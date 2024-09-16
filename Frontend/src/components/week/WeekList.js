import React from 'react';
import {ScrollView, View, StyleSheet, Dimensions} from 'react-native';
import WeekCard from './WeekCard';

// Obtenir la largeur de l'écran
const {width} = Dimensions.get('window');

const WeekList = ({weeks, navigation}) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer} // Appliquer un style au container
    >
      {weeks.map((week, index) => (
        <View
          key={week.id}
          style={[
            styles.cardContainer,
            index === 0 && styles.firstCard, // Si c'est la première semaine, ne pas ajouter de marge à gauche
            index === weeks.length - 1 && styles.lastCard, // Si c'est la dernière, ajuster la marge
          ]}>
          <WeekCard week={week} navigation={navigation} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 10, // Ajout d'un padding global pour un effet visuel agréable
  },
  cardContainer: {
    width: width * 0.8, // La carte occupe 80% de la largeur de l'écran
    marginRight: 20, // Espacement entre les cartes pour voir un bout de la prochaine
  },
  firstCard: {
    marginLeft: 10, // Laisser un peu d'espace au début
  },
  lastCard: {
    marginRight: 10, // Dernière carte ajustée pour ne pas avoir trop d'espace à droite
  },
});

export default WeekList;
