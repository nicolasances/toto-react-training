import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, TextInput} from 'react-native';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import GymExercisesList from 'TotoReactTraining/js/components/GymExercisesList';
import exerciseDataExtractor from 'TotoReactTraining/js/components/util/list/ExerciseDataExtractor';
import moment from 'moment';

export default class ArchiveExercisesScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title={navigation.getParam('muscle').name + ' exercises'}
                        color={TRC.TotoTheme.theme.COLOR_THEME}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT}
                        back={true}
                        />
      }
    }

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    this.state = {
      muscle: props.navigation.getParam('muscle'),
      referer: props.navigation.getParam('referer'),
    }

    // Load data
    this.loadExercises();

    // Bindings
    this.onExerciseSelect = this.onExerciseSelect.bind(this);

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
   * Loads the exercises for the muscle
   */
  loadExercises() {

    new TrainingAPI().getArchiveExercises(this.state.muscle.id).then((data) => {

      this.setState({exercises: data.exercises});
    })

  }

  /**
   * React to the selection of a muscle
   */
  onExerciseSelect(item) {

    // 1. Throw a "SELECTED" event
    TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.archiveExerciseSelected, context: {exercise: item.item}});

    // 2. Go back to referer if any
    if (this.state.referer) {
      this.props.navigation.goBack(this.state.referer);
    }
    // Otherwise: open the settings to change the exercises settings
    else {
      // TODO
    }

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
            onExercisePress={this.onExerciseSelect}
            />

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
