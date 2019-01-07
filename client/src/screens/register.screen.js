import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import RegisterForm from '../components/registerForm';

// create component
class Register extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to LOVEO</Text>
        <View style={styles.container}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require('../components/loveologo.jpg')}
          />
        </View>

        <View style={styles.formContainer}>
          <RegisterForm />
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
  text: {
    fontSize: 20,
    color: 'pink',
    marginTop: 15,
  },
});
export default Register;
