import React, {Component} from 'react';
import {Button, Text, Pressable, StyleSheet, View, FlatList, TouchableOpacity, Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {APP_URL} from "../App";
import {NetInfoContext} from "../netInfo_config";

// The screen renders upcoming booking list with a cancel button.
// The cancel button makes and api call in web service as well as update the async-storage

export default class CurrentBookings extends Component{
    static contextType = NetInfoContext;
    constructor(props) {
        super(props);
        this.state= (
            {
                bookingList: ''
            }
        )
    }
    componentDidMount()
    {
        const {passedUserId} = this.props.route.params;
        const prom = this.getCurrentBookings(passedUserId);
    }

    async cancelBooking(match_id){
        try
        {
            let url = APP_URL + '/users/' + '/matches/' + match_id;
            console.log(url);
            let request_header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            const response = await fetch(url, {
                method: 'DELETE',
                headers: request_header
            });
            let responseJson = await response.json();
            console.log(responseJson)

            // on success response, remove booking from bookingList
            if (response.status === 200){
                const newBookingList = this.state.bookingList.filter(item => item._id !== match_id);
                this.setState({bookingList: newBookingList});
                await AsyncStorage.removeItem('bookingList');
                await AsyncStorage.setItem('bookingList', JSON.stringify(newBookingList));
            }
            else{
                console.log('could not delete');
            }
        }
        catch (error){
            console.log(error);
        }
    }

    async getCurrentBookings(user_id) {
        try
        {
            let url = APP_URL + '/users/'+ user_id +'/matches?type=current';
            console.log(url);
            let request_header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            const response = await fetch(url, {
                method: 'GET',
                headers: request_header
            });
            let responseJson = await response.json();
            console.log(responseJson)
            this.setState({bookingList: responseJson['data']})
        }
        catch (error){
            console.log(error);
        }
    }

    render(){
        const {navigation} = this.props;
        const bookings = this.state.bookingList;
        console.log('current futsals bookings', bookings);
        const isConnected = this.context;

        return(
            <View style={styles.screenStyle}>
                <FlatList
                    data={bookings}
                    keyExtractor={item => item['_id']}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {navigation.navigate(
                                'Futsal Description',
                                { passedFutsalId: item['futsal_id'], passedFutsalName: item['futsal_name'] }
                            )}}
                        >
                            <View style={styles.normalItemStyle}>
                                <View style={styles.normalTextItemStyle}>
                                    <Text style = {styles.textStyle}>Name:  {item.futsal_name}       |   Time: {item.time}</Text>
                                    <Text style = {styles.textStyle}>Date: {new Date(item.date).toLocaleDateString()}</Text>
                                </View>
                                {/*Cancel Button*/}
                                {isConnected && (<Pressable
                                    onPress={() => this.cancelBooking(item['_id'])}
                                    style={styles.buttonStyle}
                                >
                                    <Text style={styles.buttonTextStyle}>Cancel Futsal</Text>
                                </Pressable>)}
                            </View>
                        </TouchableOpacity>
                    )
                    }
                    ListEmptyComponent =  {<Text style={styles.emptyTextItemStyle}> No Bookings </Text> }
                />
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
        normalItemStyle:
            {
                backgroundColor: '#cca6a6',
                flexDirection: 'row',
                margin: 10,
            },
        normalTextItemStyle:
            {
                backgroundColor: '#cca6a6',
                flexDirection: 'column'
            },
        textStyle:
            {
                fontSize: 20
            },
        buttonStyle: {
            paddingVertical: 2,
            paddingHorizontal: 2,
            borderRadius: 4,
            backgroundColor: 'red',
            position: 'absolute',
            bottom: 0,
            right: 0
        },
        buttonTextStyle: {
            fontSize: 16,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: 'white',
        },
        emptyTextItemStyle: {
            fontSize: 40,
            margin: 20
        }
    }

);