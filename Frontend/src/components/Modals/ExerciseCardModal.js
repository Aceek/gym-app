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

const ExerciseCardModal = ({visible, onClose, onSave, initialValues}) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [weight, setWeight] = useState(initialValues.weight.toString());
  const [reps, setReps] = useState(initialValues.reps.toString());
  const [rpe, setRpe] = useState(
    initialValues.rpe ? initialValues.rpe.toString() : '',
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTitle(initialValues.title || '');
    setWeight(initialValues.weight.toString());
    setReps(initialValues.reps.toString());
    setRpe(initialValues.rpe ? initialValues.rpe.toString() : '');
    setErrors({});
  }, [initialValues, visible]);

  const handleSave = () => {
    const parsedWeight = parseFloat(weight);
    const parsedReps = parseInt(reps, 10);
    const parsedRpe = rpe ? parseInt(rpe, 10) : null;

    let currentErrors = {};

    if (title.trim() === '') {
      currentErrors.title = 'Le titre ne peut pas être vide.';
    }

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      currentErrors.weight = 'Veuillez entrer un poids valide.';
    }

    if (isNaN(parsedReps) || parsedReps <= 0) {
      currentErrors.reps = 'Veuillez entrer un nombre de répétitions valide.';
    }

    if (rpe && (isNaN(parsedRpe) || parsedRpe < 1 || parsedRpe > 10)) {
      currentErrors.rpe = 'RPE doit être entre 1 et 10.';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    onSave({
      title: title.trim(),
      weight: parsedWeight,
      reps: parsedReps,
      rpe: parsedRpe,
    });
    setErrors({});
    onClose();
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.modalTitle}>Modifier Exercice</Text>
      </View>

      {/* Titre Input */}
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
          placeholder="Ex: Bench Press"
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      {/* Poids Input */}
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

      {/* Répétitions Input */}
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

      {/* RPE Input */}
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

      {/* Buttons */}
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

ExerciseCardModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    title: PropTypes.string.isRequired,
    weight: PropTypes.number.isRequired,
    reps: PropTypes.number.isRequired,
    rpe: PropTypes.number,
  }).isRequired,
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
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

export default ExerciseCardModal;
