import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TRC from 'toto-react-components';
import Measurement from '../Measurement';
import WeightRange from '../WeightRange';

/**
 * This class represents the settings of an exercise of type "Single".
 * Props contain:
 *
 * - exercise       : (mandatory) the exercise of type 'single' for which the properties should be managed
 *
 */
export default class SingleSettings extends Component {

  /**
   * Constructor
   */
  constructor(props) {

    super(props);

    this.state = {
      exercise: props.exercise,
    }

    // Set the min and max weight
    let weightRange = new WeightRange(props.exercise.weight);

    this.minWeight = weightRange.minWeight();
    this.maxWeight = weightRange.maxWeight();

    // Bindings
    this.onChangeSets = this.onChangeSets.bind(this);
    this.onChangeReps = this.onChangeReps.bind(this);
    this.onChangeWeight = this.onChangeWeight.bind(this);

  }

  /**
   * When the sets are changed
   */
  onChangeSets(value) {

    let ex = this.state.exercise;

    ex.sets = value;

    this.setState({exercise: ex});

  }

  /**
   * When the reps are changed
   */
  onChangeReps(value) {

    let ex = this.state.exercise;

    ex.reps = value;

    this.setState({exercise: ex});

  }

  /**
   * When the weight is changed
   */
  onChangeWeight(value) {

    let ex = this.state.exercise;

    ex.weight = value;

    this.setState({exercise: ex});

  }

  /**
   * Render method
   */
  render() {

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Exercise settings</Text>
          <Text style={styles.subtitle}>{this.state.exercise.name}</Text>
        </View>
        <View style={styles.measurementContainer}>
          <Measurement title="Sets" value={this.state.exercise.sets} minValue={1} maxValue={10} increment={1} onValueChange={this.onChangeSets} />
        </View>
        <View style={styles.measurementContainer}>
          <Measurement title="Reps" value={this.state.exercise.reps} minValue={1} maxValue={20} increment={1} onValueChange={this.onChangeReps} />
        </View>
        <View style={styles.measurementContainer}>
          <Measurement title="Weight" value={this.state.exercise.weight} minValue={this.minWeight} maxValue={this.maxWeight} increment={0.25} onValueChange={this.onChangeWeight} />
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
  },
  measurementContainer: {
    marginVertical: 6,
  },
  titleContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 12,
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
  },
  subtitle: {
    fontSize: 20,
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    marginTop: 6,
  },
})
