import React, { Component } from "react";
import R from "ramda";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationActions } from "react-navigation";

import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome5";
import { setCurrentUser } from "../actions/auth.actions";
import LOGIN_MUTATION from "../graphql/login.mutation";
import SIGNUP_MUTATION from "../graphql/signup.mutation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#bd30f4",
    paddingHorizontal: 50
  },
  logo: {
    marginBottom: 100,
    marginLeft: 100,
    width: 100,
    height: 100
  },
  inputContainer: {
    marginBottom: 20
  },
  button: {
    flex: 0.1,
    backgroundColor: "#982bf2"
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 5,
    marginLeft: 125
  },
  userInput: {
    marginLeft: 25,
    color: "white",
    fontSize: 20,
    fontWeight: "700"
  },
  inputIcon: {
    marginTop: 17
  },
  textoIcon: {
    flexDirection: "row"
  },
  texto: {
    marginTop: 15,
    marginLeft: 10,
    color: "white",
    fontSize: 20,
    fontWeight: "700"
  },
  input: {
    height: 40,
    borderRadius: 20,
    marginVertical: 6,
    padding: 6,
    borderWidth: 2,
    borderColor: "white",
    color: "white"
  },
  loadingContainer: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12
  },
  switchAction: {
    paddingHorizontal: 4,
    color: "#02f747"
  },
  submit: {
    marginVertical: 6,
    borderWidth: 2,
    borderColor: "#17ed90"
  }
});

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

class Signin extends Component {
  static navigationOptions = {
    title: "Chatty",
    headerLeft: null
  };

  constructor(props) {
    super(props);

    if (props.auth && props.auth.jwt) {
      props.navigation.goBack();
    }

    this.state = {
      newInput: "a",
      view: "login",
      username: "kk",
      email: "kk@kk.es",
      password: "123"
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.jwt) {
      nextProps.navigation.goBack();
    }
  }

  login = () => {
    const { email, password, view } = this.state;
    const { login, dispatch } = this.props;

    this.setState({
      loading: true
    });

    login({ email, password })
      .then(({ data: { login: user } }) => {
        dispatch(setCurrentUser(user));
        this.setState({
          loading: false
        });
        dispatch(
          NavigationActions.navigate({
            routeName: "Main"
          })
        );
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        Alert.alert(`${capitalizeFirstLetter(view)} error`, error.message, [
          { text: "OK", onPress: () => console.log("OK pressed") }, // eslint-disable-line no-console
          {
            text: "Joputa",
            onPress: () => console.log("Forgot Pressed"),
            style: "cancel"
          } // eslint-disable-line no-console
        ]);
      });
  };

  signup = () => {
    const { view } = this.state;
    const { signup, dispatch } = this.props;
    this.setState({
      loading: true
    });
    const { username, email, password } = this.state;
    signup({ username, email, password })
      .then(({ data: { signup: user } }) => {
        dispatch(setCurrentUser(user));
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        Alert.alert(
          `${capitalizeFirstLetter(view)} error`,
          error.message,
          [{ text: "OK", onPress: () => console.log("OK pressed") }] // eslint-disable-line no-console
        );
      });
  };

  switchView = () => {
    const { view, newInput } = this.state;
    this.setState({
      view: view === "signup" ? "login" : "signup",
      newInput: newInput === "b" ? "a" : "b"
    });
  };

  render() {
    const { view, newInput, loading } = this.state;
    const jwt = R.path(["auth", "jwt"], this.props);

    return (
      <KeyboardAvoidingView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          undefined
        )}
        <View style={styles.inputContainer}>
          <View>
            {newInput === "b" ? (
              <View>
                <View style={styles.textoIcon}>
                  <Icon
                    size={22}
                    style={styles.inputIcon}
                    name="user"
                    color="white"
                  />
                  <Text style={styles.texto}>
                    Introduce tu nombre de usuario
                  </Text>
                </View>
                <TextInput
                  defaultValue="kk"
                  onChangeText={username => this.setState({ username })}
                  placeholder="Username"
                  style={styles.input}
                />
              </View>
            ) : (
              <Text />
            )}
          </View>
          <View style={styles.textoIcon}>
            <Icon size={22} style={styles.inputIcon} name="at" color="white" />
            <Text style={styles.texto}>Introduce tu email</Text>
          </View>
          <TextInput
            defaultValue="kk@kk.es"
            onChangeText={email => this.setState({ email })}
            placeholder="Email"
            style={styles.input}
          />
          <View style={styles.textoIcon}>
            <Icon
              size={22}
              style={styles.inputIcon}
              name="lock"
              color="white"
            />
            <Text style={styles.texto}>Introduce tu contraseña</Text>
          </View>

          <TextInput
            defaultValue="123"
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            secureTextEntry
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          onPress={this[view]}
          style={styles.button}
          disabled={loading || !!jwt}
        >
          <Text style={styles.buttonText}>
            {view === "signup" ? "Sign Up" : "Login"}
          </Text>
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <Text>
            {view === "signup" ? "Already have an account?" : "New to Chatty?"}
          </Text>
          <TouchableOpacity onPress={this.switchView}>
            <Text style={styles.switchAction}>
              {newInput === "b"}
              {view === "login" ? "Sign up" : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
Signin.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func
  }),
  auth: PropTypes.shape({
    loading: PropTypes.bool,
    jwt: PropTypes.string
  }),
  dispatch: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired
};

const login = graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: ({ email, password }) =>
      mutate({
        variables: { email, password }
      })
  })
});

const signup = graphql(SIGNUP_MUTATION, {
  props: ({ mutate }) => ({
    signup: ({ username, email, password }) =>
      mutate({
        variables: { username, email, password }
      })
  })
});
const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  login,
  signup,
  connect(mapStateToProps)
)(Signin);
