import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
  ProgressBar,
  Chip,
} from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import useStore from '../store/useStore';
import apiService from '../services/api.service';

function HomeScreen({ navigation }) {
  const {
    currentMessage,
    setCurrentMessage,
    usage,
    updateUsage,
    userId,
    userTier,
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);

  // Load usage on mount
  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    const result = await apiService.getUsage(userId, userTier);
    if (result.success) {
      updateUsage(result.data.usage);
    }
  };

  const handlePasteFromClipboard = async () => {
    const text = await Clipboard.getString();
    if (text) {
      setCurrentMessage(text);
    } else {
      Alert.alert('Clipboard Empty', 'No text found in clipboard');
    }
  };

  const handleGetSuggestions = () => {
    if (!currentMessage.trim()) {
      Alert.alert('Empty Message', 'Please enter or paste a message first');
      return;
    }

    if (usage.remaining <= 0) {
      Alert.alert(
        'Daily Limit Reached',
        'You have used all your daily suggestions. Upgrade to Pro for unlimited access!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Settings') },
        ]
      );
      return;
    }

    // Navigate to suggestions screen
    navigation.navigate('Suggestions', { message: currentMessage });
  };

  const usagePercentage = (usage.used / usage.limit) * 100;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        {/* Usage Card */}
        <Card style={styles.usageCard}>
          <Card.Content>
            <View style={styles.usageHeader}>
              <Text variant="titleMedium">Daily Usage</Text>
              <Chip mode="outlined" compact>
                {userTier === 'free' ? 'Free' : 'Pro'}
              </Chip>
            </View>
            <View style={styles.usageStats}>
              <Text variant="headlineMedium" style={styles.usageNumber}>
                {usage.remaining}
              </Text>
              <Text variant="bodyMedium" style={styles.usageLabel}>
                suggestions remaining
              </Text>
            </View>
            <ProgressBar
              progress={usagePercentage / 100}
              color={usagePercentage > 80 ? '#FF6B6B' : '#00A884'}
              style={styles.progressBar}
            />
            <Text variant="bodySmall" style={styles.usageSubtext}>
              {usage.used} / {usage.limit} used today
            </Text>
          </Card.Content>
        </Card>

        {/* Instructions */}
        <Card style={styles.instructionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.instructionTitle}>
              How it works
            </Text>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>
                Paste or type the message you received
              </Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>
                Tap "Get AI Suggestions" to generate responses
              </Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>
                Choose a suggestion and copy it to your chat
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Message Input */}
        <Card style={styles.inputCard}>
          <Card.Content>
            <View style={styles.inputHeader}>
              <Text variant="titleMedium">Message</Text>
              <IconButton
                icon="content-paste"
                size={20}
                onPress={handlePasteFromClipboard}
              />
            </View>
            <TextInput
              mode="outlined"
              placeholder="Paste the message you want to respond to..."
              value={currentMessage}
              onChangeText={setCurrentMessage}
              multiline
              numberOfLines={6}
              style={styles.textInput}
              outlineColor="#E0E0E0"
              activeOutlineColor="#00A884"
            />
            <Text variant="bodySmall" style={styles.characterCount}>
              {currentMessage.length} / 1000 characters
            </Text>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleGetSuggestions}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            disabled={!currentMessage.trim() || usage.remaining <= 0}
            icon="robot"
          >
            Get AI Suggestions
          </Button>

          {currentMessage && (
            <Button
              mode="outlined"
              onPress={() => setCurrentMessage('')}
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
            >
              Clear
            </Button>
          )}
        </View>

        {/* Quick Examples */}
        <Card style={styles.examplesCard}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.examplesTitle}>
              Try these examples:
            </Text>
            <Button
              mode="text"
              compact
              onPress={() =>
                setCurrentMessage('Hey! Are you free for dinner tomorrow?')
              }
              style={styles.exampleButton}
            >
              "Hey! Are you free for dinner tomorrow?"
            </Button>
            <Button
              mode="text"
              compact
              onPress={() =>
                setCurrentMessage('Boss ne bola kal office aana hai')
              }
              style={styles.exampleButton}
            >
              "Boss ne bola kal office aana hai" (Hinglish)
            </Button>
            <Button
              mode="text"
              compact
              onPress={() =>
                setCurrentMessage('Can you review my proposal by EOD?')
              }
              style={styles.exampleButton}
            >
              "Can you review my proposal by EOD?"
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollView: {
    flex: 1,
  },
  usageCard: {
    margin: 16,
    marginBottom: 12,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  usageStats: {
    alignItems: 'center',
    marginVertical: 8,
  },
  usageNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00A884',
  },
  usageLabel: {
    color: '#666',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 12,
  },
  usageSubtext: {
    color: '#999',
    textAlign: 'center',
  },
  instructionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  instructionTitle: {
    marginBottom: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00A884',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    color: '#666',
  },
  inputCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFF',
    fontSize: 15,
  },
  characterCount: {
    textAlign: 'right',
    color: '#999',
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    borderColor: '#E0E0E0',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  examplesCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  examplesTitle: {
    marginBottom: 8,
    color: '#666',
  },
  exampleButton: {
    justifyContent: 'flex-start',
  },
});

export default HomeScreen;
