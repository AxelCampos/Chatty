import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    Image,
    Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { graphql, compose } from 'react-apollo';
import withLoading from '../components/withLoading';

const MatchList = () => (
    <View>
        <Text>Match List</Text>
    </View>
)

export default MatchList;