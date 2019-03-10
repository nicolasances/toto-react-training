import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TRC from 'toto-react-components';
import Measurement from '../Measurement';
import WeightRange from '../WeightRange';

/**
 * This class represents the settings of an exercise of type "dropset".
 * Props contain:
 *
 * - exercise       : (mandatory) the exercise of type 'dropset' for which the properties should be managed
 *
 */
export default class DropsetSettings extends Component {

  /**
   * Constructor
   */
  constructor(props) {

    super(props);

    this.state = {
      exercise: props.exercise,
    }

    // Set the min and max weight
    let weightRange1 = new WeightRange(props.exercise.weight1);
    let weightRange2 = new WeightRange(props.exercise.weight2);

    this.minWeight1 = weightRange1.minWeight();
    this.maxWeight1 = weightRange1.maxWeight();
    this.minWeight2 = weightRange2.minWeight();
    this.maxWeight2 = weightRange2.maxWeight();

    // Bindings
    this.onChangeSets = this.onChangeSets.bind(this);
    this.onChangeReps = this.onChangeReps.bind(this);
    this.onChangeWeight1 = this.onChangeWeight1.bind(this);
    this.onChangeWeight2 = this.onChangeWeight2.bind(this);

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

    ex.reps1 = value;
    ex.reps2 = value;

    this.setState({exercise: ex});

  }

  /**
   * When the weight is changed
   */
  onChangeWeight1(value) {

    let ex = this.state.exercise;

    ex.weight1 = value;

    this.setState({exercise: ex});

  }

  /**
   * When the weight is changed
   */
  onChangeWeight2(value) {

    let ex = this.state.exercise;

    ex.weight2 = value;

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
          <Measurement title="Reps" value={this.state.exercise.reps1} minValue={1} maxValue={20} increment={1} onValueChange={this.onChangeReps} />
        </View>
        <View style={styles.measurementContainer}>
          <Measurement title="Upper weight" value={this.state.exercise.weight1} minValue={this.minWeight1} maxValue={this.maxWeight1} increment={0.25} onValueChange={this.onChangeWeight1} />
        </View>
        <View style={styles.measurementContainer}>
          <Measurement title="Lower weight" value={this.state.exercise.weight2} minValue={this.minWeight2} maxValue={this.maxWeight2} increment={0.25} onValueChange={this.onChangeWeight2} />
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
