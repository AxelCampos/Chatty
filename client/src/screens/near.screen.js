import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Button,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import { USERS_MAP_QUERY } from '../graphql/users-map.query';
import { USER_MAP_QUERY } from '../graphql/user-map.query';
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

class SingleMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: null,
            lat: null,
        };
    }

    componentDidMount() {
        const { item } = this.props;
        Geocoder.geocodeAddress(item.city, ", España")
            .then((res) => {
                if (res[0].position.lng) {
                    this.setState({ lng: res[0].position.lng });
                } else {
                    this.setState({ lng: null });
                    console.log("error: ", item.username, ": ", item.city);
                }
                if (res[0].position.lat) {
                    this.setState({ lat: res[0].position.lat });
                } else {
                    console.log("error: ", item.username, ": ", item.city);
                }
            })
            .catch(err => {
                console.log(err);
            });
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
        console.log(item.id, item.username, ": ", lng, lat);
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

class UserMarker extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user, lng, lat } = this.props;
        //console.log(user.id, user.username, ": ", lng, lat);
        if (lng && lat && user.username) {
            return (
                <Marker
                    coordinate={{
                        longitude: lng,
                        latitude: lat,
                    }}
                    title={user.username}
                    pinColor={'blue'}
                />
            );
        } else {
            return (
                <View />
            );
        }
    }
}

class Nearer extends Component {
    constructor(props) {
        super(props);
        const { user } = this.props;

        this.state = {
            latitude: 40.416775,
            longitude: -3.70379,
            latitudeDelta: 2.0,
            longitudeDelta: 1.0,
            userLatitude: null,
            userLongitude: null,
        };
        console.log(user.city);
        Geocoder.geocodeAddress(user.city, ", España")
            .then((res) => {
                if (res[0].position.lng) {
                    this.setState({ longitude: res[0].position.lng });
                    this.setState({ userLongitude: res[0].position.lng });
                } else {
                    console.log("error: ", user.username, ": ", user.city);
                }
                if (res[0].position.lat) {
                    this.setState({ latitude: res[0].position.lat });
                    this.setState({ userLatitude: res[0].position.lat });
                } else {
                    console.log("error: ", user.username, ": ", user.city);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    /*getPosition = () => {
        Geocoder.geocodeAddress('Manzanares el Real, España')
            .then((res) => {
                console.log(res);
                // res is an Array of geocoding object (see below)
            })
            .catch(err => console.log(err));
    };*/
    userFilter = item => {
        const { user } = this.props;
        if (user) {
            return item.id !== user.id;
        } else {
            1 === 1;
        }
    }

    userKey = () => {
        const { user } = this.props;
        if (user) {
            return user.id.toString();
        } else {
            return '1';
        }
    }

    //<UserMarker key={this.userKey} user={user} lng={this.state.userLongitude} lat={this.state.userLatitude} />

    render() {
        const { user, users } = this.props;
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: this.state.latitudeDelta,
                        longitudeDelta: this.state.longitudeDelta,
                    }}
                    zoomEnabled
                //onPress={this.getPosition}
                >
                    {
                        user ? <UserMarker key={this.userKey} user={user} lng={this.state.userLongitude} lat={this.state.userLatitude} /> : <View></View>
                    }

                    {
                        users.filter(this.userFilter).map((item) => (
                            <SingleMarker key={item.id} item={item} properties={this.props} />
                        ))
                    }
                </MapView>
            </View>
        );
    }
}

const userQuery = graphql(USER_MAP_QUERY, {
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

const usersQuery = graphql(USERS_MAP_QUERY, {
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

/*const Nearer = () => (
    <View>
        <Text>Fixing</Text>
    </View>
);

export default Nearer;*/
