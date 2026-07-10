require('dotenv/config');

module.exports = ({ config }) => ({
  ...config,
  name: 'Hishab',
  slug: 'hishab',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  plugins: [
    [
      'expo-splash-screen',
      {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#F7F0E3',
      },
    ],
  ],
  android: {
    package: 'com.hishab.akram',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F7F0E3',
    },
  },
  favicon: './assets/favicon.png',
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'REPLACE_WITH_YOUR_EAS_PROJECT_ID',
    },
  },
});
