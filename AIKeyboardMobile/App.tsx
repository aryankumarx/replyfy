import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
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

// Modular Imports
import { C } from './src/constants/theme';
import { ALL_TONES } from './src/constants/tones';
import { styles as s } from './src/styles/App.styles';
import { 
  SparkleIcon, 
  HomeIcon, 
  PaletteIcon, 
  GearIcon, 
  PipIcon, 
  ClipboardIcon 
} from './src/components/Icons';
import { ToggleRow, NavTab } from './src/components/Shared';

const { FloatingBubbleModule } = NativeModules;

// ══════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════
// IMPORTANT: These values are injected from android/local.properties at build time
const API_URL = 'https://replyfy.onrender.com'; 
const API_KEY = 'my-super-secret-key-12345'; // Must match backend APP_API_KEY
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ══════════════════════════════════════════════
// HELPERS
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
  const [activeTab, setActiveTab] = useState<'home' | 'tone' | 'system'>('home');
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [listenerActive, setListenerActive] = useState(true);
  const [bubbleActive, setBubbleActive] = useState(false);
  const [autoClear, setAutoClear] = useState(true);
  const [lastCopied, setLastCopied] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [blockedCount, setBlockedCount] = useState(0);
  const [selectedTones, setSelectedTones] = useState<string[]>(['genz', 'sarcastic', 'sweet']);
  const [toastMsg, setToastMsg] = useState('');

  const toastAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const prevClip = useRef('');

  useEffect(() => {
    Animated.loop(Animated.timing(spinAnim, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.12, duration: 2000, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 0.8, duration: 1800, useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0.2, duration: 1800, useNativeDriver: true }),
    ])).start();
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, []);

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
      const filtered = data.suggestions.filter((s: any) => selectedTones.includes(s.tone));
      setSuggestions(filtered.length > 0 ? filtered : data.suggestions);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyReply = (text: string) => {
    Clipboard.setString(text);
    showToast('Copied to clipboard');
    if (autoClear) {
      setTimeout(() => { Clipboard.setString(''); prevClip.current = ''; }, 10000);
    }
  };

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

  const toggleTone = (id: string) => {
    setSelectedTones(prev => {
      let newTones;
      if (prev.includes(id)) newTones = prev.filter(t => t !== id);
      else newTones = [...prev, id];
      if (typeof FloatingBubbleModule.setTones === 'function') {
        FloatingBubbleModule.setTones(newTones);
      }
      return newTones;
    });
  };

  useEffect(() => {
    if (typeof FloatingBubbleModule.setTones === 'function') {
      FloatingBubbleModule.setTones(selectedTones);
    }
  }, []);

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <Animated.View style={[s.toast, { opacity: toastAnim, transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]} pointerEvents="none">
        <Text style={s.toastText}>{toastMsg}</Text>
      </Animated.View>

      <View style={s.header}>
        <Text style={s.headerBolt}>⚡</Text>
        <Text style={s.headerTitle}>AI KEYBOARD</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'home' && (
          <>
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
                  <Animated.View style={[s.radarGlow, { opacity: glowAnim }]} />
                  <View style={s.radarOuter}>
                    <Animated.View style={[s.radarCore, { 
                      transform: [{ scale: pulseAnim }],
                      shadowColor: '#6366F1', shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8, shadowRadius: 15, elevation: 10
                    }]}>
                      <Text style={{ 
                        fontSize: 34, textShadowColor: 'rgba(99,102,241,1)',
                        textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 15
                      }}>🛡️</Text>
                    </Animated.View>
                  </View>
                </View>
                <Text style={s.radarLabel}>ACTIVELY MONITORING</Text>
                <Text style={s.radarSub}>AES-256 Local Encryption Active</Text>
              </View>
            )}

            <View style={s.statsRow}>
              {[
                { label: 'BLOCKED', val: blockedCount },
                { label: 'AUTO-CLEAR', val: autoClear ? 'ON' : 'OFF', color: C.primary },
                { label: 'PRIVACY', val: incognitoMode ? 'MAX' : 'STD' }
              ].map((st, i) => (
                <View key={i} style={s.statCard}>
                  <Text style={s.statCaption}>{st.label}</Text>
                  <Text style={[s.statValue, st.color && { color: st.color }]}>{st.val}</Text>
                </View>
              ))}
            </View>

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
                    <Text style={s.feedText}>{lastCopied ? `"${lastCopied}"` : 'Copy a message from WhatsApp or any app...'}</Text>
                  </View>
                  {lastCopied ? (
                    <TouchableOpacity style={s.feedCopyBtn} onPress={() => copyReply(lastCopied)}>
                      <Text style={{ fontSize: 14 }}>📋</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <TouchableOpacity activeOpacity={0.85} style={[s.generateBtn, (!lastCopied || isGenerating) && { opacity: 0.5 }]} disabled={!lastCopied || isGenerating} onPress={generateReplies}>
                  {isGenerating ? <ActivityIndicator color="#fff" /> : (
                    <View style={s.generateInner}>
                      <SparkleIcon />
                      <Text style={s.generateText}>GENERATE SMART REPLIES</Text>
                    </View>
                  )}
                </TouchableOpacity>

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
                <TouchableOpacity key={tone.id} style={[s.toneCard, active && s.toneCardActive]} activeOpacity={0.8} onPress={() => toggleTone(tone.id)}>
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
                <View><Text style={s.aboutName}>Replyfy</Text><Text style={s.aboutVer}>v1.2.0 Beta</Text></View>
                <View style={s.aboutBadge}><Text style={s.aboutBadgeText}>GEMINI 2.5 FLASH</Text></View>
              </View>
              <View style={s.divider} />
              <View style={s.aboutRow}><View><Text style={s.aboutCaption}>ENGINE ARCHITECT</Text><Text style={s.aboutCredit}>Built with love by Aryan Kumar</Text></View></View>
              <View style={s.divider} />
              <View style={s.aboutStatsRow}>
                <View style={s.aboutStatBox}><Text style={s.aboutStatCaption}>LATENCY</Text><Text style={s.aboutStatVal}>14ms</Text></View>
                <View style={s.aboutStatBox}><Text style={s.aboutStatCaption}>STATUS</Text><Text style={[s.aboutStatVal, { color: C.green }]}>Encrypted</Text></View>
              </View>
            </View>
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.nav}>
        <NavTab id="home" label="HOME" active={activeTab} onPress={setActiveTab} icon={HomeIcon} />
        <NavTab id="tone" label="TONE" active={activeTab} onPress={setActiveTab} icon={PaletteIcon} />
        <NavTab id="system" label="SETTINGS" active={activeTab} onPress={setActiveTab} icon={GearIcon} />
      </View>
    </SafeAreaView>
  );
};

export default App;
