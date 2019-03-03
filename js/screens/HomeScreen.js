import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import TrainingAPI from '../services/TrainingAPI';
import HomeHeader from '../components/HomeHeader';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

export default class HomeScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerTitle: <TRC.TotoTitleBar
                        title='Training'
                        color={TRC.TotoTheme.theme.COLOR_THEME}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      todaySessions: null
    }

    // Bindings
    // this.onGrocerySelected = this.onGrocerySelected.bind(this);

  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    // TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.grocerySelected, this.onGrocerySelected)

    // Load data
    this.loadTodaySessions();
  }

  componentWillUnmount() {
    // REmove event listeners
    // TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.grocerySelected, this.onGrocerySelected)
  }

  /**
   * Loads today's sessions
   */
  loadTodaySessions() {

    new TrainingAPI().getTodaySessions().then((data) => {

      this.setState({todaySessions: data.sessions});

    })
  }

  /**
   * Checks if there is any session TODAY that has not been completed
   */
  anySessionNotCompletedToday(sessions) {

    if (sessions == null) return false;

    for (var i = 0; i < sessions.length; i++) {

      if (!sessions[i].completed) return true;

    }

    return false;
  }

  /**
   * Renders the home screen
   */
  render() {

    let someSessionsNotCompleted = this.anySessionNotCompletedToday(this.state.todaySessions);

    // Start button
    // Which is shown only if there are no sessions already started for today and not completed!
    let startButton;

    if (!someSessionsNotCompleted) startButton = (

      <View style={styles.mainButtonContainer}>
        <TRC.TotoIconButton
              image={require('../../img/dumbbell.png')}
              size='xxl'
              label='Start Training!'
              onPress={() => {this.props.navigation.navigate('SessionStartScreen')}}
              />
      </View>

    )

    // Jump into session button
    // Visible only if there are some sessions that haven't been completed today
    let jumpInSession;

    if (someSessionsNotCompleted) jumpInSession = (

      <View style={styles.jumpInSessionContainer}>

        <TRC.TotoIconButton
            image={require('../../img/man-training.png')}
            size='xxl'
            label='Go on, train!'
            onPress={() => {this.props.navigation.navigate('SessionExecutionScreen', {sessionId: this.state.todaySessions[0].id})}}
            />

      </View>
    )

    return (
      <View style={styles.container}>

        <HomeHeader />

        {startButton}
        {jumpInSession}

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
  mainButtonContainer: {
    marginVertical: 24
  },
  jumpInSessionContainer: {
    marginVertical: 24
  }
});
