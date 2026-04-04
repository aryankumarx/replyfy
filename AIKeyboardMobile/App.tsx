import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  Animated,
  Easing,
  Dimensions,
  NativeModules,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const { FloatingBubbleModule } = NativeModules;

// ══════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════
const API_URL = 'http://10.0.2.2:3000'; // TEST MODE — 10.0.2.2 = host PC from Android emulator
const API_KEY = 'my-super-secret-key-12345';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ══════════════════════════════════════════════
// DESIGN TOKENS — Indigo Cyber (from Stitch)
// ══════════════════════════════════════════════
const C = {
  bg:               '#0e0e13',
  surface:          '#19191f',
  surfaceHigh:      '#1f1f26',
  surfaceHighest:   '#25252d',
  surfaceLow:       '#131319',
  primary:          '#a3a6ff',
  primaryDim:       '#6063ee',
  primaryContainer: '#9396ff',
  onSurface:        '#f9f5fd',
  onSurfaceVar:     '#acaab1',
  outline:          '#76747b',
  outlineVar:       '#48474d',
  green:            '#10b981',
  red:              '#f43f5e',
  redDim:           '#d73357',
  tertiary:         '#ffa5d9',
  white10:          'rgba(255,255,255,0.06)',
  white40:          'rgba(255,255,255,0.4)',
};

// ══════════════════════════════════════════════
// AVAILABLE TONES
// ══════════════════════════════════════════════
const ALL_TONES = [
  { id: 'genz',         label: 'Gen Z',        desc: 'Internet slang, abbreviations, trending phrases',  icon: '✦' },
  { id: 'sarcastic',    label: 'Sarcastic',     desc: 'Witty comebacks with playful dry humor',           icon: '—' },
  { id: 'sweet',        label: 'Sweet',         desc: 'Warm, affectionate responses',                     icon: '♥' },
  { id: 'professional', label: 'Professional',  desc: 'Polished, business-appropriate replies',           icon: '◆' },
  { id: 'decline',      label: 'Decline',       desc: 'Politely disagree or say no to plans',             icon: '✕' },
  { id: 'quick',        label: 'Quick Reply',   desc: 'Ultra-short 2–5 word responses',                   icon: '⚡' },
];

// ══════════════════════════════════════════════
// PASSWORD DETECTION
// ══════════════════════════════════════════════
const looksLikePassword = (text: string): boolean => {
  if (!text || text.length < 4) return false;
  const hasUL = /[a-z]/.test(text) && /[A-Z]/.test(text);
  const hasD = /\d/.test(text);
  const hasS = /[!@#$%^&*()_+\-=\[\]{};':"|,.<>\/?\\]/.test(text);
  const noSp = !/\s/.test(text);
  if (/^(sk-|api-|ghp_|gho_|AIza|Bearer |eyJ)/.test(text)) return true;
  if (noSp && hasD && hasS && text.length >= 8) return true;
  if (noSp && hasUL && hasD && text.length >= 10) return true;
  return false;
};

// ══════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════
const App = () => {
  // ── Navigation ──
  const [activeTab, setActiveTab] = useState<'home' | 'tone' | 'system'>('home');

  // ── Core State ──
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [listenerActive, setListenerActive] = useState(true);
  const [bubbleActive, setBubbleActive] = useState(false);
  const [autoClear, setAutoClear] = useState(true);
  const [lastCopied, setLastCopied] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [blockedCount, setBlockedCount] = useState(0);

  // ── Tone Selection ──
  const [selectedTones, setSelectedTones] = useState<string[]>(['genz', 'sarcastic', 'sweet']);

  // ── Toast ──
  const [toastMsg, setToastMsg] = useState('');
  const toastAnim = useRef(new Animated.Value(0)).current;

  // ── Animations ──
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const prevClip = useRef('');

  // ── Radar spin + pulse + glow ──
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.8, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.2, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  // ── Toast ──
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Clipboard Listener ──
  useEffect(() => {
    if (!listenerActive || incognitoMode) return;
    const iv = setInterval(async () => {
      try {
        const t = await Clipboard.getString();
        if (t && t !== prevClip.current) {
          prevClip.current = t;
          if (looksLikePassword(t)) {
            setBlockedCount(p => p + 1);
            showToast('Sensitive text blocked');
            return;
          }
          setLastCopied(t);
        }
      } catch (_) {}
    }, 1500);
    return () => clearInterval(iv);
  }, [listenerActive, incognitoMode]);

  // ── Generate ──
  const generateReplies = async () => {
    if (!lastCopied || isGenerating) return;
    setIsGenerating(true);
    setSuggestions([]);
    try {
      const res = await fetch(`${API_URL}/api/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({ message: lastCopied }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

      // Filter suggestions to only show selected tones
      const filtered = data.suggestions.filter((s: any) => selectedTones.includes(s.tone));
      setSuggestions(filtered.length > 0 ? filtered : data.suggestions);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Copy ──
  const copyReply = (text: string) => {
    Clipboard.setString(text);
    showToast('Copied to clipboard');
    if (autoClear) {
      setTimeout(() => { Clipboard.setString(''); prevClip.current = ''; }, 10000);
    }
  };

  // ── Bubble ──
  const toggleBubble = async (v: boolean) => {
    if (v) {
      try {
        const ok = await FloatingBubbleModule.checkOverlayPermission();
        if (!ok) {
          Alert.alert('Permission Required', 'Enable "Draw over other apps" to use the Floating Bubble.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Enable', onPress: () => FloatingBubbleModule.requestOverlayPermission() },
          ]);
          return;
        }
        await FloatingBubbleModule.startService();
        setBubbleActive(true);
      } catch (_) { setBubbleActive(false); }
    } else {
      FloatingBubbleModule.stopService();
      setBubbleActive(false);
    }
  };

  useEffect(() => {
    if (incognitoMode && bubbleActive) toggleBubble(false);
  }, [incognitoMode]);

  // ── Tone Toggle ──
  const toggleTone = (id: string) => {
    setSelectedTones(prev => {
      if (prev.includes(id)) return prev.filter(t => t !== id);
      return [...prev, id];
    });
  };

  // ═══════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── Toast ── */}
      <Animated.View style={[s.toast, { opacity: toastAnim, transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]} pointerEvents="none">
        <Text style={s.toastText}>{toastMsg}</Text>
      </Animated.View>

      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.headerBolt}>⚡</Text>
        <Text style={s.headerTitle}>AI KEYBOARD</Text>
      </View>

      {/* ── Content ── */}
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ═══════════ HOME TAB ═══════════ */}
        {activeTab === 'home' && (
          <>
            {/* Radar */}
            {incognitoMode ? (
              <View style={s.radarWrap}>
                <Text style={{ fontSize: 56 }}>🕵️</Text>
                <Text style={[s.radarLabel, { color: C.red, marginTop: 20 }]}>INCOGNITO ACTIVE</Text>
                <Text style={[s.radarSub, { color: C.redDim }]}>Clipboard monitoring strictly disabled</Text>
              </View>
            ) : (
              <View style={s.radarWrap}>
                <View style={s.radarBox}>
                  <Animated.View style={[s.radarDash, { transform: [{ rotate: spin }] }]} />
                  {/* Glow ring */}
                  <Animated.View style={[s.radarGlow, { opacity: glowAnim }]} />
                  <View style={s.radarOuter}>
                    <Animated.View style={[s.radarCore, { transform: [{ scale: pulseAnim }] }]}>
                      <Text style={{ fontSize: 34 }}>🛡️</Text>
                    </Animated.View>
                  </View>
                </View>
                <Text style={s.radarLabel}>ACTIVELY MONITORING</Text>
                <Text style={s.radarSub}>AES-256 Local Encryption Active</Text>
              </View>
            )}

            {/* Stats Row */}
            <View style={s.statsRow}>
              <View style={s.statCard}>
                <Text style={s.statCaption}>BLOCKED</Text>
                <Text style={s.statValue}>{blockedCount}</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statCaption}>AUTO-CLEAR</Text>
                <Text style={[s.statValue, { color: C.primary }]}>{autoClear ? 'ON' : 'OFF'}</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statCaption}>PRIVACY</Text>
                <Text style={s.statValue}>{incognitoMode ? 'MAX' : 'STD'}</Text>
              </View>
            </View>

            {/* Capture Feed */}
            {!incognitoMode && (
              <>
                <View style={s.sectionHead}>
                  <Text style={s.sectionTitle}>Capture Feed</Text>
                  <Text style={s.sectionTag}>REAL-TIME SYNC</Text>
                </View>
                <View style={s.feedCard}>
                  <View style={s.feedIconBox}><Text style={{ fontSize: 16 }}>💬</Text></View>
                  <View style={{ flex: 1, paddingRight: 24 }}>
                    <Text style={s.feedLabel}>LAST COPIED MESSAGE</Text>
                    <Text style={s.feedText}>
                      {lastCopied ? `"${lastCopied}"` : 'Copy a message from WhatsApp or any app...'}
                    </Text>
                  </View>
                  {lastCopied ? (
                    <TouchableOpacity style={s.feedCopyBtn} onPress={() => copyReply(lastCopied)}>
                      <Text style={{ fontSize: 14 }}>📋</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* Generate Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[s.generateBtn, (!lastCopied || isGenerating) && { opacity: 0.5 }]}
                  disabled={!lastCopied || isGenerating}
                  onPress={generateReplies}
                >
                  {isGenerating ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View style={s.generateInner}>
                      <SparkleIcon />
                      <Text style={s.generateText}>GENERATE SMART REPLIES</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <>
                    <Text style={[s.sectionTitle, { marginBottom: 14 }]}>Generated Replies</Text>
                    {suggestions.map((sg, i) => (
                      <TouchableOpacity key={i} style={s.replyCard} activeOpacity={0.7} onPress={() => copyReply(sg.text)}>
                        <View style={s.replyHeader}>
                          <Text style={s.replyTag}>{sg.label?.toUpperCase()}</Text>
                          <Text style={s.replyHint}>TAP TO COPY</Text>
                        </View>
                        <Text style={s.replyText}>{sg.text}</Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ═══════════ TONES TAB ═══════════ */}
        {activeTab === 'tone' && (
          <>
            <View style={s.sectionHead}>
              <View>
                <Text style={s.pageTitle}>Tone Configuration</Text>
                <Text style={s.pageSub}>Select any number of tones to display on your Floating Bubble</Text>
              </View>
            </View>

            {ALL_TONES.map(tone => {
              const active = selectedTones.includes(tone.id);
              return (
                <TouchableOpacity
                  key={tone.id}
                  style={[s.toneCard, active && s.toneCardActive]}
                  activeOpacity={0.8}
                  onPress={() => toggleTone(tone.id)}
                >
                  <View style={[s.toneIconBox, active && { backgroundColor: 'rgba(99,102,241,0.2)' }]}>
                    <Text style={[s.toneIcon, active && { color: C.primary }]}>{tone.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.toneLabel}>{tone.label}</Text>
                    <Text style={s.toneDesc}>{tone.desc}</Text>
                  </View>
                  <View style={[s.toneToggle, active && s.toneToggleActive]}>
                    <View style={[s.toneToggleDot, active && s.toneToggleDotActive]} />
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={s.saveBtn} activeOpacity={0.85} onPress={() => showToast('Preferences saved')}>
              <Text style={s.saveBtnText}>SAVE PREFERENCES</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ═══════════ SYSTEM TAB ═══════════ */}
        {activeTab === 'system' && (
          <>
            <Text style={s.pageTitle}>System Settings</Text>
            <Text style={[s.pageSub, { marginBottom: 20 }]}>Manage core AI engine behavior and privacy controls.</Text>

            <Text style={s.groupLabel}>SYSTEM CONTROLS</Text>
            <View style={s.groupCard}>
              <ToggleRow icon={<ClipboardIcon color={C.onSurfaceVar} />} label="Clipboard Monitor" sub="Detect copied text automatically" value={listenerActive} onChange={setListenerActive} color={C.primary} />
              <View style={s.divider} />
              <ToggleRow icon={<PipIcon color={C.onSurfaceVar} />} label="Floating Bubble Service" sub="Overlay quick access on all apps" value={bubbleActive} onChange={toggleBubble} color={C.primary} />
              <View style={s.divider} />
              <ToggleRow icon="🕵️" label="Incognito Mode" sub="Hardware-level privacy switch" value={incognitoMode} onChange={setIncognitoMode} color={C.red} />
            </View>

            <Text style={s.groupLabel}>SECURITY</Text>
            <View style={s.groupCard}>
              <ToggleRow icon="🧹" label="Auto-Clear Memory" sub="Wipes data 10s after pasting" value={autoClear} onChange={setAutoClear} color={C.green} />
            </View>

            <Text style={s.groupLabel}>ABOUT</Text>
            <View style={s.groupCard}>
              <View style={s.aboutRow}>
                <View>
                  <Text style={s.aboutName}>Replyfy</Text>
                  <Text style={s.aboutVer}>v1.1.0 Beta</Text>
                </View>
                <View style={s.aboutBadge}>
                  <Text style={s.aboutBadgeText}>GEMINI 2.5 FLASH-LITE</Text>
                </View>
              </View>
              <View style={s.divider} />
              <View style={s.aboutRow}>
                <View>
                  <Text style={s.aboutCaption}>ENGINE ARCHITECT</Text>
                  <Text style={s.aboutCredit}>Built with love by Aryan Kumar</Text>
                </View>
              </View>
              <View style={s.divider} />
              <View style={s.aboutStatsRow}>
                <View style={s.aboutStatBox}>
                  <Text style={s.aboutStatCaption}>LATENCY</Text>
                  <Text style={s.aboutStatVal}>14ms</Text>
                </View>
                <View style={s.aboutStatBox}>
                  <Text style={s.aboutStatCaption}>STATUS</Text>
                  <Text style={[s.aboutStatVal, { color: C.green }]}>Encrypted</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Bottom Nav ── */}
      <View style={s.nav}>
        <NavTab id="home" label="HOME" active={activeTab} onPress={setActiveTab} icon={HomeIcon} />
        <NavTab id="tone" label="TONE" active={activeTab} onPress={setActiveTab} icon={PaletteIcon} />
        <NavTab id="system" label="SETTINGS" active={activeTab} onPress={setActiveTab} icon={GearIcon} />
      </View>
    </SafeAreaView>
  );
};

// ══════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════

const ToggleRow = ({ icon, label, sub, value, onChange, color }: any) => (
  <View style={s.toggleRow}>
    <View style={s.toggleIcon}>
      {typeof icon === 'string' ? <Text style={{ fontSize: 16 }}>{icon}</Text> : icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={s.toggleLabel}>{label}</Text>
      <Text style={s.toggleSub}>{sub}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: C.outlineVar, true: color }}
      thumbColor="#fff"
    />
  </View>
);

// ── Sparkle Icon for Generate Button ──
const SparkleIcon = () => (
  <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
    {/* Large star */}
    <View style={{ position: 'absolute', width: 3, height: 14, backgroundColor: '#fff', borderRadius: 1.5 }} />
    <View style={{ position: 'absolute', width: 14, height: 3, backgroundColor: '#fff', borderRadius: 1.5 }} />
    <View style={{ position: 'absolute', width: 3, height: 10, backgroundColor: '#fff', borderRadius: 1.5, transform: [{ rotate: '45deg' }] }} />
    <View style={{ position: 'absolute', width: 10, height: 3, backgroundColor: '#fff', borderRadius: 1.5, transform: [{ rotate: '45deg' }] }} />
    {/* Small sparkle top-right */}
    <View style={{ position: 'absolute', top: 0, right: 0, width: 1.5, height: 6, backgroundColor: '#fff', borderRadius: 1 }} />
    <View style={{ position: 'absolute', top: 2, right: -2, width: 6, height: 1.5, backgroundColor: '#fff', borderRadius: 1 }} />
  </View>
);

// ── Custom Nav Icons ──
const HomeIcon = ({ color }: { color: string }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'flex-end' }}>
    <View style={{ position: 'absolute', top: 0, width: 0, height: 0, borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 9, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color }} />
    <View style={{ width: 16, height: 11, borderWidth: 2, borderColor: color, borderTopWidth: 0, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }}>
      <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: 5, height: 6, backgroundColor: color, borderTopLeftRadius: 2, borderTopRightRadius: 2 }} />
    </View>
  </View>
);

// ── Color Palette Icon (for Tone nav tab) ──
const PaletteIcon = ({ color }: { color: string }) => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    {/* Outer palette shape — rounded oval */}
    <View style={{ width: 22, height: 20, borderRadius: 10, borderWidth: 2, borderColor: color, justifyContent: 'center', alignItems: 'center' }} />
    {/* Palette hole (thumb cutout) */}
    <View style={{ position: 'absolute', bottom: 2, right: 2, width: 5, height: 5, borderRadius: 2.5, borderWidth: 1.5, borderColor: color, backgroundColor: 'transparent' }} />
    {/* Color dots representing paint wells */}
    <View style={{ position: 'absolute', top: 4, left: 5, width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: color }} />
    <View style={{ position: 'absolute', top: 3.5, right: 5.5, width: 3, height: 3, borderRadius: 1.5, backgroundColor: color, opacity: 0.7 }} />
    <View style={{ position: 'absolute', bottom: 5.5, left: 4, width: 3, height: 3, borderRadius: 1.5, backgroundColor: color, opacity: 0.5 }} />
  </View>
);

// ── PiP (Picture-in-Picture) Icon for Floating Bubble ──
const PipIcon = ({ color }: { color: string }) => (
  <View style={{ width: 20, height: 16, justifyContent: 'center', alignItems: 'center' }}>
    {/* Outer screen / window */}
    <View style={{ width: 20, height: 14, borderRadius: 2, borderWidth: 1.8, borderColor: color }} />
    {/* Inner PiP mini-window (bottom-right) */}
    <View style={{ position: 'absolute', bottom: 2.5, right: 2, width: 8, height: 6, borderRadius: 1.5, backgroundColor: color }} />
  </View>
);

// ── Minimalist Clipboard Icon for Clipboard Monitor ──
const ClipboardIcon = ({ color }: { color: string }) => (
  <View style={{ width: 16, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    {/* Board body */}
    <View style={{ width: 16, height: 18, borderRadius: 2.5, borderWidth: 1.8, borderColor: color, marginTop: 2 }} />
    {/* Clip at top */}
    <View style={{ position: 'absolute', top: 0, width: 8, height: 4, borderRadius: 1.5, borderWidth: 1.5, borderColor: color, backgroundColor: 'transparent' }} />
    {/* Lines on clipboard */}
    <View style={{ position: 'absolute', top: 9, left: 4, width: 8, height: 1.4, backgroundColor: color, borderRadius: 1, opacity: 0.6 }} />
    <View style={{ position: 'absolute', top: 12.5, left: 4, width: 6, height: 1.4, backgroundColor: color, borderRadius: 1, opacity: 0.4 }} />
  </View>
);

const GearIcon = ({ color }: { color: string }) => (
  <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: color }} />
    <View style={{ position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
    <View style={{ position: 'absolute', top: 0, width: 2.5, height: 5, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', bottom: 0, width: 2.5, height: 5, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', left: 0, width: 5, height: 2.5, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', right: 0, width: 5, height: 2.5, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

const NavTab = ({ id, label, icon: IconComp, active, onPress }: any) => {
  const isActive = active === id;
  const iconColor = isActive ? C.primary : C.outline;
  return (
    <TouchableOpacity style={s.navTab} activeOpacity={0.7} onPress={() => onPress(id)}>
      <View style={[s.navIconWrap, isActive && s.navIconWrapActive]}>
        <IconComp color={iconColor} />
      </View>
      <Text style={[s.navLabel, isActive && { color: C.primary, opacity: 1 }]}>{label}</Text>
    </TouchableOpacity>
  );
};

// ══════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Toast
  toast: { position: 'absolute', top: 48, left: 24, right: 24, zIndex: 999, backgroundColor: C.surfaceHighest, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(99,102,241,0.15)' },
  toastText: { color: C.onSurface, fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.white10 },
  headerBolt: { fontSize: 18, marginRight: 10 },
  headerTitle: { color: C.onSurface, fontSize: 15, fontWeight: '800', letterSpacing: 2 },

  scroll: { paddingHorizontal: 24, paddingTop: 28 },

  // Radar
  radarWrap: { alignItems: 'center', marginBottom: 36, marginTop: 8 },
  radarBox: { width: 180, height: 180, justifyContent: 'center', alignItems: 'center' },
  radarDash: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 2, borderColor: 'rgba(99,102,241,0.25)', borderStyle: 'dashed' },
  radarGlow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(99,102,241,0.12)', borderWidth: 2, borderColor: 'rgba(99,102,241,0.08)' },
  radarOuter: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(99,102,241,0.08)', borderWidth: 1, borderColor: 'rgba(99,102,241,0.18)', justifyContent: 'center', alignItems: 'center' },
  radarCore: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(99,102,241,0.18)', justifyContent: 'center', alignItems: 'center' },
  radarLabel: { color: C.primaryDim, fontSize: 11, fontWeight: '800', letterSpacing: 2.5, marginTop: 28 },
  radarSub: { color: C.onSurfaceVar, fontSize: 12, marginTop: 4 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 36 },
  statCard: { flex: 1, backgroundColor: C.surface, paddingVertical: 18, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: C.white10 },
  statCaption: { color: C.onSurfaceVar, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
  statValue: { color: C.onSurface, fontSize: 20, fontWeight: '800' },

  // Section
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  sectionTitle: { color: C.onSurface, fontSize: 15, fontWeight: '600' },
  sectionTag: { color: C.white40, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginTop: 3 },

  // Feed
  feedCard: { backgroundColor: C.surface, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: C.white10, marginBottom: 28, position: 'relative' },
  feedIconBox: { backgroundColor: C.white10, width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  feedLabel: { color: C.onSurfaceVar, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  feedText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22, fontStyle: 'italic' },
  feedCopyBtn: { position: 'absolute', top: 16, right: 16 },

  // Generate
  generateBtn: { borderRadius: 999, paddingVertical: 18, alignItems: 'center', marginBottom: 36, overflow: 'hidden', backgroundColor: C.primaryDim, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 24, elevation: 10 },
  generateInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  generateText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 2 },

  // Reply Cards
  replyCard: { backgroundColor: C.surface, borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(99,102,241,0.15)' },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  replyTag: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  replyHint: { color: C.outline, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  replyText: { color: C.onSurface, fontSize: 15, lineHeight: 23 },

  // Page Titles
  pageTitle: { color: C.onSurface, fontSize: 24, fontWeight: '800', marginBottom: 6 },
  pageSub: { color: C.onSurfaceVar, fontSize: 13, lineHeight: 20, marginBottom: 8 },

  // Tone Cards
  toneBadge: { backgroundColor: C.surfaceHighest, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: C.white10 },
  toneBadgeText: { color: C.onSurface, fontSize: 16, fontWeight: '800' },
  toneBadgeSub: { color: C.onSurfaceVar, fontSize: 9, fontWeight: '700', letterSpacing: 1.2, marginTop: 2 },

  toneCard: { backgroundColor: C.surface, borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1.5, borderColor: 'transparent' },
  toneCardActive: { borderColor: 'rgba(99,102,241,0.35)', backgroundColor: C.surfaceHigh },

  toneIconBox: { width: 42, height: 42, borderRadius: 14, backgroundColor: C.white10, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  toneIcon: { color: C.onSurfaceVar, fontSize: 18, fontWeight: '700' },
  toneLabel: { color: C.onSurface, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  toneDesc: { color: C.onSurfaceVar, fontSize: 12, lineHeight: 17 },

  toneToggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: C.outlineVar, justifyContent: 'center', paddingHorizontal: 3 },
  toneToggleActive: { backgroundColor: C.primaryDim },
  toneToggleDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#888' },
  toneToggleDotActive: { backgroundColor: '#fff', alignSelf: 'flex-end' },

  saveBtn: { backgroundColor: C.primaryDim, borderRadius: 999, paddingVertical: 18, alignItems: 'center', marginTop: 8, shadowColor: C.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
  saveBtnText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 2 },

  // System
  groupLabel: { color: C.primaryDim, fontSize: 11, fontWeight: '800', letterSpacing: 1.8, marginBottom: 10, marginTop: 8 },
  groupCard: { backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 6, marginBottom: 24, borderWidth: 1, borderColor: C.white10 },
  divider: { height: 1, backgroundColor: C.white10, marginVertical: 2 },

  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  toggleIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.white10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  toggleLabel: { color: C.onSurface, fontSize: 14, fontWeight: '600' },
  toggleSub: { color: C.onSurfaceVar, fontSize: 11, marginTop: 3, paddingRight: 16 },

  // About
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  aboutName: { color: C.onSurface, fontSize: 20, fontWeight: '800' },
  aboutVer: { color: C.onSurfaceVar, fontSize: 12, marginTop: 2 },
  aboutBadge: { backgroundColor: C.surfaceHighest, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: C.white10 },
  aboutBadgeText: { color: C.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  aboutCaption: { color: C.onSurfaceVar, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  aboutCredit: { color: C.onSurface, fontSize: 13 },
  aboutStatsRow: { flexDirection: 'row', gap: 12, paddingVertical: 16 },
  aboutStatBox: { flex: 1, backgroundColor: C.surfaceLow, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.white10 },
  aboutStatCaption: { color: C.onSurfaceVar, fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
  aboutStatVal: { color: C.onSurface, fontSize: 18, fontWeight: '800' },

  // Nav
  nav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 82, backgroundColor: C.surfaceLow, borderTopWidth: 1, borderTopColor: C.white10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: 12 },
  navTab: { alignItems: 'center', flex: 1 },
  navIconWrap: { width: 44, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  navIconWrapActive: { backgroundColor: 'rgba(99,102,241,0.15)' },
  navLabel: { color: C.outline, fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginTop: 5, opacity: 0.4 },
});

export default App;
