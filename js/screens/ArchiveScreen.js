import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, TextInput} from 'react-native';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import TotoFlatList from 'TotoReactTraining/js/components/TotoFlatList';
import moment from 'moment';

export default class ArchiveScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Exercises Archive'
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
    }

    // Load data
    this.loadMuscles();

    // Bindings
    this.onMuscleSelect = this.onMuscleSelect.bind(this);

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
   * Loads the muscles
   */
  loadMuscles() {

    new TrainingAPI().getArchiveMuscles().then((data) => {

      this.setState({muscles: data.muscles});
    })

  }

  /**
   * Data extractor for the list of muscles
   */
  dataExtractor(item) {

    let m = item.item;

    return {
      title: m.name,
      avatar: {
        type: 'string',
        value: m.name.substring(0, 2)
      }
    }

  }

  /**
   * React to the selection of a muscle
   */
  onMuscleSelect(item) {

    this.props.navigation.navigate('ArchiveExercisesScreen', {muscle: item.item, referer: this.props.navigation.getParam('referer')});

  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <TotoFlatList
            data={this.state.muscles}
            dataExtractor={this.dataExtractor}
            onItemPress={this.onMuscleSelect}
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
