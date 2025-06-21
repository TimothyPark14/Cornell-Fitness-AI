// mobile-app/constants/Config.ts

// Type definition for Google OAuth configuration
interface GoogleOAuthConfig {
  clientId: string;
  scopes: string[];
}

export const GOOGLE_OAUTH_CONFIG: GoogleOAuthConfig = {
  clientId: '818513285781-9aldvk6m3m9o7bml7fof73lne0iav5m8.apps.googleusercontent.com',
  scopes: [
    'openid',
    'profile', 
    'email',
    'https://www.googleapis.com/auth/calendar.readonly'
  ],
};