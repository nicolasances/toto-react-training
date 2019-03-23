
export const API_URL = 'https://imatzdev.it/apis';
export const AUTH = 'Basic c3RvOnRvdG8=';

export const EVENTS = {
  sessionCreated: 'sessionCreated', // A new gym session has been created
  sessionDeleted: 'sessionDeleted', // A session has been deleted
  sessionCompleted: 'sessionCompleted', // A session has been completed
  sessionDurationChanged: 'sessionDurationChanged', // A session duration has been changed
  sessionFatigueChanged: 'sessionFatigueChanged', // A session fatigue level has been changed
  exerciseCompleted: 'exerciseCompleted', // An exercise has been completed
  exerciseMoodChanged: 'exerciseMoodChanged', // An exercise's mood has been changed
  exerciseSettingsChanged: 'exerciseSettingsChanged', // An exercise's settings have been changed
  planCreated: 'planCreated', // A plan has been created
  planDeleted: 'planDeleted', // A plan has been created
  workoutCreated: 'workoutCreated', // A workout has been created 
  workoutExerciseSettingsChanged: 'workoutExerciseSettingsChanged', // An xercises settings have been changed
  workoutExerciseDeleted: 'workoutExerciseDeleted', // A workout exercise has been deleted
  workoutExerciseAdded: 'workoutExerciseAdded', // An exercise has been added to the workout
  archiveExerciseSelected: 'archiveExerciseSelected', // An archive exercise has been selected
}
