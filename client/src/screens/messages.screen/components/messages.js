import PropTypes from 'prop-types';
import {
  FlatList, StyleSheet, View, Image, Text, TouchableOpacity,
} from 'react-native';
import R from 'ramda';
import { Buffer } from 'buffer';
import React, { Component } from 'react';
import randomColor from 'randomcolor';
import { wsClient } from '../../../../src/app';
import MESSAGE_ADDED_SUBSCRIPTION from '../../../graphql/message-added.subscription';
import Message from './message.component';
import MessageInput from './message-input.component';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#e5ddd5',
    flex: 1,
    flexDirection: 'column',
  },
  titleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleImage: {
    marginRight: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

class Messages extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state, navigate } = navigation;
    const goToGroupDetails = () => navigate('GroupDetails', {
      id: state.params.groupId,
      title: state.params.title,
    });
    // FIXME: refactorizar: hacer un image component
    // con la imagen como está en otros sitios y tirar de ahí

    return {
      headerTitle: (
        <TouchableOpacity style={styles.titleWrapper} onPress={goToGroupDetails}>
          <View style={styles.title}>
            <Image style={styles.titleImage} source={{ uri: navigation.state.params.photo }} />
            <Text>{state.params.title}</Text>
          </View>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#760d82',
      },
    };
  };

  constructor(props) {
    super(props);
    const usernameColors = {};
    if (props.group && props.group.users) {
      props.group.users.forEach((user) => {
        usernameColors[user.username] = randomColor();
      });
    }
    this.state = {
      usernameColors,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { usernameColors } = this.state;
    const { auth } = this.props;
    const newUsernameColors = {};

    console.log("1", auth);
    // check for new messages
    if (nextProps.group) {
      console.log("2", nextProps);
      if (nextProps.group.users) {
        // apply a color to each user
        nextProps.group.users.forEach((user) => {
          newUsernameColors[user.username] = usernameColors[user.username] || randomColor();
        });
      }
      // we don't resubscribe on changed props
      // because it never happens in our app
      if (!this.subscription) {
        const {
          auth: { id },
        } = nextProps;
        console.log("3 NO SUBS", id, nextProps.navigation.state.params.groupId);

        this.subscription = nextProps.subscribeToMore({
          document: MESSAGE_ADDED_SUBSCRIPTION,
          variables: {
            userId: id, // fake the user for now
            groupIds: [nextProps.navigation.state.params.groupId],
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            if (!subscriptionData.data) return previousResult;
            const newMessage = subscriptionData.data.messageAdded;

            const edgesLens = R.lensPath(['group', 'messages', 'edges']);

            return R.over(
              edgesLens,
              R.prepend({
                __typename: 'MessageEdge',
                node: newMessage,
                cursor: Buffer.from(newMessage.id.toString()).toString('base64'),
              }),
              previousResult,
            );
          },
        });
      }
      console.log('4 subs: ', this.subscription);
      if (!this.reconnected) {
        this.reconnected = wsClient.onReconnected(() => {
          const { refetch } = this.props;
          refetch(); // check for any data lost during disconnect
        }, this);
      }
      this.setState({
        usernameColors: newUsernameColors,
      });
    }
  }

  keyExtractor = item => item.node.id.toString();

  onEndReached = () => {
    const { loadingMoreEntries } = this.state;
    const { loadMoreEntries, group } = this.props;
    if (!loadingMoreEntries && group.messages.pageInfo.hasNextPage) {
      this.setState({
        loadingMoreEntries: true,
      });
      loadMoreEntries().then(() => {
        this.setState({
          loadingMoreEntries: false,
        });
      });
    }
  };

  renderItem = ({ item: edge }) => {
    const { usernameColors } = this.state;
    const { auth } = this.props;
    const message = edge.node;
    return (
      <Message
        color={usernameColors[message.from.username]}
        isCurrentUser={message.from.id === auth.id} // for now until we implement auth
        message={message}
      />
    );
  };

  send = (text) => {
    const { createMessage, navigation, auth } = this.props;
    createMessage({
      groupId: navigation.state.params.groupId,
      userId: auth.id,
      text,
    }).then(() => {
      this.flatList.scrollToIndex({ index: 0, animated: true });
    });
  };

  render() {
    const { group } = this.props;

    if (!group) {
      return null;
    }

    return (
      <View style={styles.container}>
        <FlatList
          ref={(ref) => {
            this.flatList = ref;
          }}
          inverted
          data={group.messages.edges}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListEmptyComponent={<View />}
          onEndReachedThreshold={0.1}
          onEndReached={this.onEndReached}
        />
        <MessageInput send={this.send} />
      </View>
    );
  }
}
Messages.propTypes = {
  createMessage: PropTypes.func,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        groupId: PropTypes.number,
      }),
    }),
  }),
  group: PropTypes.shape({
    messages: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          cursor: PropTypes.string,
          node: PropTypes.object,
        }),
      ),
      pageInfo: PropTypes.shape({
        hasNextPage: PropTypes.bool,
        hasPreviousPage: PropTypes.bool,
      }),
    }),
    users: PropTypes.array,
  }),
  loadMoreEntries: PropTypes.func,
  subscribeToMore: PropTypes.func,
  refetch: PropTypes.func,
};

export default Messages;
