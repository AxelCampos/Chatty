import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

const Search = ({ item, goToSearch, deleteThisSearch }) => {
    // console.log('search name', item.name);
    return (
        <TouchableHighlight key={item.id} onPress={goToSearch}>
            <View style={styles.tendencyContainer}>
                <Text style={styles.name}>
                    Búsqueda:
            {item.name}
                </Text>

                <Icon.Button
                    name='times-circle'
                    color='red'
                    borderRadius={16}
                    // iconStyle={}
                    size={24}
                    style={styles.icon}
                    onPress={deleteThisSearch}
                />

            </View>
        </TouchableHighlight>
    );
};

export default Search;