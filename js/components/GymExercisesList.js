import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, Image, View} from 'react-native';
import { withNavigation } from 'react-navigation';
import TRC from 'toto-react-components';
import moment from 'moment';

var imgTired = require('../../img/moods/tired.png');
var imgOk = require('../../img/moods/ok.png');
var imgDead = require('../../img/moods/dead.png');

/**
 * Flat List styled for toto.
 * To use this you must provide:
 *  - data                  : the dataset as an [] of objects
 *  - dataExtractor()       : a function that takes the flat list item and extract the following data structure:
 *                            { title :   the title, main text, of this item,
 *                              title2:   in case of superset, the title of the second exercise
 *                              avatar :  an object describing the avatar:
 *                                      { type: 'number, image'
 *                                        value: (optional) 'a value, in case of type number, an image in case of type image'
 *                                        unit: (optional) 'the unit, in case of type number'
 *                                       }
 *                              sign :    an image to put as a "sign" (e.g. info sign to show that this item has info attached)
 *                                        should be a loaded image, (provided as require(..), so already loaded)
 *                              dateRange:  an object that describes a range of date. That will be used instead of an avatar
 *                                          { start:  'starting date', formatted as YYYYMMDD string
 *                                            end:    'ending date', formatted as YYYYMMDD string,
 *                                            type:   the type of date range. Can be:
 *                                                    'dayMonth' to only show the day and the month (default)
 *                                                    'dayMonthYear' - same as dayMonth but will add the year of the END value on the right
 *                                          }
 *                            }
 *  - onItemPress()         : a function to be called when the item is pressed
 *  - avatarImageLoader()   : a function(item) that will have to load the avatar image and return a loaded <Image />
 *  - onAvatarPress()       : (optional) a function(item) to be called when the avatar is pressed
 */
export default class GymExercisesList extends Component {

  constructor(props) {
    super(props);
  }

  /**
   * Renders the toto flat list
   */
  render() {

    return (
      <FlatList
        data={this.props.data}
        renderItem={(item) => <Item item={item} avatarImageLoader={this.props.avatarImageLoader} dataExtractor={this.props.dataExtractor} onItemPress={this.props.onItemPress} onAvatarPress={this.props.onAvatarPress} onMoodPress={this.props.onMoodPress} onExercisePress={this.props.onExercisePress}/>}
        keyExtractor={(item, index) => {return 'toto-flat-list-' + index}}
        />
    )
  }

}

/**
 * Item of the Toto Flat list
 */
class Item extends Component {

  constructor(props) {
    super(props);

    // Initialize the state with the provided item
    this.state = this.props.item;

    // Bind this
    this.onDataChanged = this.onDataChanged.bind(this);

  }

  componentDidMount() {
    // Subscribe to data changed events
    TRC.TotoEventBus.bus.subscribeToEvent('totoListDataChanged', this.onDataChanged);
  }

  componentWillUnmount() {
    // Unsubscribe to data changed events
    TRC.TotoEventBus.bus.unsubscribeToEvent('totoListDataChanged', this.onDataChanged);
  }

  /**
   * React to a data change
   */
  onDataChanged(event) {
    if (this.state.item.id == event.context.item.id)
      this.setState(event.context.item);
  }

  render() {

    // The data to render
    var data = this.props.dataExtractor(this.state);

    // Define the styles, based on the state of completion the exercise
    let completed = this.props.item.item.completed;
    let imageStyle, imageSource, imageContainerStyle;

    if (completed) { 
      imageSource = require('../../img/tick.png');
      imageStyle = {tintColor: '#b9b9b9'};
      imageContainerStyle = {backgroundColor: '#B2EBF2', borderColor: '#B2EBF2'};
      textColor = {color: TRC.TotoTheme.theme.COLOR_TEXT, opacity: 0.7};
      subtitleColor = {color: TRC.TotoTheme.theme.COLOR_TEXT, opacity: 0.7};
      signColor = {tintColor: TRC.TotoTheme.theme.COLOR_TEXT, opacity: 0.7};
    }
    else {
      imageSource = data.avatar.value;
      imageStyle = {tintColor: TRC.TotoTheme.theme.COLOR_TEXT};
      imageContainerStyle = {borderColor: TRC.TotoTheme.theme.COLOR_TEXT};
      textColor = {color: TRC.TotoTheme.theme.COLOR_TEXT};
      subtitleColor = {color: TRC.TotoTheme.theme.COLOR_TEXT, opacity: 0.9};
      signColor = {tintColor: TRC.TotoTheme.theme.COLOR_TEXT};
    }

    // Define what avatar has to be rendered
    let avatarContainer;

    // If there's an avatar
    if (data.avatar != null) {

      let avatar = (<Image source={imageSource} style={[imageStyle, {width: 20, height: 20}]} />);

      avatarContainer = (
        <TouchableOpacity style={[imageContainerStyle, styles.avatar]} onPress={() => {if (this.props.onAvatarPress) this.props.onAvatarPress(this.props.item)}}>
          {avatar}
        </TouchableOpacity>
      )
    }

    // Define the mood image
    let moodImage;
    if (this.props.item.item.mood == 'ok') moodImage = imgOk;
    else if (this.props.item.item.mood == 'tired') moodImage = imgTired;
    else if (this.props.item.item.mood == 'dead') moodImage = imgDead;

    let sign = (
      <TouchableOpacity style={styles.signContainer} onPress={() => {if (this.props.onMoodPress) this.props.onMoodPress(this.props.item)}}>
        <Image source={moodImage} style={[signColor, styles.sign]} />
      </TouchableOpacity>
    )

    // If there's a second exercise to display
    let item2;
    if (data.title2 != null) item2 = (

      <View style={styles.item2}>

        <TouchableOpacity style={styles.textContainer} onPress={() => {if (this.props.onExercisePress) this.props.onExercisePress(this.props.item)}} >
          <Text style={textColor}>{data.title2}</Text>
          <Text style={[subtitleColor, {fontSize: 12}]}>{data.subtitle2}</Text>
        </TouchableOpacity>

      </View>
    )

    return (
      <View>
        <View style={styles.item}>

          {avatarContainer}

          <TouchableOpacity style={styles.textContainer} onPress={() => {if (this.props.onExercisePress) this.props.onExercisePress(this.props.item)}}>
            <Text style={textColor}>{data.title}</Text>
            <Text style={[subtitleColor, {fontSize: 12}]}>{data.subtitle1}</Text>
          </TouchableOpacity>

          {sign}

        </View>
        {item2}
      </View>
    )
  }
}

/**
 * Style sheets used for the toto flat list
 */
const styles = StyleSheet.create({

  listContainer: {
    flex: 1
  },
  item: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    marginVertical: 6,
  },
  item2: {
    marginLeft: 52
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',

  },
  textContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  signContainer: {
    marginLeft: 12,
    justifyContent: 'center'
  },
  sign: {
    width: 18,
    height: 18,
  },
})
