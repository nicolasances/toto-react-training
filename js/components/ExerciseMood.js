import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';
import TRC from 'toto-react-components';
import TrainingAPI from '../services/TrainingAPI';
import * as config from '../Config';

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

    // Save
    new TrainingAPI().setExerciseMood(this.state.exercise.sessionId, this.state.exercise.id, settings).then((data) => {

      // Send EVENT
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.exerciseSettingsChanged, context: {exerciseId: this.state.exercise.id}});

    });

    // Close the modal
    this.props.onSaved();

  }

  /**
   * New mood to set
   */
  changeMood(newMood) {

    // CAll the API
    new TrainingAPI().setExerciseMood(this.state.exercise.sessionId, this.state.exercise.id, newMood).then((data) => {

      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.exerciseMoodChanged, context: {exerciseId: this.state.exercise.id}});
    })

    // Hide the modal
    this.props.whenFinished();

  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.moodModalTitleContainer}>
          <Text style={styles.moodModalTitle}>How do you feel after the exercise?</Text>
        </View>
        <View style={styles.moodModalIconsContainer}>
          <TRC.TotoIconButton image={require('../../img/moods/ok.png')} onPress={() => {this.changeMood('ok')}} label="Fine" size='l' />
          <TRC.TotoIconButton image={require('../../img/moods/tired.png')} onPress={() => {this.changeMood('tired')}} label="Tired" size='l' />
          <TRC.TotoIconButton image={require('../../img/moods/dead.png')} onPress={() => {this.changeMood('dead')}} label="Dead" size='l' />
        </View>
        <View style={styles.iconContainer}>
          <TRC.TotoIconButton image={require('../../img/cross.png')} onPress={this.props.whenFinished} />
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
  moodModalTitleContainer: {
    marginBottom: 48,
  },
  moodModalTitle: {
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    fontSize: 20
  },
  moodModalIconsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  moodContainer: {
    marginHorizontal: 12,
    alignItems: 'center'
  },
  moodImage: {
    width: 48,
    height: 48,
    tintColor: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
  moodCaption: {
    fontSize: 12,
    color: TRC.TotoTheme.theme.COLOR_ACCENT,
    marginTop: 9
  },
  iconContainer: {
    marginBottom: 24,
    flexDirection: 'row'
  },
})
