// helperTemplateUpdate.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé pour AsyncStorage
const STORAGE_KEY = 'templateData';

// Variable pour stocker les données en mémoire
let data = {};

// Fonction pour charger les données depuis AsyncStorage
export async function loadData() {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      data = JSON.parse(jsonValue);
    } else {
      // Si aucune donnée n'est présente, initialiser avec les données du fichier template.json
      data = require('./template.json').data;
      await saveData();
    }
  } catch (e) {
    console.error('Erreur lors du chargement des données :', e);
  }
}

// Fonction pour sauvegarder les données dans AsyncStorage
export async function saveData() {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Erreur lors de la sauvegarde des données :', e);
  }
}

// Assurez-vous que les données sont chargées au démarrage
loadData();

// Fonctions pour accéder aux données
export async function getData() {
  await loadData();
  return data;
}

// Fonctions pour ajouter des éléments

// Ajouter un mésocycle
export async function addMesocycle(mesocycleId, mesocycleData) {
  await loadData();
  if (!data.mesocycles) data.mesocycles = {};
  if (data.mesocycles[mesocycleId]) {
    throw new Error('Un mésocycle avec cet ID existe déjà.');
  }
  data.mesocycles[mesocycleId] = mesocycleData;
  await saveData();
}

// Mettre à jour un mésocycle existant
export async function updateMesocycle(mesocycleId, mesocycleData) {
  await loadData();
  if (!data.mesocycles || !data.mesocycles[mesocycleId]) {
    throw new Error("Le mésocycle avec cet ID n'existe pas.");
  }
  data.mesocycles[mesocycleId] = mesocycleData;
  await saveData();
}

// Ajouter une semaine
export async function addWeek(weekId, weekData) {
  await loadData();
  if (!data.weeks) data.weeks = {};
  if (data.weeks[weekId]) {
    throw new Error('Une semaine avec cet ID existe déjà.');
  }
  data.weeks[weekId] = weekData;
  await saveData();
}

// Mettre à jour une semaine existante
export async function updateWeek(weekId, weekData) {
  await loadData();
  if (!data.weeks || !data.weeks[weekId]) {
    throw new Error("La semaine avec cet ID n'existe pas.");
  }
  data.weeks[weekId] = weekData;
  await saveData();
}

// Ajouter un jour
export async function addDay(dayId, dayData) {
  await loadData();
  if (!data.days) data.days = {};
  if (data.days[dayId]) {
    throw new Error('Un jour avec cet ID existe déjà.');
  }
  data.days[dayId] = dayData;
  await saveData();
}

// Mettre à jour un jour existant
export async function updateDay(dayId, dayData) {
  await loadData();
  if (!data.days || !data.days[dayId]) {
    throw new Error("Le jour avec cet ID n'existe pas.");
  }
  data.days[dayId] = dayData;
  await saveData();
}

// Supprimer un jour
export async function removeDay(dayId) {
  await loadData();
  if (!data.days || !data.days[dayId]) {
    throw new Error("Le jour avec cet ID n'existe pas.");
  }
  // Supprimer le jour du tableau des jours
  delete data.days[dayId];
  // Supprimer le jour des semaines associées
  if (data.weeks) {
    Object.values(data.weeks).forEach(week => {
      if (week.days) {
        week.days = week.days.filter(id => id !== dayId);
      }
    });
  }
  await saveData();
}

// Ajouter un exercice
export async function addExercise(exerciseId, exerciseData) {
  await loadData();
  if (!data.exercises) data.exercises = {};
  if (data.exercises[exerciseId]) {
    throw new Error('Un exercice avec cet ID existe déjà.');
  }
  data.exercises[exerciseId] = exerciseData;
  await saveData();
}

// Mettre à jour un exercice existant
export async function updateExercise(exerciseId, exerciseData) {
  await loadData();
  if (!data.exercises || !data.exercises[exerciseId]) {
    throw new Error("L'exercice avec cet ID n'existe pas.");
  }
  data.exercises[exerciseId] = exerciseData;
  await saveData();
}

// Ajouter un set
export async function addSet(setId, setData) {
  await loadData();
  if (!data.sets) data.sets = {};
  if (data.sets[setId]) {
    throw new Error('Un set avec cet ID existe déjà.');
  }
  data.sets[setId] = setData;
  await saveData();
}

// Mettre à jour un set existant
export async function updateSet(setId, setData) {
  await loadData();
  if (!data.sets || !data.sets[setId]) {
    throw new Error("Le set avec cet ID n'existe pas.");
  }
  data.sets[setId] = setData;
  await saveData();
}

// Fonctions pour associer des éléments entre eux

// Ajouter une semaine à un mésocycle
export async function addWeekToMesocycle(mesocycleId, weekId) {
  await loadData();
  const mesocycle = data.mesocycles ? data.mesocycles[mesocycleId] : null;
  if (!mesocycle) {
    throw new Error("Le mésocycle avec cet ID n'existe pas.");
  }
  if (!data.weeks || !data.weeks[weekId]) {
    throw new Error("La semaine avec cet ID n'existe pas.");
  }
  if (!mesocycle.weeks) mesocycle.weeks = [];
  if (!mesocycle.weeks.includes(weekId)) {
    mesocycle.weeks.push(weekId);
    await saveData();
  } else {
    throw new Error('La semaine est déjà associée à ce mésocycle.');
  }
}

// Ajouter un jour à une semaine
export async function addDayToWeek(weekId, dayId) {
  await loadData();
  const week = data.weeks ? data.weeks[weekId] : null;
  if (!week) {
    throw new Error("La semaine avec cet ID n'existe pas.");
  }
  if (!data.days || !data.days[dayId]) {
    throw new Error("Le jour avec cet ID n'existe pas.");
  }
  if (!week.days) week.days = [];
  if (!week.days.includes(dayId)) {
    week.days.push(dayId);
    await saveData();
  } else {
    throw new Error('Le jour est déjà associé à cette semaine.');
  }
}

// Ajouter un exercice à un jour
export async function addExerciseToDay(dayId, exerciseId) {
  await loadData();
  const day = data.days ? data.days[dayId] : null;
  if (!day) {
    throw new Error("Le jour avec cet ID n'existe pas.");
  }
  if (!data.exercises || !data.exercises[exerciseId]) {
    throw new Error("L'exercice avec cet ID n'existe pas.");
  }
  if (!day.exercises) day.exercises = [];
  if (!day.exercises.includes(exerciseId)) {
    day.exercises.push(exerciseId);
    await saveData();
  } else {
    throw new Error("L'exercice est déjà associé à ce jour.");
  }
}

// Ajouter un set à un exercice
export async function addSetToExercise(exerciseId, setId) {
  await loadData();
  const exercise = data.exercises ? data.exercises[exerciseId] : null;
  if (!exercise) {
    throw new Error("L'exercice avec cet ID n'existe pas.");
  }
  if (!data.sets || !data.sets[setId]) {
    throw new Error("Le set avec cet ID n'existe pas.");
  }
  if (!exercise.sets) exercise.sets = [];
  if (!exercise.sets.includes(setId)) {
    exercise.sets.push(setId);
    await saveData();
  } else {
    throw new Error('Le set est déjà associé à cet exercice.');
  }
}

// Exporter data pour lecture
export {data};
