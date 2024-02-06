import React, {Component} from 'react';
import {Text, Image, StyleSheet, View, FlatList, TouchableOpacity} from "react-native";
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from "geolib";
import {APP_URL} from "../App";
import {NetInfoContext} from "../netInfo_config";


// This screen renders the list of futsal that is received from the back-end server
export default class FutsalList extends Component{
    static contextType = NetInfoContext;
    constructor(props) {
        super(props);
        this.state=
            {
                user_id: '',
                futsalList: '',
                userLongitude: '',
                userLatitude: ''
            }
    }
    componentDidMount()
    {
        const { passedUserId } = this.props.route.params;
        this.setState({user_id: passedUserId});

        // getting user_location using Geolocation framework
        Geolocation.getCurrentPosition(info => this.setState({
            userLongitude: info['coords']['longitude'], userLatitude: info['coords']['latitude']}), error => console.log('error') ,{enableHighAccuracy: true});

        const prom = this.getFutsalList();
    }

    async getFutsalList() {
        try
        {
            let url = APP_URL + '/futsals';
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
            const futsals = responseJson['data'];

            // adding a distance field in the list of futsals received from back-end
            // using geolib library to getDistance from given futsal co-ordinates and user co-oridnates
            const futsalsWithDistance = futsals.map((futsal) => {
                console.log('userLongitude=', this.state.userLongitude, 'userLatitude=', this.state.userLatitude)
                console.log('futsalLongitude=', futsal.longitude, 'futsalLatitude=', futsal.latitude)
                const distance = getDistance(
                    {longitude: this.state.userLongitude, latitude: this.state.userLatitude},
                    {longitude: futsal.longitude, latitude: futsal.latitude}
                );
                return {...futsal, distance};
            });

            this.setState({futsalList: futsalsWithDistance})

        }
        catch (error){
            console.log(error);
        }
    }
    render(){
        const {navigation} = this.props;
        const futsals = this.state.futsalList;
        const {user_id} = this.state;
        const {userLongitude} = this.state;
        const {userLatitude} = this.state;
        console.log(futsals);

        const isConnected = this.context;

        return(
            <View style={styles.screenStyle}>
                <FlatList
                    data={futsals}
                    keyExtractor={item => item['_id']}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(
                                    'Futsal Description',
                                    {
                                        passedFutsalId: item['_id'],
                                        passedFutsalName: item['name'],
                                        passedUserId: user_id,
                                        passedUserLongitude: userLongitude,
                                        passedUserLatitude: userLatitude
                                    }
                                )
                            }}
                        >
                            <View style={styles.normalItemStyle}>
                                <Image
                                    style={styles.imageStyle}
                                    source={{uri: item.images ? item.images : 'default_futsal_image'}}
                                />
                                <View style={styles.normalTextItemStyle}>
                                    <Text style={styles.textStyle}>{item.name} ||| {item.address}</Text>
                                    <Text style={styles.textStyle}>Distance: {item.distance} metres
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                    }
                    ListEmptyComponent={<Text style={styles.emptyTextItemStyle}>No Futsal found</Text>
                    }
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
        imageStyle:
            {
                width: 50,
                height: 60,
                resizeMode: 'stretch',
            },
        emptyTextItemStyle: {
            fontSize: 40,
            margin: 20
        }
    }

);