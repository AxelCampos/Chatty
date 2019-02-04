/* import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Keyboard,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import RegisterForm from '../components/registerForm';

// create component
class Register extends Component {
  constructor(props) {
    super(props);

    this.imageHeight = new Animated.Value(100);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: 50,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: 100,
    }).start();
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.container}>
          <Text style={styles.text}>Welcome to LOVEO</Text>
          <View style={styles.container}>
            <Animated.Image
              source={require('../components/loveologo.jpg')}
              style={[styles.logo, { height: this.imageHeight }]}
            />
          </View>

          <View style={styles.formContainer}>
            <RegisterForm />
          </View>
        </View>
      </KeyboardAvoidingView>
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
  formContainer: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  logo: {
    width: 100,
  },
  text: {
    fontSize: 20,
    color: 'pink',
    marginTop: 15,
  },
  imageNormal: {
    height: 100,
  },
  imageSmall: {
    height: 50,
  },
});
export default Register; */
