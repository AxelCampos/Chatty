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
  keyExtractor = item => item.id.toString();

  goToProfiles = user => () => {
    const {
      navigation: { navigate },
    } = this.props;

    navigate('Profile', { userId: user.id });
  };

  renderItem = ({ item }) => (
    <Tendency
      users={item}
      goToProfiles={this.goToProfiles(item)}
      reduceString={this.reduceString}
    />
  );

  compare = (a, b) => b.likes - a.likes;

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

  render() {
    const { users } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          data={users.sort(this.compare).slice()}
          numColumns={2}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
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
};
export default Tendencies;