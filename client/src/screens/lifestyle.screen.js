import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Picker,
  ScrollView,
  Switch,
  ToastAndroid,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { USERS_QUERY } from '../graphql/users.query';
import withLoading from '../components/withLoading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  label: {
    marginBottom: 20,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F9F9F9',
    marginVertical: 10,
    fontFamily: 'KaushanScript-Regular',
  },
  picker: {
    width: 200,
    marginHorizontal: 20,
  },
  viewSwitchPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    marginHorizontal: 20,
  },
  moreFilters: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
});

class Lifestyle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bool: false,
      userId: 1,
      gender: 'todos',
      civilStatus: 'todos',
      children: 'todos',
      switchGenderValue: false,
      switchCivilStatusValue: false,
      switchChildrenValue: false,
      enabledpickerGender: false,
      enabledpickerCivilStatus: false,
      enabledpickerChildren: false,
      genderThumbcolor: 'red',
      civilStatusThumbcolor: 'red',
      childrenThumbcolor: 'red',
    };
  }

  resetState = () => {
    this.setState({
      gender: 'todos',
      civilStatus: 'todos',
      children: 'todos',
      switchGenderValue: false,
      switchCivilStatusValue: false,
      switchChildrenValue: false,
      enabledpickerGender: false,
      enabledpickerCivilStatus: false,
      enabledpickerChildren: false,
      genderThumbcolor: 'red',
      civilStatusThumbcolor: 'red',
      childrenThumbcolor: 'red',
    });
  };

  goToResult = () => {
    const {
      navigation: { navigate },
    } = this.props;
    const {
      userId, gender, civilStatus, children,
    } = this.state;

    navigate('LifestyleResult', {
      userId,
      gender,
      civilStatus,
      children,
    });
    this.resetState();
  };

  switchGender = () => {
    const { switchGenderValue } = this.state;
    if (switchGenderValue) {
      this.setState({
        switchGenderValue: false,
        enabledpickerGender: false,
        genderThumbcolor: 'red',
        gender: 'todos',
      });
      ToastAndroid.showWithGravity(
        'Busqueda por genero desactivada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      this.setState({
        switchGenderValue: true,
        enabledpickerGender: true,
        genderThumbcolor: 'blue',
      });
      ToastAndroid.showWithGravity(
        'Busqueda por genero activada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  switchCivilStatus = () => {
    const { switchCivilStatusValue } = this.state;

    if (switchCivilStatusValue) {
      this.setState({
        switchCivilStatusValue: false,
        enabledpickerCivilStatus: false,
        civilStatusThumbcolor: 'red',
        civilStatus: 'todos',
      });
      ToastAndroid.showWithGravity(
        'Busqueda por estado civil desactivada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      this.setState({
        switchCivilStatusValue: true,
        enabledpickerCivilStatus: true,
        civilStatusThumbcolor: 'blue',
      });
      ToastAndroid.showWithGravity(
        'Busqueda por estado civil activada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  switchChildren = () => {
    const { switchChildrenValue } = this.state;
    if (switchChildrenValue) {
      this.setState({
        switchChildrenValue: false,
        enabledpickerChildren: false,
        childrenThumbcolor: 'red',
        children: 'todos',
      });
      ToastAndroid.showWithGravity(
        'Busqueda para hijos desactivada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      this.setState({
        switchChildrenValue: true,
        enabledpickerChildren: true,
        childrenThumbcolor: 'blue',
      });
      ToastAndroid.showWithGravity(
        'Busqueda para hijos activada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  render() {
    const {
      bool, switchChildrenValue, switchCivilStatusValue, switchGenderValue,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontFamily: 'KaushanScript-Regular', fontSize: 20 }}>
            FILTRO DE BÚSQUEDA
          </Text>
        </View>
        <ScrollView
          style={{ flex: 6 }}
          ref={(scroll) => {
            this.scroll = scroll;
          }}
        >
          <Text style={styles.label}>POR GÉNERO: </Text>

          <View style={styles.viewSwitchPicker}>
            <Picker
              style={styles.picker}
              selectedValue={this.state.gender}
              onValueChange={gender => this.setState({ gender })}
              enabled={this.state.enabledpickerGender}
            >
              <Picker.Item label="todos" value="todos" />
              <Picker.Item label="hombre" value="hombre" />
              <Picker.Item label="mujer" value="mujer" />
              <Picker.Item label="otro" value="otro" />
            </Picker>
            <Switch
              style={styles.switch}
              onValueChange={this.switchGender}
              value={this.state.switchGenderValue}
              thumbColor={this.state.genderThumbcolor}
            />
          </View>

          <Text style={styles.label}> POR ESTADO CIVIL: </Text>
          <View style={styles.viewSwitchPicker}>
            <Picker
              style={styles.picker}
              selectedValue={this.state.civilStatus}
              onValueChange={civilStatus => this.setState({ civilStatus })}
              enabled={this.state.enabledpickerCivilStatus}
            >
              <Picker.Item label="todos" value="todos" />
              <Picker.Item label="soltero" value="soltero" />
              <Picker.Item label="divorciado" value="divorciado" />
              <Picker.Item label="separado" value="separado" />
              <Picker.Item label="casado" value="casado" />
              <Picker.Item label="viudo" value="viudo" />
              <Picker.Item label="no especificado" value="no especificado" />
            </Picker>
            <Switch
              style={styles.switch}
              onValueChange={this.switchCivilStatus}
              value={this.state.switchCivilStatusValue}
              thumbColor={this.state.civilStatusThumbcolor}
            />
          </View>

          <Text style={styles.label}>POR HIJOS: </Text>
          <View style={styles.viewSwitchPicker}>
            <Picker
              style={styles.picker}
              selectedValue={this.state.children}
              onValueChange={children => this.setState({ children })}
              enabled={this.state.enabledpickerChildren}
            >
              <Picker.Item label="todos" value="todos" />
              <Picker.Item label="no tiene hijos" value="no tiene hijos" />
              <Picker.Item label="tiene hijos" value="tiene hijos" />
              <Picker.Item label="no especificado" value="no especificado" />
            </Picker>
            <Switch
              style={styles.switch}
              onValueChange={this.switchChildren}
              value={this.state.switchChildrenValue}
              thumbColor={this.state.childrenThumbcolor}
            />
          </View>
          {bool === false ? (
            <View style={[styles.moreFilters, { backgroundColor: '#FAFAFA' }]}>
              <Text style={{ fontFamily: 'Merienda-Regular' }}>Más filtros...</Text>
              <Icon.Button
                name="chevron-double-down"
                color="black"
                backgroundColor="transparent"
                onPress={() => {
                  this.setState({
                    bool: true,
                  });
                  setTimeout(this.scroll.scrollToEnd, 0);
                }}
              />
            </View>
          ) : (
              <View>
                <View style={[styles.moreFilters, { backgroundColor: '#FAFAFA' }]}>
                  <Icon.Button
                    name="chevron-double-up"
                    color="black"
                    backgroundColor="transparent"
                    onPress={() => this.setState({ bool: false })}
                  />
                </View>

                <Text style={styles.label}>POR EDAD: </Text>

                <View style={styles.viewSwitchPicker}>
                  <Picker
                    style={styles.picker}
                    selectedValue={this.state.gender}
                    enabled={this.state.enabledpickerGender}
                  >
                    <Picker.Item label="18" value="18" />
                    <Picker.Item label="20" value="20" />
                    <Picker.Item label="30" value="30" />
                    <Picker.Item label="40" value="40" />
                  </Picker>
                  <Switch
                    style={styles.switch}
                    onValueChange={this.switchGender}
                    value={this.state.switchGenderValue}
                    thumbColor={this.state.genderThumbcolor}
                  />
                </View>
                <Text style={styles.label}>POR HOBBIES: </Text>

                <View style={styles.viewSwitchPicker}>
                  <Picker
                    style={styles.picker}
                    selectedValue={this.state.gender}
                    enabled={this.state.enabledpickerGender}
                  >
                    <Picker.Item label="todos" value="todos" />
                    <Picker.Item label="ninguno" value="ninguno" />
                    <Picker.Item label="Baloncesto" value="Baloncesto" />
                    <Picker.Item label="Futbol" value="Futbol" />
                  </Picker>
                  <Switch
                    style={styles.switch}
                    onValueChange={this.switchGender}
                    value={this.state.switchGenderValue}
                    thumbColor={this.state.genderThumbcolor}
                  />
                </View>
                <Text style={styles.label}>POR RELIGION: </Text>

                <View style={styles.viewSwitchPicker}>
                  <Picker
                    style={styles.picker}
                    selectedValue={this.state.gender}
                    enabled={this.state.enabledpickerGender}
                  >
                    <Picker.Item label="todas" value="todas" />
                    <Picker.Item label="ateo" value="ateo" />
                    <Picker.Item label="musulman" value="musulman" />
                    <Picker.Item label="cristiano" value="cristiano" />
                  </Picker>
                  <Switch
                    style={styles.switch}
                    onValueChange={this.switchGender}
                    value={this.state.switchGenderValue}
                    thumbColor={this.state.genderThumbcolor}
                  />
                </View>
              </View>
            )}
        </ScrollView>
        {switchChildrenValue === true
          || switchCivilStatusValue === true
          || switchGenderValue === true ? (
            <Button title="Filtrar" onPress={this.goToResult} />
          ) : (
            undefined
          )}
      </View>
    );
  }
}

const usersQuery = graphql(USERS_QUERY, {
  options: () => ({}), //  fake the user for now
  props: ({ data: { users } }) => ({
    users: users || [],
  }),
});

export default compose(
  usersQuery,
  withLoading,
)(Lifestyle);
