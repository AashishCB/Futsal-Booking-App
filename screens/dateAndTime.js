import React, {Component} from 'react';
import {Text, Pressable, StyleSheet, View, TouchableOpacity, FlatList, Alert} from "react-native";
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {APP_URL} from "../App";
import {NetInfoContext} from "../netInfo_config";


// This screen renders Date using calendar component
// This screen renders time in hours using data from previous screen that is received from back-end server
// On successful booking on screen the data is updated in async-storage

export default class DateAndTime extends Component{
    static contextType = NetInfoContext;
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            futsalId : '',
            futsalSchedules: '',
            futsalName: '',
            selectedStartDate: '',
            selectedStartTime: ''
        }
        this.onDateChange = this.onDateChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
    }

    componentDidMount()
    {
        const {passedUserId} = this.props.route.params;
        const {passedFutsalId} = this.props.route.params;
        const {passedFutsalSchedules} = this.props.route.params;
        const {passedFutsalName} = this.props.route.params;
        this.setState({userId: passedUserId, futsalId: passedFutsalId, futsalSchedules: passedFutsalSchedules, futsalName: passedFutsalName})
    }

    onDateChange(date) {
        this.setState({selectedStartDate: date});
    }

    onTimeChange(time) {
        this.setState({selectedStartTime: time});
    }

    async bookFutsal(user_id, futsal_id, futsal_name, date, time){
        try
        {
            let url = APP_URL + '/futsals/'+futsal_id+'/matches';
            let request_header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            let request_body = JSON.stringify({
                "futsal_id": futsal_id,
                "futsal_name": futsal_name,
                "user_id": user_id,
                "date": date,
                "time": time
            });
            const response = await fetch(url, {
                method: 'POST',
                headers: request_header,
                body: request_body
            });
            let responseJson = await response.json();
            console.log(responseJson);
            console.log(response.status);
            const {navigation} = this.props;
            if (response.status===403){
                Alert.alert('Select another time', responseJson['data'],
                    [
                        {text: 'OK', onPress:() => console.log('OK Pressed')}
                    ],
                    { cancelable: true}
                );
            }
            else{
                console.log('all bookings---', responseJson);
                // On  success update booking list in async-storage
                await AsyncStorage.removeItem('bookingList');
                await AsyncStorage.setItem('bookingList', JSON.stringify(responseJson['data']));
                console.log('Booking list stored in AsyncStorage', JSON.stringify(responseJson['data']));

                navigation.navigate('Current Bookings', {passedUserId: user_id});
            }
        }
        catch (error){
            console.log(error);
        }
    }

    render(){
        const user_id = this.state.userId;
        const futsal_schedules = this.state.futsalSchedules;
        const { selectedStartDate } = this.state;
        const start_date = selectedStartDate ? new Date(selectedStartDate).toLocaleDateString() : '';
        const { selectedStartTime } = this.state;
        const start_time = selectedStartTime;
        const futsal_id = this.state.futsalId;
        const futsal_name = this.state.futsalName;
        const minDate = new Date()
        const isConnected = this.context;


        return(
            <View style={styles.screenStyle}>
                <CalendarPicker
                    onDateChange={this.onDateChange}
                    minDate = {minDate}
                    disableAllBefore = {minDate}
                />
                <View>
                    <Text style={{paddingTop: 30, paddingBottom: 100, color: "black", fontWeight: 800, fontSize: 20}}>SELECTED DATE:{ start_date }</Text>
                    <FlatList
                        data={futsal_schedules}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.flatList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => this.onTimeChange(item)}
                            >

                                <Text style={styles.normalTextItemStyle}>{item}</Text>
                            </TouchableOpacity>
                        )
                        }
                        ListEmptyComponent =  {<Text style={styles.emptyTextItemStyle}> No Schedules </Text> }
                    />
                    <Text style={{paddingTop: 30, color: "black", fontWeight: 800, fontSize: 20}}>SELECTED TIME :  { start_time }</Text>
                </View>
                {isConnected ? (<Pressable
                    onPress={() => this.bookFutsal(user_id, futsal_id, futsal_name, start_date, start_time)}
                    style={styles.buttonStyle}
                >
                    <Text style={styles.buttonTextStyle}>Complete Booking</Text>
                </Pressable>): (<Text style={styles.buttonTextStyle}>No Internet</Text>)}
            </View>
        )
    }
}


const styles = StyleSheet.create(
    {
        screenStyle:
            {
                flex: 1,
                backgroundColor: "#f0e7e7"
            },
        flatList: {
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection: 'row'
        },
        normalTextItemStyle: {
            fontSize: 40,
            margin: 20
        },
        emptyTextItemStyle: {
            fontSize: 40,
            margin: 20
        },
        buttonStyle: {
            paddingVertical: 12,
            paddingHorizontal: 98,
            borderRadius: 4,
            backgroundColor: 'black',
            position: 'absolute',
            bottom: 0
        },
        buttonTextStyle: {
            fontSize: 16,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 3.9,
            color: 'white',
        }
    }

);