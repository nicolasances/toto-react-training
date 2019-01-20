import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, Image, View} from 'react-native';
import { withNavigation } from 'react-navigation';
import TRC from 'toto-react-components';

/**
 * Flat List styled for toto.
 * To use this you must provide:
 *  - data                  : the dataset as an [] of objects
 *  - dataExtractor()       : a function that takes the flat list item and extract the following data structure:
 *                            { title :   the title, main text, of this item,
 *                              avatar :  an object describing the avatar:
 *                                      { type: 'number, image'
 *                                        value: (optional) 'a value, in case of type number, an image in case of type image'
 *                                        unit: (optional) 'the unit, in case of type number'
 *                                       }
 *                              sign :    an image to put as a "sign" (e.g. info sign to show that this item has info attached)
 *                                        should be a loaded image, (provided as require(..), so already loaded)
 *                              dateRange:  an object that describes a range of date. That will be used instead of an avatar
 *                                          { start: 'starting date', formatted as YYYYMMDD string
 *                                            end: 'ending date', formatted as YYYYMMDD string
 *                                          }
 *                            }
 *  - onItemPress()         : a function to be called when the item is pressed
 *  - avatarImageLoader()   : a function(item) that will have to load the avatar image and return a loaded <Image />
 */
export default class TotoFlatList extends Component {

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
        renderItem={(item) => <Item item={item} avatarImageLoader={this.props.avatarImageLoader} dataExtractor={this.props.dataExtractor} onItemPress={this.props.onItemPress}/>}
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

    // Define what avatar has to be rendered
    let avatarContainer;

    // If there's an avatar
    if (data.avatar != null) {

      let avatar;

      // If the avatar is a NUMBER
      if (data.avatar.type == 'number') {
        avatar = <Text style={styles.avatarText}>{data.avatar.value.toFixed(0)}</Text>
      }
      // If the avatar is an IMAGE
      else if (data.avatar.type == 'image') {
        // If there's a source:
        if (data.avatar.value) avatar = <Image source={data.avatar.value}  style={{width: 20, height: 20, tintColor: TRC.TotoTheme.theme.COLOR_TEXT}} />
        // If there's a configured image Loader
        else if (this.props.avatarImageLoader) {
          // Load the image
          avatar = this.props.avatarImageLoader(this.state);
        }
      }
      // For any other type of avatar, display nothing
      else {
        avatar = <Text></Text>
      }

      avatarContainer = (
        <View style={styles.avatar}>
          {avatar}
        </View>
      )
    }

    // If there's a DATE RANGE, instead of the avatar
    let dateRange;

    if (data.dateRange != null) {

        let startDateDay = moment(data.dateRange.start, 'YYYYMMDD').format('D');
        let startDateMonth = moment(data.dateRange.start, 'YYYYMMDD').format('MMM');
        let endDateDay = moment(data.dateRange.end, 'YYYYMMDD').format('D');
        let endDateMonth = moment(data.dateRange.end, 'YYYYMMDD').format('MMM');

        dateRange = (
          <View style={styles.dateRangeContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateDay}>{startDateDay}</Text>
              <Text style={styles.dateMonth}>{startDateMonth}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateDay}>{endDateDay}</Text>
              <Text style={styles.dateMonth}>{endDateMonth}</Text>
            </View>
          </View>
        )
    }

    // If there is a sign
    let sign;

    if (data.sign) sign = (
      <View style={styles.signContainer}>
        <Image source={data.sign} style={styles.sign} />
      </View>
    )

    return (
      <TouchableOpacity style={styles.item} onPress={() => {if (this.props.onItemPress) this.props.onItemPress(this.props.item)}}>

        {avatarContainer}

        {dateRange}

        <View style={styles.textContainer}>
          <Text style={{color: TRC.TotoTheme.theme.COLOR_TEXT}}>{data.title}</Text>
        </View>

        {sign}

        <View style={styles.leftSideValueContainer}>
          <Text style={styles.leftSideValue}>{data.leftSideValue}</Text>
        </View>

      </TouchableOpacity>
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
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT,
    justifyContent: 'center',
    alignItems: 'center',

  },
  avatarText: {
    fontSize: 12,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  textContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  leftSideValueContainer: {
    justifyContent: 'center',
  },
  leftSideValue: {
    fontSize: 14,
    color: TRC.TotoTheme.theme.COLOR_TEXT
  },
  signContainer: {
    marginLeft: 12,
    justifyContent: 'center'
  },
  sign: {
    width: 18,
    height: 18,
    tintColor: TRC.TotoTheme.theme.COLOR_ACCENT_LIGHT
  },
  dateRangeContainer: {
  }
})
