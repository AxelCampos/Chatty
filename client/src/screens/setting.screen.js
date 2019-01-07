import PropTypes from 'prop-types';
import {
    Button, Alert, StyleSheet, View, Image, Text, TouchableHighlight,
} from 'react-native'
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import withLoading, { WithLoading } from '../components/withLoading';
import GROUP_QUERY from '../graphql/group.query';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    screenMenu: {
        flex: 0.2,
        alignItems: 'center',
        marginTop: 20
    },
    superbuttons: {
        flex: 1
    },
    buttons: {
        flex: 0.05,
        marginTop: 2,
        backgroundColor: '#c7d6db',
    },
    text: {
        marginTop: 3,
        marginLeft: 25
    },
    menuText: {
        marginLeft: 25,
        marginTop: 3,
    },
    textContainer: {
        flex: 0.05,
        backgroundColor: '#9cb1b7',
        flexDirection: 'row'
    },
    icon: {
        marginLeft: 5,
        position: 'absolute',
        top: 5
    }
})

onPress = () => {
    this.setState({
        count: this.state.count + 1
    })
}

class Settings extends Component {
    static navigationOptions = {
        title: 'Menu',
    };
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.screenMenu}>
                    <Icon size={40} name="cogs" color="lightgreen"></Icon>
                    <Text>Welcome to the menu</Text>

                </View>
                <View style={styles.textContainer}>
                    <Icon style={styles.icon} size={15} name="user-circle" color="white"></Icon>
                    <Text style={styles.menuText}>Your Account: </Text>
                </View>
                <TouchableHighlight
                    style={styles.buttons}
                    onPress={this.onPress}>
                    <Text style={styles.text}> Account </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.buttons}
                    onPress={this.onPress}>

                    <Text style={styles.text}> Privacity </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.buttons}
                    onPress={this.onPress}>


                    <Text style={styles.text}> About </Text>
                </TouchableHighlight>

                <View style={styles.textContainer}>
                    <Icon style={styles.icon} size={15} name="user-circle" color="white"></Icon>
                    <Text style={styles.menuText}>More Settings: </Text>
                </View>
                <TouchableHighlight
                    style={styles.buttons}
                    onPress={this.onPress}>
                    <Text style={styles.text}> Account </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.buttons}
                    onPress={this.onPress}>

                    <Text style={styles.text}> Privacity </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.buttons}
                    onPress={this.onPress}>


                    <Text style={styles.text}> About </Text>
                </TouchableHighlight>
                <View style={styles.textContainer}>
                    <Icon style={styles.icon} size={15} name="user-circle" color="white"></Icon>
                    <Text style={styles.menuText}>More Settings: </Text>
                </View>
                <TouchableHighlight
                    style={styles.buttons}
                    onPress={this.onPress}>
                    <Text style={styles.text}> Account </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.buttons}
                    onPress={this.onPress}>

                    <Text style={styles.text}> Privacity </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.buttons}
                    onPress={this.onPress}>


                    <Text style={styles.text}> About </Text>
                </TouchableHighlight>

            </View>

        );
    }

}
export default (Settings);