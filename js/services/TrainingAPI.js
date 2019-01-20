import TotoAPI from './TotoAPI';
import moment from 'moment';

/**
 * API to access the /training/* Toto API
 */
export default class TrainingAPI {

  /**
   * Saves the provided meal
   */
  // postMeal(meal) {
  //
  //   let data = {
  //     date: meal.mealDate,
  //     time: meal.mealTime,
  //     calories: meal.calories,
  //     fat: meal.fat,
  //     carbs: meal.carbs,
  //     sugars: meal.sugars,
  //     proteins: meal.proteins,
  //     aliments: meal.foods
  //   };
  //
  //   // Post the data
  //   return new TotoAPI().fetch('/diet/meals', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   }).then((response => response.json()));
  // }

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

}
