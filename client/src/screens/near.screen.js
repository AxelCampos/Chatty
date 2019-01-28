import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { graphql, compose } from 'react-apollo';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import { USERS_QUERY } from '../graphql/users.query';
import withLoading from '../components/withLoading';
import DatePicker from 'react-native-datepicker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: 500,
    width: 400,
  }
});

//TODO: convert real directions into coordinates with Geolocation

class SingleMarker extends Component {
  constructor(props) {
    super(props);
  }

  goToProfile = (user) => () => {
    const { properties: { navigation: { navigate } } } = this.props;
    navigate('Profile', { userId: user.id });
  };

  render() {
    const { user } = this.props
    const aleatLat = Math.random() / 50;
    const aleatLong = Math.random() / 50;
    return (

      <Marker
        coordinate={{
          latitude: 40.416700 + aleatLat,
          longitude: -3.703700 + aleatLong,
        }}
        title={user.username}
        //description={"description"}
        onPress={this.goToProfile(user)}
      />
    );
  }
}

class Nearer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 40.416775,
        longitude: -3.703790,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      date: "2000-01-01",
    };
  }
  getPosition = () => {
    Geocoder.geocodeAddress('28231, Spain').then(res => {
      console.log(res);
      // res is an Array of geocoding object (see below)
    })
      .catch(err => console.log(err))
  }

  render() {
    const { users } = this.props;
    return (
      <View style={styles.container}>
        <DatePicker
          style={{ width: 200 }}
          date={this.state.date}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate="1920-01-01"
          maxDate="2005-01-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={(date) => { this.setState({ date: date }) }}
        />
        <Button
          title="test"
          onPress={this.getPosition}
        />
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={this.state.region}
          zoomEnabled={true}
        //onPress={this.onPress}
        >
          {users.map((user, index) => (
            <SingleMarker key={index} user={user} properties={this.props} />
          ))
          }
        </MapView>
      </View>
    );
  }
}

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