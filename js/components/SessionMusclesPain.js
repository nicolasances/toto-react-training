import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, Modal} from 'react-native';
import TrainingAPI from '../services/TrainingAPI';
import TRC from 'toto-react-components';
import MusclePainSetting from './MusclePainSetting';
import * as config from '../Config';

var imgDead = require('../../img/pain/dead.png');
var imgHeavy = require('../../img/pain/heavy.png');
var imgLight = require('../../img/pain/light.png');
var imgNo = require('../../img/pain/no.png');
var imgQuestion = require('../../img/pain/question.png');

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
      muscles: null,
      painModalVisible: false,
    }

    // Bindings
    this.onMusclePainUpdated = this.onMusclePainUpdated.bind(this);

    // Loading stuff
    this.loadSession();
    this.loadSessionMuscles();
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.musclePainUpdated, this.onMusclePainUpdated)
  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.musclePainUpdated, this.onMusclePainUpdated)
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
   * Loads the session muscles
   */
  loadSessionMuscles() {

    new TrainingAPI().getSessionMuscles(this.props.sessionId).then((data) => {

      this.setState({muscles: data.muscles});

    })

  }

  /**
   * React to when the muscle pain level has been updated
   */
  onMusclePainUpdated(event) {

    // Update the pain of the muscle
    let muscle = event.context.muscle;
    let level = event.context.level;
    let muscles = this.state.session.muscles;

    if (muscles == null) muscles = [{muscle: muscle, painLevel: level}];
    else {
      for (var i = 0; i < muscles.length; i++) {
        if (muscles[i].muscle == muscle) muscles[i].painLevel = level;
      }
    }

    this.setState({session: {...this.state.session, muscles: muscles}});

  }

  /**
   * Triggers the selection of the pain level on a given muscle
   */
  selectMusclePain(muscle) {

    this.setState({
      selectedMuscle: muscle,
      painModalVisible: true
    })

  }

  /**
   * Retrieves the pain icon for the muscle
   * If the pain hasn't been set it's the question mark, otherwise it's the one corresponding to the pain level.
   * Note that the pains are in the session info
   */
  getPainIcon(muscle) {

    if (this.state.session == null || this.state.session.muscles == null || this.state.session.muscles.length == 0) return imgQuestion;

    for (var i = 0; i < this.state.session.muscles.length; i++) {

      let m = this.state.session.muscles[i];

      if (m.muscle == muscle) {
        if (m.painLevel == null) return imgQuestion;
        else if (m.painLevel == 0) return imgNo;
        else if (m.painLevel == 1) return imgLight;
        else if (m.painLevel == 2) return imgHeavy;
        else if (m.painLevel == 3) return imgDead;
      }
    }

    return imgQuestion;

  }


  /**
   * rendering
   */
  render() {

    let muscles = [];

    // If there are muscles
    if (this.state.muscles != null) {

      // Iterate the muscles
      for (var i = 0; i < this.state.muscles.length; i++) {

        let muscle = this.state.muscles[i];

        // Define the text: first two letters
        let muscleText = muscle.substring(0, 1).toUpperCase() + muscle.substring(1, 2);

        // Define the key
        let key = 'SessionM' + Math.random();

        // Define which icon the "pain" icon should the button have
        let icon = this.getPainIcon(this.state.muscles[i]);

        // Create the row for the muscle
        muscles.push((
          <View style={styles.muscleContainer} key={key}>
            <View style={styles.muscleAvatar}>
              <Text style={styles.muscleText}>{muscleText}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TRC.TotoIconButton image={icon} onPress={() => {this.selectMusclePain(muscle)}} />
            </View>
          </View>
        ))
      }

    }

    return (
      <View style={styles.container}>
        {muscles}

        <Modal animationType="slide" transparent={false} visible={this.state.painModalVisible}>
          <MusclePainSetting sessionId={this.props.sessionId} muscle={this.state.selectedMuscle} onCancel={() => {this.setState({painModalVisible: false})}} />
        </Modal>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  muscleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 6,
    alignItems: 'center',
  },
  muscleAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  muscleText: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: 18,
  },
  buttonsContainer: {
    marginLeft: 12,
  }
})
