// app/(tabs)/index.tsx - Cornell Fitness AI Main Screen
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import useGoogleAuth from '../../hooks/useGoogleAuth';
import WorkoutScheduler from '../../components/WorkoutScheduler';

// This is important for mobile
WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const { user, loading, signIn, signOut, isAuthenticated } = useGoogleAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Signed Out', 'You have been signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Authenticated user view with workout scheduler
  if (isAuthenticated && user) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Cornell Fitness AI</Text>
              <Text style={styles.welcomeText}>Welcome back, {user.given_name}!</Text>
            </View>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* User Info Card */}
          <View style={styles.userCard}>
            {user.picture && (
              <Image source={{ uri: user.picture }} style={styles.profilePicture} />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.successText}>✅ Calendar access active</Text>
            </View>
          </View>

          {/* Workout Scheduler Component */}
          <WorkoutScheduler />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Sign in screen for unauthenticated users
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cornell Fitness AI</Text>
        <Text style={styles.subtitle}>
          Your personal fitness assistant
        </Text>
        
        <View style={styles.featuresList}>
          <Text style={styles.featuresTitle}>What we do:</Text>
          <Text style={styles.featureItem}>📅 Analyze your calendar for free time</Text>
          <Text style={styles.featureItem}>💪 Suggest optimal workout times</Text>
          <Text style={styles.featureItem}>🏃 Create personalized workout plans</Text>
          <Text style={styles.featureItem}>📍 Find nearby Cornell gym facilities</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.signInButton} 
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>
            Sign in with Google
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.infoText}>
          We'll access your Google Calendar to find the best times for your workouts
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B31B1B',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresList: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    width: '100%',
    maxWidth: 350,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  featureItem: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
    lineHeight: 22,
  },
  signInButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
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
  userCard: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  successText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
});