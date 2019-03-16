import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Modal} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import TrainingAPI from '../services/TrainingAPI';
import GymExercisesList from '../components/GymExercisesList';
import ExerciseSettings from '../components/util/settings/ExerciseSettings';
import ExerciseMood from '../components/ExerciseMood';
import TodayBubble from '../components/TodayBubble';
import SessionMusclesPain from '../components/SessionMusclesPain';
import SessionTiming from '../components/SessionTiming';
import moment from 'moment';
import exerciseDataExtractor from '../components/util/list/ExerciseDataExtractor';

export default class SessionScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Train!!'
                        color={TRC.TotoTheme.theme.COLOR_THEME}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT}
                        back={true}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      session: null,
      workouts: [],
      muscles: [],
      moodModalVisible: false,
      selectedExercise: null,
      exModalVisible: false,
    }

    // Bindings
    this.loadWorkouts = this.loadWorkouts.bind(this);
    this.selectMood = this.selectMood.bind(this);
    this.selectExercise = this.selectExercise.bind(this);
    this.deleteSession = this.deleteSession.bind(this);
    this.completeSession = this.completeSession.bind(this);
    this.onExerciseCompleted = this.onExerciseCompleted.bind(this);
    this.onExerciseMoodChanged = this.onExerciseMoodChanged.bind(this);
    this.onExerciseSettingsChanged = this.onExerciseSettingsChanged.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.exerciseCompleted, this.onExerciseCompleted)
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.exerciseMoodChanged, this.onExerciseMoodChanged)
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.exerciseSettingsChanged, this.onExerciseSettingsChanged)

    // Load data
    this.loadSession();
    this.loadExercises();
  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.exerciseCompleted, this.onExerciseCompleted)
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.exerciseMoodChanged, this.onExerciseMoodChanged)
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.exerciseSettingsChanged, this.onExerciseSettingsChanged)
  }

  /**
   * Load the session
   */
  loadSession() {

    new TrainingAPI().getSession(this.props.navigation.getParam('sessionId')).then((data) => {

      this.setState({session : data, date: data.date}, () => {

        this.loadWorkouts();

      });

    })

  }

  /**
   * Lods the session exercises
   */
  loadExercises() {

    new TrainingAPI().getSessionExercises(this.props.navigation.getParam('sessionId')).then((data) => {

      this.setState({exercises: []}, () => {this.setState({exercises: data.exercises})});

    });

  }

  /**
   * Loads the session's workouts details
   */
  loadWorkouts() {

    if (this.state.session == null || this.state.session.workouts == null) return;

    for (var i = 0; i < this.state.session.workouts.length; i++) {

      let w = this.state.session.workouts[i];

      new TrainingAPI().getWorkout(w.planId, w.workoutId).then((data) => {

        this.setState({
          workouts: [...this.state.workouts, data]
        })
      })
    }

  }

  /**
   * Reacts to the click of the exercise avatar, which will trigger the completion (or un-completion) of the exercise
   */
  onExerciseAvatarPress(item) {

    // Update the view
    TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.exerciseCompleted, context: {sessionId: item.item.sessionId, exerciseId: item.item.id}})

    // Call the API
    new TrainingAPI().completeExercise(item.item.sessionId, item.item.id).then(() => {}, this.loadExercises);

  }

  /**
   * Reacts to the completion of an exercise
   */
  onExerciseCompleted(event) {

    for (var i = 0; i < this.state.exercises.length; i++) {

      if (this.state.exercises[i].id == event.context.exerciseId) {

        let exs = this.state.exercises;
        exs[i].completed = true;

        this.setState({exercises: []}, () => {this.setState({exercises: exs})});
      }
    }

  }

  /**
   * Reacts to the change of an exercise's mood
   */
  onExerciseMoodChanged(event) {

    this.loadExercises();

  }

  /**
   * Reacts to the change of an exercise's settings
   */
  onExerciseSettingsChanged(event) {

    this.loadExercises();

  }

  /**
   * Reacts to the request to select a new mood for the specified list item
   */
  selectMood(item) {

    // Show the modal and set the selected exercise
    this.setState({moodModalVisible: true, selectedExercise: item.item});

  }

  /**
   * Reacts to the selection of an exercise
   */
  selectExercise(item) {

    // Show the modal and set the selected exercise
    this.setState({exModalVisible: true, selectedExercise: item.item});

  }

  /**
   * Deletes the current session
   */
  deleteSession() {

    // Delete the session
    new TrainingAPI().deleteSession(this.state.session.id).then((data) => {

      // Throw an event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.sessionDeleted, context: {sessionId: this.state.sessionId}});

    });

    // Go back
    this.props.navigation.goBack();

  }

  /**
   * Completes the session
   */
  completeSession() {

    // call the api
    new TrainingAPI().completeSession(this.state.session.id).then((data) => {

      // Throw an event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.sessionCompleted, context: {sessionId: this.state.session.id}});

    });

    // Go back
    // TODO : go to the "fatigue" setting or actually request the fatigue contextually to the session closing
    this.props.navigation.goBack();

  }


  /**
   * Renders the home screen
   */
  render() {

    // Name of the workouts
    let workouts;

    if (this.state.workouts.length > 0) {

      let workoutsTitles = [];

      for (var i = 0; i < this.state.workouts.length; i++) {
        workoutsTitles.push((<Text key={i} style={styles.workoutTitle}>{this.state.workouts[i].name}</Text>));
      }

      workouts = (
        <View style={styles.workoutsTitleContainer}>
          {workoutsTitles}
        </View>
      )
    }

    // Complete session button
    // If the session is already completed, don't show the button
    let completeButton;

    if (this.state.session != null && !this.state.session.completed) completeButton = (
      <View style={{marginLeft: 12}} >
        <TRC.TotoIconButton image={require('../../img/tick.png')} onPress={this.completeSession} />
      </View>
    )

    // Delete button
    let deleteButton = (
      <View style={{marginLeft: 6}} >
        <TRC.TotoIconButton image={require('../../img/trash.png')} onPress={this.deleteSession} />
      </View>
    )

    // Muscle pain
    let musclesPain;
    if (this.state.session != null && this.state.session.completed) musclesPain = (
      <View style={styles.musclesPlainContainer}>
        <SessionMusclesPain sessionId={this.state.session.id} />
      </View>
    )

    // Session timing
    let sessionTiming;
    if (this.state.session != null && this.state.session.completed) sessionTiming = (
      <View style={styles.sessionTimingContainer}>
        <SessionTiming sessionId={this.state.session.id}/>
      </View>
    )

    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <TodayBubble date={this.state.date}/>
          {workouts}
          {completeButton}
          {deleteButton}
        </View>

        {sessionTiming}
        {musclesPain}

        <GymExercisesList
            data={this.state.exercises}
            dataExtractor={exerciseDataExtractor.extract}
            onAvatarPress={this.onExerciseAvatarPress}
            onMoodPress={this.selectMood}
            onExercisePress={this.selectExercise}
            />

        <Modal  animationType="slide" transparent={false} visible={this.state.moodModalVisible}>
          <ExerciseMood exercise={this.state.selectedExercise} whenFinished={() => {this.setState({moodModalVisible: false})}} />
        </Modal>

        <Modal animationType="slide" transparent={false} visible={this.state.exModalVisible}>
          <ExerciseSettings exercise={this.state.selectedExercise} onSaved={() => {this.setState({exModalVisible: false})}} onCancel={() => {this.setState({exModalVisible: false})}} />
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  workoutsTitleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 9
  },
  workoutTitle: {
    fontSize: 16,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginVertical: 3,
  },
  musclesPlainContainer: {
    paddingHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 12,
  },
  sessionTimingContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
  },
});
