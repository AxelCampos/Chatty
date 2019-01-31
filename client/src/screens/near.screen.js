import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Button,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
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
    //flex: 1,
    height: 550,
    width: 400,
  },
});

// TODO: convert real directions into coordinates with Geolocation

class SingleMarker extends Component {
  constructor(props) {
    super(props);
    const { item } = this.props;
    //console.log(user.city);
    this.state = {
      lng: null,
      lat: null,
    };
    Geocoder.geocodeAddress(item.city, ", España")
      .then((res) => {
        //console.log(user.city);
        //console.log(user.city, ": ", res[0].position.lng);
        if (res[0].position.lng) {
          this.setState({ lng: res[0].position.lng });
          //console.log('aqui');
        } else {
          this.setState({ lng: null });
          //console.log('ali');
        }
        if (res[0].position.lat) {
          this.setState({ lat: res[0].position.lat });
        } else {
          this.setState({ lat: null });
        }
        //console.log(this.state.lng);
        //console.log(this.state.lat);
      })
      .catch(err => console.log(err));
  }

  goToProfile = item => () => {
    const {
      properties: {
        navigation: { navigate },
      },
    } = this.props;
    navigate('Profile', { userId: item.id });
  };

  render() {
    const { item } = this.props;
    const { lng, lat } = this.state;
    //console.log(lat);
    //console.log(lng);
    if (lng && lat) {
      return (
        <Marker
          coordinate={{
            longitude: lng,
            latitude: lat,
          }}
          title={item.username}
          // description={"description"}
          onPress={this.goToProfile(item)}
        />
      );
    } else {
      return (
        <View />
      );
    }
  }
}
//TODO: insert a Component DidUpdate to change map position after receiving own user position.
class Nearer extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props;

    this.state = {
      region: {
        latitude: 40.416775,
        longitude: -3.70379,
        latitudeDelta: 0.8,
        longitudeDelta: 0.4,
      },
    };
    console.log(user);
    Geocoder.geocodeAddress(user.city, ", España")
      .then((res) => {
        //console.log(user.city, ": ", res[0].position.lng);
        if (res[0].position.lng) {
          this.setState({ longitude: res[0].position.lng });
          //console.log('aqui');
        } else {
          this.setState({ longitude: null });
          //console.log('ali');
        }
        if (res[0].position.lat) {
          this.setState({ latitude: res[0].position.lat });
        } else {
          this.setState({ latitude: null });
        }
        console.log(user.city);
        console.log(this.state.longitude);
        console.log(this.state.latitude);
      })
      .catch(err => console.log(err));
  }

  getPosition = () => {
    Geocoder.geocodeAddress('Fuenlabrada, España')
      .then((res) => {
        console.log(res);
        // res is an Array of geocoding object (see below)
      })
      .catch(err => console.log(err));
  };
  //<Button
  //title="test"
  //onPress={this.getPosition}
  ///>
  render() {
    const { user, users } = this.props;
    return (
      <View style={styles.container}>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={this.state.region}
          zoomEnabled
        // onPress={this.onPress}
        >
          {users.filter(item => item.id !== user.id).map((item, index) => (
            <SingleMarker key={index} item={item} properties={this.props} />
          ))}
        </MapView>
      </View>
    );
  }
}

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

const usersQuery = graphql(USERS_QUERY, {
  options: () => ({}), // fake the user for now
  props: ({ data: { users } }) => ({
    users: users || [],
  }),
});

export default compose(
  userQuery,
  usersQuery,
  withLoading,
)(Nearer);
