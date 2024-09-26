// helperTemplate.js

const path = require('path');

// Charger les données depuis template.json
const data = require('./template.json').data;

// Fonction pour obtenir tous les mésocycles
function getMesocycles() {
  return Object.values(data.mesocycles);
}

// Fonction pour obtenir un mésocycle par ID
function getMesocycleById(mesocycleId) {
  return data.mesocycles[mesocycleId];
}

// Fonction pour obtenir les semaines d'un mésocycle
function getWeeksForMesocycle(mesocycleId) {
  const mesocycle = getMesocycleById(mesocycleId);
  if (!mesocycle) return [];
  return mesocycle.weeks.map(weekId => getWeekById(weekId));
}

// Fonction pour obtenir toutes les semaines
function getWeeks() {
  return Object.values(data.weeks);
}

// Fonction pour obtenir une semaine par ID
function getWeekById(weekId) {
  return data.weeks[weekId];
}

// Fonction pour obtenir les jours d'une semaine
function getDaysForWeek(weekId) {
  const week = getWeekById(weekId);
  if (!week) return [];
  return week.days.map(dayId => getDayById(dayId));
}

// Fonction pour obtenir tous les jours
function getDays() {
  return Object.values(data.days);
}

// Fonction pour obtenir un jour par ID
function getDayById(dayId) {
  return data.days[dayId];
}

// Fonction pour obtenir les exercices d'un jour
function getExercisesForDay(dayId) {
  const day = getDayById(dayId);
  if (!day) return [];
  return day.exercises.map(exerciseId => getExerciseById(exerciseId));
}

// Fonction pour obtenir tous les exercices
function getExercises() {
  return Object.values(data.exercises);
}

// Fonction pour obtenir un exercice par ID
function getExerciseById(exerciseId) {
  return data.exercises[exerciseId];
}

// Fonction pour obtenir les sets d'un exercice
function getSetsForExercise(exerciseId) {
  const exercise = getExerciseById(exerciseId);
  if (!exercise || !exercise.sets) return [];
  return exercise.sets.map(setId => getSetById(setId));
}

// Fonction pour obtenir tous les sets
function getSets() {
  return Object.values(data.sets);
}

// Fonction pour obtenir un set par ID
function getSetById(setId) {
  return data.sets[setId];
}

// Exporter les fonctions pour utilisation dans d'autres modules
module.exports = {
  getMesocycles,
  getMesocycleById,
  getWeeksForMesocycle,
  getWeeks,
  getWeekById,
  getDaysForWeek,
  getDays,
  getDayById,
  getExercisesForDay,
  getExercises,
  getExerciseById,
  getSetsForExercise,
  getSets,
  getSetById,
};
