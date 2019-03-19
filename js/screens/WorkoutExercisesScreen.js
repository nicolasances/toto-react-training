import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Modal} from 'react-native';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import GymExercisesList from 'TotoReactTraining/js/components/GymExercisesList';
import ExerciseSettings from 'TotoReactTraining/js/components/util/settings/ExerciseSettings';
import ExerciseMood from 'TotoReactTraining/js/components/ExerciseMood';
import TodayBubble from 'TotoReactTraining/js/components/TodayBubble';
import SessionMusclesPain from 'TotoReactTraining/js/components/SessionMusclesPain';
import SessionTiming from 'TotoReactTraining/js/components/SessionTiming';
import SessionFatigueSetting from 'TotoReactTraining/js/components/SessionFatigueSetting';
import moment from 'moment';
import exerciseDataExtractor from 'TotoReactTraining/js/components/util/list/ExerciseDataExtractor';

export default class WorkoutExercisesScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title={navigation.getParam('workout').name}
                        color={TRC.TotoTheme.theme.COLOR_THEME}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT}
                        back={true}
                        rightButton={{
                          image: require('TotoReactTraining/img/add.png'),
                          navData: {
                            screen: 'CreateExerciseScreen',
                            data: {workout: navigation.getParam('workout')}
                          }
                        }}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      plan: props.navigation.getParam('workout'),
      selectedExercise: null,
      exModalVisible: false,
    }

    // Binding
    this.selectExercise = this.selectExercise.bind(this);
    this.loadExercises = this.loadExercises.bind(this);
    this.onWorkoutExerciseSettingsChanged = this.onWorkoutExerciseSettingsChanged.bind(this);
    this.onWorkoutExerciseDeleted = this.onWorkoutExerciseDeleted.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.workoutExerciseSettingsChanged, this.onWorkoutExerciseSettingsChanged)
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.workoutExerciseDeleted, this.onWorkoutExerciseDeleted)

    // Load data
    this.loadExercises();
  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.workoutExerciseSettingsChanged, this.onWorkoutExerciseSettingsChanged)
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.workoutExerciseDeleted, this.onWorkoutExerciseDeleted)
  }

  /**
   * Lods the session exercises
   */
  loadExercises() {

    let workout = this.props.navigation.getParam('workout');

    new TrainingAPI().getWorkoutExercises(workout.planId, workout.id).then((data) => {

      this.setState({exercises: []}, () => {this.setState({exercises: data.exercises})});

    });

  }

  /**
   * Reacts to any change on exercises
   */
  onWorkoutExerciseSettingsChanged(event) {this.loadExercises();}
  onWorkoutExerciseDeleted(event) {this.loadExercises();}

  /**
   * Reacts to the selection of an exercise
   */
  selectExercise(item) {

    // Show the modal and set the selected exercise
    this.setState({exModalVisible: true, selectedExercise: item.item});

  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <GymExercisesList
            data={this.state.exercises}
            dataExtractor={exerciseDataExtractor.extract}
            onExercisePress={this.selectExercise}
            />

        <Modal animationType="slide" transparent={false} visible={this.state.exModalVisible}>
          <ExerciseSettings exercise={this.state.selectedExercise} enableDelete={true} onSaved={() => {this.setState({exModalVisible: false})}} onCancel={() => {this.setState({exModalVisible: false})}} />
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
});
