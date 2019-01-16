import React, { Component } from 'react';
import {
  View,
  Button,
} from 'react-native';
import MyView from './my-view';
import Search from './search';
import styles from './styles';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { saveSearch, viewNameInput, nameSearch, goToMySearches, goToLifestyle, hide, isdisabled } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.viewButtonBusquedas}>
          <View style={styles.viewButtonNueva}>
            <Button style={styles.buttonNuevaBusqueda} title="Hacer nueva Búsqueda" onPress={goToLifestyle} />
          </View>
          <View style={styles.viewButtonVer}>
            <Button style={styles.buttonVerBusqueda} title="Ver Mis Búsquedas" onPress={goToMySearches} />
          </View>
        </View>
        <View style={styles.viewGuardar}>
          <Button style={styles.buttomGuardar} title="Guardar" onPress={viewNameInput} />
          <MyView hide={hide} >
            <Search saveSearch={saveSearch} nameSearch={nameSearch} isdisabled={isdisabled} />
          </MyView>
        </View>
      </View >
    )
  }
};

export default Header;
