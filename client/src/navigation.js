import React, { Component } from 'react';
import {
  StackActions,
  NavigationActions,
  createStackNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Text, View, StyleSheet, BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import Groups from './screens/groups.screen';
import Messages from './screens/messages.screen';
import User from './screens/user.screen';
import Nearer from './screens/near.screen';
import Tendencies from './screens/tendencies.screen';
import ShowPhoto from './screens/photos.screen';
import Profile from './screens/profile.screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
const TestScreen = title => () => (
  <View style={styles.container}>
    <Text>{title}</Text>
  </View>
);
const Search = createMaterialTopTabNavigator(
  {
    Tendencias: {
      screen: Tendencies,
    },
    Cerca: {
      screen: Nearer,
    },
    Nuevo: {
      screen: ShowPhoto,
    },
  },
  {
    initialRouteName: 'Tendencias',
    activeColor: 'black',
  },
);

// tabs in main screen
const MainScreenNavigator = createMaterialBottomTabNavigator(
  {
    Search: {
      screen: Search,
      navigationOptions: {
        tabBarIcon: () => <Icon size={20} name="search" color="red" />,
        tabBarColor: 'blue',
      },
    },

    Match: {
      screen: TestScreen('Match'),
      navigationOptions: {
        tabBarIcon: () => <Icon size={20} name="burn" color="red" />,
        tabBarColor: 'pink',
      },
    },

    Chats: {
      screen: Groups,
      navigationOptions: {
        tabBarIcon: () => <Icon size={20} name="rocketchat" color="red" />,
        tabBarColor: 'green',
      },
    },

    User: {
      screen: User,
      navigationOptions: {
        tabBarIcon: () => <Icon size={20} name="user" color="red" />,
        tabBarColor: 'orange',
      },
    },

    Settings: {
      screen: TestScreen('Settings'),
      navigationOptions: {
        tabBarIcon: () => <Icon size={20} name="cog" color="red" />,
        tabBarColor: 'violet',
      },
    },
  },
  {
    initialRouteName: 'Chats',

    activeColor: 'black',

    inactiveColor: 'white',
  },
);

const AppNavigator = createStackNavigator(
  {
    Main: { screen: MainScreenNavigator },
    Messages: { screen: Messages },
    Profile: { screen: Profile },
  },
  {
    navigationOptions: {
      title: 'Loveo',
    },
  },
);

// reducer initialization code
const initialState = AppNavigator.router.getStateForAction(
  StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'Main',
      }),
    ],
  }),
);
export const navigationReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};
// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
export const navigationMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);
const App = reduxifyNavigator(AppNavigator, 'root');
const mapStateToProps = state => ({
  state: state.nav,
});

class AppWithBackPress extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    return <App {...this.props} />;
  }
}
const AppWithNavigationState = connect(mapStateToProps)(AppWithBackPress);

export default AppWithNavigationState;
