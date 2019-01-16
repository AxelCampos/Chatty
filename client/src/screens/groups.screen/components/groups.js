import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList, StyleSheet, Text, View,
} from 'react-native';
import withLoading from '../../../components/withLoading';
import Header from './header';
import Group from './group';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  main: {
    flex: 1,
    alignItems: 'center',
  },

  warning: {
    textAlign: 'center',
    padding: 12,
  },
});

class Groups extends Component {
  static navigationOptions = {
    title: 'Chats',
  };

  goToNewGroup = () => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate('NewGroup');
  };

  keyExtractor = item => item.id.toString();

  goToMessages = group => () => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate('Messages', { groupId: group.id, title: group.name, photo: group.photo });
  };

  renderItem = ({ item }) => <Group group={item} goToMessages={this.goToMessages(item)} />;

  render() {
    const { user } = this.props;

    if (!user) {
      return null;
    }

    if (user && !user.groups.length) {
      return (
        <View style={styles.container}>
          <Header onPress={this.goToNewGroup} />
          <Text style={styles.warning}>You do not have any groups.</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Header onPress={this.goToNewGroup} />
        <View style={styles.main}>
          <FlatList
            numColumns={3}
            data={user.groups}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}
Groups.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        photo: PropTypes.string,
        users: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.id,
            photoprofile: PropTypes.shape({
              id: PropTypes.number,
              url: PropTypes.string,
            }),
          }),
        ),
      }),
    ),
  }),
};
const GroupsWithLoading = withLoading(Groups);

export default GroupsWithLoading;
