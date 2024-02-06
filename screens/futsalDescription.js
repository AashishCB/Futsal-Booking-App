import React, {Component} from 'react';
import {Text, Image, StyleSheet, View, Pressable, Dimensions} from "react-native";
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {APP_URL} from "../App";
import {NetInfoContext} from "../netInfo_config";

// getting device dimensions
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

// for handling zooming of map-view
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class FutsalDescription extends Component{
    static contextType = NetInfoContext;
    constructor(props) {
        super(props);
        this.state = {
            futsalId: '',
            futsalDescription: '....Loading Description.....',
            futsalName: '...loading...',
            futsalSchedules: '',
            futsalImages: 'https://tse1.mm.bing.net/th?id=OIP.xcUe39T78W7zZEZx4Vun8AHaE7&pid=Api&P=0&w=248&h=166',
            futsalLongitude: '',
            futsalLatitude: '',
            futsalAddress: '',

            userId: '',
            userLongitude: '',
            userLatitude: '',
        }
    }

    componentDidMount()
    {
        const { passedUserId } = this.props.route.params;
        const { passedFutsalId } = this.props.route.params;
        const { passedFutsalName } = this.props.route.params;
        const { passedUserLongitude } = this.props.route.params;
        const { passedUserLatitude } = this.props.route.params;

        console.log('passedFutsalId', passedFutsalId);
        console.log('passedFutsalName', passedFutsalName);
        this.setState({
            userId: passedUserId,
            futsalName: passedFutsalName,
            userLongitude: passedUserLongitude,
            userLatitude: passedUserLatitude
        });
        const prom = this.getFutsalDescription(passedFutsalId);
    }

    async getFutsalDescription(futsalId) {
        try
        {
            let url = APP_URL + '/futsals/'+futsalId;
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
            console.log('futsal_description', responseJson);

            this.setState({
                futsalId: responseJson['_id'],
                futsalDescription: responseJson['description'],
                futsalImages: responseJson['images'],
                futsalSchedules: responseJson['schedules'],
                futsalLongitude: responseJson['longitude'],
                futsalLatitude: responseJson['latitude'],
                futsalAddress: responseJson['address']
            })
        }
        catch (error){
            console.log(error);
        }
    }

    render(){
        // futsal variables
        const futsal_id = this.state.futsalId;
        const futsal_description = this.state.futsalDescription;
        const futsal_images = this.state.futsalImages;
        const futsal_schedules = this.state.futsalSchedules;
        const futsal_name =  this.state.futsalName;
        const futsal_longitude = this.state.futsalLongitude;
        const futsal_latitude = this.state.futsalLatitude;
        const futsal_address = this.state.futsalAddress;
        //user variables
        const user_id = this.state.userId;
        const user_longitude = this.state.userLongitude;
        const user_latitude = this.state.userLatitude;
        const isConnected = this.context;

        const {navigation} = this.props;
        return(
            <View style={styles.screenStyle}>
                {/*Futsal image*/}
                {isConnected &&(<Image
                    style={styles.imageStyle}
                    source={{uri: futsal_images ? futsal_images : 'default_futsal_image'}}
                />)}
                {/*Futsal Description*/}
                <View style={styles.textBackgroundStyle}>
                    <Text style = {styles.textStyle}>Name:            {futsal_name}</Text>
                    <Text style = {styles.textStyle}>Description:  {futsal_description}</Text>
                    <Text style = {styles.textStyle}>Address:         {futsal_address}</Text>
                </View>
                {/*Map view*/}
                {/*only view map if user and futsal co-ordinates are available*/}
                {isConnected && user_longitude && user_latitude && futsal_longitude && futsal_latitude &&(
                    <MapView
                        style={{ height: 175, width: '100%'}}
                        region={{
                            longitude: user_longitude,
                            latitude: user_latitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA
                        }}
                        >
                        <Marker
                            coordinate={{longitude: user_longitude, latitude: user_latitude}}
                            title="My Location"
                        />
                        <Marker
                            coordinate={{longitude: futsal_longitude, latitude: futsal_latitude, }}
                            title="futsal"
                        />
                        <MapViewDirections
                            origin={{longitude: user_longitude, latitude: user_latitude}}
                            destination={{longitude: futsal_longitude, latitude: futsal_latitude}}
                            apikey=""
                            strokeWidth={4}
                            strokeColor="blue"
                        />
                    </MapView>
                )}

                {isConnected && (<Pressable
                    onPress={() => navigation.navigate
                    (
                        'Date And Time',
                        {
                            passedUserId: user_id,
                            passedFutsalSchedules: futsal_schedules,
                            passedFutsalId: futsal_id,
                            passedFutsalName: futsal_name
                        }
                    )
                    }
                    style={styles.buttonStyle}
                >
                    <Text style={styles.buttonTextStyle}>Book Futsal</Text>
                </Pressable>)}
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
        textBackgroundStyle:
            {
                backgroundColor: "#f8b8b8"
            },
        textStyle:
            {
                fontSize: 20
            },
        imageStyle:
            {
                width: 400,
                height: 400,
                resizeMode: 'stretch',
            },
        buttonStyle: {
            paddingVertical: 12,
            paddingHorizontal: 132,
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
