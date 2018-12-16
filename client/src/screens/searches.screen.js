import React, { Component } from 'react';
import PropTypes, { node } from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableHighlight,
    Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { graphql, compose } from 'react-apollo';
import withLoading from '../components/withLoading';
import SEARCHES_QUERY from '../graphql/searches.query';
import DELETE_SEARCH_MUTATION from '../graphql/delete-search.mutation';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'flex-start', //'center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'space-evenly', strech, baseline
        //alignItems: "flex-start", //'center', 'flex-start', 'flex-end', 'stretch', baseline,
        paddingTop: 10
    },
    header: {
        flex: 0.15,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    main: {
        flex: 0.85,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    tendencyContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#F3E7E4',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        //borderRadius: 10,
        //paddingHorizontal: 12,
        //paddingVertical: 5,
        margin: 5,
    },
    sbutton: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 6,
    },
    button: {
        padding: 6,
        borderColor: '#eee',
        borderBottomWidth: 1,
        //position: 'absolute',
        //left: 30,
        //width: 150,
    },
    name: {
        height: 40,
        padding: 10,
    },
    icon: {
        backgroundColor: '#F3E7E4',
    },
});
//'plus-circle', 'times-circle','ban', <i class="far fa-times-circle"></i>
const Search = ({ item, goToSearch, deleteThisSearch }) => {
    //console.log('search name', item.name);
    return (
        <TouchableHighlight key={item.id} onPress={goToSearch} >
            <View style={styles.tendencyContainer}>
                <Text style={styles.name}>
                    Busqueda
                    {item.id}:
                    {item.name}
                </Text>

                <Icon.Button
                    name='times-circle'
                    color='red'
                    borderRadius={16}
                    //iconStyle={}
                    size={24}
                    style={styles.icon}
                    onPress={deleteThisSearch}
                />

            </View>
        </TouchableHighlight>
    );
};

const Header = ({ backToLifestyle }) => (
    <View style={styles.sbutton}>
        <Button style={styles.button} title="Hacer nueva Búsqueda" onPress={backToLifestyle} />
    </View>
);

/*const goToNewGroup = group => StackActions.reset({
    index: 1,
    actions: [
      NavigationActions.navigate({ routeName: 'Main' }),
      NavigationActions.navigate({
        routeName: 'Messages',
        params: { groupId: group.id, title: group.name },
      }),
    ],
  });*/

class MySearches extends Component {
    static navigationOptions = () => ({
        title: 'My Searches'
    });

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            userId: navigation.state.params.userId,
            gender: navigation.state.params.gender,
        }
    }

    keyExtractor = item => item.id.toString();

    renderItem = ({ item }) => <Search item={item} goToSearch={this.goToSearch(item)} deleteThisSearch={this.deleteThisSearch(item)} />

    goToSearch = item => () => {
        const { navigation: { navigate, state } } = this.props;
        navigate('LifestyleResult',
            {
                userId: state.params.userId,
                gender: item.gender,
                civilStatus: item.civilStatus,
                children: item.children,
            });
    };

    deleteThisSearch = item => () => {
        const { deleteSearch } = this.props;
        //console.log('delete item.id', item.id);
        deleteSearch(item.id);
        alert('Busqueda eliminada!');
    };

    backToLifestyle = () => {
        const { navigation: { navigate, state } } = this.props;
        navigate('Characteristic',
            {
                userId: state.params.userId,
            });
    }

    userFilter = item => {
        const { navigation } = this.props;
        const { userId } = this.state;
        //console.log('item id', item.userId.id);
        //console.log('userId', userId);
        return item.userId.id == userId;
    };

    render() {
        const { searches } = this.props;
        //const { user: { searches } } = this.props;
        /*if (!searches) {
            return null
        } else {*/
        return (
            <View style={styles.container}>
                <Header style={styles.header} backToLifestyle={this.backToLifestyle} />
                <View style={styles.main} >
                    <FlatList
                        data={searches.slice().filter(this.userFilter)}
                        //data={searches.slice().filter((item) => (item.id == this.state.userId))}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />
                </View>
            </View>
        );

    }
};

const deleteSearchMutation = graphql(DELETE_SEARCH_MUTATION, {
    props: ({ mutate }) => ({
        deleteSearch: id => mutate({
            variables: { id },
            refetchQueries: [{ query: SEARCHES_QUERY }] /*,
            update: (store, { data: { deleteSearch } }) => {
                // Read the data from our cache for this query.
                const data = store.readQuery({ query: SEARCH_QUERY, variables: { id: 1 } });
                // Add our message from the mutation to the end.
                data.search = data.search.filter(item => deleteSearch.id !== item.id);
                // Write our data back to the cache.
                store.writeQuery({
                    query: SEARCH_QUERY,
                    variables: { id: 1 },
                    data,
                });
            },*/
        }),
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
    deleteSearchMutation,
    searchesQuery,
    withLoading,
)(MySearches);