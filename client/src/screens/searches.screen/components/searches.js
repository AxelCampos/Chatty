import React, { Component } from 'react';
import {
    View,
    FlatList,
} from 'react-native';
import styles from './styles';
import Header from './header';
import Search from './search';

class Searches extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            userId: navigation.state.params.userId,
            gender: navigation.state.params.gender,
        };
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
        // console.log('delete item.id', item.id);
        deleteSearch(item.id);
        alert('Busqueda eliminada!');
    };

    backToLifestyle = () => {
        const { navigation: { navigate, state } } = this.props;
        navigate('Lifestyle',
            {
                userId: state.params.userId,
            });
    }

    userFilter = (item) => {
        const { userId } = this.state;
        // console.log('item id', item.userId.id);
        // console.log('userId', userId);
        return item.userId.id === userId;
    };

    render() {
        const { searches } = this.props;
        // const { user: { searches } } = this.props;
        /* if (!searches) {
            return null
        } else { */
        return (
            <View style={styles.container}>
                <Header style={styles.header} backToLifestyle={this.backToLifestyle} />
                <View style={styles.main}>
                    <FlatList
                        data={searches.slice().filter(this.userFilter)}
                        // data={searches.slice().filter((item) => (item.id == this.state.userId))}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />
                </View>
            </View>
        );

    }
};

export default Searches;
