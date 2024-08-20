import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {authenticateWithGoogle, api} from './api';
import {handleError} from '../utils/errorHandler';
import {
  storeTokensAndUser,
  clearStoredTokensAndUser,
  getTokenFromKeychain,
  setTokenInKeychain,
} from '../utils/storageUtils';
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from '@env';

export const loginWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
    const idToken = await GoogleSignin.getTokens().then(
      tokens => tokens.idToken,
    );

    const {accessToken, refreshToken, user} = await authenticateWithGoogle(
      idToken,
    );

    await storeTokensAndUser(accessToken, refreshToken, user);

    return user;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const LoginEmail = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const {accessToken, refreshToken, user} = response.data.data;

    console.log('user = ', user);

    await storeTokensAndUser(accessToken, refreshToken, user);

    return user;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const googleLogout = async () => {
  try {
    await GoogleSignin.signOut();
    await clearStoredTokensAndUser();
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const refreshTokenFunc = async () => {
  try {
    const refreshToken = await getTokenFromKeychain(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await api.post('/token/refresh-token', {
      refreshToken,
    });

    const {accessToken} = response.data;
    await setTokenInKeychain(ACCESS_TOKEN_KEY, accessToken);

    return accessToken;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const getTokens = async () => {
  try {
    const accessToken = await getTokenFromKeychain(ACCESS_TOKEN_KEY);
    const refreshToken = await getTokenFromKeychain(REFRESH_TOKEN_KEY);

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const registerUser = async (email, password, displayName) => {
  try {
    console.log('trying to register user');
    const response = await api.post('/auth/register', {
      email,
      password,
      displayName,
    });

    return response;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const resendConfirmationEmail = async email => {
  try {
    const response = await api.post('/auth/resend-confirmation-email', {
      email,
    });

    return response;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const sendConfirmationCode = async (email, code) => {
  try {
    const response = await api.post('/auth/confirm-email', {
      email,
      code,
    });

    return response;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};
