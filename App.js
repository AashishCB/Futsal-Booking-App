import React, {Component} from 'react';
import CurrentBookings from "./screens/currentBookings";
import PreviousBookings from "./screens/previousBookings";
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from "./screens/home";
import FutsalList from "./screens/futsalList";
import FutsalDescription from "./screens/futsalDescription";
import DateAndTime from "./screens/dateAndTime";
import SignUp from "./screens/signup";
import Bookings from "./screens/bookings";
import NetInfo from "@react-native-community/netinfo";
import {NetInfoContext} from "./netInfo_config";

// The app uses stack navigator for navigation.
// The app uses async-storage for on-device data persistence
// The app makes api call to web-service "FutsalApp" to load and render the data related to user, futsal and booking
// The app uses location of the smart-phone to find futsals nearby

// initializing stack navigator
const Stack = createStackNavigator();

//Url for calling backend
export const APP_URL = 'http://10.241.143.63:3000'

export default class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isConnected: true
        }
    }

    componentDidMount() {
        // Listen to network status and update state and share in entire app
        this.unsubscribe = NetInfo.addEventListener((state) => {
            this.setState({ isConnected: state.isConnected });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render(){
        const { isConnected } = this.state;
        return(
            // wrapping entire app with network-context
            <NetInfoContext.Provider value={isConnected}>
                {/*wrapping entire app with navigator to get the stack implementation working*/}
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="HomeScreen">
                        <Stack.Screen name="Home Screen" component={HomeScreen}/>
                        <Stack.Screen name="Sign Up" component={SignUp} options={{ headerLeft: null}}/>
                        <Stack.Screen name="Futsal List" component={FutsalList}/>
                        <Stack.Screen name="Futsal Description" component={FutsalDescription}/>
                        <Stack.Screen name="Date And Time" component={DateAndTime}/>
                        <Stack.Screen name="Current Bookings" component={CurrentBookings}/>
                        <Stack.Screen name="Previous Bookings" component={PreviousBookings}/>
                        <Stack.Screen name="Bookings" component={Bookings}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </NetInfoContext.Provider>
        );
    };
}
