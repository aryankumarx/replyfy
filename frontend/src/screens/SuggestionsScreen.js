import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  IconButton,
  Chip,
} from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import useStore from '../store/useStore';
import apiService from '../services/api.service';

function SuggestionsScreen({ route, navigation }) {
  const { message } = route.params;
  const { userId, userTier, updateUsage } = useStore();

  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);

    const result = await apiService.getSuggestions(message, {
      userId,
      userTier,
    });

    setIsLoading(false);

    if (result.success) {
      setSuggestions(result.data.suggestions);
      updateUsage(result.data.usage);
    } else {
      setError(result.error);
      Alert.alert('Error', result.error);
    }
  };

  const handleCopy = async (text, index) => {
    await Clipboard.setString(text);
    setCopiedIndex(index);

    // Show feedback
    Alert.alert(
      'Copied!',
      'Response copied to clipboard. Now paste it in your chat app.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset after a delay
            setTimeout(() => setCopiedIndex(null), 2000);
          },
        },
      ]
    );
  };

  const getToneIcon = (tone) => {
    switch (tone) {
      case 'casual':
        return 'emoticon-happy-outline';
      case 'professional':
        return 'briefcase-outline';
      case 'brief':
        return 'flash-outline';
      default:
        return 'message-outline';
    }
  };

  const getToneColor = (tone) => {
    switch (tone) {
      case 'casual':
        return '#4CAF50';
      case 'professional':
        return '#2196F3';
      case 'brief':
        return '#FF9800';
      default:
        return '#00A884';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00A884" />
        <Text style={styles.loadingText}>Generating suggestions...</Text>
        <Text style={styles.loadingSubtext}>
          AI is analyzing your message
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <IconButton icon="alert-circle-outline" size={64} iconColor="#FF6B6B" />
        <Text style={styles.errorText}>Failed to generate suggestions</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <Button mode="contained" onPress={fetchSuggestions} style={styles.retryButton}>
          Try Again
        </Button>
        <Button mode="text" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Original Message */}
      <Card style={styles.messageCard}>
        <Card.Content>
          <Text variant="labelSmall" style={styles.label}>
            ORIGINAL MESSAGE
          </Text>
          <Text variant="bodyMedium" style={styles.originalMessage}>
            {message}
          </Text>
        </Card.Content>
      </Card>

      {/* Suggestions */}
      <View style={styles.suggestionsContainer}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          AI Suggestions
        </Text>

        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCopy(suggestion.text, index)}
            activeOpacity={0.7}
          >
            <Card
              style={[
                styles.suggestionCard,
                copiedIndex === index && styles.copiedCard,
              ]}
            >
              <Card.Content>
                <View style={styles.suggestionHeader}>
                  <View style={styles.toneContainer}>
                    <IconButton
                      icon={getToneIcon(suggestion.tone)}
                      size={20}
                      iconColor={getToneColor(suggestion.tone)}
                      style={styles.toneIcon}
                    />
                    <Chip
                      mode="outlined"
                      compact
                      style={[
                        styles.toneChip,
                        { borderColor: getToneColor(suggestion.tone) },
                      ]}
                      textStyle={{ color: getToneColor(suggestion.tone) }}
                    >
                      {suggestion.label}
                    </Chip>
                  </View>
                  {copiedIndex === index && (
                    <Chip
                      mode="flat"
                      compact
                      icon="check"
                      style={styles.copiedChip}
                      textStyle={styles.copiedChipText}
                    >
                      Copied
                    </Chip>
                  )}
                </View>

                <Text variant="bodyLarge" style={styles.suggestionText}>
                  {suggestion.text}
                </Text>

                <View style={styles.actionContainer}>
                  <Button
                    mode="contained-tonal"
                    compact
                    icon={copiedIndex === index ? 'check' : 'content-copy'}
                    onPress={() => handleCopy(suggestion.text, index)}
                    style={styles.copyButton}
                  >
                    {copiedIndex === index ? 'Copied' : 'Copy'}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tips */}
      <Card style={styles.tipsCard}>
        <Card.Content>
          <Text variant="titleSmall" style={styles.tipsTitle}>
            💡 Quick Tip
          </Text>
          <Text variant="bodySmall" style={styles.tipsText}>
            Tap any suggestion to copy it instantly. You can then paste it
            directly into WhatsApp, Telegram, or any other chat app!
          </Text>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.bottomActions}>
        <Button
          mode="outlined"
          icon="refresh"
          onPress={fetchSuggestions}
          style={styles.actionButton}
        >
          Generate New
        </Button>
        <Button
          mode="contained"
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          style={styles.actionButton}
        >
          Try Another Message
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 4,
    color: '#666',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  errorSubtext: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
  },
  messageCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
  },
  label: {
    color: '#666',
    marginBottom: 8,
  },
  originalMessage: {
    fontSize: 15,
    lineHeight: 22,
  },
  suggestionsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  suggestionCard: {
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  copiedCard: {
    borderWidth: 2,
    borderColor: '#00A884',
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toneIcon: {
    margin: 0,
    marginRight: -4,
  },
  toneChip: {
    height: 28,
  },
  copiedChip: {
    backgroundColor: '#00A884',
  },
  copiedChipText: {
    color: '#FFF',
  },
  suggestionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  copyButton: {
    backgroundColor: '#E3F2FD',
  },
  tipsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFF8E1',
  },
  tipsTitle: {
    marginBottom: 8,
  },
  tipsText: {
    color: '#666',
    lineHeight: 20,
  },
  bottomActions: {
    padding: 16,
    paddingTop: 0,
    gap: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default SuggestionsScreen;
