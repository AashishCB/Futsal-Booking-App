import React, {Component} from "react";
import {Text, View, StyleSheet} from "react-native";
export class PageHeader extends Component{
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
                alignItems: "center"
            },
        textStyle:
            {
                margin: 30,
                fontSize: 50,
                fontFamily: "ShadowsIntoLight-Regular"
            }
    }
);