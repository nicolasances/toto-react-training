import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Modal} from 'react-native';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import moment from 'moment';

export default class CreateWorkoutScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Create a new workout'
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
    }

    // Binding
    this.saveWorkout = this.saveWorkout.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    // TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.archiveExerciseSelected, this.onArchiveExerciseSelected)
  }

  componentWillUnmount() {
    // REmove event listeners
    // TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.archiveExerciseSelected, this.onArchiveExerciseSelected)
  }

  /**
   * Saves the workout
   */
  saveWorkout() {

    if (this.state.workoutName == null) return;

    new TrainingAPI().postWorkout(this.props.navigation.getParam('plan').id, this.state.workoutName).then((data) => {

      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.workoutCreated});

      this.props.navigation.goBack();
    })

  }

  /**
   * Renders the home screen
   */
  render() {
    return (
      <View style={styles.container}>

        <View style={{flex: 1}}>
          <TextInput
            style={styles.nameInput}
            onChangeText={(text) => {this.setState({workoutName: text})}}
            placeholder='Write here the workout name'
            placeholderTextColor={TRC.TotoTheme.theme.COLOR_TEXT}
            keyboardType='default'
            />
        </View>

        <View style={styles.buttonsContainer}>
          <TRC.TotoIconButton image={require('TotoReactTraining/img/tick.png')} onPress={this.saveWorkout} />
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
  },
  nameInput: {
    fontSize: 20,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginBottom: 24,
    textAlign: 'center',
  },
});
