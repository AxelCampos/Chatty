import { createDrawerNavigator } from 'react-navigation';
import Tendencies from '../screens/tendencies.screen';
import Match from '../screens/match.screen';

const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: Tendencies,
  },
  Notifications: {
    screen: Match,
  },
});
export default DrawerNavigator;
