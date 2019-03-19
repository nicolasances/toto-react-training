import TotoAPI from './TotoAPI';
import moment from 'moment';

/**
 * API to access the /training/* Toto API
 */
export default class TrainingAPI {

  /**
   * Retrieves the available workout plans
   * By default the plans will be sorted by DATE DESC
   */
  getPlans() {

    return new TotoAPI().fetch('/training/plan/plans?sort=start&sortDir=desc')
        .then((response) => response.json());

  }

  /**
   * Retrieves the specified plan
   */
  getPlan(id) {

    return new TotoAPI().fetch('/training/plan/plans/' + id)
        .then((response) => response.json());

  }

  /**
   * Create a new plan
   * Requires the plan to be a {name, start, weeks}
   */
  postPlan(plan) {

    // Post the data
    return new TotoAPI().fetch('/training/plan/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plan)
    }).then((response => response.json()));

  }

  /**
   * Deletes the plan
   */
  deletePlan(planId) {

    // Post the data
    return new TotoAPI().fetch('/training/plan/plans/' + planId, {method: 'DELETE',}).then((response => response.json()));

  }

  /**
   * Retrieves the workouts of the specified plan
   */
  getPlanWorkouts(planId) {

    return new TotoAPI().fetch('/training/plan/plans/' + planId + '/workouts')
        .then((response) => response.json());
  }

  /**
   * Retrieves the specified workout
   */
  getWorkout(planId, workoutId) {

    return new TotoAPI().fetch('/training/plan/plans/' + planId + '/workouts/' + workoutId)
          .then((response) => response.json());

  }

  /**
   * Retrieves the workout exercises
   */
  getWorkoutExercises(planId, workoutId) {

    return new TotoAPI().fetch('/training/plan/plans/' + planId + '/workouts/' + workoutId + '/exercises')
          .then((response) => response.json());
  }

  /**
   * Deletes the exericse
   */
  deleteWorkoutExercise(planId, workoutId, exerciseId) {

    // Post the data
    return new TotoAPI().fetch('/training/plan/plans/' + planId + '/workouts/' + workoutId + '/exercises/' + exerciseId, {method: 'DELETE'}).then((response => response.json()));

  }

  /**
   * Changes the exercise settings.
   * Note that the settings are going to be provided as is as the body of the request
   */
  setWorkoutExerciseSettings(planId, workoutId, exerciseId, settings) {

    // Post the data
    return new TotoAPI().fetch('/training/plan/plans/' + planId + '/workouts/' + workoutId + '/exercises/' + exerciseId, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(settings)
    }).then((response => response.json()));

  }

  /**
   * Retrieves the muscles of a specific workout
   */
  getWorkoutMuscles(planId, workoutId) {

    return new TotoAPI().fetch('/training/plan/plans/' + planId + '/workouts/' + workoutId + '/muscles')
          .then((response) => response.json());

  }

  /**
   * Retrieves the sessions that exist for today
   */
  getTodaySessions() {

    return new TotoAPI().fetch('/training/session/sessions?date=' + moment().format('YYYYMMDD'))
          .then((response) => response.json());

  }

  /**
   * Retrieve the specified session
   */
  getSession(id) {

    return new TotoAPI().fetch('/training/session/sessions/' + id)
          .then((response) => response.json());

  }

  /**
   * Retrieve the specified session's muscles
   */
  getSessionMuscles(id) {

    return new TotoAPI().fetch('/training/session/sessions/' + id + '/muscles')
          .then((response) => response.json());

  }

  /**
   * Deletes the specified session
   */
  deleteSession(id) {

    return new TotoAPI().fetch('/training/session/sessions/' + id, {method: 'DELETE'})
          .then((response) => response.json());

  }

  /**
   * Retrieves the exercises of the session
   */
  getSessionExercises(sessionId) {

    return new TotoAPI().fetch('/training/session/sessions/' + sessionId + '/exercises?sort=order')
          .then((response) => response.json());

  }

  /**
   * Starts a gym training session in the specified date, with the specified workouts
   */
  startSession(date, workouts) {

    // Post the data
    return new TotoAPI().fetch('/training/session/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({date: date, workouts: workouts})
    }).then((response => response.json()));

  }

  /**
   * Completes the training session
   */
  completeSession(sessionId) {

    // Post the data
    return new TotoAPI().fetch('/training/session/sessions/' + sessionId, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({completed: true})
    }).then((response => response.json()));

  }

  /**
   * Sets the session's fatigue level
   * - level : integer
   */
  setSessionFatigue(sessionId, level) {

    // Post the data
    return new TotoAPI().fetch('/training/session/sessions/' + sessionId, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({postWorkoutFatigue: level})
    }).then((response => response.json()));

  }

  /**
   * Updates the duration of the session
   * Start and End are 'HH:mm'
   * duration is a number in minutes
   */
  setSessionDuration(sessionId, start, end, duration) {

    // Post the data
    return new TotoAPI().fetch('/training/session/sessions/' + sessionId, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({startedAt: start, finishedAt: end, timeInMinutes: duration})
    }).then((response => response.json()));

  }

  /**
   * Get the training durations for the passed days
   */
  getTrainingDurations(dateFrom) {

    return new TotoAPI().fetch('/training/stats/durations?dateFrom=' + dateFrom).then((response) => response.json());

  }

  /**
   * Gets the data to display the intensity chart
   */
  getIntensityData(maxDays) {

    return new TotoAPI().fetch('/training/stats/intensity?days=' + maxDays)
          .then((response) => response.json());

  }

  /**
   * Completes the specified exercise
   */
  completeExercise(sessionId, exerciseId) {

    // Post the data
    return new TotoAPI().fetch('/training/session/sessions/' + sessionId + '/exercises/' + exerciseId, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({completed: true})
    }).then((response => response.json()));

  }

  /**
   * Changes the mood of an exercise
   */
  setExerciseMood(sessionId, exerciseId, mood) {

    // Post the data
    return new TotoAPI().fetch('/training/session/sessions/' + sessionId + '/exercises/' + exerciseId, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({mood: mood})
    }).then((response => response.json()));

  }

  /**
   * Changes the exercise settings.
   * Note that the settings are going to be provided as is as the body of the request
   */
  setExerciseSettings(sessionId, exerciseId, settings) {

    // Post the data
    return new TotoAPI().fetch('/training/session/sessions/' + sessionId + '/exercises/' + exerciseId, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(settings)
    }).then((response => response.json()));

  }

  /**
   * Sets the pain level of a given muscle in a give session
   */
  setMusclePain(sessionId, muscle, painLevel) {

    // Post the data
    return new TotoAPI().fetch('/training/session/sessions/' + sessionId + '/muscles/' + muscle, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({painLevel: painLevel})
    }).then((response => response.json()));

  }

}
