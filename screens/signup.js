import React, {Component} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import {PageHeader} from "../components/page_header";
import {TextboxHeader} from "../components/textbox_title";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_URL} from "../App";
import {NetInfoContext} from "../netInfo_config";

// This screen is SignUp page
// Here User is requested to enter his full name and mobile number for signing in.
// On SignUp, the web-api service is called for logging the user and returns a user_id
// The user_id is stored in the async-storage

export default class SignUp extends Component{
    static contextType = NetInfoContext;
    constructor(props) {
        super(props);

        this.state = (
            {
                id: '',
                name: '',
                mobile: ''
            }
        );
    }

    signup_user(name, mobile)
    {
        const async_signup_promise = this.signup(name, mobile);
        console.log(this.state.id)
    }

    async signup(name, mobile){
        try
        {
            let url = APP_URL + '/users';
            let request_header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            let request_body = JSON.stringify({
                'name': name,
                'mobile': mobile
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: request_header,
                body: request_body
            });
            let responseJson = await response.json();

            // on success response, save user_id in async-storage and create a bookingList item
            console.log(responseJson);
            if (response.status === 200) {
                const user_id = responseJson['_id'];
                const user_name = responseJson['name'];
                const user_mobile = responseJson['mobile'];

                await AsyncStorage.setItem('_id', responseJson['_id']);
                await AsyncStorage.setItem('bookingList', JSON.stringify([]))

                this.setState({id: user_id, name: user_name, mobile: user_mobile})
                const {navigation} = this.props;
                // user is navigated back to home screen if he successfully logs in
                navigation.goBack('Home Screen');
            }else {
                console.log('Failed to sign up');
            }
        }
        catch (error)
        {
            console.error(error);
        }
    }

    render()
    {
        const isConnected = this.context;

        return (
            <View style={styles.screenStyle}>

                <PageHeader text='Book Your Futsal!'/>

                <TextboxHeader text='Full Name'/>
                <TextInput placeholder="Your Name"
                           onChangeText={(name) => this.setState({name})}
                           style={{height: 40, backgroundColor: "#ffffff", marginBottom: 50}}
                />

                <TextboxHeader text='Mobile Number'/>
                <TextInput placeholder="Your Mobile Number"
                           onChangeText={(mobile) => this.setState({mobile})}
                           style={{height: 40, backgroundColor: "#ffffff", marginBottom: 60}}
                />

                {isConnected && (<Button title="Sign Up"
                         onPress={() => this.signup_user(this.state.name, this.state.mobile)}
                />)}

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
            }
    }
)