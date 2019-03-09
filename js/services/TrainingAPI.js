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

}
