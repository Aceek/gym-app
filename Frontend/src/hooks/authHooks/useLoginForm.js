import {useState, useCallback, useContext} from 'react';
import {validateUserForLogin} from '../../validators/loginValidators';
import {AuthContext} from '../../context/AuthContext';
import store from '../../store/store';
import {setErrors} from '../../store/slices/loginSlice';
import {useDispatch} from 'react-redux';

export const useLoginForm = navigation => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const {login} = useContext(AuthContext);

  const dispatch = useDispatch();

  const handleLogin = useCallback(async () => {
    const {email, password} = store.getState().login;
    setServerError('');
    dispatch(setErrors({}));

    try {
      const {
        valid,
        errors: validationErrors,
        userInfo,
      } = await validateUserForLogin(email, password);

      if (!valid) {
        dispatch(setErrors(validationErrors));
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      await login(false, userInfo);
    } catch (err) {
      setServerError(err.message);
      if (err.details && err.details.redirect) {
        dispatch(setErrors({}));
        setShowPopup(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [login, dispatch]);

  const handleLoginWithGoogle = useCallback(async () => {
    setServerError('');
    dispatch(setErrors({}));

    try {
      setIsGoogleLogin(true);
      await login(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsGoogleLogin(false);
    }
  }, [login, dispatch]);

  const handleCancel = useCallback(() => {
    setShowPopup(false);
  }, []);

  const handlePopupTimeout = useCallback(() => {
    const {email} = store.getState().login;
    setShowPopup(false);
    navigation.navigate('Confirmation', {email: email.toLowerCase().trim()});
  }, [navigation]);

  return {
    isLoading,
    isGoogleLogin,
    serverError,
    showPopup,
    handleLogin,
    handleLoginWithGoogle,
    handleCancel,
    handlePopupTimeout,
  };
};
