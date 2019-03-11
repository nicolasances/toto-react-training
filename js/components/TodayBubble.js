import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import moment from 'moment';

export default class TodayBubble extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    // Current calendar date
    let todayDayOfWeek = moment().format('dddd');
    let todayDay = moment().format('DD');
    let todayMonth = moment().format('MMMM');
    let todayYear = moment().format('YYYY');

    return (
      <View style={styles.todayContainer}>
        <Text style={styles.todayDayOfWeek}>{todayDayOfWeek}</Text>
        <Text style={styles.todayDay}>{todayDay}</Text>
        <Text style={styles.todayMonth}>{todayMonth}</Text>
        <Text style={styles.todayYear}>{todayYear}</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  todayContainer: {
    borderWidth: 4,
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDayOfWeek: {
    textTransform: 'uppercase',
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
  },
  todayDay: {
    fontSize: 20,
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
  },
  todayMonth: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
  },
  todayYear: {
    fontSize: 8,
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
    opacity: 0.9,
  },
})