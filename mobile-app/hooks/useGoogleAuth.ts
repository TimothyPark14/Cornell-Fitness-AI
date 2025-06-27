// hooks/useGoogleAuth.ts
import { useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

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

  // Use different client IDs for different platforms
  const getClientId = () => {
    if (Platform.OS === 'ios') {
      return 'YOUR_IOS_CLIENT_ID_HERE.apps.googleusercontent.com'; // Replace with your actual iOS client ID
    } else if (Platform.OS === 'android') {
      return 'YOUR_ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com'; // Replace with your actual Android client ID
    } else {
      return '818513285781-9aldvk6m3m9o7bml7fof73lne0iav5m8.apps.googleusercontent.com'; // Web client ID
    }
  };

  const clientId = getClientId();
  console.log('📱 Platform:', Platform.OS, 'Client ID:', clientId.substring(0, 20) + '...');

  // Create redirect URI based on platform
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'exp',
    path: 'redirect',
  });

  console.log('📱 Platform:', Platform.OS);
  console.log('🔗 Redirect URI:', redirectUri);

  // Configure AuthSession request
  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: '818513285781-9aldvk6m3m9o7bml7fof73lne0iav5m8.apps.googleusercontent.com',
    scopes: [
      'openid',
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar.readonly'
    ],
    redirectUri: redirectUri,
    responseType: AuthSession.ResponseType.Token,
    extraParams: {
      prompt: 'select_account',
    },
    usePKCE: false, // Disable PKCE for compatibility
  }, {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  });

  // Handle authentication response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('✅ Auth success, got token:', !!authentication?.accessToken);
      if (authentication?.accessToken) {
        handleAuthSuccess(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      console.error('❌ Auth error:', response.error);
      setLoading(false);
    } else if (response?.type === 'cancel') {
      console.log('❌ Auth cancelled by user');
      setLoading(false);
    }
  }, [response]);

  // Load stored authentication on app start
  useEffect(() => {
    loadStoredAuth();
    
    // Web-specific: Check for OAuth callback in URL hash
    if (Platform.OS === 'web') {
      const handleWebCallback = () => {
        const hash = window.location.hash;
        console.log('🔍 Current URL hash:', hash);
        
        if (hash && hash.includes('access_token=')) {
          console.log('🎯 Web OAuth callback detected');
          const params = new URLSearchParams(hash.substring(1));
          const token = params.get('access_token');
          
          if (token) {
            handleAuthSuccess(token);
            // Clean up URL
            window.history.replaceState({}, document.title, '/');
          }
        }
      };
      
      handleWebCallback();
    }
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
      console.error('❌ Error handling auth success:', error);
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
      console.error('❌ Error getting user info:', error);
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
          console.log('✅ Loaded stored authentication');
        } else {
          // Token expired, clear storage
          await clearStoredAuth();
          console.log('⚠️ Stored token expired, cleared');
        }
      }
    } catch (error) {
      console.error('❌ Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      // Don't verify mock tokens - they're always valid for development
      if (token.includes('mobile_demo_token') || token.includes('dev_mock_token')) {
        console.log('✅ Mock token detected, skipping verification');
        return true;
      }
      
      // Only verify real Google tokens
      const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
      return response.ok;
    } catch (error) {
      // For mock tokens, always return true
      if (token.includes('mobile_demo_token') || token.includes('dev_mock_token')) {
        return true;
      }
      return false;
    }
  };

  const clearStoredAuth = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove(['google_access_token', 'user_info']);
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.error('❌ Error clearing stored auth:', error);
    }
  };

  const signIn = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('🚀 Starting Google OAuth flow...');
      
      if (Platform.OS === 'web') {
        // Web: Use manual redirect (this works)
        const params = new URLSearchParams({
          client_id: '818513285781-9aldvk6m3m9o7bml7fof73lne0iav5m8.apps.googleusercontent.com',
          redirect_uri: window.location.origin,
          response_type: 'token',
          scope: [
            'openid',
            'profile',
            'email',
            'https://www.googleapis.com/auth/calendar.readonly'
          ].join(' '),
          prompt: 'select_account',
        });

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
        console.log('🌐 Web auth URL:', authUrl);
        window.location.href = authUrl;
      } else {
        // iOS/Android: Use mock authentication for development
        console.log('📱 Using mock authentication for mobile development');
        
        // Create mock Cornell user
        const mockUser: GoogleUser = {
          id: 'mobile_cornell_student',
          email: 'tkp26@cornell.edu',
          verified_email: true,
          name: 'Timothy Park (Mobile)',
          given_name: 'Timothy',
          family_name: 'Park',
          picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        };
        
        setUser(mockUser);
        setAccessToken('mobile_demo_token_' + Date.now());
        
        // Store for persistence
        await AsyncStorage.setItem('user_info', JSON.stringify(mockUser));
        await AsyncStorage.setItem('google_access_token', 'mobile_demo_token_' + Date.now());
        
        console.log('✅ Mock mobile sign-in successful');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error signing in:', error);
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
      console.error('❌ Error signing out:', error);
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