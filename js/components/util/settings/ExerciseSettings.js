import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import { withNavigation } from 'react-navigation';
import TRC from 'toto-react-components';
import SingleSettings from './SingleSettings';
import DropsetSettings from './DropsetSettings';
import StripingSettings from './StripingSettings';
import HourglassSettings from './HourglassSettings';
import TrainingAPI from '../../../services/TrainingAPI';
import * as config from '../../../Config';
import Swiper from 'react-native-swiper';

/**
 * Supports the following props
 * - enableDelete             : (OPTIONAL, defautt false) enables the deletion of the exercise
 */
export default class ExerciseSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      exercise: props.exercise,
    }

    // Bindings
    this.saveExercise = this.saveExercise.bind(this);
    this.saveSessionExercise = this.saveSessionExercise.bind(this);
    this.saveWorkoutExercise = this.saveWorkoutExercise.bind(this);
    this.deleteExercise = this.deleteExercise.bind(this);

  }

  /**
   * Saves the exercise
   */
  saveExercise() {

    // Prepare payload
    let settings;

    // Singles
    if (this.state.exercise.type == 'single') settings = {
      sets: this.state.exercise.sets,
      reps: this.state.exercise.reps,
      weight: this.state.exercise.weight
    }
    // Supersets
    else if (this.state.exercise.type == 'superset') settings = {
      ex1: this.state.exercise.ex1,
      ex2: this.state.exercise.ex2
    }
    // Dropsets
    else if (this.state.exercise.type == 'dropset') settings = {
      sets: this.state.exercise.sets,
      reps1: this.state.exercise.reps1,
      reps2: this.state.exercise.reps2,
      weight1: this.state.exercise.weight1,
      weight2: this.state.exercise.weight2
    }
    // Striping
    else if (this.state.exercise.type == 'striping') settings = {
      sets: this.state.exercise.sets,
      reps1: 7,
      reps2: 7,
      reps3: 7,
      weight1: this.state.exercise.weight1,
      weight2: this.state.exercise.weight2,
      weight3: this.state.exercise.weight3
    }
    // Hourglass
    else if (this.state.exercise.type == 'hourglass') settings = {
      sets: 6,
      reps1: 12,
      reps2: 10,
      reps3: 8,
      weight1: this.state.exercise.weight1,
      weight2: this.state.exercise.weight2,
      weight3: this.state.exercise.weight3
    }

    // Save
    if (this.state.exercise.sessionId && this.state.exercise.id) this.saveSessionExercise(this.state.exercise, settings);
    else if (this.state.exercise.workoutId && this.state.exercise.id) this.saveWorkoutExercise(this.state.exercise, settings);

    // Close the modal
    this.props.onSaved(settings);

  }

  /**
   * Saves the session exercise (part of an active session)
   */
  saveSessionExercise(ex, settings) {

    new TrainingAPI().setExerciseSettings(this.state.exercise.sessionId, this.state.exercise.id, settings).then((data) => {

      // Send EVENT
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.exerciseSettingsChanged, context: {exerciseId: this.state.exercise.id}});

    });

  }

  /**
   * Saves the plan workout exercise
   */
  saveWorkoutExercise(ex, settings) {

    new TrainingAPI().setWorkoutExerciseSettings(this.state.exercise.planId, this.state.exercise.workoutId, this.state.exercise.id, settings).then((data) => {

      // Send EVENT
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.workoutExerciseSettingsChanged, context: {exerciseId: this.state.exercise.id}});

    });

  }

  /**
   * Deletes this exercise
   */
  deleteExercise() {

    // Delete
    // if (this.state.exercise.sessionId) this.saveSessionExercise(this.state.exercise, settings);
    // For now only supports deleting a workout exercise
    if (this.state.exercise.workoutId) this.deleteWorkoutExercise();

  }

  /**
   * Deletes the workout exercise
   */
  deleteWorkoutExercise() {

    new TrainingAPI().deleteWorkoutExercise(this.state.exercise.planId, this.state.exercise.workoutId, this.state.exercise.id).then((data) => {

      // Send EVENT
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.workoutExerciseDeleted, context: {exerciseId: this.state.exercise.id}});

    });

  }


  render() {

    // Delete button, only if enableDelete = true
    let deleteButton;
    if (this.props.enableDelete) deleteButton = (
      <TRC.TotoIconButton image={require('../../../../img/trash.png')} onPress={this.deleteExercise} />
    )

    // The settings for the exercise
    let settings;

    // Single
    if (this.state.exercise.type == 'single') settings = (<SingleSettings exercise={this.state.exercise} />)
    else if (this.state.exercise.type == 'superset') settings = (<Swiper dotStyle={styles.swiperDotStyle} activeDotStyle={styles.swiperActiveDotStyle}><SingleSettings exercise={this.state.exercise.ex1} /><SingleSettings exercise={this.state.exercise.ex2} /></Swiper>)
    else if (this.state.exercise.type == 'dropset') settings = (<DropsetSettings exercise={this.state.exercise} />)
    else if (this.state.exercise.type == 'striping') settings = (<StripingSettings exercise={this.state.exercise} />)
    else if (this.state.exercise.type == 'hourglass') settings = (<HourglassSettings exercise={this.state.exercise} />)

    return (
      <View style={styles.container}>
        <View style={styles.settingsContainer}>
          {settings}
        </View>
        <View style={styles.buttonsContainer}>
          <TRC.TotoIconButton image={require('../../../../img/tick.png')} onPress={this.saveExercise} />
          {deleteButton}
          <TRC.TotoIconButton image={require('../../../../img/cross.png')} onPress={this.props.onCancel} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  settingsContainer: {
    flex: 1,
  },
  buttonsContainer: {
    marginBottom: 24,
    flexDirection: 'row'
  },
  swiperActiveDotStyle: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_ACCENT,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  swiperDotStyle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME
  }
})
