import React, {Component} from 'react';
import {Text, StyleSheet, View, FlatList, TouchableOpacity, Image} from "react-native";
import {APP_URL} from "../App";
import {NetInfoContext} from "../netInfo_config";

// This page renders previous bookings from web-api service

export default class PreviousBookings extends Component{
    static contextType = NetInfoContext;
    constructor(props) {
        super(props);
        this.state= {
                bookingList: ''
            }
    }
    componentDidMount()
    {
        const {passedUserId} = this.props.route.params;
        const prom = this.getPreviousBookings(passedUserId);
    }

    async getPreviousBookings(user_id) {
        try
        {
            let url = APP_URL + '/users/' + user_id + '/matches?type=previous';
            let request_header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            const response = await fetch(url, {
                method: 'GET',
                headers: request_header
            });
            let responseJson = await response.json();
            console.log(responseJson);

            this.setState({bookingList: responseJson['data']})
        }
        catch (error){
            console.log(error);
        }
    }
    render(){
        const {navigation} = this.props;
        const bookings = this.state.bookingList;
        console.log('previous futsals bookings', bookings);
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
                                { passedFutsalId:item['futsal_id'], passedFutsalName: item['futsal_name']}
                            )}}
                        >
                            <View style={styles.normalItemStyle}>
                                <View style={styles.normalTextItemStyle}>
                                    <Text style = {styles.textStyle}>Name: {item.futsal_name}       |   Time: {item.time}</Text>
                                    <Text style = {styles.textStyle}>Date: {new Date(item.date).toLocaleDateString()}</Text>
                                </View>
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
        emptyTextItemStyle: {
            fontSize: 40,
            margin: 20
        }
    }

);