import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FlatList, StyleSheet, View,
} from 'react-native';
import Tendency from './tendency';


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
});

class Tendencies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingMoreEntries: false,
    };
  }

  onEndReached = () => {
    const { loadingMoreEntries } = this.state;
    const { loadMoreEntries, usersPage } = this.props;
    if (!loadingMoreEntries && usersPage.pageInfo.hasNextPage) {
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

  keyExtractor = item => item.node.id.toString();

  goToProfiles = user => () => {
    const {
      navigation: { navigate },
    } = this.props;

    navigate('Profile', { userId: user.id });
  };

  renderItem = ({ item }) => {
    const user = item.node;
    return (
      <Tendency
        users={user}
        goToProfiles={this.goToProfiles(user)}
        reduceString={this.reduceString}
      />
    );
  };

  reduceString = (a) => {
    let shortword = ' ';

    if (a.length >= 10) {
      for (let i = 0; i < 10; i++) {
        shortword += a.charAt(i);
      }
      shortword += '...';
    } else {
      shortword = a;
    }
    return shortword;
  };

  compare = (a, b) => b.node.likes - a.node.likes;

  render() {
    const { usersPage } = this.props;
    const data = usersPage.edges ? usersPage.edges.slice(0).sort(this.compare) : undefined;
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListEmptyComponent={<View />}
          onEndReachedThreshold={2}
          onEndReached={this.onEndReached}
        />
      </View>
    );
  }
}
Tendencies.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      country: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      likes: PropTypes.number.isRequired,
      photoprofile: PropTypes.shape({
        id: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired,
      }),
    }),
  ),
  usersPage: PropTypes.shape({
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
  loadMoreEntries: PropTypes.func,
};
export default Tendencies;
