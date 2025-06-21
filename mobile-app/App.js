// App.js - Updated with Calendar Access
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// This is important for mobile
WebBrowser.maybeCompleteAuthSession();

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('App component rendered'); // Debug log

  // Google Auth Request with Calendar scope
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '597568286585-k6t7sajh5r9tt5dobvhg7cj0h74k83h8.apps.googleusercontent.com',
    // TODO: Add iOS and Android client IDs when building standalone apps
    // iosClientId: 'your-ios-client-id',
    // androidClientId: 'your-android-client-id',
    // Updated scopes to include calendar access
    scopes: [
      'profile', 
      'email', 
      'https://www.googleapis.com/auth/calendar.readonly'
    ],
  });

  // Debug logs
  useEffect(() => {
    console.log('Request:', request);
    console.log('Response:', response);
  }, [request, response]);

  // Handle response
  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Auth success:', response);
      const { authentication } = response;
      getUserInfo(authentication.accessToken);
    } else if (response?.type === 'error') {
      console.log('Auth error:', response.error);
      Alert.alert('Authentication Error', response.error?.message || 'Something went wrong');
    }
  }, [response]);

  const getUserInfo = async (token) => {
    setIsLoading(true);
    try {
      console.log('Getting user info with token:', token);
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
      );
      const user = await response.json();
      console.log('User info:', user);
      
      // Also test calendar access
      await testCalendarAccess(token);
      
      setUserInfo(user);
      Alert.alert('Welcome!', `Hello ${user.name}! Calendar access granted.`);
    } catch (error) {
      console.error('Error getting user info:', error);
      Alert.alert('Error', 'Failed to get user information');
    } finally {
      setIsLoading(false);
    }
  };

  // Test function to verify calendar access
  const testCalendarAccess = async (token) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=1&access_token=${token}`
      );
      const calendarData = await response.json();
      console.log('Calendar access test:', calendarData);
      return true;
    } catch (error) {
      console.error('Calendar access error:', error);
      throw new Error('Calendar access failed');
    }
  };

  const handleSignIn = async () => {
    console.log('Sign in button pressed');
    console.log('Request available:', !!request);
    
    if (!request) {
      Alert.alert('Error', 'Google Sign-In not ready. Please wait and try again.');
      return;
    }

    try {
      setIsLoading(true);
      const result = await promptAsync();
      console.log('Prompt result:', result);
    } catch (error) {
      console.error('Prompt error:', error);
      Alert.alert('Error', 'Failed to open sign-in prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUserInfo(null);
    Alert.alert('Signed Out', 'You have been signed out successfully');
  };

  // Show user info if signed in
  if (userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Cornell Fitness AI</Text>
          
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoLabel}>Name:</Text>
            <Text style={styles.userInfoText}>{userInfo.name}</Text>
            
            <Text style={styles.userInfoLabel}>Email:</Text>
            <Text style={styles.userInfoText}>{userInfo.email}</Text>
            
            <Text style={styles.successText}>✅ Calendar access granted!</Text>
          </View>
          
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show sign in screen
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cornell Fitness AI</Text>
        <Text style={styles.subtitle}>
          Your personal fitness assistant for busy Cornell students
        </Text>
        
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>Debug Info:</Text>
          <Text style={styles.debugText}>Request Ready: {request ? '✅' : '❌'}</Text>
          <Text style={styles.debugText}>Loading: {isLoading ? '⏳' : '✅'}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.signInButton, (!request || isLoading) && styles.buttonDisabled]} 
          onPress={handleSignIn}
          disabled={!request || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading...' : 'Sign in with Google'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.infoText}>
          We'll need access to your Google Calendar to find free time for workouts
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B31B1B',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  debugInfo: {
    backgroundColor: '#e8f4f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#bee5eb',
  },
  debugText: {
    fontSize: 14,
    color: '#0c5460',
    marginBottom: 5,
  },
  signInButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  userInfoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
    maxWidth: 300,
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  userInfoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  successText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default App;