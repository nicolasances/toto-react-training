import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import TrainingAPI from '../services/TrainingAPI';

export default class HomeHeader extends Component {

  constructor(props) {

    super(props);

    this.state = {
      trainingTime: 42
    };
  }

  render() {

    // Components
    let leftButton, rightButton, time;

    // Left Button
    leftButton = (
      <View style={styles.buttonContainer}>
        <TRC.TotoIconButton image={require('../../img/calendar.png')} size="l" label="Calendar" />
      </View>
    )

    // Time
    if (this.state.trainingTime != null) time = (
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Today you trained</Text>
        <View style={styles.timeTextContainer}>
          <Text style={styles.timeText}>{this.state.trainingTime}</Text>
          <Text style={styles.timeUnitText}>min</Text>
        </View>
      </View>
    )
    else time = (
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Today</Text>
        <View style={styles.timeTextContainer}>
          <Image source={require('../../img/sleep.png')} style={styles.timeImg} />
        </View>
      </View>

    )

    // Right button
    rightButton = (
      <View style={styles.buttonContainer}>
        <TRC.TotoIconButton image={require('../../img/man-training.png')} size="l" label="Start training" />
      </View>
    )

    return (
      <View style={styles.container}>

        {leftButton}

        {time}

        {rightButton}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
    marginTop: 24,
  },
  buttonContainer: {
    flex: 1
  },
  timeContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    textTransform: 'uppercase',
  },
  timeTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  timeText: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: 42,
    height: 45,
  },
  timeUnitText: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: 14,
    opacity: 0.9,
    flex: 1,
  },
  timeImg: {
    width: 42,
    height: 42,
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.8
  },
})
