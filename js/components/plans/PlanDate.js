import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TRC from 'toto-react-components';
import moment from 'moment';

export default class PlanDate extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.dateContainer}>
        <Text style={styles.dateDay}>{moment(this.props.date, 'YYYYMMDD').format('D')}</Text>
        <Text style={styles.dateMonth}>{moment(this.props.date, 'YYYYMMDD').format('MMM')}</Text>
        <Text style={styles.dateYear}>{moment(this.props.date, 'YYYYMMDD').format('YYYY')}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dateContainer: {
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT,
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
  },
  dateDay: {
    fontSize: 22,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  dateMonth: {
    fontSize: 12,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    textTransform: 'uppercase',
  },
  dateYear: {
    fontSize: 8,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
})
