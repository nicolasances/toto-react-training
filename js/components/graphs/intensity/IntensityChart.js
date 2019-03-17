import React, {Component} from 'react';
import {Animated, Easing, View, Text, ART, Dimensions, StyleSheet, Image, TouchableOpacity} from 'react-native';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as array from 'd3-array';
import * as path from 'd3-path';
import TRC from 'toto-react-components';
import moment from 'moment';
import { withNavigation } from 'react-navigation';

const {Group, Shape, Surface} = ART;
const d3 = {scale, shape, array, path};
const window = Dimensions.get('window');

/**
 * Creates a the chart displaying what has been done every day at the gym
 */
class IntensityChart extends Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    // Init the state!
    this.state = {
      data: null,
    }

    // Init the graph
    this.initGraph(props);

  }

  /**
   * Mount the component
   */
  componentDidMount() {
    this.mounted = true;
  }

  /**
  * Unmount the component
  */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Initializes the graph
   */
  initGraph(props) {

    // Avoid nulls
    if (!this.mounted || props == null) return;
    if (props.data == null || props.data == []) return;

    // Sets the "width" of the "column" containing each day
    this.columnWidth = window.width / props.data.length;

    // Set the height of the chart
    this.height = props.height == null ? 250 : props.height;

    // Define the min and max x values
    let xMin = d3.array.min(props.data, (d) => {return new Date(moment(d.date, 'YYYYMMDD'));});
    let xMax = d3.array.max(props.data, (d) => {return new Date(moment(d.date, 'YYYYMMDD'));});

    // Define the min and max y values
    // let yMin = props.minY == null ? 0 : props.minY;
    // let yMax = d3.array.max(props.data, (d) => {return d.y});

    // Update the scales
    this.x = d3.scale.scaleLinear().range([0, window.width]).domain([xMin, xMax]);
    // this.y = d3.scale.scaleLinear().range([0, this.height]).domain([yMin, yMax]);

  }

  /**
   * Returns a shape drawing the provided path
   */
  createShape(path, color, fillColor, strokeWidth) {

    if (strokeWidth == null) strokeWidth = 0;

    let key = 'IntesityChart-' + Math.random();

    return (
      <Shape key={key} d={path} strokeWidth={strokeWidth} stroke={color} fill={fillColor} />
    )
  }

  /**
   * Create the x axis labels
   */
  createXAxisLabels(props) {

    let data = props.data;

    if (data == null) return;

    // The labels
    let labels = [];

    // For each point, create the label
    for (var i = 0; i < data.length; i++) {

      // The single datum
      let value = moment(data[i].date, 'YYYYMMDD').format('dd');

      // Define the key
      let key = 'Label-X-' + Math.random();

      // Create the text element
      let element = (
        <View key={key} style={{width: this.columnWidth, alignItems: 'center'}}>
          <Text style={styles.xAxisLabel}>{value}</Text>
        </View>
      );

      labels.push(element);
    }

    return (
      <View style={styles.xLabelsContainer}>
        {labels}
      </View>
    )
  }

  /**
   * Creates the circles with the muscle icon inside
   */
  createMuscles(props) {

    let data = props.data;

    if (data == null) return;

    let elements = [];

    // For each point, create a circle
    for (var i = 0; i < data.length; i++) {

      // Define the key
      let key = 'Circle-X-' + Math.random();

      let muscles = data[i].muscles;
      let date = data[i].date;

      // If no muscles => rest day!
      if (muscles == null || muscles.length == 0) {

        let el = (
          <TouchableOpacity key={key} style={{width: this.columnWidth, alignItems: 'center'}} onPress={() => {this.props.navigation.navigate('SessionStartScreen', {date: date})}}>
            <Image source={require('TotoReactTraining/img/sleep.png')} style={styles.restImg} />
          </TouchableOpacity>
        )

        elements.push(el);

        continue;
      }

      // Create a circle for each muscle
      let circles = [];

      for (var m = 0; m < muscles.length; m++) {

        let muscleKey = 'musc' + m;

        let muscleText = muscles[m].muscle.substring(0, 1).toUpperCase() + muscles[m].muscle.substring(1, 2);
        let sessionId = muscles[m].sessionId;

        // Create the circle
        let circle = (
          <TouchableOpacity key={muscleKey} style={styles.muscleCircle} onPress={() => {this.props.navigation.navigate('SessionScreen', {sessionId: sessionId})}}>
            <Text style={styles.muscleText}>{muscleText}</Text>
          </TouchableOpacity>
        )

        circles.push(circle);

      }

      // Add the pain bubbles
      let painBubblesStack = this.createPainBubblesStack(data[i]);

      // Create the stack of muscles
      let musclesStack = (
        <View style={styles.musclesStack}>
          {painBubblesStack}
          {circles}
        </View>
      )

      // Create the image of the muscle
      // TODO

      // Combine them
      let el = (
        <View key={key} style={{width: this.columnWidth, alignItems: 'center'}}>
          {musclesStack}
        </View>
      )

      // Add them to the stack
      elements.push(el);

    }

    return (
      <View style={styles.circlesContainer}>
        {elements}
      </View>
    )
  }

  /**
   * Creates the bubbles of pain
   */
  createPainBubblesStack(datum) {

    // If there's no pain set, put to 0
    if (datum.pain == null) datum.pain = 0;

    let painCircles = [];

    // Create one circle per pain level
    for (var p = 1; p <= datum.pain; p++) {

      // The size of the circle depends from the pain level
      let size = 6 * (1 + datum.pain - p);
      let key = 'painCircle' + Math.random() + '-' + p;

      let circle = (
        <View key={key} style={[styles.painBubble, {width: size, height: size, borderRadius: size / 2}]}>
        </View>
      )

      painCircles.push(circle);

    }

    // Create the stack
    let stack = (
      <View key={'painb' + Math.random()} style={[styles.painBubblesStack, {width: this.columnWidth}]}>
      {painCircles}
      </View>
    )

    return stack;

  }

  /**
   * Renders the component
   */
  render() {

    this.initGraph(this.props);

    let labels = this.createXAxisLabels(this.props);
    let muscles = this.createMuscles(this.props);

    return (
      <View style={styles.container}>
        {muscles}
        {labels}
      </View>
    )
  }

}

/**
 * Exports the animated component
 */
export default withNavigation(Animated.createAnimatedComponent(IntensityChart));

/**
 * Stylesheets
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME
  },
  valueLabel: {
    color: TRC.TotoTheme.theme.COLOR_ACCENT,
    fontSize: 14,
  },
  xLabelsContainer: {
    flexDirection: 'row',
    marginBottom: 12
  },
  xAxisLabel: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: 12,
  },
  circlesContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end'
  },
  musclesStack: {
    alignItems: 'center'
  },
  muscleCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT,
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  muscleText: {
    fontSize: 14,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  restImg: {
    width: 24,
    height: 24,
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT
  },
  painBubblesStack: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 6,
  },
  painBubble: {
    borderWidth: 1,
    borderColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    marginTop: 9
  },

});
