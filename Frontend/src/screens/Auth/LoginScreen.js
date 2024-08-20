import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import {validateUserForLogin} from '../../utils/authValidators';
import {validateEmail} from '../../utils/fieldsValidators';
import {validatePasswordRegister} from '../../utils/fieldsValidators';

const LoginScreen = ({navigation}) => {
  const {login} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleEmailBlur = () => {
    const emailValidation = validateEmail(email);
    setErrors(prevErrors => ({
      ...prevErrors,
      email: emailValidation.valid ? null : emailValidation.message,
    }));
  };

  const handlePasswordBlur = () => {
    const passwordValidation = validatePasswordRegister(password);
    setErrors(prevErrors => ({
      ...prevErrors,
      password: passwordValidation.valid
        ? null
        : passwordValidation.errors.join(', '),
    }));
  };

  const handleLogin = async () => {
    setServerError('');
    setErrors({});
    setIsLoading(true);

    try {
      const {
        valid,
        errors: validationErrors,
        userInfo,
      } = await validateUserForLogin(email, password);

      if (!valid) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      await login(false, userInfo);
    } catch (err) {
      if (err.message === 'Please confirm your email to login') {
        navigation.replace('ConfirmationEmail', {email});
      } else {
        setServerError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}
      <InputField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        onBlur={handleEmailBlur}
        error={errors.email}
      />
      <InputField
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onBlur={handlePasswordBlur}
        error={errors.password}
      />
      <Button
        title="Login"
        onPress={handleLogin}
        isLoading={isLoading}
        disabled={isLoading}
      />
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate('SignUp')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;
