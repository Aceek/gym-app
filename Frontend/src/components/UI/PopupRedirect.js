import React from 'react';
import {View, Text, StyleSheet, Modal, ActivityIndicator} from 'react-native';
import Button from './Button';

const PopupRedirect = React.memo(
  ({visible, message, onCancel, onTimeout, timeout = 2000}) => {
    console.log('PopupRedirect rendered with visible = ', visible);
    React.useEffect(() => {
      if (visible) {
        const timer = setTimeout(onTimeout, timeout);
        return () => clearTimeout(timer);
      }
    }, [visible, onTimeout, timeout]);

    return (
      <Modal transparent={true} visible={visible} animationType="fade">
        <View style={styles.container}>
          <View style={styles.popup}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.message}>{message}</Text>
            <Button title="Cancel" onPress={onCancel} />
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
  },
});

export default PopupRedirect;
