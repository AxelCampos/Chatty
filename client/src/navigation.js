import React, { Component } from 'react';
import {
  StackActions,
  NavigationActions,
  createStackNavigator,
  createMaterialTopTabNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

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
import Lifestyle from './screens/lifestyle.screen';
import Profile from './screens/profile.screen';
import Match from './screens/match.screen';
import NewGroup from './screens/new-group.screen';
import FinalizeGroup from './screens/finalize-group.screen';
import GroupDetails from './screens/group-details.screen';
import Settings from './screens/setting.screen';
import EditProfile from './screens/edit-profile.screen';
import LifestyleResult from './screens/lifestyle-result.screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tabText: {
    color: '#777',
    fontSize: 10,
    justifyContent: 'center',
  },
  selected: {
    color: 'blue',
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
    Lifestyle: {
      screen: Lifestyle,
    },
  },
  {
    initialRouteName: 'Tendencias',
    activeColor: 'black',
  },
);

// tabs in main screen
const MainScreenNavigator = createBottomTabNavigator(
  {
    Search: {
      screen: Search,
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: ({ tintColor }) => <Icon size={20} name="search" color={tintColor} />,
        tabBarColor: 'blue',
      },
    },

    Match: {
      screen: Match,
      navigationOptions: {
        tabBarLabel: 'Match',
        tabBarIcon: ({ tintColor }) => <Icon size={20} name="burn" color={tintColor} />,
        tabBarColor: 'pink',
      },
    },

    Chats: {
      screen: Groups,
      navigationOptions: {
        tabBarLabel: 'Chats',
        tabBarIcon: ({ tintColor }) => <Icon size={20} name="rocketchat" color={tintColor} />,
        tabBarColor: 'green',
      },
    },

    User: {
      screen: User,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => <Icon size={20} name="user" color={tintColor} />,
        tabBarColor: 'orange',
      },
    },

    Settings: {
      screen: Settings,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => <Icon size={20} name="cog" color={tintColor} />,
        tabBarColor: 'violet',
      },
    },
  },
  {
    initialRouteName: 'Chats',
    navigationOptions: {
      tabBarVisible: true,
    },
    tabBarOptions: {
      activeTintColor: 'black',
      activeBackgroundColor: '#A5DFF1',
      inactiveBackgroundColor: '#52ABD8',
      inactiveTintColor: '#D3BCDD',
      tabStyle: {
        borderTopColor: 'grey',
        borderTopWidth: 0.4,
      },
    },
  },
);

const AppNavigator = createStackNavigator(
  {
    Main: {
      screen: MainScreenNavigator,
      navigationOptions: {
        header: null,
      },
    },
    Messages: { screen: Messages },
    Profile: {
      screen: Profile,
      navigationOptions: {
        title: 'Profile',
      },
    },
    GroupDetails: { screen: GroupDetails },
    NewGroup: { screen: NewGroup },
    FinalizeGroup: { screen: FinalizeGroup },
    EditProfile: {
      screen: EditProfile,
      navigationOptions: {
        title: 'Editar Perfil',
      }
    },
    LifestyleResult: {
      screen: LifestyleResult,
      navigationOptions: {
        title: 'Resultado de la Búsqueda',
      }
    }
  },
  {
    navigationOptions: {
      title: 'Loveo',
    },
    headerMode: 'screen',
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
