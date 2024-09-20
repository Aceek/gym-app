// templateHelper.js

import template from './template.json'; // Assurez-vous que le chemin est correct

// Simuler un délai pour imiter un appel API
const simulateApiDelay = (data, delay = 100) =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

/**
 * Récupère tous les mesocycles du template.
 * @returns {Promise<Array>} Une promesse qui résout avec un tableau de mesocycles.
 */
export const getMesocycles = async () => {
  const mesocycles = Object.values(template.data.mesocycles);
  return simulateApiDelay(mesocycles);
};

/**
 * Récupère toutes les semaines d'un mesocycle spécifique.
 * @param {string} mesocycleId - L'ID du mesocycle.
 * @returns {Promise<Array>} Une promesse qui résout avec un tableau de semaines.
 */
export const getWeeksByMesocycle = async mesocycleId => {
  const mesocycle = template.data.mesocycles[mesocycleId];
  if (!mesocycle) {
    throw new Error('Mesocycle not found');
  }

  const weeks = mesocycle.weeks.map(weekId => template.data.weeks[weekId]);
  return simulateApiDelay(weeks);
};

/**
 * Récupère tous les jours d'une semaine spécifique.
 * @param {string} weekId - L'ID de la semaine.
 * @returns {Promise<Array>} Une promesse qui résout avec un tableau de jours.
 */
export const getDaysByWeek = async weekId => {
  const week = template.data.weeks[weekId];
  if (!week) {
    throw new Error('Week not found');
  }

  const days = week.days.map(dayId => template.data.days[dayId]);
  return simulateApiDelay(days);
};

/**
 * Récupère les détails d'un jour spécifique.
 * @param {string} dayId - L'ID du jour.
 * @returns {Promise<Object>} Une promesse qui résout avec les détails du jour.
 */
export const getDayDetails = async dayId => {
  const day = template.data.days[dayId];
  if (!day) {
    throw new Error('Day not found');
  }

  // Récupérer les exercices associés
  const exercises = day.exercises.map(
    exerciseId => template.data.exercises[exerciseId],
  );
  return simulateApiDelay({...day, exercises});
};

/**
 * Récupère les détails d'un exercice spécifique.
 * @param {string} exerciseId - L'ID de l'exercice.
 * @returns {Promise<Object>} Une promesse qui résout avec les détails de l'exercice.
 */
export const getExerciseDetails = async exerciseId => {
  const exercise = template.data.exercises[exerciseId];
  if (!exercise) {
    throw new Error('Exercise not found');
  }

  // Récupérer les sets associés
  const sets = exercise.sets.map(setId => template.data.sets[setId]);
  return simulateApiDelay({...exercise, sets});
};
