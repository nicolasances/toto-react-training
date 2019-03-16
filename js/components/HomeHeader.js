import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, ActivityIndicator} from 'react-native';
import TRC from 'toto-react-components';
import { withNavigation } from 'react-navigation';
import * as config from '../Config';
import TrainingAPI from '../services/TrainingAPI';

class HomeHeader extends Component {

  constructor(props) {

    super(props);

    this.state = {
      trainingTime: null,
      sessionsLoaded: false
    };

    // Bindings
    this.findOngoingSession = this.findOngoingSession.bind(this);
    this.goToSessionExecution = this.goToSessionExecution.bind(this);
    this.onSessionDeleted = this.onSessionDeleted.bind(this);
    this.onSessionCreated = this.onSessionCreated.bind(this);
    this.onSessionCompleted = this.onSessionCompleted.bind(this);
    this.onSessionDurationChanged = this.onSessionDurationChanged.bind(this);
  }

  /**
   * On component mount
   */
  componentDidMount() {

    this.loadTodaySessions();

    // Bind events
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionCreated, this.onSessionCreated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionCompleted, this.onSessionCompleted);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionDurationChanged, this.onSessionDurationChanged);

  }

  /**
   * When the component will un mount
   */
  componentWillUnmount() {

    // Unregister
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionCreated, this.onSessionCreated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionCompleted, this.onSessionCompleted);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionDurationChanged, this.onSessionDurationChanged);
  }

  /**
   * Loads todays sessions, if any
   */
  loadTodaySessions() {

    new TrainingAPI().getTodaySessions().then((data) => {

      // Calculate training time
      let trainingTime = 0;

      for (var i = 0; i < data.sessions.length; i++) {

        let session = data.sessions[i];

        if (session.timeInMinutes) trainingTime += session.timeInMinutes;

      }

      this.setState({sessions: data.sessions, sessionsLoaded: true, trainingTime: trainingTime});

    })

  }

  /**
   * Goes to the session that is currently ongoing
   */
  goToSessionExecution() {

    // 1. Find which session is ongoing
    let session = this.findOngoingSession();

    if (session == null) return;

    this.props.navigation.navigate('SessionScreen', {sessionId: session.id});

  }

  /**
   * Checks if there are ongoing sessions
   */
  findOngoingSession() {

    if (this.state.sessions == null) return null;

    for (var i = 0; i < this.state.sessions.length; i++) {

      let session = this.state.sessions[i];

      if (!session.completed) return session;
    }

    return null;

  }

  /**
   * When a session has been deleted
   */
  onSessionDeleted(event) {

    // Reload the data
    this.loadTodaySessions();

  }

  /**
   * When a session has been created
   */
  onSessionCreated(event) {

    // Reload the data
    this.loadTodaySessions();

  }

  /**
   * When a session has been created
   */
  onSessionCompleted(event) {

    // Reload the data
    this.loadTodaySessions();

  }

  /**
   * When a session has been created
   */
  onSessionDurationChanged(event) {

    // Reload the data
    this.loadTodaySessions();

  }


  render() {

    // Components
    let leftButton, rightButton, time;

    // Check if there are ongoing sessions
    let ongoingSessions = this.findOngoingSession() != null;

    // Left Button
    leftButton = (
      <View style={styles.buttonContainer}>
        <TRC.TotoIconButton image={require('../../img/calendar.png')} size="l" label="Calendar" />
      </View>
    )

    // Time
    if (!this.state.sessionsLoaded) time = (
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Loading sessions</Text>
        <View style={styles.timeTextContainer}>
          <ActivityIndicator size="large" color={TRC.TotoTheme.theme.COLOR_THEME_LIGHT} />
        </View>
      </View>
    )
    else if (ongoingSessions) time = (
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>You're training!</Text>
        <TouchableOpacity style={styles.trainingImgTextContainer} onPress={this.goToSessionExecution}>
          <Image source={require('../../img/man-training.png')} style={[styles.trainingImg, {tintColor: TRC.TotoTheme.theme.COLOR_ACCENT}]} />
        </TouchableOpacity>
      </View>
    )
    else if (this.state.trainingTime != null) time = (
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Today you trained</Text>
        <View style={styles.timeTextContainer}>
          <Text style={styles.timeText}>{this.state.trainingTime}</Text>
          <Text style={styles.timeUnitText}>minutes</Text>
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
    if (!this.state.sessionsLoaded) rightButton = (
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}></Text>
        <View style={styles.timeTextContainer}>
          <ActivityIndicator size="large" color={TRC.TotoTheme.theme.COLOR_THEME_LIGHT} />
        </View>
      </View>
    )
    else rightButton = (
      <View style={styles.buttonContainer}>
        <TRC.TotoIconButton image={require('../../img/man-training.png')}
                            size="l"
                            label="Start training"
                            disabled={ongoingSessions}
                            onPress={() => {this.props.navigation.navigate('SessionStartScreen')}}  />
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

export default withNavigation(HomeHeader);

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
    height: 100
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
    fontSize: 48,
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
  trainingImg: {
    width: 100,
    height: 100,
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT,
    marginTop: 12,
  },
})
