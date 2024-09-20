import React, {useState, useCallback, useMemo} from 'react';
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

const ThreeDotsMenu = React.memo(({onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.threeDotsMenu}>
    <Text style={styles.threeDotsText}>⋮</Text>
  </TouchableOpacity>
));

const ThreeDotsModal = React.memo(({onRemove, onModify, deleteText}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = useCallback(() => {
    if (!modalVisible) {
      setModalVisible(true);
    }
  }, [modalVisible]);

  const handleCloseModal = useCallback(() => {
    if (modalVisible) {
      setModalVisible(false);
    }
  }, [modalVisible]);

  const handleDelete = useCallback(() => {
    if (onRemove) {
      onRemove();
    }
    handleCloseModal();
  }, [onRemove, handleCloseModal]);

  const handleModify = useCallback(() => {
    if (onModify) {
      onModify();
    }
    handleCloseModal();
  }, [onModify, handleCloseModal]);

  const modifyOption = useMemo(() => {
    if (onModify) {
      return (
        <TouchableOpacity style={styles.modalOption} onPress={handleModify}>
          <Text style={[styles.modalOptionText, styles.modifyText]}>
            Modifier
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  }, [onModify, handleModify]);

  const deleteOption = useMemo(() => {
    if (onRemove) {
      return (
        <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
          <Text style={styles.modalOptionText}>
            {deleteText || 'Supprimer'}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  }, [onRemove, handleDelete, deleteText]);

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
          activeOpacity={1}
          onPress={handleCloseModal}>
          <View style={styles.modalContent} pointerEvents="box-none">
            <View style={styles.modalOptionsContainer}>
              {modifyOption}
              {deleteOption}
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
});

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
  modalOptionsContainer: {
    // Optionnel : Ajoutez un conteneur pour mieux gérer les options
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
  modifyText: {
    color: 'blue', // Couleur différente pour "Modifier"
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
