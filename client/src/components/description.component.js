import { NavigationActions, StackActions } from 'react-navigation';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  albumContainer: {
    flex: 1,
    backgroundColor: 'yellow',
  },
});
class Descripcion extends Component {
  constructor(props) {
    super(props);
  }

  tabHandler = () => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Test' })],
      }),
    );
  };

  render() {
    return <View style={styles.albumContainer} />;
  }
}
export default Descripcion;
