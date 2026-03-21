import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SuggestionsScreen from './src/screens/SuggestionsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

// Custom theme
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#00A884', // WhatsApp green
    secondary: '#25D366',
    background: '#FFFFFF',
    surface: '#F7F8FA',
  },
};

function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FFFFFF',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              title: 'AI Keyboard Assistant',
              headerRight: () => <SettingsButton />
            }}
          />
          <Stack.Screen 
            name="Suggestions" 
            component={SuggestionsScreen} 
            options={{ title: 'AI Suggestions' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// Settings button component
const SettingsButton = () => {
  const navigation = useNavigation();
  return (
    <IconButton
      icon="cog"
      size={24}
      onPress={() => navigation.navigate('Settings')}
    />
  );
};

export default App;
