import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';

const buttonConfig = {
  google: {
    backgroundColor: '#FFFFFF',
    borderColor: '#4285F4',
    textColor: '#4285F4',
    icon: require('../assets/google-logo.png'),
    activityIndicatorColor: '#4285F4',
  },
  facebook: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1877F2',
    textColor: '#1877F2',
    icon: require('../assets/facebook-logo.png'),
    activityIndicatorColor: '#1877F2',
  },
  default: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
    textColor: '#FFFFFF',
    activityIndicatorColor: '#FFFFFF',
  },
};

const Button = ({title, onPress, isLoading, disabled, type = 'default'}) => {
  const config = buttonConfig[type] || buttonConfig.default;

  const buttonStyle = [
    styles.button,
    {backgroundColor: config.backgroundColor, borderColor: config.borderColor},
    disabled && styles.buttonDisabled,
  ];

  const textStyle = [styles.buttonText, {color: config.textColor}];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
      {isLoading ? (
        <ActivityIndicator size="small" color={config.activityIndicatorColor} />
      ) : (
        <>
          {config.icon && <Image source={config.icon} style={styles.icon} />}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
  },
  buttonDisabled: {
    backgroundColor: '#9c9c9c',
    borderColor: '#9c9c9c',
  },
  buttonText: {
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default Button;
