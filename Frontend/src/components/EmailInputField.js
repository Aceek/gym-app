import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import InputField from './InputField';
import {setEmail} from '../store/slices/forgotPasswordSlice';

const EmailInputField = React.memo(() => {
  const email = useSelector(state => state.forgotPassword.email);
  const emailError = useSelector(state => state.forgotPassword.error);
  const dispatch = useDispatch();

  const handleChangeText = useCallback(
    text => {
      dispatch(setEmail(text));
    },
    [dispatch],
  );

  return (
    <InputField
      label="Email"
      placeholder="Enter your email"
      value={email}
      onChangeText={handleChangeText}
      error={emailError}
    />
  );
});

export default EmailInputField;
