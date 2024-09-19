// BaseModal.js

import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

const BaseModal = ({visible, onClose, children}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection={['down']}
      onSwipeComplete={onClose}
      style={styles.modal}
      avoidKeyboard={true}
      propagateSwipe={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

BaseModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
});

export default React.memo(BaseModal);
