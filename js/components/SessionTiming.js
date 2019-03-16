import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, Modal, DatePickerIOS} from 'react-native';
import TrainingAPI from '../services/TrainingAPI';
import TRC from 'toto-react-components';
import * as config from '../Config';
import moment from 'moment';

/**
 * Shows the list of muscles worked out in the specified session and allows
 * the user to see, set or change the pain level for the that muscleù
 * Expected properties:
 * - sessionId  : the id of the session
 */
export default class SessionMusclesPain extends Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    this.state = {
      session: {},
      timeModalVisible: false,
      sessionDate: new Date()
    }

    // Bindings
    this.changeStartTime = this.changeStartTime.bind(this);
    this.changeEndTime = this.changeEndTime.bind(this);
    this.setTime = this.setTime.bind(this);

    // Loading stuff
    this.loadSession();
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
   * Loads the session
   */
  loadSession() {

    new TrainingAPI().getSession(this.props.sessionId).then((data) => {

      this.setState({session: data});

    })

  }

  /**
   * Sets the time of the finish or start of session based on the this.state.selected param
   */
  setTime(date) {

    let newTime = moment(date).format('HH:mm');

    this.setState({sessionDate: new Date(moment(date)), newTime: newTime});

  }

  /**
   * Confirms the time set
   */
  confirmTime() {

    // Get the timings
    let start = this.state.session.startedAt;
    let end = this.state.session.finishedAt;
    let duration = this.state.session.timeInMinutes;

    // Update the time
    if (this.state.selected == 'start') start = this.state.newTime;
    if (this.state.selected == 'end') end = this.state.newTime;

    duration = moment(end, 'HH.mm').diff(moment(start, 'HH:mm'), 'minutes');

    // Update the state
    this.setState({
      session: {
        ...this.state.session,
        startedAt: start,
        finishedAt: end,
        timeInMinutes: duration
      }
    })

    new TrainingAPI().setSessionDuration(this.state.session.id, start, end, duration).then((data) => {

      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.sessionDurationChanged, context: {sessionId: this.state.session.id, startedAt: start, finishedAt: end, timeInMinutes: duration}});

    });

  }

  /**
   * Shows the modal to change the start time
   */
  changeStartTime() {

    let date = new Date(moment(this.state.session.date + ' ' + this.state.session.startedAt, 'YYYYMMDD HH:mm'));

    this.setState({timeModalVisible: true, sessionDate: date, selected: 'start'});

  }

  /**
  * Shows the modal to change the session end time
  */
  changeEndTime() {

    let date = new Date(moment(this.state.session.date + ' ' + this.state.session.finishedAt, 'YYYYMMDD HH:mm'));

    this.setState({timeModalVisible: true, sessionDate: date, selected: 'end'});

  }

  /**
   * rendering
   */
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.timeContainer} onPress={this.changeStartTime}>
          <Text style={styles.timeText}>{this.state.session.startedAt}</Text>
        </TouchableOpacity>
        <View style={styles.dotsContainer}>
          <Image source={require('../../img/dots.png')} style={styles.dotsImage} />
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>{this.state.session.timeInMinutes}</Text>
            <Text style={styles.durationLabel}>min</Text>
          </View>
          <Image source={require('../../img/dots.png')} style={styles.dotsImage} />
        </View>
        <TouchableOpacity style={styles.timeContainer} onPress={this.changeEndTime}>
          <Text style={styles.timeText}>{this.state.session.finishedAt}</Text>
        </TouchableOpacity>

        <Modal animationType="slide" transparent={false} visible={this.state.timeModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DatePickerIOS
              date={this.state.sessionDate}
              onDateChange={this.setTime}
              minuteInterval={5}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <TRC.TotoIconButton image={require('../../img/tick.png')} onPress={() => {this.confirmTime(); this.setState({timeModalVisible: false})}} />
              <TRC.TotoIconButton image={require('../../img/cross.png')} onPress={() => {this.setState({timeModalVisible: false})}} />
            </View>
          </View>
        </Modal>

      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timeContainer: {
  },
  timeText: {
    fontSize: 18,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginHorizontal: 6,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsImage: {
    height: 16,
    width: 16,
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT,
    marginHorizontal: 3,
    opacity: 0.7,
  },
  clockImage: {
    height: 24,
    width: 24,
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT,
    marginHorizontal: 3,
  },
  durationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 42,
    height: 42,
    borderWidth: 2,
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT,
    borderRadius: 21,
    marginHorizontal: 6,
  },
  durationText: {
    fontSize: 16,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 7,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    justifyContent: 'center',
    paddingTop: 64,
  },
  pickerContainer: {
    flex: 1,
  },
  buttonsContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  }
})
