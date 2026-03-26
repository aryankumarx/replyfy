package com.aikeyboardmobile

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
 * FloatingBubbleService — Final Version with 📋 Paste Button
 *
 * Flow:
 * 1. User copies text in WhatsApp
 * 2. Taps ⌨️ bubble → panel appears with EditText + 📋 Paste + 🚀 Generate
 * 3. Taps "📋 Paste" → launches invisible ClipboardGrabberActivity
 *    → reads clipboard (foreground = legal!) → auto-fills EditText
 *    → user stays in WhatsApp (moveTaskToBack)
 * 4. Taps "🚀 Generate" → API call → reply cards shown
 * 5. Taps a reply card → copied to clipboard → paste in WhatsApp!
 */
class FloatingBubbleService : Service() {

    companion object {
        private const val TAG = "FloatingBubble"
        private const val CHANNEL_ID = "ai_keyboard_channel"
        private const val NOTIFICATION_ID = 1001
        private const val API_URL = "https://ai-keyboard-assistant.onrender.com"
        private const val API_KEY = "my-super-secret-key-12345"
        private val SENSITIVE_PREFIXES = listOf("sk-", "api-", "ghp_", "gho_", "AIza", "Bearer ", "eyJ")

        // Static callback to detect when we enter/leave chat apps
        var onChatAppStateChanged: ((Boolean) -> Unit)? = null
    }

    private lateinit var windowManager: WindowManager
    private lateinit var clipboardManager: ClipboardManager
    private var bubbleView: View? = null
    private var panelView: View? = null
    private var bubbleParams: WindowManager.LayoutParams? = null
    private var currentMessage = ""
    private var activeEditText: EditText? = null  // Reference to the EditText in the panel
    
    private var isInChatApp = false
    private var isSelfCopy = false
    private var clipListener: ClipboardManager.OnPrimaryClipChangedListener? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        clipboardManager = getSystemService(CLIPBOARD_SERVICE) as ClipboardManager
        createNotificationChannel()

        try {
            startForeground(NOTIFICATION_ID, buildNotification("Tap ⌨️ after copying text"))
            Log.d(TAG, "✅ Foreground service started successfully")
        } catch (e: Exception) {
            Log.e(TAG, "❌ startForeground failed: ${e.message}", e)
            stopSelf()
            return
        }

        // Check overlay permission before trying to draw the bubble
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !android.provider.Settings.canDrawOverlays(this)) {
            Log.e(TAG, "❌ SYSTEM_ALERT_WINDOW permission not granted!")
            toast("❌ Overlay permission required — enable 'Draw over other apps'")
            return
        }

        showBubble()

        // Hide bubble initially until they copy text in a chat app!
        bubbleView?.visibility = View.GONE

        // Listen for chat app state changes
        onChatAppStateChanged = { isChatApp ->
            android.os.Handler(mainLooper).post {
                isInChatApp = isChatApp
                if (!isChatApp) {
                    removePanel()
                    bubbleView?.visibility = View.GONE
                }
            }
        }

        // Listen for clipboard changes to TRIGGER the bubble
        clipListener = ClipboardManager.OnPrimaryClipChangedListener {
            android.os.Handler(mainLooper).post {
                if (isSelfCopy) {
                    isSelfCopy = false
                    return@post
                }
                if (isInChatApp) {
                    bubbleView?.visibility = View.VISIBLE
                    Log.d(TAG, "Text copied in Chat App -> Showing Bubble!")
                }
            }
        }
        clipboardManager.addPrimaryClipChangedListener(clipListener)

        Log.d(TAG, "✅ Bubble context-aware service ready")
    }

    override fun onDestroy() {
        clipListener?.let { clipboardManager.removePrimaryClipChangedListener(it) }
        onChatAppStateChanged = null
        removeBubble(); removePanel()
        ClipboardGrabberActivity.onTextGrabbed = null
        super.onDestroy()
    }

    private fun dp(v: Int) = TypedValue.applyDimension(
        TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics
    ).toInt()

    private fun toast(m: String) {
        android.os.Handler(mainLooper).post { Toast.makeText(this, m, Toast.LENGTH_SHORT).show() }
    }

    // ==================== NOTIFICATION ====================
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val ch = NotificationChannel(CHANNEL_ID, "AI Keyboard", NotificationManager.IMPORTANCE_LOW)
            ch.setShowBadge(false)
            getSystemService(NotificationManager::class.java).createNotificationChannel(ch)
        }
    }

    private fun buildNotification(text: String): Notification {
        val pi = PendingIntent.getActivity(this, 0,
            packageManager.getLaunchIntentForPackage(packageName),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("⌨️ AI Keyboard Active").setContentText(text)
            .setSmallIcon(android.R.drawable.ic_menu_edit)
            .setContentIntent(pi).setOngoing(true).setSilent(true).build()
    }

    // ==================== SECURITY ====================
    private fun isSensitive(t: String): Boolean {
        if (t.length < 4) return false
        for (p in SENSITIVE_PREFIXES) if (t.startsWith(p)) return true
        val n = !t.contains(" "); val d = t.any { it.isDigit() }
        val s = t.any { !it.isLetterOrDigit() && !it.isWhitespace() }
        val u = t.any { it.isUpperCase() }; val l = t.any { it.isLowerCase() }
        return (n && d && s && t.length >= 8) || (n && u && l && d && t.length >= 10)
    }

    // ==================== BUBBLE ====================
    private fun showBubble() {
        removeBubble()
        bubbleView = TextView(this).apply {
            text = "⌨️"; textSize = 24f; gravity = Gravity.CENTER; elevation = 10f
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL; setColor(0xFF6366F1.toInt())
            }
        }
        bubbleParams = WindowManager.LayoutParams(
            dp(56), dp(56),
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply { gravity = Gravity.END or Gravity.CENTER_VERTICAL; x = dp(8); y = 0 }

        // Drag + click
        var sX = 0; var sY = 0; var sTX = 0f; var sTY = 0f; var drag = false
        bubbleView?.setOnTouchListener { v, ev ->
            when (ev.action) {
                MotionEvent.ACTION_DOWN -> {
                    sX = bubbleParams!!.x; sY = bubbleParams!!.y
                    sTX = ev.rawX; sTY = ev.rawY; drag = false; true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = (ev.rawX - sTX).toInt(); val dy = (ev.rawY - sTY).toInt()
                    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) drag = true
                    bubbleParams!!.x = sX - dx; bubbleParams!!.y = sY + dy
                    try { windowManager.updateViewLayout(v, bubbleParams) } catch (_: Exception) {}
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if (!drag) { bubbleView?.visibility = View.GONE; showInputPanel() }
                    true
                }
                else -> false
            }
        }

        try { windowManager.addView(bubbleView, bubbleParams) }
        catch (e: Exception) { Log.e(TAG, "Bubble: ${e.message}") }
    }

    private fun removeBubble() {
        try { bubbleView?.let { windowManager.removeView(it) } } catch (_: Exception) {}
        bubbleView = null
    }

    // ==================== INPUT PANEL ====================
    private fun showInputPanel() {
        removePanel()

        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = GradientDrawable().apply {
                setColor(0xFF1A1A24.toInt()); cornerRadius = dp(16).toFloat()
            }
            setPadding(dp(20), dp(16), dp(20), dp(16)); elevation = 20f
        }

        // Title
        container.addView(TextView(this).apply {
            text = "⌨️ AI Smart Reply"
            textSize = 16f; setTextColor(0xFF6366F1.toInt()); setPadding(0, 0, 0, dp(6))
        })

        // Instruction
        container.addView(TextView(this).apply {
            text = "Tap 📋 Paste to grab your copied text, then Generate!"
            textSize = 12f; setTextColor(0xFFAAAAAA.toInt()); setPadding(0, 0, 0, dp(10))
        })

        // EditText
        val editText = EditText(this).apply {
            hint = "Your copied text will appear here..."
            setHintTextColor(0xFF555555.toInt()); setTextColor(Color.WHITE); textSize = 14f
            minLines = 2; maxLines = 4
            background = GradientDrawable().apply {
                setColor(0xFF2A2A35.toInt()); cornerRadius = dp(10).toFloat()
                setStroke(2, 0xFF444444.toInt())
            }
            setPadding(dp(14), dp(12), dp(14), dp(12))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply { bottomMargin = dp(10) }
            isFocusable = true; isFocusableInTouchMode = true; isLongClickable = true
        }
        activeEditText = editText
        container.addView(editText)

        // ===== ROW 1: 📋 Paste button (full width) =====
        val pasteBtn = TextView(this).apply {
            text = "📋  Paste from Clipboard"
            textSize = 15f; setTextColor(Color.WHITE); gravity = Gravity.CENTER
            background = GradientDrawable().apply {
                setColor(0xFF10B981.toInt()); cornerRadius = dp(10).toFloat()
            }
            setPadding(dp(16), dp(13), dp(16), dp(13))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply { bottomMargin = dp(8) }

            setOnClickListener {
                Log.d(TAG, "📋 Paste button tapped — launching ClipboardGrabber...")

                // Set the callback BEFORE launching the activity
                ClipboardGrabberActivity.onTextGrabbed = { grabbedText ->
                    Log.d(TAG, "📋 Callback received: '${grabbedText.take(60)}'")
                    android.os.Handler(mainLooper).post {
                        val txt = grabbedText.trim()
                        if (txt.isNotBlank()) {
                            if (isSensitive(txt)) {
                                toast("🔒 Sensitive text blocked")
                            } else {
                                // ✅ Auto-execute! Skip the generate button
                                activeEditText?.setText(txt)
                                currentMessage = txt
                                removePanel()
                                showReplyPanel()
                            }
                        } else {
                            toast("📋 Clipboard is empty! Copy text first.")
                        }
                    }
                }

                // Launch the invisible activity to grab clipboard
                try {
                    val intent = Intent(this@FloatingBubbleService, ClipboardGrabberActivity::class.java)
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
        }
        container.addView(pasteBtn)

        // ===== ROW 2: Close =====
        val closeBtn = TextView(this).apply {
            text = "✕ Close"; textSize = 15f; setTextColor(0xFFF43F5E.toInt()); gravity = Gravity.CENTER
            background = GradientDrawable().apply {
                setColor(0xFF2A2A35.toInt()); cornerRadius = dp(10).toFloat()
            }
            setPadding(dp(16), dp(13), dp(16), dp(13))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            setOnClickListener { removePanel() }
        }
        container.addView(closeBtn)
        panelView = container

        // Focusable so EditText works
        val pp = WindowManager.LayoutParams(
            (resources.displayMetrics.widthPixels * 0.88).toInt(),
            WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.CENTER
            softInputMode = WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN
        }

        try { windowManager.addView(panelView, pp) }
        catch (e: Exception) { Log.e(TAG, "Panel: ${e.message}") }
    }

    // ==================== REPLY PANEL ====================
    private fun showReplyPanel() {
        removePanel()

        val container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = GradientDrawable().apply {
                setColor(0xFF1A1A24.toInt()); cornerRadius = dp(16).toFloat()
            }
            setPadding(dp(20), dp(20), dp(20), dp(20)); elevation = 20f
        }

        container.addView(TextView(this).apply {
            text = "⌨️  AI Smart Replies"
            textSize = 17f; setTextColor(0xFF6366F1.toInt()); setPadding(0, 0, 0, dp(12))
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
            text = "✕ Close"; textSize = 14f; setTextColor(0xFFF43F5E.toInt())
            gravity = Gravity.CENTER; setPadding(0, dp(16), 0, 0)
            setOnClickListener { removePanel() }
        }
        container.addView(closeBtn)

        panelView = container

        val pp = WindowManager.LayoutParams(
            (resources.displayMetrics.widthPixels * 0.88).toInt(),
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
        val em = mapOf("friendly" to "🌟", "witty" to "🔥", "direct" to "⚡", "quick reply" to "💬")
        for ((label, text) in items) {
            val card = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                background = GradientDrawable().apply {
                    setColor(0xFF2A2A35.toInt()); cornerRadius = dp(12).toFloat()
                }
                setPadding(dp(16), dp(12), dp(16), dp(12))
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { bottomMargin = dp(8) }
            }
            card.addView(TextView(this).apply {
                this.text = "${em[label.lowercase()] ?: "💬"} ${label.uppercase()}"
                textSize = 11f; setTextColor(0xFF10B981.toInt())
            })
            card.addView(TextView(this).apply {
                this.text = text; textSize = 14f; setTextColor(Color.WHITE)
                setPadding(0, dp(4), 0, 0)
            })
             card.setOnClickListener {
                isSelfCopy = true
                clipboardManager.setPrimaryClip(ClipData.newPlainText("AI Reply", text))
                toast("✅ Copied! Paste in your chat")
                removePanel()
            }
            c.addView(card)
        }
        c.addView(close)
    }

    private fun removePanel() {
        try { panelView?.let { windowManager.removeView(it) } } catch (_: Exception) {}
        panelView = null; activeEditText = null
        // Hide the bubble when panel is closed so it doesn't clutter the screen!
        bubbleView?.visibility = View.GONE
    }

    // ==================== API ====================
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
        return (0 until a.length()).map {
            a.getJSONObject(it).let { o -> Pair(o.getString("label"), o.getString("text")) }
        }
    }
}
