import React, {Component} from 'react';
import {Text, StyleSheet, View, FlatList, TouchableOpacity, Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// this component is rendered when the app is not connected to network
// the data rendered here is retrieved from async-storage

export default class Bookings extends Component{
    constructor(props) {
        super(props);
        this.state= {
            bookingList: ''
        }
    }
    async componentDidMount()
    {
        // retrieve the booking list
        try {
            const bookingList = await AsyncStorage.getItem('bookingList');
            this.setState({bookingList: JSON.parse(bookingList)});
        }catch (error){
            console.log(error);
        }
    }


    render(){
        const bookings = this.state.bookingList;
        console.log('futsals bookings', bookings);

        return(
            <View style={styles.screenStyle}>
                <FlatList
                    data={bookings}
                    keyExtractor={item => item['_id']}
                    renderItem={({ item }) => (
                            <View style={styles.normalItemStyle}>
                                <View style={styles.normalTextItemStyle}>
                                    <Text style = {styles.textStyle}>Name: {item.futsal_name}       |   Time: {item.time}</Text>
                                    <Text style = {styles.textStyle}>Date: {new Date(item.date).toLocaleDateString()}</Text>
                                </View>
                            </View>
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