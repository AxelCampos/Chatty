import React, { Component } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import styles from './styles';
import Header from './header';
import UserChosen from './user-chosen';

class LifestyleResult extends Component {
  constructor(props) {
    super(props);
    // const { users } = props;
    // const { navigation } = this.props;
    const { state } = this.props.navigation;
    // console.log('gender en constructor: ', state.params.gender);
    // console.log('civilStatus en constructor: ', state.params.civilStatus);
    // console.log('children en constructor: ', state.params.children);
    this.state = {
      userId: state.params.userId,
      gender: state.params.gender,
      civilStatus: state.params.civilStatus,
      children: state.params.children,
      name: '',
      hide: true,
      disabled: true,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userId !== this.props.navigation.state.params.userId) {
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
      // console.log('name', this.state.name);
      if (this.state.name !== '') {
        this.setState({ disabled: false });
        // console.log('lleno');
      }
      if (this.state.name === '') {
        this.setState({ disabled: true });
        // console.log('vacío');
      }
    }
  }

  keyExtractor = item => item.id.toString();

  renderItem = ({ item }) => <UserChosen item={item} goToProfile={this.goToProfile(item)} />

  goToProfile = item => () => {
    const { navigation: { navigate } } = this.props;
    navigate('Profile', { userId: item.id });
  };

  goToMySearches = () => {
    const { navigation: { navigate } } = this.props;
    navigate('Searches', { userId: this.state.userId });
  };

  goToLifestyle = () => {
    const { navigation: { navigate } } = this.props;
    navigate('Lifestyle', {
      userId: this.state.userId,
      gender: this.state.gender,
      civilStatus: this.state.civilStatus,
      children: this.state.children,
    });
  };

  viewNameInput = () => {
    this.setState({ hide: false });
  };

  nameSearch = ({ name }) => {
    this.setState({ name });
  }

  saveSearch = () => {
    const {
      userId, gender, civilStatus, children, name,
    } = this.state;
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

  /* selectUsers = (item) => {
      console.log('state gender: ', this.state.gender);
      return (item.gender == this.state.gender) && (item.civilStatus == this.state.civilStatus) && (item.children == this.state.children);
  } */

  selectGender = (item) => {
    const { gender } = this.state;
    // console.log('gender final: ');
    if (gender == 'todos') {
      // console.log(item.username, item.gender);
      return item.gender == item.gender;
    } else {
      // console.log(item.username, item.gender);
      return item.gender == this.state.gender;
    }
  };

  selectCivilStatus = (item) => {
    const { civilStatus } = this.state;
    // console.log('civilStatus final: ');
    if (civilStatus == 'todos') {
      // console.log(item.username, item.civilStatus);
      return item.civilStatus == item.civilStatus;
    } else {
      // console.log(item.username, item.civilStatus);
      return item.civilStatus == this.state.civilStatus;
    }
  };

  selectChildren = (item) => {
    const { children } = this.state;
    // console.log('children final: ');
    if (children == 'todos') {
      // console.log(item.username, item.children);
      return item.children == item.children;
    } else {
      // console.log(item.username, item.children);
      return item.children == this.state.children;
    }
  };

  selectBlacklist = (item) => {
    const { user } = this.props;
    return user.miscreated.filter(dato => dato.id === item.id).length === 0;
  };

  render() {
    const { users } = this.props;
    // console.log('usuarios', users);
    return (
      <View style={styles.container}>
        <Header hide={this.state.hide} viewNameInput={this.viewNameInput} saveSearch={this.saveSearch} nameSearch={this.nameSearch} goToMySearches={this.goToMySearches} goToLifestyle={this.goToLifestyle} isdisabled={this.state.disabled} />
        <View style={styles.main}>
          <FlatList
            data={users.filter(item => item.id !== this.state.userId).filter(this.selectGender).filter(this.selectCivilStatus).filter(this.selectChildren).filter(this.selectBlacklist)}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            numColumns={2}
          />
        </View>
      </View>
    );
  }
}

export default LifestyleResult;
