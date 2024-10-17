// helperTemplate.js

import {data, loadData} from './helperTemplateUpdate';

// Fonction pour obtenir tous les mésocycles
export async function getMesocycles() {
  await loadData();
  return Object.values(data.mesocycles);
}

// Fonction pour obtenir un mésocycle par ID
export async function getMesocycleById(mesocycleId) {
  await loadData();
  return data.mesocycles[mesocycleId];
}

// Fonction pour obtenir les semaines d'un mésocycle
export async function getWeeksForMesocycle(mesocycleId) {
  await loadData();
  const mesocycle = await getMesocycleById(mesocycleId);
  if (!mesocycle) return [];
  return mesocycle.weeks.map(weekId => data.weeks[weekId]);
}

// Fonction pour obtenir toutes les semaines
export async function getWeeks() {
  await loadData();
  return Object.values(data.weeks);
}

// Fonction pour obtenir une semaine par ID
export async function getWeekById(weekId) {
  await loadData();
  return data.weeks[weekId];
}

// Fonction pour obtenir les jours d'une semaine
export async function getDaysForWeek(weekId) {
  await loadData();
  const week = await getWeekById(weekId);
  if (!week) return [];
  return week.days.map(dayId => data.days[dayId]);
}

// Fonction pour obtenir tous les jours
export async function getDays() {
  await loadData();
  return Object.values(data.days);
}

// Fonction pour obtenir un jour par ID
export async function getDayById(dayId) {
  await loadData();
  return data.days[dayId];
}

// Fonction pour obtenir les exercices d'un jour
export async function getExercisesForDay(dayId) {
  await loadData();
  const day = await getDayById(dayId);
  if (!day) return [];
  return day.exercises.map(exerciseId => data.exercises[exerciseId]);
}

// Fonction pour obtenir tous les exercices
export async function getExercises() {
  await loadData();
  return Object.values(data.exercises);
}

// Fonction pour obtenir un exercice par ID
export async function getExerciseById(exerciseId) {
  await loadData();
  return data.exercises[exerciseId];
}

// Fonction pour obtenir les sets d'un exercice
export async function getSetsForExercise(exerciseId) {
  await loadData();
  const exercise = await getExerciseById(exerciseId);
  if (!exercise || !exercise.sets) return [];
  return exercise.sets.map(setId => data.sets[setId]);
}

// Fonction pour obtenir tous les sets
export async function getSets() {
  await loadData();
  return Object.values(data.sets);
}

// Fonction pour obtenir un set par ID
export async function getSetById(setId) {
  await loadData();
  return data.sets[setId];
}
