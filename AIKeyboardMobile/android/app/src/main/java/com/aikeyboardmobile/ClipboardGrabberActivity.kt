package com.aikeyboardmobile

import android.app.Activity
import android.content.ClipboardManager
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.WindowManager

/**
 * Invisible 1x1 pixel Activity that briefly gains foreground focus
 * to read the clipboard on Android 10+.
 * 
 * Called by FloatingBubbleService when user taps "📋 Paste" button.
 * Reads clipboard → passes text back via static callback → finishes instantly.
 */
class ClipboardGrabberActivity : Activity() {

    companion object {
        private const val TAG = "ClipGrabber"
        // Static callback — set by FloatingBubbleService before launching
        var onTextGrabbed: ((String) -> Unit)? = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Make this activity truly invisible — 1x1 pixel, fully transparent
        window.setLayout(1, 1)
        window.setGravity(Gravity.START or Gravity.TOP)
        window.attributes = window.attributes.also { a ->
            a.x = 0; a.y = 0; a.dimAmount = 0f
            a.alpha = 0f  // Fully transparent window
            a.flags = a.flags or
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            // Window has ACTUALLY gained focus — now clipboard read is guaranteed to work
            grabClipboard()
        }
    }

    override fun onResume() {
        super.onResume()
        // Fallback: if onWindowFocusChanged doesn't fire (some devices), try after a delay
        window.decorView.postDelayed({
            if (!hasGrabbed) {
                Log.d(TAG, "⏱️ Fallback clipboard read after delay")
                grabClipboard()
            }
        }, 200)
    }

    private var hasGrabbed = false

    private fun grabClipboard() {
        if (hasGrabbed) return
        hasGrabbed = true

        var text = ""
        try {
            val cm = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val clip = cm.primaryClip
            if (clip != null && clip.itemCount > 0) {
                text = clip.getItemAt(0).text?.toString() ?: ""
            }
            Log.d(TAG, "✅ Got: '${text.take(60)}'")
        } catch (e: Exception) {
            Log.e(TAG, "❌ ${e.message}")
        }

        // Pass text back to the FloatingBubbleService
        onTextGrabbed?.invoke(text)

        // Close immediately — go back to previous app (WhatsApp etc.)
        finishAndRemoveTask()
        // Suppress any transition animation
        if (Build.VERSION.SDK_INT >= 34) {
            overrideActivityTransition(OVERRIDE_TRANSITION_CLOSE, 0, 0)
        } else {
            @Suppress("DEPRECATION")
            overridePendingTransition(0, 0)
        }
    }
}
