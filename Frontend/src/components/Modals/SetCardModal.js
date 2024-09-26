// SetCardModal.js

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

const SetCardModal = ({visible, onClose, onSave, initialValues}) => {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [rpe, setRpe] = useState('');
  const [type, setType] = useState('regular');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setReps(initialValues.reps.toString());
    setWeight(initialValues.weight.toString());
    setRpe(initialValues.rpe ? initialValues.rpe.toString() : '');
    setType(initialValues.type || 'regular');
    setErrors({});
  }, [initialValues, visible]);

  const handleSave = () => {
    const parsedReps = parseInt(reps, 10);
    const parsedWeight = parseFloat(weight);
    const parsedRpe = rpe ? parseInt(rpe, 10) : null;

    let currentErrors = {};

    if (isNaN(parsedReps) || parsedReps <= 0) {
      currentErrors.reps = 'Veuillez entrer un nombre de répétitions valide.';
    }

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      currentErrors.weight = 'Veuillez entrer un poids valide.';
    }

    if (rpe && (isNaN(parsedRpe) || parsedRpe < 1 || parsedRpe > 10)) {
      currentErrors.rpe = 'RPE doit être entre 1 et 10.';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    onSave({
      reps: parsedReps,
      weight: parsedWeight,
      rpe: parsedRpe,
      type,
    });
    onClose();
  };

  const toggleType = selectedType => {
    setType(prevType => (prevType === selectedType ? 'regular' : selectedType));
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.modalTitle}>Modifier Set</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Répétitions:</Text>
        <TextInput
          style={[styles.input, errors.reps && styles.inputError]}
          onChangeText={text => {
            setReps(text);
            if (errors.reps) {
              setErrors(prev => ({...prev, reps: null}));
            }
          }}
          value={reps}
          keyboardType="numeric"
          placeholder="Ex: 5"
        />
        {errors.reps && <Text style={styles.errorText}>{errors.reps}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Poids (kg):</Text>
        <TextInput
          style={[styles.input, errors.weight && styles.inputError]}
          onChangeText={text => {
            setWeight(text);
            if (errors.weight) {
              setErrors(prev => ({...prev, weight: null}));
            }
          }}
          value={weight}
          keyboardType="numeric"
          placeholder="Ex: 80"
        />
        {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>RPE:</Text>
        <TextInput
          style={[styles.input, errors.rpe && styles.inputError]}
          onChangeText={text => {
            setRpe(text);
            if (errors.rpe) {
              setErrors(prev => ({...prev, rpe: null}));
            }
          }}
          value={rpe}
          keyboardType="numeric"
          placeholder="Ex: 8"
        />
        {errors.rpe && <Text style={styles.errorText}>{errors.rpe}</Text>}
      </View>

      <View style={styles.typeContainer}>
        <Text style={styles.label}>Type de Set:</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'superset' && styles.typeButtonSelected,
            ]}
            onPress={() => toggleType('superset')}>
            <Text
              style={[
                styles.typeButtonText,
                type === 'superset' && styles.typeButtonTextSelected,
              ]}>
              SuperSet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'dropset' && styles.typeButtonSelected,
            ]}
            onPress={() => toggleType('dropset')}>
            <Text
              style={[
                styles.typeButtonText,
                type === 'dropset' && styles.typeButtonTextSelected,
              ]}>
              DropSet
            </Text>
          </TouchableOpacity>
        </View>
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

SetCardModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    reps: PropTypes.number.isRequired,
    weight: PropTypes.number.isRequired,
    rpe: PropTypes.number,
    type: PropTypes.string,
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
  inputError: {borderColor: 'red'},
  errorText: {color: 'red', fontSize: 12, marginTop: 5},
  typeContainer: {marginBottom: 15},
  typeButtons: {flexDirection: 'row', justifyContent: 'space-between'},
  typeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#f9f9f9',
  },
  typeButtonSelected: {
    backgroundColor: '#e0e0e0',
    borderColor: '#000',
  },
  typeButtonText: {fontSize: 16, color: '#555'},
  typeButtonTextSelected: {color: '#000', fontWeight: 'bold'},
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

export default SetCardModal;
