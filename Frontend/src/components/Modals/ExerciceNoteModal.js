// ExerciseNoteModal.js

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import BaseModal from './BaseModal'; // Assurez-vous que le chemin est correct

const ExerciseNoteModal = ({visible, onClose, onSave, initialNote}) => {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, visible]);

  const handleSave = () => {
    onSave(note);
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.modalTitle}>Ajouter une note</Text>
      </View>

      {/* Note Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textArea, styles.input]}
          onChangeText={setNote}
          value={note}
          placeholder="Entrez votre note ici..."
          multiline={true}
          numberOfLines={4}
        />
      </View>

      {/* Boutons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};

ExerciseNoteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialNote: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  textArea: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
    width: '45%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ExerciseNoteModal;
