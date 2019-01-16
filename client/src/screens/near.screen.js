import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { graphql, compose } from 'react-apollo';

import { USERS_QUERY } from '../graphql/users.query';
import withLoading from '../components/withLoading';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  NearContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  userName: {
    fontWeight: 'bold',
    flex: 0.7,
  },
});
const Near = ({ users: { id, username } }) => (
  <TouchableHighlight key={id}>
    <View style={styles.NearContainer}>
      <Text style={styles.userName}>{username}</Text>
    </View>
  </TouchableHighlight>
);
Near.propTypes = {
  users: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }),
};
class Nearer extends Component {
  /* static navigationOptions = {
    title: '',
  }; */

  keyExtractor = item => item.id.toString();

  renderItem = ({ item }) => <Near users={item} />;

  render() {
    const { users } = this.props;

    return (
      <View>
        <FlatList
          data={users.slice().reverse()}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
Nearer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      album: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
        }),
      ),
    }),
  ),
};
const usersQuery = graphql(USERS_QUERY, {
  options: () => ({}), // fake the user for now
  props: ({ data: { users } }) => ({
    users: users || [],
  }),
});

export default compose(
  usersQuery,
  withLoading,
)(Nearer);
