import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import IntensityChart from './IntensityChart';
import moment from 'moment';

export default class IntesityGraph extends Component {

  constructor(props) {

    super(props);

    this.state = {};

    // Binding functions to this
    this.onSessionDeleted = this.onSessionDeleted.bind(this);
    this.onSessionCreated = this.onSessionCreated.bind(this);
    this.onMusclePainUpdated = this.onMusclePainUpdated.bind(this);
    this.onSessionFatigueChanged = this.onSessionFatigueChanged.bind(this);
  }

  /**
   * On mounting
   */
  componentDidMount() {

    this.loadIntensityData();

    // Register to events
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionCreated, this.onSessionCreated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.musclePainUpdated, this.onMusclePainUpdated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionFatigueChanged, this.onSessionFatigueChanged);
  }

  /**
   * When the component will un mount
   */
  componentWillUnmount() {

    // Unregister
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionCreated, this.onSessionCreated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.musclePainUpdated, this.onMusclePainUpdated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionFatigueChanged, this.onSessionFatigueChanged);
  }

  /**
   * Loads the intensity data
   */
  loadIntensityData() {

    new TrainingAPI().getIntensityData(8).then((data) => {

      this.setState({days: []}, () => {this.setState({days: data.days})});

    })

  }

  onSessionDeleted(event) {this.loadIntensityData();}
  onSessionCreated(event) {this.loadIntensityData();}
  onMusclePainUpdated(event) {this.loadIntensityData();}
  onSessionFatigueChanged(event) {this.loadIntensityData();}

  /**
   * Render
   */
  render() {

    return (
      <View style={styles.container}>

        <IntensityChart data={this.state.days} />

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
    fontSize: 40,
    height: 43,
    marginTop: 3
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
