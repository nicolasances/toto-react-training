import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import TrainingAPI from '../services/TrainingAPI';
import IntensityChart from './IntensityChart';
import moment from 'moment';

export default class IntesityGraph extends Component {

  constructor(props) {

    super(props);

    this.state = {
    };

    // Binding functions to this
    this.onSessionDeleted = this.onSessionDeleted.bind(this);
    this.onSessionCreated = this.onSessionCreated.bind(this);
  }

  /**
   * On mounting
   */
  componentDidMount() {

    this.loadIntensityData();

    // Register to events
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionCreated, this.onSessionCreated);
  }

  /**
   * When the component will un mount
   */
  componentWillUnmount() {

    // Unregister
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionCreated, this.onSessionCreated);
  }

  /**
   * Loads the intensity data
   */
  loadIntensityData() {

    new TrainingAPI().getIntensityData(8).then((data) => {

      this.setState({days: data.days});

    })

  }

  /**
   * When a session has been deleted
   */
  onSessionDeleted(event) {

    // Reload the data
    this.loadIntensityData();

  }

  /**
   * When a session has been created
   */
  onSessionCreated(event) {

    // Reload the data
    this.loadIntensityData();

  }

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
