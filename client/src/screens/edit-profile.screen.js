import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Picker,
  ToastAndroid,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { graphql, compose } from 'react-apollo';
import ImagePicker from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import { USER_QUERY } from '../graphql/user.query';
import EDIT_USER_MUTATION from '../graphql/edit-user.mutation';
import EDIT_PHOTOPROFILE_MUTATION from '../graphql/edit-photoprofile.mutation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  submit: {
    flex: 0.1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  viewButton2: {
    padding: 6,
    alignSelf: 'flex-end',
  },
  button2: {
    padding: 6,
    borderColor: '#eee',
    borderBottomWidth: 1,

    backgroundColor: 'red',
    borderRadius: 20,
  },
  input: {
    marginBottom: 15,
    marginTop: 0,
    marginLeft: 15,
    marginRight: 15,
    height: 40,
    borderColor: '#c7d6db',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
  inputDescription: {
    textAlign: 'justify',
    marginBottom: 15,
    marginTop: 0,
    marginLeft: 15,
    marginRight: 15,
    height: 100,
    borderColor: '#c7d6db',
    borderWidth: 1,
    borderRadius: 20,
  },
  label: {
    marginBottom: 20,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F9F9F9',
  },
  picker: {
    marginBottom: 15,
    marginTop: 0,
    marginLeft: 15,
    marginRight: 8,
    borderColor: '#9cb1b7',
    height: 40,
    borderRadius: 20,
    padding: 10,
  },
  viewImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  scroll: {
    flex: 0.5,
  },
  iconStyle: {
    alignItems: 'center',
    paddingStart: 9,
    paddingEnd: 0,
    width: 50,
    marginHorizontal: 5,
  },
});

class EditProfile extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      image: undefined,
      newName: user.username,
      newCountry: user.country,
      newCity: user.city,
      newEmail: user.email,
      newAge: user.age,
      newGender: user.gender,
      newCivilStatus: user.civilStatus,
      newChildren: user.children,
      street: user.street,
      streetNumber: user.streetNumber,
      zipcode: user.zipcode,
      birthdate: user.birthdate,
      height: user.height,
      weight: user.weight,
      education: user.education,
      profession: user.profession,
      religion: user.religion,
      pets: user.pets,
      smoker: user.smoker,
      description: user.description,
    };
  }

  update = () => {
    const { editUser, user } = this.props;
    const {
      newName,
      newCountry,
      newCity,
      newEmail,
      newAge,
      newGender,
      newCivilStatus,
      newChildren,
      street,
      streetNumber,
      zipcode,
      birthdate,
      height,
      weight,
      education,
      profession,
      religion,
      pets,
      smoker,
      description,
    } = this.state;

    editUser({
      id: user.id,
      username: newName,
      email: newEmail,
      age: newAge,
      gender: newGender,
      civilStatus: newCivilStatus,
      children: newChildren,
      city: newCity,
      country: newCountry,
      street,
      streetNumber,
      zipcode,
      birthdate,
      height,
      weight,
      education,
      profession,
      religion,
      pets,
      smoker,
      description,
    });
    alert('Usuario actualizado.');
  };

  openImagepicker = () => {
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    const { editPhotoprofile, user } = this.props;

    ImagePicker.showImagePicker(options, async (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }

      await ImgToBase64.getBase64String(`${response.uri}`)
        .then(res => this.setState({
          image: res,
        }))
        .then(() => editPhotoprofile({ userId: user.id, url: this.state.image }))
        .catch(err => console.log('error!!!', err));
      alert('Foto actualizada');
    });
  };

  goToBlacklist = () => {
    const {
      user,
      navigation: { navigate },
    } = this.props;
    ToastAndroid.showWithGravity('Go to Blacklist', ToastAndroid.SHORT, ToastAndroid.CENTER);
    navigate('Blacklist', {
      userId: user.id,
    });
  };

  render() {
    const {
      user: {
        username,
        photoprofile,
        country,
        city,
        email,
        age,
        gender,
        civilStatus,
        children,
        street,
        streetNumber,
        zipcode,
        birthdate,
        height,
        weight,
        education,
        profession,
        religion,
        pets,
        smoker,
        description,
      },
    } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <View style={styles.viewImage}>
            <TouchableHighlight onPress={this.openImagepicker}>
              <Image style={styles.image} source={{ uri: `data:image/png;base64, ${photoprofile.url}` }} />
            </TouchableHighlight>
            <Text>Cambiar foto</Text>
          </View>
          <View>
            <Text style={styles.label}>
              Nombre de Usuario:
              {username}
            </Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="nuevo nombre"
              onChangeText={newName => this.setState({ newName })}
            />
            <Text style={styles.label}>
              Correo Electrónico:
              {email}
            </Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="nuevo correo electrónico"
              onChangeText={newEmail => this.setState({ newEmail })}
            />
            <Text style={styles.label}>
              Edad:
              {age}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="nueva edad"
              onChangeText={(newAge) => {
                const num = parseInt(newAge, 10);
                this.setState({ newAge: num });
              }}
            />
            <Text style={styles.label}>
              País:
              {country}
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.newCountry}
              onValueChange={newCountry => this.setState({ newCountry })}
            >
              <Picker.Item label="España" value="España" />
              <Picker.Item label="Italia" value="Italia" />
              <Picker.Item label="Francia" value="Francia" />
              <Picker.Item label="EEUU" value="EEUU" />
              <Picker.Item label="Reino Unido" value="Reino Unido" />
              <Picker.Item label="Brasil" value="Brasil" />
              <Picker.Item label="Argentina" value="Argentina" />
              <Picker.Item label="Portugal" value="Portugal" />
              <Picker.Item label="Bélgica" value="Bélgica" />
            </Picker>
            <Text style={styles.label}>
              Ciudad:
              {city}
            </Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="nuevo nombre"
              onChangeText={newCity => this.setState({ newCity })}
            />
            <Text style={styles.label}>
              Logradouro:
              {street}
            </Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="nuevo logradouro (nombre de la calle/avenida)"
              onChangeText={street => this.setState({ street })}
            />

            <Text style={styles.label}>
              Número del Logradouro, Piso, Puerta:
              {streetNumber}
            </Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="número del logradouro, piso, puerta"
              onChangeText={streetNumber => this.setState({ streetNumber })}
            />

            <Text style={styles.label}>
              Código de Área:
              {zipcode}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="nuevo código de área"
              onChangeText={zipcode => this.setState({ zipcode })}
            />

            <Text style={styles.label}>
              Genero:
              {gender}
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.newGender}
              onValueChange={newGender => this.setState({ newGender })}
            >
              <Picker.Item label="hombre" value="hombre" />
              <Picker.Item label="mujer" value="mujer" />
              <Picker.Item label="otro" value="otro" />
            </Picker>

            <Text style={styles.label}>
              Fecha de Nacimiento:
              {birthdate}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              // placeholderTextColor="#9a73ef"
              autoCapitalize="none"
              placeholder="fecha de nacimiento"
              onChangeText={birthdate => this.setState({ birthdate })}
            />

            <Text style={styles.label}>
              Altura (cm):
              {height}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="altura"
              onChangeText={(height) => {
                const num = parseInt(height, 10);
                this.setState({ height: num });
              }}
            />
            <Text style={styles.label}>
              Peso (kg):
              {weight}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="peso"
              onChangeText={(weight) => {
                const num = parseInt(weight, 10);
                this.setState({ weight: num });
              }}
            />
            <Text style={styles.label}>
              Estado Civil:
              {civilStatus}
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.newCivilStatus}
              onValueChange={newCivilStatus => this.setState({ newCivilStatus })}
            >
              <Picker.Item label="soltero" value="soltero" />
              <Picker.Item label="divorciado" value="divorciado" />
              <Picker.Item label="separado" value="separado" />
              <Picker.Item label="casado" value="casado" />
              <Picker.Item label="viudo" value="viudo" />
              <Picker.Item label="no especificado" value="no especificado" />
            </Picker>

            <Text style={styles.label}>
              Nivel de Estudios:
              {education}
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.education}
              onValueChange={education => this.setState({ education })}
            >
              <Picker.Item label="secundario o inferior" value="secundario o inferior" />
              <Picker.Item label="modulo profesional" value="modulo profesional" />
              <Picker.Item label="superior" value="superior" />
              <Picker.Item label="posgrado o master" value="posgrado o master" />
              <Picker.Item label="no especificado" value="no especificado" />
            </Picker>

            <Text style={styles.label}>
              Profesión:
              {profession}
            </Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="profesión"
              onChangeText={profession => this.setState({ profession })}
            />
            <Text style={styles.label}>
              Religión:
              {religion}
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.religion}
              onValueChange={religion => this.setState({ religion })}
            >
              <Picker.Item label="no especificado" value="no especificado" />
              <Picker.Item label="cristiana" value="cristiana" />
              <Picker.Item label="musulmane" value="musulmane" />
              <Picker.Item label="judaica" value="judaica" />
              <Picker.Item label="induísta" value="induísta" />
              <Picker.Item label="budista" value="budista" />
              <Picker.Item label="espiritualista" value="espiritualista" />
              <Picker.Item label="ateísta" value="ateísta" />
              <Picker.Item label="otra" value="otra" />
            </Picker>

            <Text style={styles.label}>
              Fuma?
              {smoker}
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.smoker}
              onValueChange={smoker => this.setState({ smoker })}
            >
              <Picker.Item label="fumo" value="fumo" />
              <Picker.Item label="no fumo pero no me molesta" value="no fumo pero no me molesta" />
              <Picker.Item label="no fumo y me molesta" value="no fumo y me molesta" />
              <Picker.Item label="no especificado" value="no especificado" />
            </Picker>

            <Text style={styles.label}>
              Tiene hijos?
              {children}
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.newChildren}
              onValueChange={newChildren => this.setState({ newChildren })}
            >
              <Picker.Item label="no tiene hijos" value="no tiene hijos" />
              <Picker.Item label="tiene hijos" value="tiene hijos" />
              <Picker.Item label="no especificado" value="no especificado" />
            </Picker>

            <Text style={styles.label}>
              Tiene Mascotas?
              {pets}
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.pets}
              onValueChange={pets => this.setState({ pets })}
            >
              <Picker.Item label="tengo" value="tengo" />
              <Picker.Item label="no tengo" value="no tengo" />
              <Picker.Item label="no especificado" value="no especificado" />
            </Picker>
            <Text style={styles.label}>Descripcion:</Text>
            <TextInput
              style={styles.inputDescription}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              multiline
              maxLength={400}
              placeholder={description}
              onChangeText={description => this.setState({ description })}
            />
          </View>
          <View style={styles.viewButton2}>
            <TouchableOpacity style={styles.button2} onPress={this.goToBlacklist}>
              <Text>See Blacklist</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.submit}>
          <Icon.Button
            underlayColor="transparent"
            style={styles.iconStyle}
            color="grey"
            backgroundColor="white"
            size={30}
            borderRadius={30}
            onPress={this.update}
            name="check-outline"
          />
        </View>
      </View>
    );
  }
}

const editUserMutation = graphql(EDIT_USER_MUTATION, {
  props: ({ mutate }) => ({
    editUser: user => mutate({
      variables: { user },
      update: (store, { data: { editUser } }) => {
        const data = store.readQuery({
          query: USER_QUERY,
          variables: {
            id: user.id,
          },
        });
        data.user.username = editUser.username;
        data.user.country = editUser.country;
        data.user.city = editUser.city;
        data.user.email = editUser.email;
        data.user.age = editUser.age;
        data.user.gender = editUser.gender;
        data.user.civilStatus = editUser.civilStatus;
        data.user.children = editUser.children;

        data.user.street = editUser.street;
        data.user.streetNumber = editUser.streetNumber;
        data.user.zipcode = editUser.zipcode;
        data.user.birthdate = editUser.birthdate;
        data.user.height = editUser.height;
        data.user.weight = editUser.weight;
        data.user.education = editUser.education;
        data.user.profession = editUser.profession;
        data.user.religion = editUser.religion;
        data.user.pets = editUser.pets;
        data.user.smoker = editUser.smoker;
        data.user.description = editUser.description;

        store.writeQuery({
          query: USER_QUERY,
          variables: {
            id: user.id,
          },
          data,
        });
      },
    }),
  }),
});

const editPhotoprofileMutation = graphql(EDIT_PHOTOPROFILE_MUTATION, {
  props: ({ mutate }) => ({
    editPhotoprofile: photo => mutate({
      variables: { photo },
      refetchQueries: [{ query: USER_QUERY }],
    }),
  }),

});

const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({
    variables: {
      id: ownProps.navigation.state.params.userId,
    },
  }),
  props: ({ data: { user } }) => ({
    user: user || null,
  }),
});
export default compose(
  userQuery,
  editUserMutation,
  editPhotoprofileMutation,
)(EditProfile);
