import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import moment from 'moment';

export default class SessionFatigueSetting extends Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    // Bindings
    this.setFatigue = this.setFatigue.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    // TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.musclePainUpdated, this.onMusclePainUpdated)
  }

  componentWillUnmount() {
    // REmove event listeners
    // TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.musclePainUpdated, this.onMusclePainUpdated)
  }

  /**
   * Sets the fatigue
   */
  setFatigue(level) {

    new TrainingAPI().setSessionFatigue(this.props.sessionId, level).then((data) => {

      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.sessionFatigueChanged, context: {sessionId: this.props.sessionId, fatigueLevel: level}});

    });

    this.props.onCancel();

  }

  /**
   * rendering
   */
  render() {

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What's your energy level?</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TRC.TotoIconButton image={require('TotoReactTraining/img/fatigue/full.png')} label="Full" onPress={() => {this.setFatigue(0)}} />
          <TRC.TotoIconButton image={require('TotoReactTraining/img/fatigue/half.png')} label="Tired" onPress={() => {this.setFatigue(1)}} />
          <TRC.TotoIconButton image={require('TotoReactTraining/img/fatigue/zero.png')} label="Exhausted" onPress={() => {this.setFatigue(2)}} />
        </View>
        <View style={styles.toolsContainer}>
          <TRC.TotoIconButton image={require('TotoReactTraining/img/cross.png')} onPress={this.props.onCancel} />
        </View>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    justifyContent: 'flex-start',
    paddingTop: 64,
  },
  titleContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  }
})
