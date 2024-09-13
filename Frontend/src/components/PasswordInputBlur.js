import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setPassword, setErrors} from '../store/slices/loginSlice';
import InputField from './InputField';
import {useCallback} from 'react';
import {validatePasswordRegister} from '../validators/fieldsValidators';

const PasswordInputBlur = React.memo(() => {
  const password = useSelector(state => state.login.password);
  const passwordErrors = useSelector(state => state.login.errors.password);
  const dispatch = useDispatch();

  const handlePasswordBlur = useCallback(() => {
    const passwordValidation = validatePasswordRegister(password);
    dispatch(
      setErrors({
        password: passwordValidation.valid
          ? null
          : passwordValidation.errors.join(', '),
      }),
    );
  }, [password, dispatch]);

  return (
    <InputField
      label="Password"
      placeholder="Enter your password"
      secureTextEntry
      value={password}
      onChangeText={text => dispatch(setPassword(text))}
      onBlur={handlePasswordBlur}
      error={passwordErrors}
    />
  );
});

export default PasswordInputBlur;
