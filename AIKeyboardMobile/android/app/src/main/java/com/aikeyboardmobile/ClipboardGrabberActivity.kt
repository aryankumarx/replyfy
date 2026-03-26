package com.aikeyboardmobile

import android.app.Activity
import android.content.ClipboardManager
import android.content.Context
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
        // 1x1 pixel, transparent, top-left corner
        window.setLayout(1, 1)
        window.setGravity(Gravity.START or Gravity.TOP)
        val a = window.attributes
        a.x = 0; a.y = 0; a.dimAmount = 0f
        a.flags = a.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
        window.attributes = a
    }

    override fun onResume() {
        super.onResume()
        // We are now the foreground Activity — clipboard access is legal!
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

        // Pass text back to the service
        onTextGrabbed?.invoke(text)

        // Go back to previous app (WhatsApp) and die
        moveTaskToBack(true)
        finish()
        overridePendingTransition(0, 0)
    }
}
