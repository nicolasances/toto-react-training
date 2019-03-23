import React, {Component} from 'react';
import {StyleSheet, Text, View, Slider, TouchableOpacity} from 'react-native';
import TRC from 'toto-react-components';

export default class Measurement extends Component {

  constructor(props) {
    super(props);

    // Bindings
    this.decrease = this.decrease.bind(this);
    this.decreaseFast = this.decreaseFast.bind(this);
    this.increase = this.increase.bind(this);
    this.increaseFast = this.increaseFast.bind(this);

  }

  decrease() {
    let value = this.props.value - 0.25;
    if (value < 0) value = 0;
    this.props.onValueChange(value);
  }
  decreaseFast() {
    let value = this.props.value - 1;
    if (value < 0) value = 0;
    this.props.onValueChange(value);
  }
  increase() {
    let value = this.props.value + 0.25;
    this.props.onValueChange(value);
  }
  increaseFast() {
    let value = this.props.value + 1;
    this.props.onValueChange(value);
  }

  render() {

    // Show the slider only if an increment has been specified
    let slider;
    if (this.props.increment) slider = (
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
    )

    // If there's no increment, show buttons on each side of the slider
    let buttonsLeft, buttonsRight;
    if (!this.props.increment) {
      buttonsLeft = (
        <View style={styles.incButtonsContainer}>
          <TRC.TotoIconButton onPress={this.decrease} image={require('TotoReactTraining/img/left-arrow.png')} size='s' />
          <TRC.TotoIconButton onPress={this.decreaseFast} image={require('TotoReactTraining/img/double-left-arrow.png')} size='s' />
        </View>
      );
      buttonsRight = (
        <View style={styles.incButtonsContainer}>
          <TRC.TotoIconButton onPress={this.increaseFast} image={require('TotoReactTraining/img/double-right-arrow.png')} size='s'/>
          <TRC.TotoIconButton onPress={this.increase} image={require('TotoReactTraining/img/right-arrow.png')} size='s'/>
        </View>
      )
    }


    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{this.props.title}</Text>
          {slider}
          {buttonsLeft}
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{this.props.value}</Text>
          </View>
          {buttonsRight}
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
  incButtonsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
