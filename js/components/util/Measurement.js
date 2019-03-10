import React, {Component} from 'react';
import {StyleSheet, Text, View, Slider} from 'react-native';
import TRC from 'toto-react-components';

export default class Measurement extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{this.props.title}</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderRangeValueContainer}>
            <Text style={styles.sliderRange}>{this.props.minValue}</Text>
          </View>
          <Slider minimumValue={this.props.minValue}
                  maximumValue={this.props.maxValue}
                  style={{width: 150}}
                  minimumTrackTintColor={TRC.TotoTheme.theme.COLOR_ACCENT}
                  maximumTrackTintColor={TRC.TotoTheme.theme.COLOR_THEME}
                  onValueChange={this.props.onValueChange}
                  step={this.props.increment}
                  value={this.props.value} />
          <View style={styles.sliderRangeValueContainer}>
            <Text style={styles.sliderRange}>{this.props.maxValue}</Text>
          </View>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{this.props.value}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    fontSize: 16,
    width: 60,
    textAlign: 'right',
  },
  valueContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: TRC.TotoTheme.theme.COLOR_ACCENT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  value: {
    color: TRC.TotoTheme.theme.COLOR_ACCENT,
    fontSize: 14,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sliderRangeValueContainer: {
    width: 32,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sliderRange: {
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
    fontSize: 10,
  },
})
