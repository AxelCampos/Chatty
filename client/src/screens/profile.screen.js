import PropTypes from 'prop-types';
import {
  StyleSheet, View, Image, Text, Alert, ScrollView,
} from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { graphql, compose } from 'react-apollo';
import { StackActions, NavigationActions } from 'react-navigation';
import withLoading from '../components/withLoading';
import Menu from '../components/navigator-menu-component';
import CREATE_CONVERSATION_MUTATION from '../graphql/create-conversation.mutation';
import UPDATE_USER_MUTATION from '../graphql/update-user.mutation';
import USER_QUERY from '../graphql/user.query';
import EDIT_FRIEND_MUTATION from '../graphql/edit-friend.mutation';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  containerImage: {
    alignItems: 'center',
    height: 300,
  },
  userImage: {
    height: 300,
    width: 400,
  },
  userInformacion: {
    alignItems: 'flex-start',
    height: 150,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  userName: {
    fontSize: 20,
    color: 'black',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 20,
    right: 30,
  },
  iconStyle: {
    alignItems: 'center',
    paddingStart: 9,
    paddingEnd: 0,
    width: 50,
    borderWidth: 0.7,
    marginHorizontal: 5,
  },
  locationUser: {
    marginTop: 10,
    marginBottom: 10,
  },
  conexionStyle: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    marginHorizontal: 5,
  },
  menu: {
    height: 550,
    backgroundColor: 'white',
  },
});
const goToNewGroup = group => StackActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'Main' }),
    NavigationActions.navigate({
      routeName: 'Messages',
      params: { groupId: group.id, title: group.name },
    }),
  ],
});

class Profile extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: state.params.username,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      enableScrollViewScroll: true,
      switcher: false,
    };
    this.create = this.create.bind(this);
    this.addLike = this.addLike.bind(this);
  }

  addLike() {
    const { updateUser, user, editFriend } = this.props;
    this.setState({
      switcher: true,
    });

    updateUser({
      id: user.id,
      likes: user.likes + 1,
    });

    editFriend({
      id: 1,
      userId: user.id,
    }).catch((error) => {
      Alert.alert('Error Creating New Friend', error.message, [{ text: 'OK', onPress: () => {} }]);
    });
  }

  create() {
    const {
      createConversation,
      navigation,
      user: { username, id, photoprofile},
    } = this.props;

    createConversation({
      name: username,
      userIds: id,
      userId: 1,
      photo: photoprofile.url,
    })
      .then((res) => {
        navigation.dispatch(goToNewGroup(res.data.createConversation));
      })
      .catch((error) => {
        Alert.alert('Error Creating New Group', error.message, [{ text: 'OK', onPress: () => {} }]);
      });
  }

  renderMenu() {
    return (
      <View
        onStartShouldSetResponderCapture={() => {
          this.setState({ enableScrollViewScroll: false });
          if (this._myScroll.contentOffset === 0 && this.state.enableScrollViewScroll === false) {
            this.setState({ enableScrollViewScroll: true });
          }
        }}
        style={styles.menu}
      >
        <Menu />
      </View>
    );
  }

  render() {
    const { user, navigation } = this.props;
    const { switcher} = this.state;
   
    return (
      <View
        style={styles.container}
        onStartShouldSetResponderCapture={() => {
          this.setState({ enableScrollViewScroll: true });
        }}
      >
        <ScrollView
          scrollEnabled={this.state.enableScrollViewScroll}
          ref={myScroll => (this._myScroll = myScroll)}
        >
          <View style={styles.containerImage}>
            <Image style={styles.userImage} source={{ uri: user.photoprofile.url }} />
          </View>
          <View style={styles.userInformacion}>
            <Text style={styles.userName}>
              {user.username}
              {' ('}
              {user.age}
              {')'}
              {user.likes}
            </Text>
            <View style={styles.conexionStyle}>
              <Icon size={11.5} name="home-circle" />
              <Text style={[styles.locationUser, styles.textStyle]}>{user.city}</Text>
            </View>
            <View style={styles.conexionStyle}>
              <Icon size={10} name="circle" color="green" />
              <Text style={styles.textStyle}>Ultima conexión: 13h</Text>
            </View>
            <View style={styles.icons}>
              {switcher == false ? (
                <Icon.Button
                  underlayColor="transparent"
                  style={styles.iconStyle}
                  color="#F0625A"
                  backgroundColor="white"
                  size={30}
                  borderRadius={30}
                  name="cards-heart"
                  onPress={this.addLike}
                />
              ) : (
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
                onPress={this.create}
              />
            </View>
          </View>
          {this.renderMenu()}
        </ScrollView>
      </View>
    );
  }
}

Profile.propTypes = {
  updateUser: PropTypes.func.isRequired,
  createConversation: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }),
  user: PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
    city: PropTypes.string,
    age: PropTypes.number,
    likes: PropTypes.number,
    photoprofile: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    }),
  }),
};
const createConversationMutation = graphql(CREATE_CONVERSATION_MUTATION, {
  props: ({ mutate }) => ({
    createConversation: group => mutate({
      variables: { group },
      refetchQueries: [{ query: USER_QUERY }],
    }),
  }),
});
const updateUserMutation = graphql(UPDATE_USER_MUTATION, {
  props: ({ mutate }) => ({
    updateUser: user => mutate({
      variables: { user },

      update: (store, { data: { updateUser } }) => {
        const data = store.readQuery({
          query: USER_QUERY,
          variables: {
            id: user.id,
          },
        });
        data.user.likes = updateUser.likes;

        store.writeQuery({
          query: USER_QUERY,
          variables: {
            id: user.id,
          },
          data,
        });
      },
    }),
  }),
});
const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({
    variables: {
      id: ownProps.navigation.state.params.userId,
    },
  }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});
const editFriendMutation = graphql(EDIT_FRIEND_MUTATION, {
  props: ({ mutate }) => ({
    editFriend: (id, userId) => mutate({
      variables: id,
      userId,
      refetchQueries:[{query:USER_QUERY}],
    }),
  }),
});

export default compose(
  userQuery,
  withLoading,
  createConversationMutation,
  updateUserMutation,
  editFriendMutation,
)(Profile);
