import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import { withNavigation } from 'react-navigation';
import * as config from 'TotoReactTraining/js/Config';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import TotoFlatList from 'TotoReactTraining/js/components/TotoFlatList';
import TodayBubble from 'TotoReactTraining/js/components/TodayBubble';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

class PlansList extends Component<Props> {

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      plans: [],
    }

    // Load the data
    this.loadPlans();

    // Bind
    this.onPlanCreated = this.onPlanCreated.bind(this);
    this.onPlanDeleted = this.onPlanDeleted.bind(this);

  }

  /**
   * Loads the available training plans
   */
  loadPlans() {
    new TrainingAPI().getPlans().then((data) => {
      this.setState({plans: []}, () => {this.setState({plans: data.plans})});
    });
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.planCreated, this.onPlanCreated)
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.planDeleted, this.onPlanDeleted)
  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.planCreated, this.onPlanCreated)
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.planDeleted, this.onPlanDeleted)
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

  // Reactors
  onPlanCreated(event) {this.loadPlans();}
  onPlanDeleted(event) {this.loadPlans();}

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <TotoFlatList
            data={this.state.plans}
            dataExtractor={this.planDataExtractor}
            onItemPress={this.props.onSelectPlan}
            />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
});

export default withNavigation(PlansList);
