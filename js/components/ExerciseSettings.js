import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import { withNavigation } from 'react-navigation';
import TRC from 'toto-react-components';
import SingleSettings from './util/SingleSettings';
import TrainingAPI from '../services/TrainingAPI';
import * as config from '../Config';
import Swiper from 'react-native-swiper';

export default class ExerciseSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      exercise: props.exercise,
    }

    // Bindings
    this.saveExercise = this.saveExercise.bind(this);

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

    // Save
    new TrainingAPI().setExerciseSettings(this.state.exercise.sessionId, this.state.exercise.id, settings).then((data) => {

      // Send EVENT
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.exerciseSettingsChanged, context: {exerciseId: this.state.exercise.id}});

    });

    // Close the modal
    this.props.onSaved();

  }

  render() {

    // The settings for the exercise
    let settings;

    // Single
    if (this.state.exercise.type == 'single') settings = (<SingleSettings exercise={this.state.exercise} />)
    else if (this.state.exercise.type == 'superset') settings = (<Swiper dotStyle={styles.swiperDotStyle} activeDotStyle={styles.swiperActiveDotStyle}><SingleSettings exercise={this.state.exercise.ex1} /><SingleSettings exercise={this.state.exercise.ex2} /></Swiper>)

    return (
      <View style={styles.container}>
        <View style={styles.settingsContainer}>
          {settings}
        </View>
        <View style={styles.buttonsContainer}>
          <TRC.TotoIconButton image={require('../../img/tick.png')} onPress={this.saveExercise} />
          <TRC.TotoIconButton image={require('../../img/cross.png')} onPress={this.props.onCancel} />
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
