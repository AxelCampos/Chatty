import React, { Component } from 'react';
import { createMaterialTopTabNavigator, NavigationActions, StackActions } from 'react-navigation';
import { View, Text } from 'react-native';
import Album from './album.component';
import Descripcion from './description.component';

const Menu = createMaterialTopTabNavigator(
  {
    Album: {
      screen: Album,
    },
    Descripcion: {
      screen: Descripcion,
    },
  },
  {
    initialRouteName: 'Album',
    activeColor: 'black',
  },
);

export default Menu;
