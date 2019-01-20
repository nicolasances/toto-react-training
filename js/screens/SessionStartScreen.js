import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import TrainingAPI from '../services/TrainingAPI';
import TotoFlatList from '../components/TotoFlatList';

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
      plans: []
    }

    // Load the data
    this.loadPlans();

    // Bindings
    // this.onGrocerySelected = this.onGrocerySelected.bind(this);

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
      title: item.item.name
    }

  }

  /**
   * Renders the home screen
   */
  render() {


    return (
      <View style={styles.container}>

        <TotoFlatList
            data={this.state.plans}
            dataExtractor={this.planDataExtractor}
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
