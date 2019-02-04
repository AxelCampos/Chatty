/* import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoginForm from '../components/loginForm';

import { setCurrentUser } from '../actions/auth.actions';
import LOGIN_MUTATION from '../graphql/login.mutation';

// create component
function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}
class Login extends Component {
  login = () => {
    const { email, password, view } = this.state;
    const { login, dispatch } = this.props;

    this.setState({
      loading: true,
    });

    login({ email, password })
      .then(({ data: { login: user } }) => {
        dispatch(setCurrentUser(user));
        this.setState({
          loading: false,
        });
        dispatch(
          NavigationActions.navigate({
            routeName: 'Main',
          }),
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        Alert.alert(`${capitalizeFirstLetter(view)} error`, error.message, [
          { text: 'OK', onPress: () => console.log('OK pressed') }, // eslint-disable-line no-console
          {
            text: 'Forgot password',
            onPress: () => console.log('Forgot Pressed'),
            style: 'cancel',
          }, // eslint-disable-line no-console
        ]);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require('../components/loveologo.jpg')}
          />
        </View>

        <View style={styles.formContainer}>
          <LoginForm login={this.login} />
        </View>
      </View>
    );
  }
}

// defining styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple',
  },
  loginContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    width: 400,
    height: 100,
  },
});
const login = graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: ({ email, password }) => mutate({
      variables: { email, password },
    }),
  }),
});
const mapStateToProps = ({ auth }) => ({
  auth,
});
export default compose(
  login,
  connect(mapStateToProps),
)(Login); */
