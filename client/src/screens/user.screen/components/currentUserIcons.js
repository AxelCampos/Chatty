import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import styles from './styles';

const openImagepicker = (setImage) => {
  const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      console.log(typeof setImage);
      setImage(response.uri);
    }
  });
};

const CurrentUserIcons = ({ settings, setImage }) => (
  <View style={styles.currentUserIcons}>
    <Icon.Button
      underlayColor="transparent"
      color="black"
      backgroundColor="white"
      size={20}
      borderRadius={30}
      name="camera"
      onPress={() => openImagepicker(setImage)}
    />
    <Icon.Button
      underlayColor="transparent"
      color="black"
      backgroundColor="white"
      size={20}
      borderRadius={30}
      name="dots-vertical"
      onPress={settings}
    />
  </View>
);
CurrentUserIcons.propTypes = {
  setImage: PropTypes.func,
  settings: PropTypes.func.isRequired,
};
export default CurrentUserIcons;
