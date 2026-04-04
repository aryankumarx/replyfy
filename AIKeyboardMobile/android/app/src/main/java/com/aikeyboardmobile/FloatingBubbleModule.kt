package com.aikeyboardmobile

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * FloatingBubbleModule — React Native Native Module
 * Bridges the Kotlin FloatingBubbleService with JavaScript (App.tsx).
 *
 * Exposes these methods to JS:
 *   - startService()             → Start the floating bubble background service
 *   - stopService()              → Stop the service
 *   - checkOverlayPermission()   → Check if SYSTEM_ALERT_WINDOW is granted
 *   - requestOverlayPermission() → Open Android settings to grant it
 *
 * Also emits "BUBBLE_CLIPBOARD_FETCH" events to JS when the bubble grabs clipboard text.
 */
class FloatingBubbleModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "FloatingBubbleModule"

    /**
     * Check if the app has "Draw Over Other Apps" permission
     */
    @ReactMethod
    fun checkOverlayPermission(promise: Promise) {
        val has = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Settings.canDrawOverlays(reactContext)
        } else true
        promise.resolve(has)
    }

    /**
     * Open Android Settings to grant overlay permission
     */
    @ReactMethod
    fun requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${reactContext.packageName}")
            )
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactContext.startActivity(intent)
        }
    }

    /**
     * Start the Floating Bubble Foreground Service
     */
    @ReactMethod
    fun startService(promise: Promise) {
        try {
            val intent = Intent(reactContext, FloatingBubbleService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(intent)
            } else {
                reactContext.startService(intent)
            }
            promise.resolve("Service started")
        } catch (e: Exception) {
            promise.reject("START_ERROR", e.message)
        }
    }

    /**
     * Stop the Floating Bubble Foreground Service
     */
    @ReactMethod
    fun stopService(promise: Promise) {
        try {
            val intent = Intent(reactContext, FloatingBubbleService::class.java)
            reactContext.stopService(intent)
            promise.resolve("Service stopped")
        } catch (e: Exception) {
            promise.reject("STOP_ERROR", e.message)
        }
    }

    /**
     * Save selected tones to SharedPreferences so the Service can read them.
     */
    @ReactMethod
    fun setTones(tones: ReadableArray) {
        val prefs = reactContext.getSharedPreferences("BubblePrefs", android.content.Context.MODE_PRIVATE)
        val set = mutableSetOf<String>()
        for (i in 0 until tones.size()) {
            tones.getString(i)?.let { set.add(it) }
        }
        prefs.edit().putStringSet("selectedTones", set).apply()
    }

    /**
     * Emit an event to JavaScript (used by the service to send clipboard data)
     */
    fun emitEvent(eventName: String, data: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }
}
