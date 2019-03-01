import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import TrainingAPI from '../services/TrainingAPI';
import GymExercisesList from '../components/GymExercisesList';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

var avatarSingle = require('../../img/type/single.png');
var avatarSuperset = require('../../img/type/superset.png');
var avatarDropset = require('../../img/type/dropset.png');
var avatarStriping = require('../../img/type/striping.png');
var avatarHourglass = require('../../img/type/hourglass.png');

var imgTired = require('../../img/moods/tired.png');
var imgOk = require('../../img/moods/ok.png');
var imgDead = require('../../img/moods/dead.png');

export default class SessionExecutionScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Train!!'
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
      session: null,
      workouts: []
    }

    // Bindings
    this.loadWorkouts = this.loadWorkouts.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    // TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.grocerySelected, this.onGrocerySelected)

    // Load data
    this.loadSession();
    this.loadExercises();
  }

  componentWillUnmount() {
    // REmove event listeners
    // TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.grocerySelected, this.onGrocerySelected)
  }

  /**
   * Load the session
   */
  loadSession() {

    new TrainingAPI().getSession(this.props.navigation.getParam('sessionId')).then((data) => {

      this.setState({session : data}, () => {

        this.loadWorkouts();

      });

    })

  }

  /**
   * Lods the session exercises
   */
  loadExercises() {

    new TrainingAPI().getSessionExercises(this.props.navigation.getParam('sessionId')).then((data) => {

      this.setState({exercises: data.exercises});

    });

  }

  /**
   * Loads the session's workouts details
   */
  loadWorkouts() {

    if (this.state.session == null || this.state.session.workouts == null) return;

    for (var i = 0; i < this.state.session.workouts.length; i++) {

      let w = this.state.session.workouts[i];

      new TrainingAPI().getWorkout(w.planId, w.workoutId).then((data) => {

        this.setState({
          workouts: [...this.state.workouts, data]
        })
      })
    }

  }

  /**
   * Data extractor for the list of exercises
   */
  exerciseDataExtractor(item) {

    let ex = item.item;
    let s1, s2;
    let r1, r2, r3;
    let w1, w2, w3;
    let title1, title2;
    let subtitle1, subtitle2;
    let avatar = {type: 'image'};
    let sign;

    if (ex.mood == 'ok') sign = imgOk;
    else if (ex.mood == 'tired') sign = imgTired;
    else if (ex.mood == 'dead') sign = imgDead;

    if (ex.type == 'single') {
      s1 = ex.sets; r1 = ex.reps; w1 = ex.weight;
      title1 = ex.name;
      subtitle1 = s1 + ' X ' + r1 + '  ' + w1 + ' Kg';
      avatar.value = avatarSingle;
    }
    else if (ex.type == 'superset') {
      s1 = ex.ex1.sets; r1 = ex.ex1.reps; w1 = ex.ex1.weight;
      s2 = ex.ex2.sets; r2 = ex.ex2.reps; w2 = ex.ex2.weight;
      title1 = ex.ex1.name;
      title2 = ex.ex2.name;
      subtitle1 = s1 + ' X ' + r1 + '  ' + w1 + ' Kg';
      subtitle2 = s2 + ' X ' + r2 + '  ' + w2 + ' Kg';
      avatar.value = avatarSuperset;
    }
    else if (ex.type == 'dropset') {
      s1 = ex.sets;
      r1 = ex.reps1; r2 = ex.reps2;
      w1 = ex.weight1; w2 = ex.weight2;
      title1 = ex.name;
      subtitle1 = s1 + ' X (' + r1 + ' + ' + r2 + ')' + '  ' + w1 + ' Kg' + '  ' + w2 + ' Kg';
      avatar.value = avatarDropset;
    }
    else if (ex.type == 'striping') {
      s1 = ex.sets;
      r1 = ex.reps1; r2 = ex.reps2; r3 = ex.reps3;
      w1 = ex.weight1; w2 = ex.weight2; w3 = ex.reps3;
      title1 = ex.name;
      subtitle1 = s1 + ' X (7 + 7 + 7)' + '  ' + w1 + ' Kg' + '  ' + w2 + ' Kg', + '  ' + w3 + ' Kg';
      avatar.value = avatarStriping;
    }
    else if (ex.type == 'hourglass') {
      s1 = ex.sets;
      w1 = ex.weight1; w2 = ex.weight2; w3 = ex.reps3;
      title1 = ex.name;
      subtitle1 = s1 + '  ' + w1 + ' Kg' + '  ' + w2 + ' Kg', + '  ' + w3 + ' Kg';
      avatar.value = avatarHourglass;
    }

    return {
      title: title1,
      title2: title2,
      subtitle1: subtitle1,
      subtitle2: subtitle2,
      avatar: avatar,
      sign: sign
    }

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

    // Name of the workouts
    let workouts;

    if (this.state.workouts.length > 0) {

      let workoutsTitles = [];

      for (var i = 0; i < this.state.workouts.length; i++) {

        let w = (
          <Text key={i} style={styles.workoutTitle}>{this.state.workouts[i].name}</Text>
        )

        workoutsTitles.push(w);

      }

      workouts = (
        <View style={styles.workoutsTitleContainer}>
          {workoutsTitles}
        </View>
      )
    }

    return (
      <View style={styles.container}>

        <View style={styles.header}>
          {today}
          {workouts}
        </View>

        <GymExercisesList
            data={this.state.exercises}
            dataExtractor={this.exerciseDataExtractor}
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
    paddingTop: 24,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 24,
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
  workoutsTitleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutTitle: {
    fontSize: 22,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginTop: 6,
  },
});
