import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ExerciseCard = ({
  id,
  columnId,
  title,
  initialContent,
  onPress,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');

  const handlePress = () => {
    if (isEditing) {
      onUpdate(id, columnId, {weight, reps, rpe});
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Weight"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Reps"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="RPE"
            value={rpe}
            onChangeText={setRpe}
            keyboardType="numeric"
          />
        </View>
      );
    } else {
      return <Text style={styles.cardContent}>{initialContent}</Text>;
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        {renderContent()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: SCREEN_WIDTH * 0.02,
    padding: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_WIDTH * 0.03,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: SCREEN_WIDTH * 0.01,
    elevation: 2,
  },
  cardTitle: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  cardContent: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: SCREEN_WIDTH * 0.01,
    padding: SCREEN_WIDTH * 0.02,
    marginBottom: SCREEN_WIDTH * 0.02,
  },
});

export default ExerciseCard;
