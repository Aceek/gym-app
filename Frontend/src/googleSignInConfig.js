import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GOOGLE_ANDROID_CLIENT_ID} from '@env';

export const configureGoogleSignIn = () => {
  console.log('GOOGLE_ANDROID_CLIENT_ID:', GOOGLE_ANDROID_CLIENT_ID);

  GoogleSignin.configure({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email', 'openid'],
  });
};
