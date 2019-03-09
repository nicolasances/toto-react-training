import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Modal} from 'react-native';
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
      workouts: [],
      moodModalVisible: false,
      selectedExercise: null
    }

    // Bindings
    this.loadWorkouts = this.loadWorkouts.bind(this);
    this.selectMood = this.selectMood.bind(this);
    this.changeMood = this.changeMood.bind(this);
    this.onExerciseCompleted = this.onExerciseCompleted.bind(this);
    this.onExerciseMoodChanged = this.onExerciseMoodChanged.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.exerciseCompleted, this.onExerciseCompleted)
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.exerciseMoodChanged, this.onExerciseMoodChanged)

    // Load data
    this.loadSession();
    this.loadExercises();
  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.exerciseCompleted, this.onExerciseCompleted)
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.exerciseMoodChanged, this.onExerciseMoodChanged)
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
    }

  }

  /**
   * Reacts to the click of the exercise avatar, which will trigger the completion (or un-completion) of the exercise
   */
  onExerciseAvatarPress(item) {

    new TrainingAPI().completeExercise(item.item.sessionId, item.item.id).then((data) => {

      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.exerciseCompleted, context: {sessionId: item.item.sessionId, exerciseId: item.item.id}})
    });
  }

  /**
   * Reacts to the completion of an exercise
   */
  onExerciseCompleted(event) {

    this.loadExercises();

  }

  /**
   * Reacts to the completion of an exercise
   */
  onExerciseMoodChanged(event) {

    this.loadExercises();

  }

  /**
   * Reacts to the request to select a new mood for the specified list item
   */
  selectMood(item) {

    // Show the modal and set the selected exercise
    this.setState({moodModalVisible: true, selectedExercise: item.item});

  }

  /**
   * New mood to set
   */
  changeMood(newMood) {

    // Hide the modal
    this.setState({moodModalVisible: false});

    if (this.state.selectedExercise == null) return;

    // CAll the API
    new TrainingAPI().setExerciseMood(this.state.session.id, this.state.selectedExercise.id, newMood).then((data) => {

      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.exerciseMoodChanged, context: {exerciseId: this.state.selectedExercise.id}});
    })

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
          <View style={{marginLeft: 12}} >
            <TRC.TotoIconButton image={require('../../img/tick.png')} />
          </View>
          <View style={{marginLeft: 6}} >
            <TRC.TotoIconButton image={require('../../img/trash.png')} size='s' />
          </View>
          {workouts}
        </View>

        <GymExercisesList
            data={this.state.exercises}
            dataExtractor={this.exerciseDataExtractor}
            onAvatarPress={this.onExerciseAvatarPress}
            onMoodPress={this.selectMood}
            />

        <Modal  animationType="slide" transparent={false} visible={this.state.moodModalVisible}>
          <View style={styles.moodModal}>
            <View style={styles.moodModalTitleContainer}>
              <Text style={styles.moodModalTitle}>How do you feel after the exercise?</Text>
            </View>
            <View style={styles.moodModalIconsContainer}>
              <TouchableOpacity style={styles.moodContainer} onPress={() => {this.changeMood('ok')}}>
                <Image source={require('../../img/moods/ok.png')} style={styles.moodImage} />
                <Text style={styles.moodCaption}>Fine</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moodContainer} onPress={() => {this.changeMood('tired')}}>
                <Image source={require('../../img/moods/tired.png')} style={styles.moodImage} />
                <Text style={styles.moodCaption}>Tired</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moodContainer} onPress={() => {this.changeMood('dead')}}>
                <Image source={require('../../img/moods/dead.png')} style={styles.moodImage} />
                <Text style={styles.moodCaption}>Dead</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  todayContainer: {
    borderWidth: 4,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDayOfWeek: {
    textTransform: 'uppercase',
    fontSize: 14,
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
  },
  todayDay: {
    fontSize: 30,
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
  },
  todayMonth: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
  },
  todayYear: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
    opacity: 0.9,
  },
  workoutsTitleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 9
  },
  workoutTitle: {
    fontSize: 16,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginVertical: 3,
  },
  moodModal: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  moodModalTitleContainer: {
    marginBottom: 48,
    marginTop: 64,
  },
  moodModalTitle: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: 20
  },
  moodModalIconsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  moodContainer: {
    marginHorizontal: 12,
    alignItems: 'center'
  },
  moodImage: {
    width: 48,
    height: 48,
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  moodCaption: {
    fontSize: 12,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginTop: 9
  },
});
