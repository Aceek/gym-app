import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ThreeDotsMenu = ({onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.threeDotsMenu}>
    <Text style={styles.threeDotsText}>⋮</Text>
  </TouchableOpacity>
);

const ThreeDotsModal = ({onRemove, deleteText}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleDelete = () => {
    onRemove();
    handleCloseModal();
  };

  return (
    <>
      <ThreeDotsMenu onPress={handleOpenModal} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={handleCloseModal}>
          <View style={styles.modalContent} activeOpacity={1}>
            <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
              <Text style={styles.modalOptionText}>{deleteText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, styles.cancelOption]}
              onPress={handleCloseModal}>
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  threeDotsMenu: {
    position: 'absolute',
    top: SCREEN_WIDTH * 0.02,
    right: SCREEN_WIDTH * 0.02,
    padding: SCREEN_WIDTH * 0.01,
  },
  threeDotsText: {
    fontSize: SCREEN_WIDTH * 0.06,
    color: '#666',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: SCREEN_WIDTH * 0.05,
    borderTopRightRadius: SCREEN_WIDTH * 0.05,
    padding: SCREEN_WIDTH * 0.05,
  },
  modalOption: {
    paddingVertical: SCREEN_WIDTH * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalOptionText: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: 'red',
    textAlign: 'center',
  },
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: SCREEN_WIDTH * 0.02,
  },
  cancelOptionText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default ThreeDotsModal;
