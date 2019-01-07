import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList, StyleSheet, Text, TouchableHighlight, View, Button, Image,
} from 'react-native';

import { Query } from 'react-apollo';

import { USER_QUERY } from '../graphql/user.query';
import withLoading from '../components/withLoading';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  main: {
    flex: 1,
    alignItems: 'center',
  },
  groupContainer: {
    width: 100,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    
    borderRadius: 50,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  groupName: {
    color:'white',
    borderRadius:10,
    marginHorizontal: 0.6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    fontWeight: 'bold',
    flex: 0.7,
    textAlign: 'center',
    marginTop: -10,
  },
  header: {
    alignItems: 'flex-end',
    padding: 6,
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
  warning: {
    textAlign: 'center',
    padding: 12,
  },
  image:{
    width:100,
    height:100,
    borderRadius:50,
  }
});

const Header = ({ onPress }) => (
  <View style={styles.header}>
    <Button title="New Group" onPress={onPress} />
  </View>
);
Header.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const Group = ({ goToMessages, group:{id, name, users, photo} }) => {
  
  return (
    
    <TouchableHighlight key={id} onPress={goToMessages}>
      <View>
        <View style={styles.groupContainer}>

        {photo != undefined ? <Image style={styles.image} source={{uri:photo}}></Image> :
         <Image style={styles.image} source={{uri:"http://blogs.grupojoly.com/la-sastreria/files/Manolo-Garc%C3%ADa.jpg"}}></Image> 
        }
           
      
        </View>
        <Text style={styles.groupName}>{name}</Text>
      </View>
    </TouchableHighlight>
  );
};
Group.propTypes = {
  goToMessages: PropTypes.func.isRequired,
  group: PropTypes.shape({
    photo: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
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
    navigate('Messages', { groupId: group.id, title: group.name ,photo:group.photo });
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
        photo:PropTypes.string,
        users: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.id,
            photoprofile:PropTypes.shape({
              id:PropTypes.number,
              url:PropTypes.string,
            }),
          }),
        ),
      }),
    ),
  }),
};
const GroupsWithLoading = withLoading(Groups);

const UserQuery = props => (
  <Query query={USER_QUERY} variables={{ id: 1 }}>
    {({ data }) => <GroupsWithLoading {...props} {...data} />}
  </Query>
);

export default UserQuery;