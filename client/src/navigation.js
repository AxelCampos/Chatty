import React, { Component } from 'react';
import {
  StackActions,
  NavigationActions,
  createMaterialTopTabNavigator,
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import {
  fromLeft,
  fromTop,
  fromRight,
  fromBottom,
  fadeIn,
  zoomIn,
  zoomOut,
  flipY,
  flipX,
} from 'react-navigation-transitions';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { REHYDRATE } from 'redux-persist';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BackHandler } from 'react-native';
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
import GroupImage from './screens/group-image.screen';
import LifestyleResult from './screens/lifestyle-result.screen';
import Searches from './screens/searches.screen';
import MyLikes from './screens/my-likes.screen';
import WhoLikesMe from './screens/who-likes-me.screen';
import MatchList from './screens/match-list.screen';
import Notifications from './screens/notifications.screen';
import Blacklist from './screens/blacklist.screen';
import { LOGOUT } from './constants/constants';
import SigninScreen from './screens/signin.screen';

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

    MyUser: {
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
    initialRouteName: 'Search',
    navigationOptions: {
      tabBarVisible: true,
    },
    tabBarOptions: {
      activeTintColor: '#251d26',
      activeBackgroundColor: '#ba1ba7',
      inactiveBackgroundColor: '#760d82',
      inactiveTintColor: '#D3BCDD',
      tabStyle: {
        borderTopColor: 'purple',
        borderTopWidth: 0.4,
      },
    },
  },
);

const StackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainScreenNavigator,
      navigationOptions: {
        tabBarVisible: true,
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
      },
    },
    LifestyleResult: {
      screen: LifestyleResult,
      navigationOptions: {
        title: 'Resultado de la Búsqueda',
      },
    },
    Searches: {
      screen: Searches,
      navigationOptions: {
        title: 'Búsquedas',
      },
    },
    Notifications: {
      screen: Notifications,
      navigationOptions: {
        title: 'Notifications',
      },
    },
    Blacklist: {
      screen: Blacklist,
      navigationOptions: {
        title: 'Blacklist',
      },
    },
    GroupImage: { screen: GroupImage },
    MyLikes: {
      screen: MyLikes,
      navigationOptions: {
        title: 'My Likes',
      },
    },
    WhoLikesMe: {
      screen: WhoLikesMe,

      navigationOptions: {
        title: 'Who Likes Me',
      },
    },
    MatchList: {
      screen: MatchList,
      navigationOptions: {
        title: 'Match List',
      },
    },
  },

  {
    transitionConfig: () => fromLeft(),
    navigationOptions: {
      title: 'Loveo',
    },
    headerMode: 'screen',
  },
);
const AppNavigator = createSwitchNavigator(
  {
    Auth: SigninScreen,
    Main: StackNavigator,
  },
  {
    initialRouteName: 'Auth',
  },
);


export const navigationReducer = (state = null, action) => {
  let nextState = AppNavigator.router.getStateForAction(action, state);

  switch (action.type) {
    case REHYDRATE:
      // convert persisted data to Immutable and confirm rehydration
      if (!action.payload || !action.payload.auth || !action.payload.auth.jwt) {
        const { routes, index } = state;
        if (routes[index].routeName !== 'Auth') {
          nextState = AppNavigator.router.getStateForAction(
            NavigationActions.navigate({ routeName: 'Auth' }),
            state,
          );
        }
      }
      break;
    case LOGOUT:
      const { routes, index } = state;
      if (routes[index].routeName !== 'Auth') {
        nextState = AppNavigator.router.getStateForAction(
          NavigationActions.navigate({ routeName: 'Auth' }),
          state,
        );
      }
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }
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
