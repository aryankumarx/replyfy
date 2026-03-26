package com.aikeyboardmobile

import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityEvent

/**
 * ChatAccessibilityService — An Android Accessibility Service
 * 
 * How apps like Grammarly and Truecaller work:
 * They use Accessibility Services to constantly monitor the screen content, 
 * detect when users switch apps, and read what text they type.
 * 
 * Our privacy-friendly implementation ONLY listens to "Window State Changed" events
 * (which tells us what app is currently open, e.g., "com.whatsapp").
 * We DO NOT read typing data or screen content here, keeping user trust!
 * 
 * Uses a direct static callback to FloatingBubbleService to hide/show the bubble
 * purely based on whether a Chat App is actively on the screen.
 */
class ChatAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "ChatAccessibility"

        // The list of apps where the bubble SHOULD appear. Add more here!
        private val CHAT_APPS = listOf(
            // ===== Production chat apps =====
            "com.whatsapp",
            "com.whatsapp.w4b",             // WhatsApp Business
            "org.telegram.messenger",
            "com.instagram.android",
            "com.facebook.orca",            // Messenger
            "com.twitter.android",
            "com.snapchat.android",
            "com.linkedin.android",
            "com.discord",

            // ===== Emulator testing — remove before release =====
            "com.google.android.apps.messaging",  // Google Messages (default SMS)
            "com.android.messaging",              // AOSP Messages
            "com.android.chrome",                 // Chrome browser
            "com.google.android.gm",              // Gmail
            "com.google.android.apps.nbu.files",  // Files app (to copy text from)
        )
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "Chat Accessibility Service Connected!")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null || event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val packageName = event.packageName?.toString() ?: return

        // If it's the system UI, keyboard, or our own app changing, ignore it to prevent flickering
        if (packageName == "com.android.systemui" || packageName.contains("keyboard") || packageName == "com.aikeyboardmobile") {
            return
        }

        val isChatApp = CHAT_APPS.contains(packageName)
        Log.d(TAG, "Active App: $packageName | isChatApp: $isChatApp")

        // Send a broadcast to the FloatingBubbleService to hide or show the Chat Head!
        val intent = Intent("com.aikeyboardmobile.APP_STATE_CHANGED")
        intent.putExtra("IS_CHAT_APP", isChatApp)
        sendBroadcast(intent)
    }

    override fun onInterrupt() {
        Log.d(TAG, "Chat Accessibility Service Interrupted")
        // App crashed or user disabled it mid-operation
    }
}
