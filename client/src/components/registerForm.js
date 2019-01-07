import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { graphql, compose } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import CREATE_USER_MUTATION from '../graphql/create-user.mutation';

// create a component
class RegisterForm extends Component {
  constructor(props) {
    super(props);
  }

  // funcion de la mutasion
  mutasion = () => {
    const { createUser } = this.props;
    createUser(this.state)
      .then(() => {
        ToastAndroid.showWithGravity('Usuario creado!', ToastAndroid.SHORT, ToastAndroid.CENTER);
        const { navigate } = this.props.navigation;
        navigate('User');
      })
      .catch((error) => {
        Alert.alert('ERRORRRRR', error.message, [{ text: 'OK', onPress: () => {} }]);
      });
  };

  render() {
    return (
      <View style={StyleSheet.container}>
        <View style={styles.textIcon}>
          <Icon size={18} style={styles.icons} name="user-circle" color="white" />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onSubmitEditing={() => this.passwordInput.focus()}
            autoCorrect={false}
            keyBoardType="default"
            returnKeyType="next"
            placeholder="Enter your username "
            placeholderTextColor="white"
            onChangeText={username => this.setState({ username })}
          />
        </View>

        <View style={styles.textIcon}>
          <Icon size={18} style={styles.icons} name="at" color="white" />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onSubmitEditing={() => this.passwordInput.focus()}
            autoCorrect={false}
            keyBoardType="email-address"
            returnKeyType="next"
            placeholder="Enter your email"
            placeholderTextColor="white"
            onChangeText={email => this.setState({ email })}
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
            onChangeText={password => this.setState({ password })}
          />
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={this.mutasion}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const createUserMutation = graphql(CREATE_USER_MUTATION, {
  props: ({ mutate }) => ({
    createUser: user => mutate({
      variables: {
        user,
      },
    }),
  }),
});

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
    color: 'white',
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
export default compose(
  createUserMutation,
  withNavigation,
)(RegisterForm);
