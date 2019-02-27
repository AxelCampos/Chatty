import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList, StyleSheet, Text, View,
} from 'react-native';
import R from 'ramda';
import { Buffer } from 'buffer';
import withLoading from '../../../components/withLoading';
import { graphql } from 'react-apollo';
import { USER_QUERY } from '../../../graphql/user.query';
import MESSAGE_ADDED_SUBSCRIPTION from '../../../graphql/message-added.subscription';
import GROUP_ADDED_SUBSCRIPTION from '../../../graphql/group-added.subscription';
import { wsClient } from '../../../../src/app';
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

const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({ variables: { id: ownProps.auth.id } }), // fake the user for now
  props: ({
    data: {
      loading, user, refetch, subscribeToMore,
    },
  }) => ({
    loading,
    user,
    refetch,
    subscribeToMessages() {
      return subscribeToMore({
        document: MESSAGE_ADDED_SUBSCRIPTION,
        variables: {
          groupIds: R.pluck('id', user.groups),
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          const previousGroups = previousResult.user.groups;
          const newMessage = subscriptionData.data.messageAdded;

          const groupIndex = R.pluck('id', previousGroups).indexOf(newMessage.to.id);

          const edgesLens = R.lensPath(['user', 'groups', groupIndex, 'messages', 'edges']);

          return R.set(
            edgesLens,
            [
              {
                __typename: 'MessageEdge',
                node: newMessage,
                cursor: Buffer.from(newMessage.id.toString()).toString('base64'),
              },
            ],
            previousResult,
          );
        },
      });
    },
    subscribeToGroups() {
      return subscribeToMore({
        document: GROUP_ADDED_SUBSCRIPTION,
        variables: { userId: user.id },
        updateQuery: (previousResult, { subscriptionData }) => {
          const newGroup = subscriptionData.data.groupAdded;
          const groupsLens = R.lensPath(['user', 'groups']);
          return R.over(groupsLens, R.append(newGroup), previousResult);
        },
      });
    },
  }),
});

class Groups extends Component {
  static navigationOptions = {
    title: 'Chats',
  };

  componentWillReceiveProps(nextProps) {
    const { user } = this.props;
    if (!nextProps.user) {
      if (this.groupSubscription) {
        this.groupSubscription();
      }
      if (this.messagesSubscription) {
        this.messagesSubscription();
      }
      // clear the event subscription
      if (this.reconnected) {
        this.reconnected();
      }
    } else if (!this.reconnected) {
      const { refetch } = this.props;
      this.reconnected = wsClient.onReconnected(() => {
        refetch(); // check for any data lost during disconnect
      }, this);
    }
    if (
      nextProps.user
      && (!user || nextProps.user.groups.length !== user.groups.length)
    ) {
      // unsubscribe from old
      if (typeof this.messagesSubscription === 'function') {
        this.messagesSubscription();
      }
      // subscribe to new
      if (nextProps.user.groups.length) {
        this.messagesSubscription = nextProps.subscribeToMessages();
      }
    }
    if (!this.groupSubscription && nextProps.user) {
      this.groupSubscription = nextProps.subscribeToGroups();
    }
  }

  onRefresh = () => {
    const { refetch } = this.props;
    refetch();
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
    const { user, networkStatus } = this.props;

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
            onRefresh={this.onRefresh}
            refreshing={networkStatus === 4}
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
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
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
  subscribeToMessages: PropTypes.func.isRequired,
  subscribeToGroups: PropTypes.func.isRequired,
};
const GroupsWithLoading = withLoading(userQuery(Groups));

export default GroupsWithLoading;
