import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
  StyleSheet,
  StatusBar,
  onButtonPress,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// create a component
class LoginForm extends Component {
  render() {
    return (
      <View style={StyleSheet.container}>
        <View style={styles.icon}>
          <View style={styles.icons}>
            <Icon size={25} name="user" color="white" />
          </View>
          <TextInput
            style={styles.container}
            autoCapitalize="none"
            onSubmitEditing={() => this.passwordInput.focus()}
            autoCorrect={false}
            keyBoardType="email-address"
            returnKeyType="next"
            placeholder="Enter your email or username"
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.icon}>
          <View style={styles.icons}>
            <Icon size={25} name="lock" color="white" />
          </View>
          <TextInput
            style={styles.container}
            returnKeyType="go"
            ref={input => (this.passwordInput = input)}
            placeholder="Password"
            placeholderTextColor="white"
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={onButtonPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// defining styles
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  buttonContainer: {
    backgroundColor: '#981fa3',
    paddingVertical: 15,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  icon: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderRadius: 50,
    borderColor: 'white',
    marginBottom: 5,
  },
  icons: {
    marginTop: 10,
    marginLeft: 10,
  },
});
export default LoginForm;
