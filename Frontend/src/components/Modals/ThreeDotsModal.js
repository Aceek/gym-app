// ThreeDotsModal.js

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import PropTypes from 'prop-types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ThreeDotsModal = ({onRemove, onModify, deleteText}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => setModalVisible(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.threeDotsMenu}>
        <Text style={styles.threeDotsText}>⋮</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseModal}>
          <View style={styles.modalContent} pointerEvents="box-none">
            <View style={styles.modalOptionsContainer}>
              {onModify && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    onModify();
                    handleCloseModal();
                  }}>
                  <Text style={[styles.modalOptionText, styles.modifyText]}>
                    Modifier
                  </Text>
                </TouchableOpacity>
              )}
              {onRemove && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    onRemove();
                    handleCloseModal();
                  }}>
                  <Text style={styles.modalOptionText}>
                    {deleteText || 'Supprimer'}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.modalOption, styles.cancelOption]}
                onPress={handleCloseModal}>
                <Text style={styles.cancelOptionText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

ThreeDotsModal.propTypes = {
  onRemove: PropTypes.func,
  onModify: PropTypes.func,
  deleteText: PropTypes.string,
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
  modalOptionsContainer: {},
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
  modifyText: {
    color: 'blue',
  },
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: SCREEN_WIDTH * 0.02,
  },
  cancelOptionText: {
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ThreeDotsModal;
