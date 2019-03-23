import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import TotoFlatList from 'TotoReactTraining/js/components/TotoFlatList';
import PlanDate from 'TotoReactTraining/js/components/plans/PlanDate';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

/**
 * Shows the workouts of the specified plan
 * Navigation parameters:
 *  - plan                      : (MANDATORY) the plan as an {}
 *  - onSelect                  : (OPTIONAL) function(workout) to be called when a workout is selected
 *  - deletable                 : (OPTIONAL, default false) true|false indicates if the delete functionality should be shown for this plan
 *  - enableExercisesNavigation : (OPTIONAL, default false) enables nav to WorkoutExercisesScreen
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
      workouts: [],
      deletable: this.props.navigation.getParam('deletable') ? true : false
    }

    // Load the data
    this.loadWorkouts();

    // Bindings
    this.onItemPress = this.onItemPress.bind(this);
    this.deletePlan = this.deletePlan.bind(this);

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
      avatar: {
        type: 'string',
        value: item.item.name.substring(0, 2)
      },
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
    else if (this.props.navigation.getParam('enableExercisesNavigation')) {

      this.props.navigation.navigate('WorkoutExercisesScreen', {workout: item.item})

    }
  }

  /**
   * Deletes the plan
   */
  deletePlan() {

    new TrainingAPI().deletePlan(this.state.plan.id).then((data) => {

      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.planDeleted, context: {planId: this.state.plan.id}});

      this.props.navigation.goBack();

    });

  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <View style={styles.planHeaderContainer}>
          <PlanDate date={this.state.plan.start} />
          <PlanDate date={this.state.plan.end} />
          <TRC.TotoIconButton disabled={!this.state.deletable} image={require('TotoReactTraining/img/trash.png')} onPress={this.deletePlan}/>
        </View>

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
  planHeaderContainer: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
  }
});
