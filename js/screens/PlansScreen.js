import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from 'TotoReactTraining/js/Config';
import PlansList from 'TotoReactTraining/js/components/plans/PlansList';
import moment from 'moment';

export default class PlansScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Workout Plans'
                        color={TRC.TotoTheme.theme.COLOR_THEME}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT}
                        back={true}
                        rightButton={{
                          image: require('TotoReactTraining/img/add.png'),
                          navData: {
                            screen: 'PlanCreationScreen'
                          }
                        }}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
    }

    this.onSelectPlan = this.onSelectPlan.bind(this);

  }

  // On select plan
  onSelectPlan(item) {
    this.props.navigation.navigate('PlanWorkoutsScreen', {plan: item.item, deletable: true, enableExercisesNavigation: true})
  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <PlansList onSelectPlan={this.onSelectPlan}/>

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
