import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TRC from 'toto-react-components';
import TrainingAPI from '../services/TrainingAPI';
import * as config from '../Config';

var imgDead = require('../../img/pain/dead.png');
var imgHeavy = require('../../img/pain/heavy.png');
var imgLight = require('../../img/pain/light.png');
var imgNo = require('../../img/pain/no.png');

/**
 * View (dialog) to set the pain level
 * Requires the following properties:
 * - sessionId
 * - muscle
 */
export default class MusclePainSetting extends Component {

  constructor(props) {
    super(props);

    // Binding
    this.setPainLevel = this.setPainLevel.bind(this);

  }

  /**
   * Sets the pain level for the muscle (only for the muscle)
   */
  setPainLevel(level) {

    // Call the API
    new TrainingAPI().setMusclePain(this.props.sessionId, this.props.muscle, level).then((data) => {

      // Trigger an event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.musclePainUpdated, context: {sessionId: this.props.sessionId, muscle: this.props.muscle, level: level}});

    });

    // Close the window
    this.props.onCancel();

  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Set the pain level on</Text>
          <Text style={styles.subtitle}>{this.props.muscle}</Text>
        </View>
        <View style={styles.painContainer}>
          <TRC.TotoIconButton image={imgNo} label="No pain" size='l' onPress={() => {this.setPainLevel(0)}}/>
          <TRC.TotoIconButton image={imgLight} label="Some" size='l' onPress={() => {this.setPainLevel(1)}}/>
          <TRC.TotoIconButton image={imgHeavy} label="Relevant" size='l' onPress={() => {this.setPainLevel(2)}}/>
          <TRC.TotoIconButton image={imgDead} label="Severe" size='l' onPress={() => {this.setPainLevel(3)}}/>
        </View>
        <View style={styles.buttonsContainer}>
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
  buttonsContainer: {
    marginBottom: 24,
  },
  titleContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
  },
  subtitle: {
    fontSize: 28,
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
  },
  painContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
})
