import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const ExerciseDetailsModal = ({isVisible, onClose, exercise}) => {
  if (!exercise) return null;

  // Example data for bench press
  const benchPress = {
    name: 'Bench Press',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps', 'Front Deltoids'],
    description:
      'The bench press is a compound exercise that primarily targets the chest muscles (pectorals). It also engages the triceps and the front part of the shoulders.',
    image:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    technique: [
      'Lie on a flat bench with your feet flat on the ground',
      'Grip the barbell slightly wider than shoulder-width',
      'Lower the bar to your mid-chest',
      'Press the bar back up to the starting position',
    ],
    tips: [
      'Keep your wrists straight and elbows at about a 45-degree angle to your torso',
      'Maintain a slight arch in your lower back',
      'Breathe out as you push the bar up',
    ],
    variations: [
      'Incline Bench Press',
      'Decline Bench Press',
      'Dumbbell Bench Press',
    ],
    sets: 3,
    reps: '8-12',
    weight: 'Varies based on individual strength',
    restTime: '60-90 seconds between sets',
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.modalTitle}>{benchPress.name}</Text>
            <Image
              source={{uri: benchPress.image}}
              style={styles.exerciseImage}
            />
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Muscle Groups:</Text>
              <Text style={styles.sectionText}>
                Primary: {benchPress.muscleGroup}
              </Text>
              <Text style={styles.sectionText}>
                Secondary: {benchPress.secondaryMuscles.join(', ')}
              </Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Description:</Text>
              <Text style={styles.sectionText}>{benchPress.description}</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Technique:</Text>
              {benchPress.technique.map((step, index) => (
                <Text key={index} style={styles.listItem}>
                  {index + 1}. {step}
                </Text>
              ))}
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Tips:</Text>
              {benchPress.tips.map((tip, index) => (
                <Text key={index} style={styles.listItem}>
                  • {tip}
                </Text>
              ))}
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Variations:</Text>
              {benchPress.variations.map((variation, index) => (
                <Text key={index} style={styles.listItem}>
                  • {variation}
                </Text>
              ))}
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Recommended Routine:</Text>
              <Text style={styles.sectionText}>Sets: {benchPress.sets}</Text>
              <Text style={styles.sectionText}>Reps: {benchPress.reps}</Text>
              <Text style={styles.sectionText}>
                Weight: {benchPress.weight}
              </Text>
              <Text style={styles.sectionText}>
                Rest Time: {benchPress.restTime}
              </Text>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.9,
    height: height * 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalTitle: {
    marginBottom: height * 0.02,
    textAlign: 'center',
    fontSize: width * 0.07,
    fontWeight: 'bold',
  },
  exerciseImage: {
    width: width * 0.8,
    height: width * 0.6,
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
  infoSection: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  sectionText: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
  },
  listItem: {
    fontSize: width * 0.04,
    marginLeft: width * 0.02,
    marginBottom: height * 0.005,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: width * 0.03,
    elevation: 2,
    marginTop: height * 0.02,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: width * 0.04,
  },
});

export default ExerciseDetailsModal;
