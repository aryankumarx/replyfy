import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

// ============ CONFIG ============
const API_URL = 'https://ai-keyboard-assistant.onrender.com';
const API_KEY = 'my-super-secret-key-12345';
const { width } = Dimensions.get('window');

// ============ PASSWORD DETECTION (AppSec) ============
const looksLikePassword = (text: string): boolean => {
  if (!text || text.length < 4) return false;
  // Common password patterns: mixed case + digits + symbols, API keys, tokens
  const hasUpperAndLower = /[a-z]/.test(text) && /[A-Z]/.test(text);
  const hasDigits = /\d/.test(text);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"|,.<>\/?\\]/.test(text);
  const noSpaces = !/\s/.test(text);
  const looksLikeToken = /^(sk-|api-|ghp_|gho_|AIza|Bearer |eyJ)/.test(text);

  if (looksLikeToken) return true;
  if (noSpaces && hasDigits && hasSymbols && text.length >= 8) return true;
  if (noSpaces && hasUpperAndLower && hasDigits && text.length >= 10) return true;
  return false;
};

const App = () => {
  // ============ STATE ============
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [listenerActive, setListenerActive] = useState(false); // OFF by default (permission-first)
  const [autoClearClipboard, setAutoClearClipboard] = useState(true);
  const [lastCopiedText, setLastCopiedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [blockedCount, setBlockedCount] = useState(0);

  // Permission modal
  const [showPermissionModal, setShowPermissionModal] = useState(true);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const prevClipboardText = useRef('');

  // ============ ANIMATIONS ============
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // Pulse animation for the status indicator
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // ============ TOAST NOTIFICATION ============
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToastVisible(false));
  };

  // ============ CLIPBOARD LISTENER ============
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (listenerActive && !incognitoMode) {
      interval = setInterval(async () => {
        try {
          const text = await Clipboard.getString();

          if (text && text !== prevClipboardText.current) {
            prevClipboardText.current = text;

            // AppSec: Block password-like text
            if (looksLikePassword(text)) {
              setBlockedCount(prev => prev + 1);
              showToast('🔒 Sensitive text detected & blocked');
              return;
            }

            setLastCopiedText(text);
            showToast('📋 New text captured');
          }
        } catch (error) {
          console.error('Failed to read clipboard', error);
        }
      }, 1500);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [listenerActive, incognitoMode]);

  // ============ GENERATE REPLIES ============
  const generateReplies = async (message: string) => {
    if (!message) return;

    setIsGenerating(true);
    setSuggestions([]);

    try {
      const response = await fetch(`${API_URL}/api/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({
          message,
          userId: 'mobile-app-user',
          userTier: 'free',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');
      setSuggestions(data.suggestions);

    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ============ COPY & AUTO-CLEAR ============
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    showToast('✅ Copied! Paste it in your chat');

    // AppSec: Auto-clear clipboard after 10 seconds
    if (autoClearClipboard) {
      setTimeout(() => {
        Clipboard.setString('');
        prevClipboardText.current = '';
      }, 10000);
    }
  };

  // ============ PERMISSION PROMPT ============
  const handlePermissionGrant = () => {
    setShowPermissionModal(false);
    setListenerActive(true);
    showToast('✅ Clipboard access enabled');
  };

  const handlePermissionDeny = () => {
    setShowPermissionModal(false);
    setListenerActive(false);
    showToast('🔒 Running in manual mode');
  };

  // ============ RENDER ============
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />

      {/* ===== PERMISSION MODAL ===== */}
      <Modal visible={showPermissionModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🔐</Text>
            <Text style={styles.modalTitle}>Clipboard Permission</Text>
            <Text style={styles.modalBody}>
              AI Keyboard Assistant needs to read your clipboard to detect copied messages and generate smart replies.
            </Text>

            <View style={styles.modalPrivacyBox}>
              <Text style={styles.modalPrivacyTitle}>🛡️ Our Privacy Promise</Text>
              <Text style={styles.modalPrivacyText}>• We only read text YOU explicitly copy</Text>
              <Text style={styles.modalPrivacyText}>• Passwords & API keys are auto-blocked</Text>
              <Text style={styles.modalPrivacyText}>• Zero message storage — nothing is saved</Text>
              <Text style={styles.modalPrivacyText}>• Incognito mode available anytime</Text>
            </View>

            <TouchableOpacity style={styles.modalButtonAllow} onPress={handlePermissionGrant}>
              <Text style={styles.modalButtonText}>✅ Allow Clipboard Access</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonDeny} onPress={handlePermissionDeny}>
              <Text style={styles.modalButtonDenyText}>Use Manual Mode Instead</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== TOAST ===== */}
      {toastVisible && (
        <Animated.View style={[styles.toast, { opacity: toastAnim }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ===== HEADER ===== */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>⌨️</Text>
              <Animated.View style={[styles.statusDot, {
                backgroundColor: listenerActive && !incognitoMode ? '#10b981' : '#f43f5e',
                transform: [{ scale: pulseAnim }]
              }]} />
            </View>
            <Text style={styles.title}>AI Keyboard Assistant</Text>
            <Text style={styles.subtitle}>
              {incognitoMode ? '🕵️ Incognito Active' : listenerActive ? '🟢 Listening' : '⏸️ Paused'}
            </Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v1.0 • Gemini Flash-Lite</Text>
            </View>
          </View>

          {/* ===== SECURITY STATUS CARD ===== */}
          <View style={styles.securityCard}>
            <Text style={styles.securityTitle}>🛡️ Security Status</Text>
            <View style={styles.securityRow}>
              <View style={styles.securityItem}>
                <Text style={styles.securityIcon}>🔒</Text>
                <Text style={styles.securityLabel}>Blocked</Text>
                <Text style={styles.securityValue}>{blockedCount}</Text>
              </View>
              <View style={styles.securityDivider} />
              <View style={styles.securityItem}>
                <Text style={styles.securityIcon}>{autoClearClipboard ? '✅' : '❌'}</Text>
                <Text style={styles.securityLabel}>Auto-Clear</Text>
                <Text style={styles.securityValue}>{autoClearClipboard ? 'ON' : 'OFF'}</Text>
              </View>
              <View style={styles.securityDivider} />
              <View style={styles.securityItem}>
                <Text style={styles.securityIcon}>{incognitoMode ? '🕵️' : '👁️'}</Text>
                <Text style={styles.securityLabel}>Privacy</Text>
                <Text style={styles.securityValue}>{incognitoMode ? 'MAX' : 'STD'}</Text>
              </View>
            </View>
          </View>

          {/* ===== SETTINGS CARD ===== */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚙️ Settings & Privacy</Text>

            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>Clipboard Listener</Text>
                <Text style={styles.settingSubtext}>Detect copied text automatically</Text>
              </View>
              <Switch
                value={listenerActive}
                onValueChange={setListenerActive}
                trackColor={{ false: '#333', true: '#6366f1' }}
                thumbColor={listenerActive ? '#ffffff' : '#888'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>🕵️‍♂️ Incognito Mode</Text>
                <Text style={styles.settingSubtext}>Pause all tracking for max privacy</Text>
              </View>
              <Switch
                value={incognitoMode}
                onValueChange={setIncognitoMode}
                trackColor={{ false: '#333', true: '#f43f5e' }}
                thumbColor={incognitoMode ? '#ffffff' : '#888'}
              />
            </View>

            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>🧹 Auto-Clear Clipboard</Text>
                <Text style={styles.settingSubtext}>Wipe clipboard 10s after copying a reply</Text>
              </View>
              <Switch
                value={autoClearClipboard}
                onValueChange={setAutoClearClipboard}
                trackColor={{ false: '#333', true: '#10b981' }}
                thumbColor={autoClearClipboard ? '#ffffff' : '#888'}
              />
            </View>
          </View>

          {/* ===== INTERACTION AREA ===== */}
          {incognitoMode ? (
            <View style={styles.incognitoBanner}>
              <Text style={styles.incognitoEmoji}>🕵️</Text>
              <Text style={styles.incognitoTitle}>Incognito Mode Active</Text>
              <Text style={styles.incognitoSubtext}>
                Clipboard monitoring is completely disabled.{'\n'}
                We are NOT reading any of your messages.
              </Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📩 Last Copied Message</Text>
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>
                  {lastCopiedText || 'Copy a message from WhatsApp or any app to see it here...'}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.button, (!lastCopiedText || isGenerating) && styles.buttonDisabled]}
                disabled={!lastCopiedText || isGenerating}
                onPress={() => generateReplies(lastCopiedText)}
                activeOpacity={0.7}
              >
                {isGenerating ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={styles.buttonText}>  Generating...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>⚡ Generate Smart Replies</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ===== SUGGESTIONS ===== */}
          {suggestions.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>💬 Smart Replies</Text>
              {suggestions.map((s, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionItem}
                  onPress={() => copyToClipboard(s.text)}
                  activeOpacity={0.6}
                >
                  <View style={styles.suggestionHeader}>
                    <Text style={styles.suggestionLabel}>
                      {s.tone === 'casual' && '😊 '}
                      {s.tone === 'professional' && '💼 '}
                      {s.tone === 'brief' && '⚡ '}
                      {s.tone === 'quick' && '💬 '}
                      {s.label}
                    </Text>
                    <Text style={styles.copyHint}>Tap to copy</Text>
                  </View>
                  <Text style={styles.suggestionText}>{s.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ===== FOOTER ===== */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Built with 💜 by Aryan Kumar</Text>
            <Text style={styles.footerSubtext}>Privacy-first • Zero storage • Open source</Text>
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ STYLES ============
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Header
  header: { alignItems: 'center', marginBottom: 24, marginTop: 10 },
  logoContainer: { position: 'relative', marginBottom: 12 },
  logo: { fontSize: 56 },
  statusDot: { position: 'absolute', bottom: 2, right: -4, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#0a0a0f' },
  title: { fontSize: 26, fontWeight: '800', color: '#e0e0e0', textAlign: 'center', letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: '#888', marginTop: 6 },
  versionBadge: { marginTop: 8, backgroundColor: '#6366f120', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#6366f140' },
  versionText: { color: '#6366f1', fontSize: 11, fontWeight: '600' },

  // Security Card
  securityCard: { backgroundColor: '#111118', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#10b98130' },
  securityTitle: { fontSize: 12, fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, textAlign: 'center' },
  securityRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  securityItem: { alignItems: 'center', flex: 1 },
  securityIcon: { fontSize: 24, marginBottom: 4 },
  securityLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  securityValue: { fontSize: 16, color: '#e0e0e0', fontWeight: '700' },
  securityDivider: { width: 1, height: 40, backgroundColor: '#2a2a35' },

  // Cards
  card: { backgroundColor: '#1a1a24', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#2a2a35' },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },

  // Settings
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a35' },
  settingText: { fontSize: 16, color: '#e0e0e0', fontWeight: '500' },
  settingSubtext: { fontSize: 12, color: '#888', marginTop: 3, maxWidth: width * 0.6 },

  // Incognito
  incognitoBanner: { backgroundColor: '#f43f5e10', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#f43f5e30', marginBottom: 20, alignItems: 'center' },
  incognitoEmoji: { fontSize: 40, marginBottom: 10 },
  incognitoTitle: { color: '#f43f5e', fontWeight: '700', fontSize: 18, marginBottom: 8 },
  incognitoSubtext: { color: '#f43f5e90', textAlign: 'center', lineHeight: 20 },

  // Message Box
  messageBox: { backgroundColor: '#0a0a0f', padding: 16, borderRadius: 12, minHeight: 80, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a35' },
  messageText: { color: '#d0d0d0', fontSize: 15, lineHeight: 22 },

  // Buttons
  button: { backgroundColor: '#6366f1', padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  buttonDisabled: { backgroundColor: '#333340', shadowOpacity: 0, elevation: 0 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },

  // Suggestions
  suggestionItem: { backgroundColor: '#22222e', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a35' },
  suggestionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  suggestionLabel: { color: '#10b981', fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
  copyHint: { color: '#666', fontSize: 11 },
  suggestionText: { color: '#e0e0e0', fontSize: 15, lineHeight: 22 },

  // Toast
  toast: { position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: '#1a1a24', padding: 14, borderRadius: 12, zIndex: 999, borderWidth: 1, borderColor: '#6366f140', alignItems: 'center' },
  toastText: { color: '#e0e0e0', fontWeight: '600', fontSize: 14 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: '#000000cc', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#1a1a24', borderRadius: 20, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a35' },
  modalEmoji: { fontSize: 48, marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#e0e0e0', marginBottom: 12 },
  modalBody: { fontSize: 15, color: '#aaa', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  modalPrivacyBox: { backgroundColor: '#10b98110', borderRadius: 12, padding: 16, width: '100%', marginBottom: 24, borderWidth: 1, borderColor: '#10b98130' },
  modalPrivacyTitle: { color: '#10b981', fontWeight: '700', fontSize: 14, marginBottom: 10 },
  modalPrivacyText: { color: '#10b981', fontSize: 13, lineHeight: 22 },
  modalButtonAllow: { backgroundColor: '#6366f1', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 10 },
  modalButtonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  modalButtonDeny: { padding: 12, width: '100%', alignItems: 'center' },
  modalButtonDenyText: { color: '#888', fontSize: 14 },

  // Footer
  footer: { alignItems: 'center', marginTop: 10, paddingVertical: 20 },
  footerText: { color: '#555', fontSize: 13 },
  footerSubtext: { color: '#333', fontSize: 11, marginTop: 4 },
});

export default App;
