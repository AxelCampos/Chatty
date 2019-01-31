import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const Header = ({ onPress, picker }) => (
  <View style={styles.header}>
    <Icon.Button
      underlayColor="transparent"
      color="black"
      backgroundColor="white"
      size={20}
      borderRadius={30}
      name="camera"
      onPress={picker}
    />
    <Icon.Button
      underlayColor="transparent"
      color="black"
      backgroundColor="white"
      size={20}
      borderRadius={30}
      name="dots-vertical"
      onPress={onPress}
    />
  </View>
);
Header.propTypes = {
  picker: PropTypes.func,
  onPress: PropTypes.func.isRequired,
};
export default Header;
