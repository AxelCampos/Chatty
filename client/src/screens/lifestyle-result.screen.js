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
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { graphql, compose } from 'react-apollo';
import { USERS_QUERY } from '../graphql/users.query';
import withLoading from '../components/withLoading';
import SEARCHES_QUERY from '../graphql/searches.query';
import CREATE_SEARCH_MUTATION from '../graphql/create-search.mutation';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'flex-start', //'center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'space-evenly', strech, baseline
        //alignItems: "flex-start", //'center', 'flex-start', 'flex-end', 'stretch', baseline,
        paddingTop: 10
    },
    header: {
        flex: 0.35,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    main: {
        flex: 0.65,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    sbutton1: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 6,
    },
    sbutton2: {
        justifyContent: 'space-evenly',
        padding: 6,
    },
    button1: {
        padding: 6,
        borderColor: '#eee',
        borderBottomWidth: 1,
        //position: 'absolute',
        //left: 30,
        //width: 150,
    },
    button2: {
        padding: 6,
        borderColor: '#eee',
        borderBottomWidth: 1,
        //position: 'absolute',
        //left: 250,
        //width: 150,
    },
    button3: {
        padding: 6,
        borderColor: '#eee',
        borderBottomWidth: 1,
        //position: 'absolute',
        //left: 250,
        //width: 150,
    },
    input: {
        marginBottom: 10,
        marginTop: 10,
        //marginLeft: 15,
        //marginRight: 15,
        height: 40,
        borderColor: '#c7d6db',
        borderWidth: 1,
        //borderRadius: 20,
        padding: 6,
        //width: 350,
    },
    /*title: {
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        height: 40,
        padding: 10,
        backgroundColor: '#c7d6db',
        borderRadius: 10,
        //color: '#7a42f4',
    },*/
    tendencyContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 160,
        height: 195,
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
        top: 147,
        left: 10,
        color: 'black',
    },
    userImage: {
        width: 150,
        height: 135,
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
    textLocation: {
        fontSize: 10,
        position: 'absolute',
        bottom: 5,
        left: 10,
    },
});

const MyView = (props) => {
    const { children, hide, style } = props;
    if (hide) {
        return null;
    }
    return (
        <View {...this.props} style={style}>
            {children}
        </View>
    );
};

const Search = ({ saveSearch, nameSearch, isdisabled }) => (
    <View>
        <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            //placeholderTextColor="#9a73ef"
            autoCapitalize="none"
            placeholder='nombre de la búsqueda'
            onChangeText={(name) => nameSearch({ name })}
        //value={country}
        />
        <Button disabled={isdisabled} style={styles.button3} title="OK" onPress={saveSearch} />
    </View>
);

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { saveSearch, viewNameInput, nameSearch, goToMySearches, hide, isdisabled } = this.props;
        return (
            <View style={styles.header}>
                <View style={styles.sbutton2}>
                    <Button style={styles.button2} title="Ver Mis Búsquedas" onPress={goToMySearches} />
                </View>
                <View style={styles.sbutton1}>
                    <Button style={styles.button1} title="Guardar" onPress={viewNameInput} />
                    <MyView hide={hide} >
                        <Search saveSearch={saveSearch} nameSearch={nameSearch} isdisabled={isdisabled} />
                    </MyView>
                </View>
            </View>
        )
    }
};

const UserChosen = ({ item, goToProfile }) => {
    //console.log(item.username, item.gender, item.civilStatus, item.children);
    return (
        <TouchableHighlight key={item.id} onPress={goToProfile}>
            <View style={styles.tendencyContainer}>
                <Image style={styles.userImage} source={{ uri: item.photoprofile.url }} />
                <View style={styles.userLikes}>
                    <Icon size={12} name="heart" color="#F0625A" />
                    <Text style={styles.textLikes}>{item.likes}</Text>
                </View>
                <Text style={styles.userName}>
                    {item.username} :
                {item.gender},
                {item.civilStatus},
                {item.children}
                </Text>
            </View>
        </TouchableHighlight>
    );
};

class LifestyleResult extends Component {
    static navigationOptions = () => ({
        title: 'Search Results'
    });

    constructor(props) {
        super(props);
        //const { users } = props;
        //const { navigation } = this.props;
        const { state } = this.props.navigation;
        //console.log('gender en constructor: ', state.params.gender);
        //console.log('civilStatus en constructor: ', state.params.civilStatus);
        //console.log('children en constructor: ', state.params.children);
        this.state = {
            userId: state.params.userId,
            gender: state.params.gender,
            civilStatus: state.params.civilStatus,
            children: state.params.children,
            name: "",
            hide: true,
            disabled: true,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.userId != this.props.navigation.state.params.userId) {
            this.setState({ userId: this.props.navigation.state.params.userId })
        }
        console.log('prevState', prevState.gender);
        console.log('prop', this.props.navigation.state.params.gender);
        if (prevState.gender != this.props.navigation.state.params.gender) {
            this.setState({ gender: this.props.navigation.state.params.gender })
        }
        if (prevState.civilStatus != this.props.navigation.state.params.civilStatus) {
            this.setState({ civilStatus: this.props.navigation.state.params.civilStatus })
        }
        if (prevState.children != this.props.navigation.state.params.children) {
            this.setState({ children: this.props.navigation.state.params.children })
        }
        if (prevState.name !== this.state.name) {
            //console.log('name', this.state.name);
            if (this.state.name !== "") {
                this.setState({ disabled: false });
                //console.log('lleno');
            }
            if (this.state.name === "") {
                this.setState({ disabled: true });
                //console.log('vacío');
            }
        }
    };

    keyExtractor = item => item.id.toString();

    renderItem = ({ item }) => <UserChosen item={item} goToProfile={this.goToProfile(item)} />

    goToProfile = item => () => {
        const { navigation: { navigate } } = this.props;
        navigate('Profile', { userId: item.id });
    };

    goToMySearches = () => {
        const { navigation: { navigate } } = this.props;
        navigate('MySearches', { userId: this.state.userId });
    };

    viewNameInput = () => {
        this.setState({ hide: false });
    };

    nameSearch = ({ name }) => {
        this.setState({ name: name });
    }

    saveSearch = () => {
        const { userId, gender, civilStatus, children, name } = this.state;
        const { createSearch } = this.props;
        createSearch({
            userId: userId,
            name: name,
            gender: gender,
            civilStatus: civilStatus,
            children: children,
        });
        this.setState({ hide: true });
        alert('Busqueda creada!');
    };

    /*selectUsers = (item) => {
        console.log('state gender: ', this.state.gender);
        return (item.gender == this.state.gender) && (item.civilStatus == this.state.civilStatus) && (item.children == this.state.children);
    }*/

    selectGender = (item) => {
        const { gender } = this.state;
        //console.log('gender final: ');
        if (gender == 'todos') {
            //console.log(item.username, item.gender);
            return item.gender == item.gender;
        } else {
            //console.log(item.username, item.gender);
            return item.gender == this.state.gender;
        }
    };
    selectCivilStatus = (item) => {
        const { civilStatus } = this.state;
        //console.log('civilStatus final: ');
        if (civilStatus == 'todos') {
            //console.log(item.username, item.civilStatus);
            return item.civilStatus == item.civilStatus;
        } else {
            //console.log(item.username, item.civilStatus);
            return item.civilStatus == this.state.civilStatus;
        }
    };
    selectChildren = (item) => {
        const { children } = this.state;
        //console.log('children final: ');
        if (children == 'todos') {
            //console.log(item.username, item.children);
            return item.children == item.children;
        } else {
            //console.log(item.username, item.children);
            return item.children == this.state.children;
        }
    };

    //data={users.filter(this.selectGender).filter(this.selectCivilStatus).filter(this.selectChildren)}

    render() {
        const { users } = this.props;
        //console.log('usuarios', users);
        return (
            <View style={styles.container}>
                <Header hide={this.state.hide} viewNameInput={this.viewNameInput} saveSearch={this.saveSearch} nameSearch={this.nameSearch} goToMySearches={this.goToMySearches} isdisabled={this.state.disabled} />
                <View style={styles.main}>
                    <FlatList
                        data={users.filter((item) => item.id != this.state.userId).filter(this.selectGender).filter(this.selectCivilStatus).filter(this.selectChildren)}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                        numColumns={2}
                    />
                </View>
            </View>
        );
    }
}

const createSearchMutation = graphql(CREATE_SEARCH_MUTATION, {
    props: ({ mutate }) => ({
        createSearch: search => mutate({
            variables: { search },
            refetchQueries: [{ query: SEARCHES_QUERY }]
            /*,
        update: (store, { data: { searchGroup } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: USER_QUERY, variables: { id: group.userId } });
          // Add our message from the mutation to the end.
          data.user.groups.push(createGroup);
          // Write our data back to the cache.
          store.writeQuery({
            query: USER_QUERY,
            variables: { id: group.userId },
            data,
          });
        },*/
        }),
    }),
});

const usersQuery = graphql(USERS_QUERY, {
    options: () => ({}), // fake the user for now
    props: ({ data: { users } }) => ({
        users: users || [],
    }),
});

const searchesQuery = graphql(SEARCHES_QUERY, {
    options: () => ({}),
    /*options: (ownProps) => ({
        variables: {
            id: ownProps.navigation.state.params.userId,
        },
    }),*/
    props: ({ data: { searches } }) => ({
        searches: searches || [],
    }),
});

export default compose(
    createSearchMutation,
    searchesQuery,
    usersQuery,
    withLoading,
)(LifestyleResult);