import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import useGoogleAuth from '@/hooks/useGoogleAuth';

// This is important for mobile
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading, user, isAuthenticated } = useGoogleAuth();

  // Watch for successful authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated:', user.email);
      checkUserExists(user.email);
    }
  }, [isAuthenticated, user]);

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign-in...');
      await signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
      // You could show an alert or toast message here
    }
  };

  const checkUserExists = async (email: string) => {
    try {
      // Check if user exists in your system
      const userExists = await checkIfUserExistsInDatabase(email);

      if (userExists) {
        console.log('Existing user, redirecting to profile');
        router.replace('/(tabs)/profile' as any);
      } else {
        console.log('New user, redirecting to onboarding');
        router.replace('/(auth)/onboarding' as any);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  // TODO: Replace this with actual API call to your backend
  const checkIfUserExistsInDatabase = async (email: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, let's say users with "existing" in their email exist
    // In real app, this would be an API call to your backend
    return email.includes('existing');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7f1d1d', '#991b1b', '#374151']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.backgroundDecoration}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>CF</Text>
              </View>
              <Text style={styles.title}>Cornell Fitness AI</Text>
              <Text style={styles.subtitle}>Train smarter. Push harder.</Text>
            </View>

            <View style={styles.formContainer}>
              <TouchableOpacity 
                style={styles.button}
                onPress={handleGoogleSignIn}
              >
                <Text style={styles.buttonText}>SIGN IN WITH GOOGLE</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.terms}>
              By signing in, you agree to our <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  backgroundDecoration: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
  },
  circle1: { width: 100, height: 100, top: 80, left: 50 },
  circle2: { width: 80, height: 80, bottom: 120, right: 40 },
  circle3: { width: 60, height: 60, top: '50%', left: 20 },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(254,202,202,0.9)',
    fontStyle: 'italic',
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
    paddingHorizontal: 20,
  },

  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  button: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  terms: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  link: {
    color: '#fca5a5',
    textDecorationLine: 'underline',
  },
  textInput: {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 12,
  marginBottom: 16,
  color: 'white',
  fontSize: 18,
},

});
