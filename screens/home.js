import React, {Component} from 'react';
import {PageHeader} from "../components/page_header";
import {Text, Pressable, StyleSheet, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {NetInfoContext} from "../netInfo_config";

// This page renders different component when the app is connected/not connected to network
// This page renders different component when user is logged_in or logged_out

export default class HomeScreen extends Component{
    static contextType = NetInfoContext;
    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            logged_in: true
        }

        const {navigation} = this.props;

        // Adding a listener to home screen whenever it is navigated back from other screen or opened for first time.
        // Specially for handling login status of user whenever user navigates back after signup
        navigation.addListener('focus', () => {
            this.retrieve_user_id_from_device();
        });
    };

    componentDidMount() {
        // fetching user_id from async-storage on home screen
        const promise = this.retrieve_user_id_from_device();
    }


    render(){
        const { logged_in, user_id } = this.state;
        const { navigation } = this.props
        const isConnected = this.context;
        return(
            <View style={styles.screenStyle}>
                {/*Custom component page-header*/}
                <PageHeader text='Book Your Futsal!'/>
                <View style={styles.buttonContainer}>
                    {logged_in && !isConnected &&(
                        <Pressable
                            onPress={() => navigation.navigate('Bookings')}
                            style={styles.offlineButton}
                        >
                            <Text style={styles.text}>Bookings</Text>
                        </Pressable>
                    )}
                    {isConnected ?(
                        <Pressable
                            onPress={() => this.findFutsal()}
                            style={styles.button0}
                        >
                            <Text style={styles.text}>Find Futsal Nearby You!</Text>
                        </Pressable>
                    ):
                        <Pressable style={styles.button0}>
                            <Text style={styles.text}>No Internet Connection</Text>
                        </Pressable>
                    }
                    {logged_in && isConnected &&(
                        <Pressable
                            onPress={() => navigation.navigate('Current Bookings', {passedUserId: user_id})}
                            style={styles.button1}
                        >
                            <Text style={styles.text}>Current Bookings</Text>
                        </Pressable>
                    )}
                    {logged_in && isConnected &&(
                        <Pressable
                            onPress={() => navigation.navigate('Previous Bookings', {passedUserId: user_id})}
                            style={styles.button2}
                        >
                            <Text style={styles.text}>Previous Bookings</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        )
    }


    findFutsal() {
        const { navigation } = this.props
        const {user_id} = this.state;

        if (this.state.logged_in===false){
            navigation.navigate('Sign Up')
        }
        else{
            navigation.navigate('Futsal List', {passedUserId: user_id})
        }
    }

    async retrieve_user_id_from_device(){
        try
        {
            const value = await AsyncStorage.getItem('_id');
            console.log(value);
            if (value===null){
                this.setState({'user_id': value, 'logged_in': false})
            }
            else{
                this.setState({'user_id': value, 'logged_in': true});
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }
}



const styles = StyleSheet.create(
    {
        screenStyle:
            {
                flex: 1,
                backgroundColor: "#f0e7e7"
            },
        offlineButton: {
            paddingVertical: 12,
            paddingHorizontal: 82,
            borderRadius: 4,
            backgroundColor: 'black',
            position: 'absolute',
            top: 100,
            left: 80
        },
        button0: {
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 4,
            backgroundColor: '#001281',
            position: 'absolute',
            top: 200,
            left: 80
        },
        button1: {
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 7,
            backgroundColor: 'brown',
            position: 'absolute',
            bottom: 0,
            left: 0
        },
        button2: {
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 7,
            backgroundColor: 'orange',
            position: 'absolute',
            bottom: 0,
            right: 0
        },
        text: {
            fontSize: 16,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: 'white',
        },
        buttonContainer: {
            flex: 2
        }
    }

);