// DayCardModal.js

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import BaseModal from './BaseModal';

const DayCardModal = ({visible, onClose, onSave, initialValues}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTitle(initialValues.title || '');
    setContent(initialValues.content || '');
    setErrors({});
  }, [initialValues, visible]);

  const handleSave = () => {
    let currentErrors = {};

    if (!title.trim()) {
      currentErrors.title = 'Le titre ne peut pas être vide.';
    }

    if (!content.trim()) {
      currentErrors.content = 'Le contenu ne peut pas être vide.';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
    });
    onClose();
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.modalTitle}>Modifier Jour</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Titre:</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          onChangeText={text => {
            setTitle(text);
            if (errors.title) {
              setErrors(prev => ({...prev, title: null}));
            }
          }}
          value={title}
          placeholder="Ex: Day 1"
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contenu:</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            errors.content && styles.inputError,
          ]}
          onChangeText={text => {
            setContent(text);
            if (errors.content) {
              setErrors(prev => ({...prev, content: null}));
            }
          }}
          value={content}
          placeholder="Ex: Chest, Triceps - 5 exercices"
          multiline
          numberOfLines={4}
        />
        {errors.content && (
          <Text style={styles.errorText}>{errors.content}</Text>
        )}
      </View>

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

DayCardModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  header: {alignItems: 'center', marginBottom: 20},
  modalTitle: {fontSize: 24, fontWeight: 'bold'},
  inputContainer: {marginBottom: 15},
  label: {fontSize: 16, marginBottom: 5, color: '#333'},
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {borderColor: 'red'},
  errorText: {color: 'red', fontSize: 12, marginTop: 5},
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
  saveButton: {backgroundColor: '#4CAF50'},
  buttonText: {color: 'white', fontWeight: 'bold', textAlign: 'center'},
});

export default DayCardModal;
