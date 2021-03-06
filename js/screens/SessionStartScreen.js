import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import TotoFlatList from 'TotoReactTraining/js/components/TotoFlatList';
import TodayBubble from 'TotoReactTraining/js/components/TodayBubble';
import PlansList from 'TotoReactTraining/js/components/plans/PlansList';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

export default class SessionStartScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='New Training Session'
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
      plans: [],
      workouts: [],
      muscles: [],
      date: props.navigation.getParam('date'),
    }

    // Load the data
    this.loadPlans();

    // Bindings
    this.onSelectPlan = this.onSelectPlan.bind(this);
    this.onWorkoutSelected = this.onWorkoutSelected.bind(this);
    this.updateAffectedMuscles = this.updateAffectedMuscles.bind(this);
    this.onStart = this.onStart.bind(this);

  }

  /**
   * Loads the available training plans
   */
  loadPlans() {

    new TrainingAPI().getPlans().then((data) => {
      // Update the state
      this.setState({
        plans: data.plans
      });
    });
  }

  /**
   * Retrieves the list of affected muscles
   */
  updateAffectedMuscles(workout) {

    new TrainingAPI().getWorkoutMuscles(workout.planId, workout.id).then((data) => {

      var newMuscles = [...this.state.muscles, ...data.muscles];

      // Update the state
      this.setState({
        muscles: newMuscles
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
   * Toto Flat List data extractor for a training plan
   */
  planDataExtractor(item) {

    return {
      title: item.item.name,
      dateRange: {
        start: item.item.start,
        end: item.item.end,
        type: 'dayMonthYear'
      }
    }

  }

  /**
   * Reacts to the selection of a workout and adds it to the list of workouts selected
   * for this session
   */
  onWorkoutSelected(workout) {

    // Update the state
    this.setState({
      workouts: [...this.state.workouts, workout]
    });

    // Update the list of affected muscles
    this.updateAffectedMuscles(workout);

  }

  /**
   * Reacts to the selection of a plan
   */
  onSelectPlan(item) {

    // Navigate to the workout selection screen
    this.props.navigation.navigate('PlanWorkoutsScreen', {
      plan: item.item,
      onSelect: this.onWorkoutSelected
    });
  }

  /**
   * Starts the session
   */
  onStart() {

    let workouts = [];

    // Get the workouts to add to the session
    for (var i = 0; i < this.state.workouts.length; i++) {

      workouts.push({
        planId: this.state.workouts[i].planId,
        workoutId: this.state.workouts[i].id
      })
    }

    // Which date?
    let date = this.state.date == null ? moment().format('YYYYMMDD') : this.state.date;

    // Start the session!
    new TrainingAPI().startSession(date, workouts).then((data) => {

      if (data.id != null) {

        // Publish an event
        TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.sessionCreated, context: {sessionId: data.id}});

        // Publish a notification
        TRC.TotoEventBus.bus.publishEvent({name: 'notification', context: {text: 'The session has been started!'}});

        // Go back
        this.props.navigation.goBack();
      }

    });

  }

  /**
   * Renders the home screen
   */
  render() {

    // In case there are no muscles selected, show a text message
    // "Add some workout!"
    let emptyMessage;

    if (this.state.workouts == null || this.state.workouts.length == 0) emptyMessage = (

      <View style={{flexDirection: 'row'}}>
        <Image style={styles.emptyMessageIcon} source={require('TotoReactTraining/img/down-arrow.png')} />
        <Text style={styles.emptyMessage}>Add some workout!</Text>
      </View>
    )

    // Button to start the session
    let startButton;

    if (this.state.muscles.length > 0) startButton = (
        <TRC.TotoIconButton image={require('TotoReactTraining/img/tick.png')} onPress={this.onStart} />
    )

    // Affected Muscles
    let muscles;

    if (this.state.muscles.length > 0) {

      let muscleIcons = [];

      for (var i = 0; i < this.state.muscles.length; i++) {

        let muscleName = this.state.muscles[i];

        let icon = (
          <View style={styles.muscleIconContainer} key={muscleName}>
            <Text style={styles.muscleFirstLetter}>{muscleName.substring(0, 1).toUpperCase()}</Text>
            <Text style={styles.muscleSecondLetter}>{muscleName.substring(1, 2)}</Text>
          </View>
        );

        muscleIcons.push(icon);
      }

      muscles = (

        <View style={styles.musclesIconsContainer}>
          {muscleIcons}
        </View>
      )
    }

    return (
      <View style={styles.container}>

        <View style={styles.sessionContainer}>
          <TodayBubble date={this.state.date} />
          <View style={styles.actionsContainer}>
            {emptyMessage}
            {startButton}
          </View>
          {muscles}
        </View>

        <PlansList onSelectPlan={this.onSelectPlan} />

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
  sessionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginVertical: 12,
    marginBottom: 24,
  },
  actionsContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  emptyMessage: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.9,
    fontSize: 20,
  },
  emptyMessageIcon: {
    width: 24,
    height: 24,
    tintColor: TRC.TotoTheme.theme.COLOR_ACCENT,
    marginRight: 12,
  },
  musclesIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 12,
  },
  muscleIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
    borderWidth: 2,
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 12,
  },
  muscleFirstLetter: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: 20,
  },
  muscleSecondLetter: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: 20,
  }
});
