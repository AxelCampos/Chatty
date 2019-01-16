import React, { Component } from 'react';
import {
    View,
    Button,
} from 'react-native';
import styles from './styles';

const Header = ({ backToLifestyle }) => (
    <View style={styles.sbutton}>
        <Button style={styles.button} title="Hacer nueva Búsqueda" onPress={backToLifestyle} />
    </View>
);

export default Header;