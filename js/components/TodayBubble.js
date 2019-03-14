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

    let date = this.props.date == null ? moment() : moment(this.props.date, 'YYYYMMDD');

    // Current calendar date
    let todayDayOfWeek = date.format('dddd');
    let todayDay = date.format('DD');
    let todayMonth = date.format('MMM');
    let todayYear = date.format('YYYY');

    return (
      <View style={styles.todayContainer}>
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
    fontSize: 30,
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
  },
  todayMonth: {
    fontSize: 14,
    textTransform: 'uppercase',
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
  },
  todayYear: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
    opacity: 0.9,
  },
})
