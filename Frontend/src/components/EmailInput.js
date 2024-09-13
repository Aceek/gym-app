import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setEmail, setErrors} from '../store/actions/loginAction';
import {useCallback} from 'react';
import {validateEmail} from '../validators/fieldsValidators';

import InputField from './InputField';

const EmailInput = React.memo(() => {
  const email = useSelector(state => state.login.email);
  const emailError = useSelector(state => state.login.errors.email);
  const dispatch = useDispatch();

  const handleEmailBlur = useCallback(() => {
    const emailValidation = validateEmail(email);
    dispatch(
      setErrors({
        email: emailValidation.valid ? null : emailValidation.message,
      }),
    );
  }, [email, dispatch]);

  return (
    <InputField
      label="Email"
      placeholder="Enter your email"
      value={email}
      onChangeText={text => dispatch(setEmail(text))}
      onBlur={handleEmailBlur}
      error={emailError}
    />
  );
});

export default EmailInput;
