import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Modal} from 'react-native';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import moment from 'moment';
import GymExercisesList from 'TotoReactTraining/js/components/GymExercisesList';
import ExerciseTypePicker from 'TotoReactTraining/js/components/ex/ExerciseTypePicker';
import exerciseDataExtractor from 'TotoReactTraining/js/components/util/list/ExerciseDataExtractor';

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

    this.state = {
      exercise: {}
    }

    // Binding
    this.setType = this.setType.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    // TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.workoutExerciseSettingsChanged, this.onWorkoutExerciseSettingsChanged)
  }

  componentWillUnmount() {
    // REmove event listeners
    // TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.workoutExerciseSettingsChanged, this.onWorkoutExerciseSettingsChanged)
  }

  /**
   * Selects the type of exercise
   */
  setType(type) {

    let ex1, ex2, name;
    if (type == 'superset') {
      ex1 = {name : 'Pick an exercise'};
      ex2 = {name : 'Pick an exercise'};
    }
    else name = 'Pick an exercise';

    this.setState({
      exercise: {
        ...this.state.exercise,
        type: type,
        name: name,
        ex1: ex1,
        ex2: ex2
      }
    })
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
    let exercise = this.state.exercise.type ? (
      <GymExercisesList
          data={[this.state.exercise]}
          dataExtractor={exerciseDataExtractor.extract}
          onExercisePress={this.selectExercise}
          />
    ) : null

    return (
      <View style={styles.container}>

        {chooseExerciseType}

        <View style={{flex: 1}}>
          {exercise}
        </View>

        <View style={styles.buttonsContainer}>
          <TRC.TotoIconButton image={require('TotoReactTraining/img/tick.png')} />
        </View>

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
  buttonsContainer: {
    marginBottom: 24,
    alignItems: 'center'
  }
});
