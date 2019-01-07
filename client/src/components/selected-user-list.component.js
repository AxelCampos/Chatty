import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList, Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  itemContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  itemIcon: {
    alignItems: 'center',
    backgroundColor: '#dbdbdb',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    top: -3,
    width: 20,
  },
  itemImage: {
    borderRadius: 27,
    height: 54,
    width: 54,
  },
});
export const SelectedUserListItem = ({ user: { username, photoprofile }, remove }) => (
  <View style={styles.itemContainer}>
    <View>
      <Image style={styles.itemImage} source={{ uri: photoprofile.url }} />
      <TouchableOpacity onPress={remove} style={styles.itemIcon}>
        <Icon color="white" name="times" size={12} />
      </TouchableOpacity>
    </View>
    <Text>{username}</Text>
  </View>
);

SelectedUserListItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    photoprofile: PropTypes.shape({
      url: PropTypes.string,
    }),
  }),
  remove: PropTypes.func,
};
class SelectedUserList extends Component {
  keyExtractor = item => item.id.toString();

  renderItem = ({ item: user }) => {
    console.log('-------', user);
    const { remove } = this.props;
    return <SelectedUserListItem user={user} remove={() => remove(user)} />;
  };

  render() {
    const { data } = this.props;
    return (
      <FlatList
        data={data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        horizontal
        style={styles.list}
      />
    );
  }
}
SelectedUserList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  remove: PropTypes.func,
};
export default SelectedUserList;
