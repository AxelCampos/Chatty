import PropTypes from 'prop-types';
import { NavigationActions, StackActions } from 'react-navigation';
import React, { Component } from 'react';
import {
  TouchableHighlight, View, Text, StyleSheet, FlatList, Image,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { USER_QUERY } from '../graphql/user.query';
import withLoading from './withLoading';

const styles = StyleSheet.create({
  albumContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
  photoContainer: {
    width: 160,
    height: 180,
    alignItems: 'center',
    backgroundColor: '#F3E7E4',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    margin: 10,
  },
  userImage: {
    width: 150,
    height: 135,
    borderRadius: 10,
  },
});
const Photo = ({ album: { id, url } }) => (
  <TouchableHighlight key={id} underlayColor="transparent">
    <View style={styles.photoContainer}>
      <Image style={styles.userImage} source={{ uri: url }} />
    </View>
  </TouchableHighlight>
);
Photo.propTypes = {
  album: PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string,
  }),
};
class Album extends Component {
  constructor(props) {
    super(props);
  }

  keyExtractor = item => item.id.toString();

  renderItem = ({ item: album }) => <Photo album={album} />;

  tabHandler = () => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Album' })],
      }),
    );
  };

  render() {
    const { user } = this.props;

    if (!user) {
      return;
    }
    return (
      <View style={styles.albumContainer}>
        {user ? (
          <FlatList
            data={user.album.slice()}
            numColumns={2}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        ) : null}
      </View>
    );
  }
}

Album.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    album: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ),
  }),
};

const userQuery = graphql(USER_QUERY, {
  options: () => ({
    variables: {
      id: 1,
    },
  }),

  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

export default compose(
  userQuery,
  withLoading,
)(Album);
