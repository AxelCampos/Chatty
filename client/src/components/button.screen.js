import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Picker,
  ToastAndroid,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-circular-action-menu';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MenuActionButton extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ActionButton
          btnOutRange="rgba(208, 170, 230,1)"
          buttonColor="rgba(185, 104, 233,1)"
          position="left"
          degrees={360}
          icon={<Icon name="menu" size={30} />}
        >
          <ActionButton.Item title="MyLikes" onPress={() => navigate('MyLikes')}>
            <Icon name="heart" size={30} />
          </ActionButton.Item>
          <ActionButton.Item title="whoLikes" onPress={() => navigate('WhoLikesMe')}>
            <Icon name="fire" size={30} />
          </ActionButton.Item>
          <ActionButton.Item title="Match" onPress={() => navigate('MatchList')}>
            <Icon name="bullseye-arrow" size={30} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}
export default MenuActionButton;
