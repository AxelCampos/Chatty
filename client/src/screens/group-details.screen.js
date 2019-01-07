import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Button,
  Image,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { NavigationActions, StackActions } from 'react-navigation';
import GROUP_QUERY from '../graphql/group.query';
import { USER_QUERY } from '../graphql/user.query';
import DELETE_GROUP_MUTATION from '../graphql/delete-group.mutation';
import LEAVE_GROUP_MUTATION from '../graphql/leave-group.mutation';
import EDIT_GROUP_MUTATION from '../graphql/edit-group.mutation';

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Main' })],
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupImageContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 6,
    alignItems: 'center',
  },
  groupName: {
    color: 'black',
  },
  groupNameBorder: {
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    flex: 1,
    paddingVertical: 8,
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  participants: {
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: '#dbdbdb',
    color: '#777',
  },
  user: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    flexDirection: 'row',
    padding: 10,
  },
  username: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
class GroupDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const isReady = state.params && state.params.mode === 'ready';

    return {
      title: `${navigation.state.params.title}`,
      headerRight: isReady ? (
        <View style={{ paddingRight: 10 }}>
          <Button title="Edit" onPress={state.params.edit} />
        </View>
      ) : (
        undefined
      ),
    };
  };

  constructor(props) {
    super(props);
    const { group } = this.props;
    this.state = {
      groupName: group.name,
      groupImage:group.photo,
    };
    this.edit = this.edit.bind(this);
  }

  componentDidMount() {
    const { groupName } = this.state;
    this.refreshNavigation(false);
  }

  componentWillUpdate(nextProps, nextState) {
    const { groupName } = this.state;
    const { group } = this.props;
    if (nextState.groupName.length !== groupName.length) {
      this.refreshNavigation(nextState.groupName.length && nextState.groupName !== group.name);
    }
  }

  keyExtractor = item => item.id.toString();

  renderItem = ({ item: user }) => (
    <View style={styles.user}>{}
      <Image style={styles.avatar} source={{ uri: user.photoprofile.url }} />
      <Text style={styles.username}>{user.username}</Text>
    </View>
  );

  deleteGroup = () => {
    const { deleteGroup, navigation } = this.props;
    deleteGroup(navigation.state.params.id)
      .then(() => {
        navigation.dispatch(resetAction);
      })
      .catch((e) => {
        console.log(e); // eslint-disable-line no-console
      });
  };

  leaveGroup = () => {
    const { leaveGroup, navigation } = this.props;
    leaveGroup({
      id: navigation.state.params.id,
      userId: 1,
    }) // fake user for now
      .then(() => {
        navigation.dispatch(resetAction);
      })
      .catch((e) => {
        console.log(e); // eslint-disable-line no-console
      });
  };
  pickGroupImage = () => {
    const {group} = this.props;
    const { 
      navigation: {navigate},
    } = this.props;
      navigate('GroupImage',{group:group});
 };
  
  edit = () => {
    const { groupName } = this.state;
    const { updateGroup, group, navigation : { navigate, dispatch } } = this.props;
  
    updateGroup({
      id: group.id,
      name: groupName,
      photo: group.photo
    }).then((res) => {
      dispatch(navigate('Chats', res));
    });
  };

  refreshNavigation(ready) {
    const { navigation } = this.props;
    const { groupName } = this.state;
    navigation.setParams({
      mode: ready ? 'ready' : undefined,
      edit: this.edit,
      groupName,
    });
  }

  onNameChange = (text) => {
    this.setState({
      groupName: text,
    });
  };

  render() {
    const { group, loading, navigation } = this.props;
    const { groupName } = this.state;
    // render loading placeholder while we fetch messages

    if (!group || loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.detailsContainer}>
        {group.users.length > 2 ?
          <TouchableOpacity style={styles.groupImageContainer} onPress={this.pickGroupImage}>
          {group.photo == undefined ?
            <Image style={styles.groupImage} source={{ uri: "http://blogs.grupojoly.com/la-sastreria/files/Manolo-Garc%C3%ADa.jpg"}} />
          : <Image style={styles.groupImage} source={{ uri: group.photo }} />}
            <Text>edit</Text>
          </TouchableOpacity>:
          <View style={styles.groupImageContainer}>
          {group.photo == undefined ?
            <Image style={styles.groupImage} source={{ uri: "http://blogs.grupojoly.com/la-sastreria/files/Manolo-Garc%C3%ADa.jpg" }} />
          : <Image style={styles.groupImage} source={{ uri: group.photo }} />}
          </View>
        }
        {group.users.length > 2 ? <View style={styles.groupNameBorder}>
            <TextInput
              style={styles.groupName}
              placeholder={`${group.name}`}
              value={groupName}
              onChangeText={text => this.onNameChange(text)}
            />
          </View>:
          <View style={styles.groupNameBorder}>
          <Text style={styles.groupName}>{groupName}</Text>
        </View>}
          
        </View>
        <FlatList
          data={group.users}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListHeaderComponent={() => (
            <View>
              <Text style={styles.participants}>
                {`participants: ${group.users.length}`.toUpperCase()}
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View>
              <Button title="Leave Group" onPress={this.leaveGroup} />
              <Button title="Delete Group" onPress={this.deleteGroup} />
            </View>
          )}
        />
      </View>
    );
  }
}
GroupDetails.propTypes = {
  loading: PropTypes.bool,
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    photo:PropTypes.string,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string,
        photoprofile: PropTypes.shape({
          id: PropTypes.number,
          url: PropTypes.string,
        }),
      }),
    ),
  }),
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        title: PropTypes.string,
        id: PropTypes.number,
      }),
    }),
  }),
  deleteGroup: PropTypes.func.isRequired,
  leaveGroup: PropTypes.func.isRequired,
  updateGroup: PropTypes.func.isRequired,
};
const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({ variables: { groupId: ownProps.navigation.state.params.id } }),
  props: ({ data: { loading, group } }) => ({
    loading,
    group,
  }),
});
const updateGroupMutation = graphql(EDIT_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    updateGroup: group => mutate({
      variables: { group },
      refetchQueries: [{ query: GROUP_QUERY }],
    }),
  }),
});
const deleteGroupMutation = graphql(DELETE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    deleteGroup: id => mutate({
      variables: { id },
      update: (store, { data: { deleteGroup } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: USER_QUERY, variables: { id: 1 } }); // fake for now
        // Add our message from the mutation to the end.
        data.user.groups = data.user.groups.filter(g => deleteGroup.id !== g.id);
        // Write our data back to the cache.
        store.writeQuery({
          query: USER_QUERY,
          variables: { id: 1 }, // fake for now
          data,
        });
      },
    }),
  }),
});
const leaveGroupMutation = graphql(LEAVE_GROUP_MUTATION, {
  props: ({ mutate }) => ({
    leaveGroup: ({ id, userId }) => mutate({
      variables: { id, userId },
      update: (store, { data: { leaveGroup } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: USER_QUERY, variables: { id: 1 } }); // fake for now
        // Add our message from the mutation to the end.
        data.user.groups = data.user.groups.filter(g => leaveGroup.id !== g.id);
        // Write our data back to the cache.
        store.writeQuery({
          query: USER_QUERY,
          variables: { id: 1 }, // fake for now
          data,
        });
      },
    }),
  }),
});
export default compose(
  updateGroupMutation,
  groupQuery,
  deleteGroupMutation,
  leaveGroupMutation,
)(GroupDetails);
