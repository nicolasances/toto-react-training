import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Modal} from 'react-native';
import TRC from 'toto-react-components';

export default class ExerciseTypePicker extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Pick a type</Text>
        <View style={styles.typesContainer}>
          <TRC.TotoIconButton image={require('TotoReactTraining/img/type/single.png')} label="Single" onPress={() => {this.props.onSelect('single')}} />
          <TRC.TotoIconButton image={require('TotoReactTraining/img/type/superset.png')} label="Superset" onPress={() => {this.props.onSelect('superset')}} />
          <TRC.TotoIconButton image={require('TotoReactTraining/img/type/dropset.png')} label="Dropset" onPress={() => {this.props.onSelect('dropset')}} />
          <TRC.TotoIconButton image={require('TotoReactTraining/img/type/striping.png')} label="Striping" onPress={() => {this.props.onSelect('striping')}} />
          <TRC.TotoIconButton image={require('TotoReactTraining/img/type/hourglass.png')} label="Hourglass" onPress={() => {this.props.onSelect('hourglass')}} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  label: {
    fontSize: 20,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginBottom: 24,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
})
