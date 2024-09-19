import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
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
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {children}
        </ScrollView>
      </View>
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
    justifyContent: 'center',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
});

export default React.memo(BaseModal);
