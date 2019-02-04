import React from 'react';
import {
  View, Text, TextInput, TouchableHighlight, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { withNavigation } from 'react-navigation';
// defining styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  buttonContainer: {
    backgroundColor: '#c10bb7',
    paddingVertical: 15,
    borderRadius: 40,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  input: {
    marginLeft: 10,
  },
  icons: {
    marginTop: 15,
    marginLeft: 20,
  },
  textIcon: {
    flexDirection: 'row',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 10,
  },
});
const LoginForm = login => (
  <View style={StyleSheet.container}>
    <View style={styles.textIcon}>
      <Icon size={18} style={styles.icons} name="user" color="white" />
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        onSubmitEditing={() => this.passwordInput.focus()}
        autoCorrect={false}
        keyBoardType="email-address"
        returnKeyType="next"
        placeholder="Enter your email or username"
        placeholderTextColor="white"
      />
    </View>
    <View style={styles.textIcon}>
      <Icon size={18} style={styles.icons} name="lock" color="white" />
      <TextInput
        style={styles.input}
        returnKeyType="go"
        ref={input => (this.passwordInput = input)}
        placeholder="Password"
        placeholderTextColor="white"
        secureTextEntry
      />
    </View>
    <TouchableHighlight style={styles.buttonContainer} onPress={() => login}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableHighlight>
  </View>
);
const mapStateToProps = ({ auth }) => ({
  auth,
});

export default withNavigation(LoginForm);
