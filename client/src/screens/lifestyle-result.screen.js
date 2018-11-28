import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableHighlight,
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
    header: {
        flex: 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    main: {
        flex: 0.9,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 5,
    },
    button1: {
        flex: 0.5,
        padding: 6,
        borderColor: '#eee',
        borderBottomWidth: 1,
        alignSelf: "center",
        marginLeft: 35,
        marginRight: 165,
        //position: 'absolute',
        //left: 30,
        //width: 150,
    },
    button2: {
        flex: 0.5,
        padding: 6,
        borderColor: '#eee',
        borderBottomWidth: 1,
        alignSelf: "center",
        //marginLeft: 20,
        position: 'absolute',
        left: 250,
        //width: 150,
    },
    title: {
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        height: 40,
        padding: 10,
        backgroundColor: '#c7d6db',
        borderRadius: 10,
        //color: '#7a42f4',
    },
    tendencyContainer: {
        flex: 1,
        width: 200,
        height: 190,
        alignItems: 'center',
        backgroundColor: '#F3E7E4',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 5,
        margin: 10,
    },
    userName: {
        fontSize: 12,
        position: 'absolute',
        top: 160,
        left: 10,
        color: 'black',
    },
    userImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
    },
    userLikes: {
        flexDirection: 'row',
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        width: 40,
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    textLikes: {
        color: 'white',
        marginLeft: 3,
    },
});

const Header = ({ saveSearch, goToMySearches }) => (
    <View style={styles.header}>
        <Button style={styles.button1} title="Salvar" onPress={saveSearch} />
        <Button style={styles.button2} title="Ver Búsquedas" onPress={goToMySearches} />
    </View>
);

const UserChosen = ({ item, goToProfile }) => {
    console.log(item.username, item.gender, item.civilStatus, item.children);
    return (
        <TouchableHighlight key={item.id} onPress={goToProfile}>
            <View style={styles.tendencyContainer}>
                <Image style={styles.userImage} source={{ uri: item.photoprofile.url }} />
                <View style={styles.userLikes}>
                    <Icon size={12} name="heart" color="#F0625A" />
                    <Text style={styles.textLikes}>{item.likes}</Text>
                </View>
                <Text style={styles.userName}>
                    {item.username} /
                {item.gender} /
                {item.civilStatus} /
                {item.children}
                </Text>
            </View>
        </TouchableHighlight>
    );
};

class LifestyleResult extends Component {
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

    goToProfile = item => () => {
        const { navigation: { navigate } } = this.props;
        navigate('Profile', { userId: item.id });
    };

    goToMySearches = () => {
        console.log('ali');
    };

    saveSearch = () => {
        console.log('aqui');
    };

    render() {
        //const { users: ownProps.navigation.state.params.users } = navigation
        const { users } = this.props;
        return (
            <View style={styles.container}>
                <Header saveSearch={this.saveSearch} goToMySearches={this.goToMySearches} />
                <View style={styles.main}>
                    <FlatList
                        data={users}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    //numColumns={2}
                    />
                </View>
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
)(LifestyleResult);