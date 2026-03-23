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
  ScrollView
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

// Change this to your actual Render URL!
const API_URL = 'https://ai-keyboard-assistant.onrender.com';
const API_KEY = 'my-super-secret-key-12345';

const App = () => {
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [listenerActive, setListenerActive] = useState(true);
  const [lastCopiedText, setLastCopiedText] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // We use a ref to track the previous clipboard text without triggering re-renders
  const prevClipboardText = useRef('');

  useEffect(() => {
    // A simple polling mechanism to detect clipboard changes while the app is active
    // In the future, this will run in a Headless JS Background Task
    let interval: ReturnType<typeof setInterval>;

    if (listenerActive && !incognitoMode) {
      interval = setInterval(async () => {
        try {
          const text = await Clipboard.getString();
          
          if (text && text !== prevClipboardText.current) {
            console.log('New text copied:', text);
            prevClipboardText.current = text;
            setLastCopiedText(text);
          }
        } catch (error) {
          console.error('Failed to read clipboard', error);
        }
      }, 1500); // Check clipboard every 1.5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [listenerActive, incognitoMode]);

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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch suggestions');
      }

      setSuggestions(data.suggestions);

    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', 'Smart reply copied to clipboard. You can paste it now.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <Text style={styles.logo}>⌨️</Text>
          <Text style={styles.title}>AI Keyboard Assistant</Text>
          <Text style={styles.subtitle}>Mobile App Prototype</Text>
        </View>

        {/* Dashboard Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Settings & Privacy</Text>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingText}>Clipboard Listener</Text>
              <Text style={styles.settingSubtext}>Automatically read copied text</Text>
            </View>
            <Switch
              value={listenerActive}
              onValueChange={setListenerActive}
              trackColor={{ false: '#333', true: '#6366f1' }}
              thumbColor={listenerActive ? '#ffffff' : '#888'}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingText}>🕵️‍♂️ Incognito Mode</Text>
              <Text style={styles.settingSubtext}>Pause tracking for privacy</Text>
            </View>
            <Switch
              value={incognitoMode}
              onValueChange={setIncognitoMode}
              trackColor={{ false: '#333', true: '#f43f5e' }}
              thumbColor={incognitoMode ? '#ffffff' : '#888'}
            />
          </View>
        </View>

        {/* Real-time Interaction Area */}
        {incognitoMode ? (
          <View style={styles.incognitoBanner}>
            <Text style={styles.incognitoText}>Incognito Mode Active: Clipboard paused.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📩 Last Copied Message</Text>
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                {lastCopiedText || 'Copy a message from anywhere to see it here...'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (!lastCopiedText || isGenerating) && styles.buttonDisabled
              ]}
              disabled={!lastCopiedText || isGenerating}
              onPress={() => generateReplies(lastCopiedText)}
            >
              {isGenerating ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>⚡ Generate Smart Replies</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Suggestions Area */}
        {suggestions.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💬 Smart Replies</Text>
            {suggestions.map((s, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionItem}
                onPress={() => copyToClipboard(s.text)}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  logo: { fontSize: 48, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '700', color: '#10b981', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  card: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a35'
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a35' },
  settingText: { fontSize: 16, color: '#e0e0e0', fontWeight: '500' },
  settingSubtext: { fontSize: 12, color: '#888', marginTop: 4 },
  incognitoBanner: { backgroundColor: '#f43f5e15', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#f43f5e50', marginBottom: 20 },
  incognitoText: { color: '#f43f5e', textAlign: 'center', fontWeight: '600' },
  messageBox: { backgroundColor: '#00000050', padding: 15, borderRadius: 12, minHeight: 80, marginBottom: 15 },
  messageText: { color: '#d0d0d0', fontSize: 16, lineHeight: 24 },
  button: { backgroundColor: '#6366f1', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#444455' },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  suggestionItem: { backgroundColor: '#2a2a35', padding: 15, borderRadius: 12, marginBottom: 10 },
  suggestionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  suggestionLabel: { color: '#10b981', fontWeight: '600', fontSize: 12, textTransform: 'uppercase' },
  copyHint: { color: '#888', fontSize: 11 },
  suggestionText: { color: '#e0e0e0', fontSize: 15, lineHeight: 22 }
});

export default App;
