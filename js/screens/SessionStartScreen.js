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
      workouts: null
    }

    // Load the data
    this.loadPlans();

    // Bindings
    this.onSelectPlan = this.onSelectPlan.bind(this);
    this.onWorkoutSelected = this.onWorkoutSelected.bind(this);

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

    this.setState({
      workouts: {...this.state.workouts, workout}
    });

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
   * Renders the home screen
   */
  render() {

    // Current calendar date
    let todayDayOfWeek = moment().format('dddd');
    let todayDay = moment().format('DD');
    let todayMonth = moment().format('MMMM');
    let todayYear = moment().format('YYYY');

    let today = (
      <View style={styles.todayContainer}>
        <Text style={styles.todayDayOfWeek}>{todayDayOfWeek}</Text>
        <Text style={styles.todayDay}>{todayDay}</Text>
        <Text style={styles.todayMonth}>{todayMonth}</Text>
        <Text style={styles.todayYear}>{todayYear}</Text>
      </View>
    )

    // In case there are no muscles selected, show a text message
    // "Add some workout!"
    let emptyMessage;

    if (this.state.workouts == null || this.state.workouts.size == 0) emptyMessage = (
      <View style={{flexDirection: 'row'}}>
        <Image style={styles.emptyMessageIcon} source={require('../../img/down-arrow.png')} />
        <Text style={styles.emptyMessage}>Add some workout!</Text>
      </View>
    )

    return (
      <View style={styles.container}>

        <View style={styles.sessionContainer}>
          {today}
          <View style={styles.musclesContainer}>
            {emptyMessage}
          </View>
        </View>

        <TotoFlatList
            data={this.state.plans}
            dataExtractor={this.planDataExtractor}
            onItemPress={this.onSelectPlan}
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
  sessionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  todayContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
    alignItems: 'center'
  },
  todayDayOfWeek: {
    textTransform: 'uppercase',
    fontSize: 14,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  todayDay: {
    fontSize: 30,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  todayMonth: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  todayYear: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.9,
  },
  musclesContainer: {
    flex: 1,
    justifyContent: 'center',
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
});
