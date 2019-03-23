import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Modal} from 'react-native';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import moment from 'moment';
import GymExercisesList from 'TotoReactTraining/js/components/GymExercisesList';
import ExerciseTypePicker from 'TotoReactTraining/js/components/ex/ExerciseTypePicker';
import ExerciseSettings from 'TotoReactTraining/js/components/util/settings/ExerciseSettings';
import exerciseDataExtractor from 'TotoReactTraining/js/components/util/list/ExerciseDataExtractor';

const defaultExName = 'Pick an exercise';

export default class CreateExerciseScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Create an exercise'
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

    let workout = props.navigation.getParam('workout');

    this.state = {
      exercise: {
        planId: workout.planId,
        workoutId: workout.id
      },
      exercises: [],
      exModalVisible: false
    }

    // Binding
    this.setType = this.setType.bind(this);
    this.selectAndConfigureExercise = this.selectAndConfigureExercise.bind(this);
    this.onArchiveExerciseSelected = this.onArchiveExerciseSelected.bind(this);
    this.applySettings = this.applySettings.bind(this);
    this.saveExercise = this.saveExercise.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.archiveExerciseSelected, this.onArchiveExerciseSelected)
  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.archiveExerciseSelected, this.onArchiveExerciseSelected)
  }

  /**
   * When an exercise is selected from the archive, set the exercise
   * If a superset, first set the ex1 then the ex2
   */
  onArchiveExerciseSelected(event) {

    // Get the exercise
    let ex = event.context.exercise;

    // Single
    if (this.state.exercise.type == 'single') {
      this.setState({
        exercise: {
          ...this.state.exercise,
          name: ex.name,
          benchmarkExerciseId: ex.id,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          muscleGroupId: ex.muscleGroupId
        },
        exercises: []
      }, () => {this.setState({exercises: [this.state.exercise]})})
    }
    // Dropset
    else if (this.state.exercise.type == 'dropset') {
      this.setState({
        exercise: {
          ...this.state.exercise,
          name: ex.name,
          benchmarkExerciseId: ex.id,
          sets: ex.sets,
          reps1: ex.reps,
          reps2: ex.reps,
          weight1: ex.weight,
          weight2: ex.weight,
          muscleGroupId: ex.muscleGroupId
        },
        exercises: []
      }, () => {this.setState({exercises: [this.state.exercise]})})
    }
    // Striping
    else if (this.state.exercise.type == 'striping') {
      this.setState({
        exercise: {
          ...this.state.exercise,
          name: ex.name,
          benchmarkExerciseId: ex.id,
          sets: ex.sets,
          reps1: 7,
          reps2: 7,
          reps3: 7,
          weight1: ex.weight,
          weight2: ex.weight,
          weight3: ex.weight,
          muscleGroupId: ex.muscleGroupId
        },
        exercises: []
      }, () => {this.setState({exercises: [this.state.exercise]})})
    }
    // Hourglass
    else if (this.state.exercise.type == 'hourglass') {
      this.setState({
        exercise: {
          ...this.state.exercise,
          name: ex.name,
          benchmarkExerciseId: ex.id,
          sets: 6,
          reps1: 12,
          reps2: 10,
          reps3: 8,
          weight1: ex.weight,
          weight2: ex.weight,
          weight3: ex.weight,
          muscleGroupId: ex.muscleGroupId
        },
        exercises: []
      }, () => {this.setState({exercises: [this.state.exercise]})})
    }
    // Superset
    else if (this.state.exercise.type == 'superset') {
      if (this.state.exercise.ex1.name == defaultExName) {
        this.setState({
          exercise: {
            ...this.state.exercise,
            ex1: {
              name: ex.name,
              benchmarkExerciseId: ex.id,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight,
              muscleGroupId: ex.muscleGroupId
            }
          },
          exercises: []
        }, () => {this.setState({exercises: [this.state.exercise]})})
      }
      else if (this.state.exercise.ex2.name == defaultExName) {
        this.setState({
          exercise: {
            ...this.state.exercise,
            ex2: {
              name: ex.name,
              benchmarkExerciseId: ex.id,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight,
              muscleGroupId: ex.muscleGroupId
            }
          },
          exercises: []
        }, () => {this.setState({exercises: [this.state.exercise]})})
      }
    }

  }

  /**
   * Selects the type of exercise
   */
  setType(type) {

    let ex1, ex2, name;
    if (type == 'superset') {
      ex1 = {name : defaultExName};
      ex2 = {name : defaultExName};
    }
    else name = defaultExName;

    this.setState({
      exercise: {
        ...this.state.exercise,
        type: type,
        name: name,
        ex1: ex1,
        ex2: ex2
      }
    }, () => {this.setState({exercises: [this.state.exercise]})})
  }

  /**
   * Selects or configure the exercise
   */
  selectAndConfigureExercise(item) {

    let navigationKey = 'CreateEx-' + Math.random();

    // If the exercise has not been selected yet
    if ((this.state.exercise.type != 'superset' && this.state.exercise.name == defaultExName) ||
        (this.state.exercise.type == 'superset' && (this.state.exercise.ex1.name == defaultExName || this.state.exercise.ex2.name == defaultExName) )) {

      this.props.navigation.navigate({
        routeName: 'ArchiveScreen',
        params: {referer: navigationKey},
        key: navigationKey
      });

    }
    // Otherwise, the exercise has been selected and it's time to CONFIGURE IT
    else {
      this.setState({
        selectedExercise: item.item,
        exModalVisible: true,
      })
    }

  }

  /**
   * Apply the settings to the exercise
   */
  applySettings(settings) {

    // Hide the modal
    // and set the exercise settings
    this.setState({
      exModalVisible: false,
      exercise: {
        ...this.state.exercise,
        sets: settings.sets,
        reps: settings.reps,
        weight: settings.weight,
        reps1: settings.reps1,
        reps2: settings.reps2,
        reps3: settings.reps3,
        weight1: settings.weight1,
        weight2: settings.weight2,
        weight3: settings.weight3,
        ex1: settings.ex1,
        ex2: settings.ex2
      }
    }, () => {this.setState({exercises: [this.state.exercise]})})

  }

  /**
   * Saves the exercise, adding it to the workout
   */
  saveExercise() {

    new TrainingAPI().addExerciseToWorkout(this.state.exercise.planId, this.state.exercise.workoutId, this.state.exercise).then((data) => {

      // Send an event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.workoutExerciseAdded, context: {workoutId: this.state.exercise.workoutId, exercise: this.state.exercise}});

      // Go back
      this.props.navigation.goBack();

    });

  }

  /**
   * Renders the home screen
   */
  render() {

    // 1. Step 1: choose a type of exercise
    let chooseExerciseType = this.state.exercise.type ? null : (
      <View style={styles.typeContainer}>
        <ExerciseTypePicker onSelect={this.setType} />
      </View>
    )

    // Display the exercise being created
    let label;

    if ((this.state.exercise.type != 'superset' && this.state.exercise.name == defaultExName) ||
        (this.state.exercise.type == 'superset' && (this.state.exercise.ex1.name == defaultExName || this.state.exercise.ex2.name == defaultExName) ))
          label = 'Pick the exercise' + (this.state.exercise.ex1 != null ? 's' : '');
    else label = 'Configure the exercise' + (this.state.exercise.ex1 != null ? 's' : '');

    let exercise = this.state.exercise.type ? (
      <View style={styles.exerciseContainer}>
        <Text style={styles.label}>{label}</Text>
        <GymExercisesList
            data={this.state.exercises}
            dataExtractor={exerciseDataExtractor.extract}
            onExercisePress={this.selectAndConfigureExercise}
            />
      </View>
    ) : null

    return (
      <View style={styles.container}>

        {chooseExerciseType}

        <View style={{flex: 1}}>
          {exercise}
        </View>

        <View style={styles.buttonsContainer}>
          <TRC.TotoIconButton image={require('TotoReactTraining/img/tick.png')} onPress={this.saveExercise} />
        </View>

        <Modal animationType="slide" transparent={false} visible={this.state.exModalVisible}>
          <ExerciseSettings exercise={this.state.selectedExercise} onSaved={this.applySettings} onCancel={() => {this.setState({exModalVisible: false})}} />
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
  exerciseContainer: {
  },
  buttonsContainer: {
    marginBottom: 24,
    alignItems: 'center'
  },
  label: {
    fontSize: 20,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginBottom: 24,
    textAlign: 'center',
  },
});
