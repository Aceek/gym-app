import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GOOGLE_WEB_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID} from '@env';

console.log('GOOGLE_WEB_CLIENT_ID:', GOOGLE_WEB_CLIENT_ID);
console.log('GOOGLE_ANDROID_CLIENT_ID:', GOOGLE_ANDROID_CLIENT_ID);

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
  });
};
