import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoginForm from '../components/loginForm';

// create component
class Login extends Component {
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
          <LoginForm />
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
    backgroundColor: '#ce2568',
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
export default Login;
