import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableHighlight,
    TouchableOpacity,
    Picker,
    ScrollView,
    Image,
    Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { graphql, compose } from 'react-apollo';
import { USERS_QUERY } from '../graphql/users.query';
import withLoading from '../components/withLoading';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'flex-start', //'center', 'flex-start', 'flex-end', 'space-around', 'space-between'
        //alignItems: "flex-start", //'center', 'flex-start', 'flex-end', 'stretched'
        paddingTop: 10
    },
    main: {
        flex: 0.9,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 5,
    },
    submit: {
        flex: 0.1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 15,
    },
    title: {
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        height: 40,
        padding: 10,
        //backgroundColor: '#c7d6db',
        borderRadius: 10,
        //color: '#7a42f4',
        width: 200,
    },
    label: {
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 15,
        marginRight: 15,
        height: 30,
        padding: 3,
        paddingLeft: 10,
        backgroundColor: '#c7d6db',
        borderRadius: 10,
        //color: '#7a42f4',
        width: 200,
    },
    picker: {
        marginBottom: 15,
        marginTop: 0,
        marginLeft: 15,
        marginRight: 15,
        borderColor: '#9cb1b7',
        height: 30,
        borderRadius: 10,
        padding: 3,
        paddingLeft: 10,
        //color: '#7a42f4',
        width: 200,
    },
    submitButton: {
        backgroundColor: '#9cb1b7',
        padding: 10,
        margin: 15,
        height: 40,
        borderRadius: 20,
        width: 200,
    },
    submitButtonText: {
        textAlign: 'center',
    },
});

class Lifestyle extends Component {
    constructor(props) {
        super(props);
        const { users } = props;
        this.state = {
            gender: 'hombre',
            civilStatus: 'soltero',
            children: 'no tiene hijos',
        }
    }

    keyExtractor = item => item.id.toString();

    renderItem = ({ item }) => <UserChosen item={item} goToProfile={this.goToProfile(item)} />

    goToResult = users => () => {
        const { navigation: { navigate } } = this.props;
        navigate('LifestyleResult', { users: users });
    }

    selectGender = (item) => {
        return item.gender == this.state.gender;
    }
    selectCivilStatus = (item) => {
        return item.civilStatus == this.state.civilStatus;
    }
    selectChildren = (item) => {
        return item.children == this.state.children;
    }

    render() {

        const { users } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.main}>
                    <ScrollView >
                        <Text style={styles.title}>Preferencias de Búsqueda </Text>
                        <Text style={styles.label}>por Genero: </Text>
                        <Picker style={styles.picker} selectedValue={this.state.gender} onValueChange={(gender) => this.setState({ gender })}>
                            <Picker.Item label='hombre' value='hombre' />
                            <Picker.Item label='mujer' value='mujer' />
                            <Picker.Item label='otro' value='otro' />
                        </Picker>
                        <Text style={styles.label}>Estado Civil: </Text>
                        <Picker style={styles.picker} selectedValue={this.state.civilStatus} onValueChange={(civilStatus) => this.setState({ civilStatus })}>
                            <Picker.Item label='soltero' value='soltero' />
                            <Picker.Item label='divorciado' value='divorciado' />
                            <Picker.Item label='separado' value='separado' />
                            <Picker.Item label='casado' value='casado' />
                            <Picker.Item label='viudo' value='viudo' />
                            <Picker.Item label='no especificado' value='no especificado' />
                        </Picker>
                        <Text style={styles.label}>por Tener o no Tener Hijos: </Text>
                        <Picker style={styles.picker} selectedValue={this.state.children} onValueChange={(children) => this.setState({ children })}>
                            <Picker.Item label='no tiene hijos' value='no tiene hijos' />
                            <Picker.Item label='tiene hijos' value='tiene hijos' />
                            <Picker.Item label='no especificado' value='no especificado' />
                        </Picker>
                    </ScrollView>
                </View>
                <View style={styles.submit}>
                    <TouchableOpacity style={styles.submitButton} onPress={this.goToResult(users)} >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}

/*Lifestyle.propTypes = {
    navigation: PropTypes.shape({
        navitate: PropTypes.func,
    }),
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            username: PropTypes.string,
            album: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.number,
                }),
            ),
        }),
    ),
};*/

const usersQuery = graphql(USERS_QUERY, {
    options: () => ({}), // fake the user for now
    props: ({ data: { users } }) => ({
        users: users || [],
    }),
});

export default compose(
    usersQuery,
    withLoading,
)(Lifestyle);