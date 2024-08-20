import React, {useRef} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const ConfirmationCodeInput = ({code, setCode, length = 6}) => {
  const inputs = useRef([]);

  const handleChangeText = (text, index) => {
    const newCode = code.split('');
    newCode[index] = text;
    setCode(newCode.join(''));

    if (text && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({nativeEvent}, index) => {
    if (nativeEvent.key === 'Backspace') {
      if (code[index]) {
        const newCode = code.split('');
        newCode[index] = '';
        setCode(newCode.join(''));
      } else if (index > 0) {
        inputs.current[index - 1].focus();
        const newCode = code.split('');
        newCode[index - 1] = '';
        setCode(newCode.join(''));
      }
    }
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill('')
        .map((_, index) => (
          <TextInput
            key={index}
            ref={ref => (inputs.current[index] = ref)}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={text => handleChangeText(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            value={code[index] || ''}
            autoFocus={index === 0}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 5,
  },
});

export default ConfirmationCodeInput;
