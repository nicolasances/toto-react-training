import React, {Component} from 'react';
import {Animated, Easing, View, Text, ART, Dimensions, StyleSheet, Image, TouchableOpacity} from 'react-native';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as array from 'd3-array';
import * as path from 'd3-path';
import TRC from 'toto-react-components';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import * as config from 'TotoReactTraining/js/Config';

const {Group, Shape, Surface} = ART;
const d3 = {scale, shape, array, path};
const window = Dimensions.get('window');

const graphColorTheme = {
  main: TRC.TotoTheme.theme.COLOR_THEME_LIGHT
};

/**
 * Creates a the chart displaying what has been done every day at the gym
 */
class SessionTimingGraph extends Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    // Init the state!
    this.state = {
      data: null,
    }


    // Bindings
    this.initGraph = this.initGraph.bind(this);
    this.onSessionCompleted = this.onSessionCompleted.bind(this);
    this.onSessionDeleted = this.onSessionDeleted.bind(this);
    this.onSessionDurationChanged = this.onSessionDurationChanged.bind(this);

  }

  /**
   * Mount the component
   */
  componentDidMount() {

    this.mounted = true;

    // Listen to events
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionCompleted, this.onSessionCompleted);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.sessionDurationChanged, this.onSessionDurationChanged);

    // Init the graph
    this.loadData();
  }

  /**
  * Unmount the component
  */
  componentWillUnmount() {
    this.mounted = false;

    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionCompleted, this.onSessionCompleted);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionDeleted, this.onSessionDeleted);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.sessionDurationChanged, this.onSessionDurationChanged);
  }

  // Event listeners
  onSessionCompleted() {this.loadData();}
  onSessionDeleted() {this.loadData();}
  onSessionDurationChanged() {this.loadData();}

  /**
   * Loads the data
   */
  loadData() {

    let dateFrom = moment().subtract(8, 'days').format('YYYYMMDD');

    new TrainingAPI().getTrainingDurations(dateFrom).then((data) => {

      this.setState({data: data.durations});

    });

  }

  /**
   * Initializes the graph
   */
  initGraph(props) {

    // Avoid nulls
    if (!this.mounted || props == null) return;
    if (this.state.data == null || this.state.data == []) return;

    // Sets props
    this.columnWidth = window.width / this.state.data.length;
    this.height = props.height == null ? 100 : props.height;
    let paddingV = 12;

    // Define the min and max x values
    let xMin = d3.array.min(this.state.data, (d) => {return new Date(moment(d.date, 'YYYYMMDD'));});
    let xMax = d3.array.max(this.state.data, (d) => {return new Date(moment(d.date, 'YYYYMMDD'));});

    // Define the min and max y values
    let yMin = props.minY == null ? 0 : props.minY;
    let yMax = d3.array.max(this.state.data, (d) => {return d.timeInMinutes});

    // Update the scales
    this.x = d3.scale.scaleLinear().range([this.columnWidth / 2, window.width - this.columnWidth / 2]).domain([xMin, xMax]);
    this.y = d3.scale.scaleLinear().range([this.height - paddingV, paddingV]).domain([yMin, yMax]);

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
   * Creates a circle path
   */
  circlePath(cx, cy, radius) {

    let startAngle = 0;
    let endAngle = 360;

    var polarCoord = (centerX, centerY, radius, angleInDegrees) => {

      var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      }
    }

    var start = polarCoord(cx, cy, radius, endAngle * 0.9999);
    var end = polarCoord(cx, cy, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ]

    return d.join();

  }


  /**
   * Creates the line with the timing
   */
  createTimeline(data) {

    if (data == null) return;

    var line = d3.shape.line()
                .x((d) => {return this.x(new Date(moment(d.date, 'YYYYMMDD')))})
                .y((d) => {return this.y(d.rest ? 0 : d.timeInMinutes)})
                .curve(d3.shape.curveLinear);

    var path = line([...data]);

    return this.createShape(path, graphColorTheme.main, null, 1);

  }

  /**
   * Creates the plots of time
   */
  createPlots(data) {

    if (data == null) return;

    let plotRadius = 5;

    let plots = [];

    for (var i = 0; i < data.length; i++) {

      let xVal = new Date(moment(data[i].date, 'YYYYMMDD'));
      let yVal = data[i].rest ? 0 : data[i].timeInMinutes;
      let radius = data[i].rest ? 2 : plotRadius;

      let plot = this.circlePath(this.x(xVal), this.y(yVal), radius);

      plots.push(this.createShape(plot, graphColorTheme.main, TRC.TotoTheme.theme.COLOR_THEME, 1));

    }

    return plots;

  }

  /**
   * Create the time values elements
   */
  createTimeValues(data) {

    if (data == null) return null;

    let labels = [];

    for (var i = 0; i < data.length; i++) {

      if (data[i].timeInMinutes == null) continue;

      let time = data[i].timeInMinutes;
      let xPos = this.x(new Date(moment(data[i].date, 'YYYYMMDD'))) - 8;
      let yPos = this.y(time) - 36;
      let key = 'TimeValueLabel-' + Math.random();

      let label = (
        <View key={key} style={{position: 'absolute', left: xPos, top: yPos}}>
          <Text style={[styles.timeLabel]}>{time}</Text>
          <Text style={[styles.timeMinLabel]}>min</Text>
        </View>
      )

      labels.push(label)

    }

    return labels;
  }

  /**
   * Renders the component
   */
  render() {

    // Init the graph scales etc..
    this.initGraph(this.props);

    // Create the shapes
    let timeline = this.createTimeline(this.state.data);
    let plots = this.createPlots(this.state.data);
    let timeValues = this.createTimeValues(this.state.data);

    return (
      <View style={styles.container}>
        <Surface height={this.height} width={window.width}>
          {timeline}
          {plots}
        </Surface>
        {timeValues}
      </View>
    )
  }

}

/**
 * Exports the animated component
 */
export default withNavigation(Animated.createAnimatedComponent(SessionTimingGraph));

/**
 * Stylesheets
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME
  },
  timeLabel: {
    fontSize: 12,
    color: graphColorTheme.main
  },
  timeMinLabel: {
    fontSize: 8,
    color: graphColorTheme.main
  },
});
