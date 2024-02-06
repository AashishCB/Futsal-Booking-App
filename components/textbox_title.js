import React, {Component} from "react";
import {Text, View, StyleSheet} from "react-native";
export class TextboxHeader extends Component{
    render(){
        return(
            <View style={styles.itemStyle}>
                <Text style={styles.textStyle}>
                    {this.props.text}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        itemStyle:
            {
                alignItems: "flex-start"
            },
        textStyle:
            {
                fontSize: 20,
                fontFamily: "serif"
            }
    }
);