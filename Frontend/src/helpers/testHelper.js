// testHelper.js

const helper = require('./helperTemplate.js');

console.log('--- Test du fichier helperTemplate.js ---\n');

// Tester la récupération de tous les mésocycles
console.log('Tous les mésocycles :');
const mesocycles = helper.getMesocycles();
console.log(mesocycles);

// Tester la récupération des semaines pour un mésocycle spécifique
console.log('\nSemaines pour le mésocycle "mesocycle_chest_focus" :');
const weeksForMesocycle = helper.getWeeksForMesocycle('mesocycle_chest_focus');
console.log(weeksForMesocycle);

// Tester la récupération des jours pour une semaine spécifique
console.log('\nJours pour la semaine "week_chest_focus_1" :');
const daysForWeek = helper.getDaysForWeek('week_chest_focus_1');
console.log(daysForWeek);

// Tester la récupération des exercices pour un jour spécifique
console.log('\nExercices pour le jour "day_chest_focus_1_1" :');
const exercisesForDay = helper.getExercisesForDay('day_chest_focus_1_1');
console.log(exercisesForDay);

// Tester la récupération des sets pour un exercice spécifique
console.log('\nSets pour l\'exercice "exercise_bench_press" :');
const setsForExercise = helper.getSetsForExercise('exercise_bench_press');
console.log(setsForExercise);

// Tester la récupération d'un mésocycle par ID
console.log('\nMésocycle avec l\'ID "mesocycle_leg_focus" :');
const mesocycle = helper.getMesocycleById('mesocycle_leg_focus');
console.log(mesocycle);

// Tester la récupération d'une semaine par ID
console.log('\nSemaine avec l\'ID "week_leg_focus_2" :');
const week = helper.getWeekById('week_leg_focus_2');
console.log(week);

// Tester la récupération d'un jour par ID
console.log('\nJour avec l\'ID "day_leg_focus_2_1" :');
const day = helper.getDayById('day_leg_focus_2_1');
console.log(day);

// Tester la récupération d'un exercice par ID
console.log('\nExercice avec l\'ID "exercise_squat" :');
const exercise = helper.getExerciseById('exercise_squat');
console.log(exercise);

// Tester la récupération d'un set par ID
console.log('\nSet avec l\'ID "set_squat_1" :');
const set = helper.getSetById('set_squat_1');
console.log(set);
