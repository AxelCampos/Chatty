import PropTypes from 'prop-types';
import {
  View, Image, Text, Alert, TouchableHighlight,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const OtherUserIcons = ({ create, addLike, liked }) => (
  <View style={styles.icons}>
    {!liked ? (
      <Icon.Button
        underlayColor="transparent"
        style={styles.iconStyle}
        color="#F0625A"
        backgroundColor="white"
        size={30}
        borderRadius={30}
        name="cards-heart"
        onPress={addLike}
      />
    )
      : (
        <Icon.Button
          underlayColor="transparent"
          style={styles.iconStyle}
          color="grey"
          backgroundColor="white"
          size={30}
          borderRadius={30}
          name="cards-heart"
        />
      )}

    <Icon.Button
      underlayColor="transparent"
      style={styles.iconStyle}
      color="black"
      backgroundColor="white"
      size={30}
      borderRadius={30}
      name="email-outline"
      onPress={create}
    />
  </View>
);

export default OtherUserIcons;
