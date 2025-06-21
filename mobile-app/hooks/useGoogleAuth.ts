// hooks/useGoogleAuth.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_OAUTH_CONFIG } from '../constants/Config';

// Type definitions
interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale?: string;
}

interface UseGoogleAuthReturn {
  user: GoogleUser | null;
  accessToken: string | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const useGoogleAuth = (): UseGoogleAuthReturn => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  console.log('🔥 useGoogleAuth hook initialized');

  // Load stored authentication on app start
  useEffect(() => {
    loadStoredAuth();
    
    // Check for OAuth callback in URL hash
    const handleOAuthCallback = () => {
      const hash = window.location.hash;
      console.log('🔍 Current URL hash:', hash);
      
      if (hash && hash.includes('access_token=')) {
        console.log('🎯 OAuth callback detected');
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        console.log('🔑 Token extracted:', token ? 'Token found' : 'No token');
        
        if (token) {
          handleAuthSuccess(token);
          // Clean up URL and redirect to home
          window.history.replaceState({}, document.title, '/');
          // Force reload to home screen
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
        }
      }
    };

    handleOAuthCallback();
  }, []);

  const handleAuthSuccess = async (token: string): Promise<void> => {
    try {
      setAccessToken(token);
      
      // Get user info from Google
      const userInfo = await getUserInfo(token);
      setUser(userInfo);
      
      // Store for persistence
      await AsyncStorage.setItem('google_access_token', token);
      await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
      
      console.log('✅ Google sign-in successful:', userInfo.email);
    } catch (error) {
      console.error('Error handling auth success:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = async (token: string): Promise<GoogleUser> => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.status}`);
      }
      
      const userInfo: GoogleUser = await response.json();
      return userInfo;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  };

  const loadStoredAuth = async (): Promise<void> => {
    try {
      const storedToken = await AsyncStorage.getItem('google_access_token');
      const storedUser = await AsyncStorage.getItem('user_info');
      
      if (storedToken && storedUser) {
        // Verify token is still valid
        const isValid = await verifyToken(storedToken);
        if (isValid) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser) as GoogleUser);
        } else {
          // Token expired, clear storage
          await clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const clearStoredAuth = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove(['google_access_token', 'user_info']);
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing stored auth:', error);
    }
  };

  const signIn = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('🚀 Starting Google OAuth flow...');
      
      // Manual OAuth URL construction to avoid PKCE issues
      const params = new URLSearchParams({
        client_id: GOOGLE_OAUTH_CONFIG.clientId,
        redirect_uri: window.location.origin,
        response_type: 'token',
        scope: GOOGLE_OAUTH_CONFIG.scopes.join(' '),
        prompt: 'select_account',
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
      console.log('🔗 Auth URL:', authUrl);
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error signing in:', error);
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Revoke the access token
      if (accessToken) {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
          method: 'POST',
        });
      }
      
      await clearStoredAuth();
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    accessToken,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user && !!accessToken,
  };
};

export default useGoogleAuth;