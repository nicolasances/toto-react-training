import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import * as config from '../Config';
import TrainingAPI from '../services/TrainingAPI';
import IntensityChart from './IntensityChart';
import moment from 'moment';

export default class IntesityGraph extends Component {

  constructor(props) {

    super(props);

    this.state = {
    };

    // Binding functions to this
    this.xLabel = this.xLabel.bind(this);
  }

  /**
   * On mounting
   */
  componentDidMount() {

    this.loadIntensityData();
  }

  /**
   * Loads the intensity data
   */
  loadIntensityData() {

    new TrainingAPI().getIntensityData(8).then((data) => {

      this.setState({days: data.days});

    })

  }

  /**
   * Data for the chart
   */
  makeData(days) {

    if (days == null) return [];

    let data = [];

    for (var i = 0; i < days.length; i++) {

      data.push({
        x: i,
        y: days[i].muscles ? days[i].muscles.length : 0
      });
    }

    return data;

  }

  /**
   * Generate the x label for the provided datum
   */
  xLabel(xValue) {

    // xValue is the index of the array this.state.days
    if (this.state.days == null || this.state.days.length <= xValue) return '';

    let day = this.state.days[xValue];

    return moment(day.date, 'YYYYMMDD').format('dd');

  }

  /**
   * Render
   */
  render() {

    // Create the data for the chart
    let data = this.makeData(this.state.days);

    return (
      <View style={styles.container}>

        <IntensityChart data={this.state.days} />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
    marginTop: 24,
  },
  buttonContainer: {
    flex: 1
  },
  timeContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    textTransform: 'uppercase',
  },
  timeTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  timeText: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: 40,
    height: 43,
    marginTop: 3
  },
  timeUnitText: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: 14,
    opacity: 0.9,
    flex: 1,
  },
  timeImg: {
    width: 42,
    height: 42,
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.8
  },
})
