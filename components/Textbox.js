import React, {Component} from "react";
import {Text, View, StyleSheet, TextInput} from "react-native";
export class Textbox extends Component{
    render(){
        return(
            <View>
                <TextInput style={styles.boxStyle} placeholder={this.props.placeholder}/>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        boxStyle:{
            height: 40,
            backgroundColor: "#ffffff"
        }
    }
);