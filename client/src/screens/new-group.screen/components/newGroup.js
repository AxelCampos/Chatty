import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator, Button, StyleSheet, View, Alert,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import AlphabetListView from 'react-native-alpha-listview';

import SelectedUserList from '../../../components/selected-user-list.component';
import Cell from './cell';
import SectionHeader from './sectionHeader';
import SectionItem from './sectionItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  selected: {
    flexDirection: 'row',
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
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

class NewGroup extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const isReady = state.params && state.params.mode === 'ready';
    return {
      title: 'New Group',
      headerRight: isReady ? (
        <View style={{ paddingRight: 10 }}>
          <Button title="Next" onPress={state.params.finalizeGroup} />
        </View>
      ) : (
        undefined
      ),
    };
  };

  constructor(props) {
    super(props);
    const {
      navigation: {
        state: { params },
      },
    } = this.props;
    const { selected } = params || { selected: [] };
    this.state = {
      selected: selected || [],
      friends: props.user
        ? R.groupBy(friend => friend.username.charAt(0).toUpperCase(), props.user.friends)
        : [],
    };
  }

  componentDidMount() {
    const { selected } = this.state;
    this.refreshNavigation(selected);
  }

  componentWillReceiveProps(nextProps) {
    const { user } = this.props;
    const state = {};
    if (nextProps.user && nextProps.user.friends && nextProps.user !== user) {
      state.friends = R.groupBy(
        friend => friend.username.charAt(0).toUpperCase(),
        nextProps.user.friends,
      );
    }
    if (nextProps.selected) {
      Object.assign(state, {
        selected: nextProps.selected,
      });
    }
    this.setState(state);
  }

  componentWillUpdate(nextProps, nextState) {
    const { selected } = this.state;
    if (!!selected.length !== !!nextState.selected.length) {
      this.refreshNavigation(nextState.selected);
    }
  }

  refreshNavigation = (selected) => {
    const { navigation } = this.props;
    navigation.setParams({
      mode: selected && selected.length ? 'ready' : undefined,
      finalizeGroup: this.finalizeGroup,
    });
  };

  finalizeGroup = () => {
    const {
      navigation: { navigate, dispatch },
      user,
      createConversation,
    } = this.props;
    const { selected } = this.state;

    if (selected.length >= 2) {
      navigate('FinalizeGroup', {
        selected,
        friendCount: user.friends.length,
        userId: user.id,
      });
    } else {
      createConversation({
        name: selected[0].username,
        userIds: selected[0].id,
        userId: 1,
        photo: selected[0].photoprofile.url,
      })
        .then((res) => {
          dispatch(goToNewGroup(res.data.createConversation));
        })
        .catch((error) => {
          Alert.alert('Error Creating New Group', error.message, [
            { text: 'OK', onPress: () => {} },
          ]);
        });
    }
  };

  isSelected = (user) => {
    const { selected } = this.state;
    return ~selected.indexOf(user);
  };

  toggle = (user) => {
    const { selected } = this.state;
    const index = selected.indexOf(user);
    this.setState({
      selected: ~index ? selected.filter((_, i) => i !== index) : [...selected, user],
    });
  };

  render() {
    const { user, loading } = this.props;
    const { selected, friends } = this.state;

    // render loading placeholder while we fetch messages
    if (loading || !user) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {selected.length ? (
          <View style={styles.selected}>
            <SelectedUserList data={selected} remove={this.toggle} />
          </View>
        ) : (
          undefined
        )}
        {R.keys(friends).length ? (
          <AlphabetListView
            style={{ flex: 1 }}
            data={friends}
            cell={Cell}
            cellHeight={30}
            cellProps={{
              isSelected: this.isSelected,
              toggle: this.toggle,
            }}
            sectionListItem={SectionItem}
            sectionHeader={SectionHeader}
            sectionHeaderHeight={22.5}
          />
        ) : (
          undefined
        )}
      </View>
    );
  }
}
NewGroup.propTypes = {
  createConversation: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setParams: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.object,
    }),
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
    friends: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        username: PropTypes.string,
        photoprofile: PropTypes.shape({
          url: PropTypes.string,
        }),
      }),
    ),
  }),
  selected: PropTypes.arrayOf(PropTypes.object),
};
export default NewGroup;
