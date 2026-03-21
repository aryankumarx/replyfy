import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  List,
  Switch,
  Button,
  Divider,
} from 'react-native-paper';
import useStore from '../store/useStore';

function SettingsScreen() {
  const { userId, userTier, usage } = useStore();

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Pro',
      'Get unlimited AI suggestions for just $3.99/month!\n\n' +
        '✓ Unlimited suggestions\n' +
        '✓ Custom tone preferences\n' +
        '✓ Priority support\n' +
        '✓ No ads',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Upgrade Now', onPress: () => {} },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Account Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Account
          </Text>
          <List.Item
            title="User ID"
            description={userId}
            left={(props) => <List.Icon {...props} icon="account" />}
          />
          <List.Item
            title="Plan"
            description={userTier === 'free' ? 'Free Plan' : 'Pro Plan'}
            left={(props) => <List.Icon {...props} icon="star" />}
            right={() =>
              userTier === 'free' ? (
                <Button mode="contained-tonal" compact onPress={handleUpgrade}>
                  Upgrade
                </Button>
              ) : null
            }
          />
        </Card.Content>
      </Card>

      {/* Usage Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Usage Statistics
          </Text>
          <List.Item
            title="Today's Usage"
            description={`${usage.used} / ${usage.limit} suggestions used`}
            left={(props) => <List.Icon {...props} icon="chart-line" />}
          />
          <List.Item
            title="Remaining"
            description={`${usage.remaining} suggestions left today`}
            left={(props) => <List.Icon {...props} icon="clock-outline" />}
          />
        </Card.Content>
      </Card>

      {/* App Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            App Settings
          </Text>
          <List.Item
            title="Dark Mode"
            description="Coming soon"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => <Switch disabled value={false} />}
          />
          <Divider />
          <List.Item
            title="Language"
            description="Auto-detect (English, Hindi, Hinglish)"
            left={(props) => <List.Icon {...props} icon="translate" />}
          />
          <Divider />
          <List.Item
            title="Notifications"
            description="Coming soon"
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
            right={() => <Switch disabled value={false} />}
          />
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            About
          </Text>
          <List.Item
            title="Version"
            description="1.0.0 (Beta)"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            description="Your data is never stored"
            left={(props) => <List.Icon {...props} icon="shield-check" />}
            onPress={() => Alert.alert('Privacy', 'We never store your messages. All AI processing is ephemeral and encrypted.')}
          />
          <Divider />
          <List.Item
            title="Support"
            description="Get help or report issues"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={() => Alert.alert('Support', 'Email: support@example.com')}
          />
        </Card.Content>
      </Card>

      {/* Upgrade CTA */}
      {userTier === 'free' && (
        <Card style={[styles.card, styles.upgradeCard]}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.upgradeTitle}>
              Unlock Pro Features
            </Text>
            <Text variant="bodyMedium" style={styles.upgradeDescription}>
              Get unlimited AI suggestions and premium features
            </Text>
            <Button
              mode="contained"
              onPress={handleUpgrade}
              style={styles.upgradeButton}
            >
              Upgrade to Pro - $3.99/month
            </Button>
          </Card.Content>
        </Card>
      )}

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerText}>
          Made with ❤️ for better conversations
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  card: {
    margin: 16,
    marginBottom: 0,
  },
  cardTitle: {
    marginBottom: 8,
  },
  upgradeCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  upgradeTitle: {
    color: '#1976D2',
    marginBottom: 8,
  },
  upgradeDescription: {
    color: '#666',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#2196F3',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
  },
});

export default SettingsScreen;
