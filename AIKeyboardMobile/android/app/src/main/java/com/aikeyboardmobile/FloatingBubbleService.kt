package com.aikeyboardmobile

import android.animation.ValueAnimator
import android.app.*
import android.content.*
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.IBinder
import android.util.Log
import android.util.TypedValue
import android.view.*
import android.view.animation.DecelerateInterpolator
import android.view.animation.OvershootInterpolator
import android.widget.*
import androidx.core.app.NotificationCompat
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

/**
 * FloatingBubbleService — Messenger-style Chat Head
 *
 * Behavior (like Facebook Messenger):
 * 1. Bubble is ALWAYS visible on screen (persistent)
 * 2. Draggable anywhere — snaps to nearest edge on release
 * 3. Drag to bottom ✕ zone to dismiss
 * 4. Tap to read clipboard & show AI reply panel
 * 5. After selecting a reply, panel closes but bubble STAYS visible
 * 6. Accessibility Service optionally hides bubble when not in a chat app
 */
class FloatingBubbleService : Service() {

    companion object {
        private const val TAG = "FloatingBubble"
        private const val CHANNEL_ID = "ai_keyboard_channel"
        private const val ACTION_SHOW_BUBBLE = "com.aikeyboardmobile.SHOW_BUBBLE"
        private const val NOTIFICATION_ID = 1001
        private val API_URL = BuildConfig.API_URL
        private val API_KEY = BuildConfig.API_KEY
        private val SENSITIVE_PREFIXES = listOf("sk-", "api-", "ghp_", "gho_", "AIza", "Bearer ", "eyJ")

        // Static callback for Accessibility Service → chat app detection
        var onChatAppStateChanged: ((Boolean) -> Unit)? = null
    }

    private lateinit var windowManager: WindowManager
    private lateinit var clipboardManager: ClipboardManager
    private var bubbleView: View? = null
    private var panelView: View? = null
    private var dismissView: View? = null
    private var bubbleParams: WindowManager.LayoutParams? = null
    private var currentMessage = ""
    private var screenWidth = 0
    private var screenHeight = 0
    private val bubbleSize by lazy { dp(56) }
    private var isServiceRunning = false
    private var isPeeking = false
    private val peekHidePercent = 0.75f // Hide 75% of the bubble off-screen
    private val hideHandler = android.os.Handler(android.os.Looper.getMainLooper())
    private val hideRunnable = Runnable { togglePeeking(true) }

    // Chat app awareness (defaults true so it works without Accessibility Service)
    private var isInChatApp = true
    private var isSelfCopy = false
    private var clipListener: ClipboardManager.OnPrimaryClipChangedListener? = null
    
    // Track bubble position to restore it perfectly when recreating
    private var lastBubbleX = -1
    private var lastBubbleY = -1

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Called when service is already running and receives a new intent
        // This handles: notification tap, app toggle re-enable
        if (intent?.action == ACTION_SHOW_BUBBLE) {
            Log.d(TAG, "🔄 Re-show bubble requested")
            if (bubbleView == null) {
                showBubble()
                pulseBubble()
                toast("⌨️ Bubble restored!")
            }
        }
        return START_STICKY
    }

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        clipboardManager = getSystemService(CLIPBOARD_SERVICE) as ClipboardManager
        screenWidth = resources.displayMetrics.widthPixels
        screenHeight = resources.displayMetrics.heightPixels
        createNotificationChannel()

        try {
            startForeground(NOTIFICATION_ID, buildNotification("⌨️ Tap bubble after copying text"))
            Log.d(TAG, "✅ Foreground service started")
        } catch (e: Exception) {
            Log.e(TAG, "❌ startForeground failed: ${e.message}", e)
            stopSelf()
            return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !android.provider.Settings.canDrawOverlays(this)) {
            Log.e(TAG, "❌ SYSTEM_ALERT_WINDOW permission not granted!")
            toast("❌ Overlay permission required — enable 'Draw over other apps'")
            return
        }

        // ═══════════════════════════════════════════════════════════
        // MESSENGER-STYLE: Bubble is VISIBLE immediately on start
        // ═══════════════════════════════════════════════════════════
        isServiceRunning = true
        showBubble()

        // Listen for chat app state changes (from Accessibility Service)
        onChatAppStateChanged = { isChatApp ->
            android.os.Handler(mainLooper).post {
                isInChatApp = isChatApp
                Log.d(TAG, "Chat app state → $isChatApp")
                if (isChatApp) {
                    // Entering chat app → ensure bubble is created and visible
                    if (bubbleView == null) {
                        showBubble()
                    }
                } else {
                    // Leaving chat app → remove bubble fully to clear Android's system warning
                    removePanel()
                    removeBubble()
                }
            }
        }

        // Clipboard listener: re-show bubble if dismissed, or pulse if already visible
        clipListener = ClipboardManager.OnPrimaryClipChangedListener {
            android.os.Handler(mainLooper).post {
                if (isSelfCopy) {
                    isSelfCopy = false
                    return@post
                }
                if (isInChatApp) {
                    if (bubbleView != null) {
                        // Already visible → pulse animation as visual hint
                        pulseBubble()
                        Log.d(TAG, "📋 Text copied → bubble pulsed")
                    } else {
                        // Was dismissed or removed → re-create it!
                        showBubble()
                        pulseBubble()
                        Log.d(TAG, "📋 Text copied → bubble respawned after dismiss")
                    }
                }
            }
        }
        clipboardManager.addPrimaryClipChangedListener(clipListener)

        Log.d(TAG, "✅ Messenger-style bubble service ready")
    }

    override fun onDestroy() {
        isServiceRunning = false
        clipListener?.let { clipboardManager.removePrimaryClipChangedListener(it) }
        onChatAppStateChanged = null
        removePanel()
        removeBubble()
        hideDismissZone()
        ClipboardGrabberActivity.onTextGrabbed = null
        super.onDestroy()
    }

    // ═══════════════════════════════════════════════════════════════
    // BUBBLE — Always visible, draggable, edge-snapping, dismiss zone
    // ═══════════════════════════════════════════════════════════════

    private fun showBubble() {
        removeBubble()

        bubbleView = TextView(this).apply {
            text = "⌨️"; textSize = 24f; gravity = Gravity.CENTER; elevation = 10f
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL; setColor(0xAA6063EE.toInt()) // Glassy Primary Indigo (Alpha 0xAA)
                setStroke(dp(2), 0x40FFFFFF.toInt()) // Glass edge
            }
        }

        // Use TOP|START gravity for absolute positioning (needed for edge-snapping math)
        bubbleParams = WindowManager.LayoutParams(
            bubbleSize, bubbleSize,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = if (lastBubbleX != -1) lastBubbleX else (screenWidth - bubbleSize - dp(8))
            y = if (lastBubbleY != -1) lastBubbleY else (screenHeight / 2 - bubbleSize / 2)
        }

        var initialX = 0; var initialY = 0
        var initialTouchX = 0f; var initialTouchY = 0f
        var isDragging = false

        bubbleView?.setOnTouchListener { v, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    hideHandler.removeCallbacks(hideRunnable)
                    if (isPeeking) togglePeeking(false)
                    initialX = bubbleParams!!.x
                    initialY = bubbleParams!!.y
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    isDragging = false
                    true
                }

                MotionEvent.ACTION_MOVE -> {
                    val dx = (event.rawX - initialTouchX).toInt()
                    val dy = (event.rawY - initialTouchY).toInt()
                    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                        if (!isDragging) {
                            isDragging = true
                            showDismissZone() // Show ✕ target when drag starts
                        }
                    }
                    if (isDragging) {
                        bubbleParams!!.x = initialX + dx
                        bubbleParams!!.y = initialY + dy
                        try { windowManager.updateViewLayout(v, bubbleParams) } catch (_: Exception) {}

                        // Highlight dismiss zone if bubble is near it
                        updateDismissHighlight(
                            bubbleParams!!.x + bubbleSize / 2,
                            bubbleParams!!.y + bubbleSize / 2
                        )
                    }
                    true
                }

                MotionEvent.ACTION_UP -> {
                    hideDismissZone()
                    if (!isDragging) {
                        // ══════ TAP: Read clipboard & process ══════
                        handleBubbleTap()
                        // Reset idle timer
                        hideHandler.postDelayed(hideRunnable, 3000)
                    } else {
                        // ══════ DRAG ENDED: Dismiss or snap to edge ══════
                        val centerX = bubbleParams!!.x + bubbleSize / 2
                        val centerY = bubbleParams!!.y + bubbleSize / 2
                        val dismissCenterX = screenWidth / 2
                        val dismissCenterY = screenHeight - dp(80)
                        val dist = Math.sqrt(
                            ((centerX - dismissCenterX) * (centerX - dismissCenterX) +
                             (centerY - dismissCenterY) * (centerY - dismissCenterY)).toDouble()
                        )

                        if (dist < dp(70)) {
                            removeBubble()
                            toast("Bubble dismissed")
                        } else {
                            snapToEdge()
                            // Schedule auto-peek after snap
                            hideHandler.postDelayed(hideRunnable, 3000)
                        }
                    }
                    true
                }

                else -> false
            }
        }

        try {
            if (isServiceRunning) {
                windowManager.addView(bubbleView, bubbleParams)
                Log.d(TAG, "✅ Bubble added — visible immediately")
            }
        } catch (e: Exception) {
            Log.e(TAG, "❌ Bubble add failed: ${e.message}")
        }
    }

    /**
     * Snap bubble to the nearest horizontal screen edge with smooth animation.
     * Just like Messenger — maintains Y position, slides horizontally.
     */
    private fun snapToEdge() {
        val currentX = bubbleParams?.x ?: return
        val margin = dp(8)
        val targetX = if (currentX + bubbleSize / 2 < screenWidth / 2) {
            margin // Snap LEFT
        } else {
            screenWidth - bubbleSize - margin // Snap RIGHT
        }

        val animator = ValueAnimator.ofInt(currentX, targetX)
        animator.duration = 300
        animator.interpolator = DecelerateInterpolator(2f)
        animator.addUpdateListener { anim ->
            bubbleParams?.let { params ->
                params.x = anim.animatedValue as Int
                try { windowManager.updateViewLayout(bubbleView, params) } catch (_: Exception) {}
            }
        }
        animator.start()
    }

    private fun togglePeeking(peek: Boolean) {
        if (peek == isPeeking || bubbleParams == null || bubbleView == null) return
        isPeeking = peek
        
        val currentX = bubbleParams!!.x
        val isLeft = currentX + bubbleSize / 2 < screenWidth / 2
        val margin = dp(8)
        
        val targetX = if (peek) {
            if (isLeft) -(bubbleSize * peekHidePercent).toInt()
            else screenWidth - (bubbleSize * (1 - peekHidePercent)).toInt()
        } else {
            if (isLeft) margin
            else screenWidth - bubbleSize - margin
        }

        val anim = ValueAnimator.ofInt(currentX, targetX)
        anim.duration = 400
        anim.interpolator = DecelerateInterpolator()
        anim.addUpdateListener { a ->
            bubbleParams?.let { p ->
                p.x = a.animatedValue as Int
                try { windowManager.updateViewLayout(bubbleView, p) } catch (_: Exception) {}
            }
        }
        anim.start()
        bubbleView?.animate()?.alpha(if (peek) 0.4f else 1.0f)?.setDuration(400)?.start()
    }

    /**
     * Pulse animation on bubble — visual hint when user copies text.
     */
    private fun pulseBubble() {
        hideHandler.removeCallbacks(hideRunnable)
        if (isPeeking) togglePeeking(false)
        
        bubbleView?.let { view ->
            view.animate()
                .scaleX(1.4f).scaleY(1.4f)
                .setDuration(200)
                .setInterpolator(OvershootInterpolator())
                .withEndAction {
                    view.animate()
                        .scaleX(1.0f).scaleY(1.0f)
                        .setDuration(300)
                        .setInterpolator(DecelerateInterpolator())
                        .withEndAction {
                            hideHandler.postDelayed(hideRunnable, 5000)
                        }
                        .start()
                }
                .start()
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // DISMISS ZONE — ✕ target at bottom of screen (like Messenger)
    // ═══════════════════════════════════════════════════════════════

    private fun showDismissZone() {
        if (dismissView != null) return
        val size = dp(52)

        dismissView = FrameLayout(this).apply {
            // Outer circle background
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(0xCC333333.toInt())
                setStroke(dp(2), 0x66FFFFFF.toInt())
            }
            alpha = 0f
            elevation = 15f

            // ✕ icon
            addView(TextView(this@FloatingBubbleService).apply {
                text = "✕"
                textSize = 20f
                setTextColor(Color.WHITE)
                gravity = Gravity.CENTER
            }, FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            ))
        }

        val params = WindowManager.LayoutParams(
            size, size,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = screenWidth / 2 - size / 2
            y = screenHeight - dp(110)
        }

        try {
            windowManager.addView(dismissView, params)
            // Fade in
            dismissView?.animate()?.alpha(0.7f)?.setDuration(200)?.start()
        } catch (_: Exception) {}
    }

    private fun hideDismissZone() {
        try { dismissView?.let { windowManager.removeView(it) } } catch (_: Exception) {}
        dismissView = null
    }

    private fun updateDismissHighlight(bubbleCenterX: Int, bubbleCenterY: Int) {
        val dismissCenterX = screenWidth / 2
        val dismissCenterY = screenHeight - dp(80)
        val dist = Math.sqrt(
            ((bubbleCenterX - dismissCenterX) * (bubbleCenterX - dismissCenterX) +
             (bubbleCenterY - dismissCenterY) * (bubbleCenterY - dismissCenterY)).toDouble()
        )

        dismissView?.apply {
            if (dist < dp(70)) {
                // Close to dismiss zone — enlarge + brighten
                animate().scaleX(1.4f).scaleY(1.4f).alpha(1f).setDuration(100).start()
            } else {
                animate().scaleX(1.0f).scaleY(1.0f).alpha(0.7f).setDuration(100).start()
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // TAP HANDLER — Read clipboard via ClipboardGrabberActivity
    // ═══════════════════════════════════════════════════════════════

    private fun handleBubbleTap() {
        ClipboardGrabberActivity.onTextGrabbed = { grabbedText ->
            android.os.Handler(mainLooper).post {
                val txt = grabbedText.trim()
                if (txt.isNotBlank()) {
                    if (isSensitive(txt)) {
                        toast("🔒 Sensitive text blocked")
                    } else {
                        currentMessage = txt
                        showReplyPanel()
                    }
                } else {
                    toast("📋 Clipboard is empty! Copy text first.")
                }
            }
        }

        try {
            val intent = Intent(this, ClipboardGrabberActivity::class.java)
            intent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_MULTIPLE_TASK or
                Intent.FLAG_ACTIVITY_NO_ANIMATION or
                Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS
            )
            startActivity(intent)
        } catch (e: Exception) {
            Log.e(TAG, "Launch failed: ${e.message}")
            toast("❌ Could not read clipboard")
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // REPLY PANEL — AI suggestions overlay
    // ═══════════════════════════════════════════════════════════════

    private fun showReplyPanel() {
        removePanel()

        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = GradientDrawable().apply {
                setColor(0xDD0E0E13.toInt()); // Glassy App BG (Alpha 0xDD)
                cornerRadius = dp(24).toFloat()
                setStroke(dp(1), 0x30FFFFFF.toInt()) // Brighter glass edge
            }
            setPadding(dp(22), dp(22), dp(22), dp(22)); elevation = 30f
        }

        container.addView(TextView(this).apply {
            text = "AI SMART REPLIES"
            textSize = 14f; setTextColor(0xFFA3A6FF.toInt()); // App Primary color
            letterSpacing = 0.1f; setTypeface(null, android.graphics.Typeface.BOLD)
            setPadding(0, 0, 0, dp(12))
        })

        val preview = currentMessage.take(80) + if (currentMessage.length > 80) "..." else ""
        container.addView(TextView(this).apply {
            text = "📩 \"$preview\""
            textSize = 13f; setTextColor(0xFF888888.toInt()); setPadding(0, 0, 0, dp(12))
        })

        val loading = TextView(this).apply {
            text = "⏳ Generating (may take ~30s first time)..."
            textSize = 14f; setTextColor(Color.WHITE)
        }
        container.addView(loading)

        val closeBtn = TextView(this).apply {
            text = "✕ Close Panel"
            textSize = 14f; setTextColor(0xFFF43F5E.toInt())
            gravity = Gravity.CENTER; setPadding(0, dp(16), 0, 0)
            setOnClickListener { removePanel() }
        }
        container.addView(closeBtn)

        panelView = container

        val pp = WindowManager.LayoutParams(
            (screenWidth * 0.88).toInt(),
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply { gravity = Gravity.CENTER }

        try { windowManager.addView(panelView, pp) }
        catch (e: Exception) { Log.e(TAG, "Reply panel: ${e.message}"); return }

        thread {
            try {
                val sugg = callApi(currentMessage)
                android.os.Handler(mainLooper).post {
                    container.removeView(loading)
                    renderCards(container, closeBtn, sugg)
                }
            } catch (e: Exception) {
                Log.e(TAG, "API: ${e.message}", e)
                android.os.Handler(mainLooper).post {
                    loading.text = "❌ ${e.message}\nTap Close and try again."
                    loading.setTextColor(0xFFF43F5E.toInt())
                }
            }
        }
    }

    private fun renderCards(c: LinearLayout, close: TextView, items: List<Pair<String, String>>) {
        c.removeView(close)
        for ((label, text) in items) {
            val card = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                background = GradientDrawable().apply {
                    setColor(0x8019191F.toInt()); // Semi-transparent glass surface
                    cornerRadius = dp(16).toFloat()
                    setStroke(dp(1), 0x20FFFFFF.toInt())
                }
                setPadding(dp(16), dp(12), dp(16), dp(12))
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { bottomMargin = dp(8) }
            }
            card.addView(TextView(this).apply {
                this.text = label.uppercase()
                textSize = 10f; setTextColor(0xFF6063EE.toInt()); // App Primary Dim color
                letterSpacing = 0.15f; setTypeface(null, android.graphics.Typeface.BOLD)
            })
            card.addView(TextView(this).apply {
                this.text = text; textSize = 14f; setTextColor(Color.WHITE)
                setPadding(0, dp(4), 0, 0)
            })
            card.setOnClickListener {
                isSelfCopy = true
                clipboardManager.setPrimaryClip(ClipData.newPlainText("AI Reply", text))
                toast("Copied!")
                removePanel()
                // ═══ MESSENGER-STYLE: Bubble STAYS visible after copying a reply ═══
            }
            c.addView(card)
        }
        c.addView(close)
    }

    /**
     * Remove the reply panel. Bubble STAYS visible (Messenger-style).
     * Old behavior hid the bubble here — that was the root cause of the respawn bug.
     */
    private fun removePanel() {
        try { panelView?.let { windowManager.removeView(it) } } catch (_: Exception) {}
        panelView = null
        // ═══ KEY CHANGE: Do NOT hide the bubble here! ═══
        // Old code had: bubbleView?.visibility = View.GONE  ← THIS CAUSED THE BUG
        // Messenger model: bubble is always visible
    }

    private fun removeBubble() {
        bubbleParams?.let {
            lastBubbleX = it.x
            lastBubbleY = it.y
        }
        try { bubbleView?.let { windowManager.removeView(it) } } catch (_: Exception) {}
        bubbleView = null
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILS
    // ═══════════════════════════════════════════════════════════════

    private fun dp(v: Int) = TypedValue.applyDimension(
        TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics
    ).toInt()

    private fun toast(m: String) {
        android.os.Handler(mainLooper).post { Toast.makeText(this, m, Toast.LENGTH_SHORT).show() }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val ch = NotificationChannel(CHANNEL_ID, "Replyfy Service", NotificationManager.IMPORTANCE_NONE)
            ch.description = "Background listener for clipboard events"
            ch.setShowBadge(false)
            ch.lockscreenVisibility = Notification.VISIBILITY_SECRET
            getSystemService(NotificationManager::class.java).createNotificationChannel(ch)
        }
    }

    private fun buildNotification(text: String): Notification {
        // Tapping notification → re-show bubble (not open app)
        val showBubbleIntent = Intent(this, FloatingBubbleService::class.java).apply {
            action = ACTION_SHOW_BUBBLE
        }
        val pi = PendingIntent.getService(this, 0,
            showBubbleIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

        // "Open App" action button for when user actually wants the main app
        val openAppIntent = PendingIntent.getActivity(this, 1,
            packageManager.getLaunchIntentForPackage(packageName),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.color.transparent)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setShowWhen(false)
            .setOngoing(true)
            .setSilent(true)
            .setVisibility(NotificationCompat.VISIBILITY_SECRET)
            .build()
    }

    private fun isSensitive(t: String): Boolean {
        if (t.length < 4) return false
        for (p in SENSITIVE_PREFIXES) if (t.startsWith(p)) return true
        val n = !t.contains(" ")
        val d = t.any { it.isDigit() }
        val s = t.any { !it.isLetterOrDigit() && !it.isWhitespace() }
        val u = t.any { it.isUpperCase() }
        val l = t.any { it.isLowerCase() }
        return (n && d && s && t.length >= 8) || (n && u && l && d && t.length >= 10)
    }

    // ═══════════════════════════════════════════════════════════════
    // API
    // ═══════════════════════════════════════════════════════════════

    private fun callApi(msg: String): List<Pair<String, String>> {
        var err: Exception? = null
        for (i in 1..2) {
            try { return doFetch(msg) } catch (e: Exception) {
                err = e; if (i == 1) Thread.sleep(3000)
            }
        }
        throw err ?: Exception("Unknown")
    }

    private fun doFetch(msg: String): List<Pair<String, String>> {
        val c = (URL("$API_URL/api/suggest").openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            setRequestProperty("Content-Type", "application/json")
            setRequestProperty("x-api-key", API_KEY)
            setRequestProperty("Accept", "application/json")
            connectTimeout = 60000; readTimeout = 60000; doOutput = true
        }
        OutputStreamWriter(c.outputStream).use {
            it.write(JSONObject().apply {
                put("message", msg); put("userId", "bubble"); put("userTier", "free")
            }.toString()); it.flush()
        }
        if (c.responseCode != 200) { c.disconnect(); throw Exception("Server ${c.responseCode}") }
        val b = BufferedReader(InputStreamReader(c.inputStream)).readText(); c.disconnect()
        val a = JSONObject(b).getJSONArray("suggestions")
        val prefs = getSharedPreferences("BubblePrefs", Context.MODE_PRIVATE)
        val selectedTones = prefs.getStringSet("selectedTones", null)

        val result = mutableListOf<Pair<String, String>>()
        for (i in 0 until a.length()) {
            val o = a.getJSONObject(i)
            val toneId = o.optString("tone", "")
            // Always show all if none are selected (fallback) or if they match
            if (selectedTones == null || selectedTones.isEmpty() || selectedTones.contains(toneId)) {
                result.add(Pair(o.getString("label"), o.getString("text")))
            }
        }
        return result
    }
}
