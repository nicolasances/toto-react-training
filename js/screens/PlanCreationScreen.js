import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView, Modal, DatePickerIOS, Keyboard, TouchableWithoutFeedback} from 'react-native';
import TRC from 'toto-react-components';
import TrainingAPI from 'TotoReactTraining/js/services/TrainingAPI';
import PlanDate from 'TotoReactTraining/js/components/plans/PlanDate';
import * as config from 'TotoReactTraining/js/Config';
import moment from 'moment';

export default class PlanCreationScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerTitle: <TRC.TotoTitleBar
                        title='Create a new plan'
                        color={TRC.TotoTheme.theme.COLOR_THEME}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT}
                        back={true}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      datepickerModalVisible: false,
      datePicked: new Date(),
      weeksModalVisible: false,
    }

    // Bindings
    this.pickStartDate = this.pickStartDate.bind(this);
    this.pickEndDate = this.pickEndDate.bind(this);
    this.setPickedDate = this.setPickedDate.bind(this);
    this.confirmPickedDate = this.confirmPickedDate.bind(this);
    this.calculateEndDate = this.calculateEndDate.bind(this);
    this.confirmWeeks = this.confirmWeeks.bind(this);
    this.savePlan = this.savePlan.bind(this);

  }

  /**
   * Functions to manage the selection of the start and end date of the plan
   */
  pickStartDate() {this.setState({datepickerModalVisible: true});}
  pickEndDate() {this.setState({weeksModalVisible: true});}
  setPickedDate(date) {this.setState({datePicked: date})}
  confirmPickedDate() {this.setState({plan: {...this.state.plan, start: moment(this.state.datePicked).format('YYYYMMDD')}, datepickerModalVisible: false}, this.calculateEndDate)}
  confirmWeeks() {this.setState({plan: {...this.state.plan, weeks: this.state.pickedWeeks}, weeksModalVisible: false}, this.calculateEndDate)}
  calculateEndDate() {
    if (this.state.plan != null && this.state.plan.start != null && this.state.plan.weeks != null) {
      this.setState({
        plan: {
          ...this.state.plan,
          end: moment(this.state.plan.start, 'YYYYMMDD').add(this.state.plan.weeks, 'weeks').format('YYYYMMDD')
        }
      })
    }
  }

  /**
   * Save the plan
   */
  savePlan() {

    new TrainingAPI().postPlan(this.state.plan).then((data) => {

      // Update the state with the new plan id
      this.setState({plan: {...this.state.plan, id: data.id}}, () => {

        // Throw an event
        TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.planCreated, context: {plan: this.state.plan}});

      });

    })

  }

  /**
   * Renders the home screen
   */
  render() {

    // Define the start and end date
    let startDate, endDate;

    if (this.state.plan != null && this.state.plan.start != null) startDate = (
      <PlanDate date={this.state.plan.start} />
    )
    else startDate = (
      <TRC.TotoIconButton image={require('TotoReactTraining/img/calendar.png')} label='Starting' onPress={this.pickStartDate}/>
    )

    if (this.state.plan != null && this.state.plan.end != null) endDate = (
      <PlanDate date={this.state.plan.end} />
    )
    else endDate = (
      <TRC.TotoIconButton image={require('TotoReactTraining/img/calendar.png')} label='Ending' onPress={this.pickEndDate} />
    )

    // Create plan button
    let createPlanButton;

    if (this.state.plan != null && this.state.plan.id == null && this.state.plan.name != null && this.state.plan.start != null && this.state.plan.weeks != null) createPlanButton = (
      <View style={styles.createPlanButtonContainer}>
        <TRC.TotoIconButton image={require('TotoReactTraining/img/tick.png')} size='l' onPress={this.savePlan} />
      </View>
    )

    return (
      <KeyboardAvoidingView style={styles.container} behavior='height'>

        <View style={styles.planHeaderContainer}>
          {startDate}
          {endDate}
          <TextInput
            style={styles.planNameValue}
            onChangeText={(text) => this.setState({plan: {...this.state.plan, name: text}})}
            placeholder='Write the plan name'
            placeholderTextColor={TRC.TotoTheme.theme.COLOR_ACCENT}
            autoCapitalize='sentences'
            keyboardType='default'
             />
        </View>

        <View style={{flex: 1}}>
        </View>

        {createPlanButton}

        <Modal animationType="slide" transparent={false} visible={this.state.datepickerModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DatePickerIOS
                date={this.state.datePicked}
                onDateChange={this.setPickedDate}
                mode="date"
                />
            </View>
            <View style={styles.buttonsContainer}>
              <TRC.TotoIconButton image={require('TotoReactTraining/img/tick.png')} onPress={this.confirmPickedDate} />
              <TRC.TotoIconButton image={require('TotoReactTraining/img/cross.png')} onPress={() => {this.setState({datepickerModalVisible: false})}} />
            </View>
          </View>
        </Modal>
        <Modal animationType="slide" transparent={false} visible={this.state.weeksModalVisible}>
          <TouchableWithoutFeedback style={styles.modalContainer} onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                <Text style={styles.weeksLabel}>How many weeks will this plan last?</Text>
                <TextInput
                style={styles.weeksInput}
                onChangeText={(text) => {this.setState({pickedWeeks: parseInt(text)})}}
                placeholderTextColor={TRC.TotoTheme.theme.COLOR_TEXT}
                keyboardType='numeric'
                />
              </View>
              <View style={styles.buttonsContainer}>
                <TRC.TotoIconButton image={require('TotoReactTraining/img/tick.png')} onPress={this.confirmWeeks} />
                <TRC.TotoIconButton image={require('TotoReactTraining/img/cross.png')} onPress={() => {this.setState({weeksModalVisible: false})}} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
    paddingTop: 24
  },
  planHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  planNameValue: {
    fontSize: 20,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginLeft: 12,
  },
  createPlanButtonContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 64,
  },
  pickerContainer: {
    flex: 1
  },
  buttonsContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  weeksInputContainer: {
    backgroundColor: 'blue',
    width: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeksInput: {
    padding: 12,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    fontSize: 32,
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    textAlign: 'center'
  },
  weeksLabel: {
    fontSize: 20,
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    marginBottom: 24,
  }
});
