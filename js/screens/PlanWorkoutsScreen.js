import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import TrainingAPI from '../services/TrainingAPI';
import TotoFlatList from '../components/TotoFlatList';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

/**
 * Supports:
 *  - onSelect            : (OPTIONAL) function(workout) to be called when a workout is selected
 */
export default class PlanWorkoutsScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title={navigation.getParam('plan').name}
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
      plan: this.props.navigation.getParam('plan'),
      workouts: []
    }

    // Load the data
    this.loadWorkouts();

    // Bindings
    this.onItemPress = this.onItemPress.bind(this);

  }

  /**
   * Loads the available training workouts for the specified plan
   */
  loadWorkouts() {

    new TrainingAPI().getPlanWorkouts(this.state.plan.id).then((data) => {
      // Update the state
      this.setState({
        workouts: data.workouts
      });
    });
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    // TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.grocerySelected, this.onGrocerySelected)
  }

  componentWillUnmount() {
    // REmove event listeners
    // TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.grocerySelected, this.onGrocerySelected)
  }

  /**
   * Extracts the flat list data of a workout
   */
  workoutDataExtractor(item) {

    return {
      title: item.item.name,
      avatar: {},
    }
  }

  /**
   * Reacts to pressing an item
   * If the navigation contains a "on select" method, this one will have priority
   * otherwise, this function will navigate to the detail screen of the workout
   */
  onItemPress(item) {

    // On select method optionally passed in the navigation
    let onSelect = this.props.navigation.getParam('onSelect');

    // If onSelect is there, use it
    if (onSelect != null) {
      // Use it
      onSelect(item.item);

      // Go back
      this.props.navigation.goBack();
    }
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

        <TotoFlatList
          data={this.state.workouts}
          dataExtractor={this.workoutDataExtractor}
          onItemPress={this.onItemPress}
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
    paddingTop: 24
  },
});
