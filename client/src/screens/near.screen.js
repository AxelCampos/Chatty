import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { graphql, compose } from 'react-apollo';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { USERS_QUERY } from '../graphql/users.query';
import { USER_QUERY } from '../graphql/user.query';
import withLoading from '../components/withLoading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    margin: 10,
    height: 300,
    width: 300,
  }
});

class Geolocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={this.state.region}
          zoomEnabled={true}
        />
      </View>
    );
  }
}

export default compose(
  //usersQuery,
  withLoading,
)(Geolocation);
