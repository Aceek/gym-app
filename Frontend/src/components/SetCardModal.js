import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import SetCardModalContent from './SetCardModalContent';

const SetCardModal = ({visible, onClose, onSave, initialValues}) => {
  const [reps, setReps] = useState(initialValues.reps.toString());
  const [weight, setWeight] = useState(initialValues.weight.toString());
  const [rpe, setRpe] = useState(
    initialValues.rpe ? initialValues.rpe.toString() : '',
  );
  const [type, setType] = useState(initialValues.type || 'regular');

  useEffect(() => {
    setReps(initialValues.reps.toString());
    setWeight(initialValues.weight.toString());
    setRpe(initialValues.rpe ? initialValues.rpe.toString() : '');
    setType(initialValues.type || 'regular');
  }, [initialValues]);

  const handleSave = () => {
    onSave({
      reps: parseInt(reps, 10),
      weight: parseFloat(weight),
      rpe: rpe ? parseInt(rpe, 10) : null,
      type: type,
    });
    onClose();
  };

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
          <SetCardModalContent
            reps={reps}
            setReps={setReps}
            weight={weight}
            setWeight={setWeight}
            rpe={rpe}
            setRpe={setRpe}
            type={type}
            setType={setType}
            onClose={onClose}
            onSave={handleSave}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
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

export default SetCardModal;
