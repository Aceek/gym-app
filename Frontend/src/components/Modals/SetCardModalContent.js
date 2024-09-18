import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SetCardModalContent = ({
  reps,
  setReps,
  weight,
  setWeight,
  rpe,
  setRpe,
  type,
  setType,
  onClose,
  onSave,
}) => {
  const toggleType = selectedType => {
    if (type === selectedType) {
      setType('regular');
    } else {
      setType(selectedType);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.modalTitle}>Modifier Set</Text>
      </View>

      {/* Reps Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Répétitions:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setReps}
          value={reps}
          keyboardType="numeric"
        />
      </View>

      {/* Weight Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Poids (kg):</Text>
        <TextInput
          style={styles.input}
          onChangeText={setWeight}
          value={weight}
          keyboardType="numeric"
        />
      </View>

      {/* RPE Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>RPE:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setRpe}
          value={rpe}
          keyboardType="numeric"
        />
      </View>

      {/* Set Type Selection */}
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

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={onSave}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </>
  );
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
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  typeContainer: {
    marginBottom: 15,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  typeButtonSelected: {
    backgroundColor: '#e0e0e0',
    borderColor: '#000',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#555',
  },
  typeButtonTextSelected: {
    color: '#000',
    fontWeight: 'bold',
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

export default SetCardModalContent;
