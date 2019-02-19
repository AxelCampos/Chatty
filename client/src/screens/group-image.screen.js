import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  TouchableHighlight, View, StyleSheet, FlatList, Image,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { USER_QUERY } from '../graphql/user.query';
import EDIT_GROUP_MUTATION from '../graphql/edit-group.mutation';
import GROUP_QUERY from '../graphql/group.query';

const mapStateToProps = ({ auth }) => ({
  auth,
});

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
const Photo = ({ album: { id, url }, selected }) => (
  <TouchableHighlight key={id} underlayColor="transparent" onPress={() => selected(url)}>
    <View style={styles.photoContainer}>
      <Image style={styles.userImage} source={{ uri: url }} />
    </View>
  </TouchableHighlight>
);
Photo.propTypes = {
  selected: PropTypes.func,
  album: PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string,
  }),
};
class GroupImage extends Component {
  selected = (url) => {
    const {
      navigation: { navigate, dispatch },
      updateGroup,
    } = this.props;

    updateGroup({
      id: this.props.navigation.state.params.group.id,
      name: this.props.navigation.state.params.group.name,
      photo: url,
    }).then((res) => {
      dispatch(navigate('GroupDetails', res));
    });
  };

  keyExtractor = item => item.id.toString();

  renderItem = ({ item: album }) => <Photo album={album} selected={this.selected} />;

  render() {
    const { user } = this.props;

    if (!user) {
      return;
    }
    return (
      <View style={styles.albumContainer}>
        <FlatList
          data={user.album.slice()}
          numColumns={2}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

GroupImage.propTypes = {
  updateGroup: PropTypes.func,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
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
  options: ownProps => ({
    variables: {
      id: ownProps.auth.id,
    },
  }),

  props: ({ data: { loading, user } }) => ({
    loading,
    user,
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

const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({ variables: { groupId: ownProps.navigation.state.params.id } }),
  props: ({ data: { loading, group } }) => ({
    loading,
    group,
  }),
});

export default compose(
  connect(mapStateToProps),
  userQuery,
  updateGroupMutation,
  groupQuery,
)(GroupImage);
