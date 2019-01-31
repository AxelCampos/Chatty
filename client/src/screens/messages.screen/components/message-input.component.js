import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, TextInput, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Formik } from 'formik';
import ImagePicker from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    backgroundColor: '#f5f1ee',
    borderColor: '#dbdbdb',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#dbdbdb',
    borderRadius: 15,
    borderWidth: 1,
    color: 'black',
    height: 32,
    padding: 8,
  },
  sendButtonContainer: {
    paddingRight: 12,
    paddingVertical: 6,
  },
  sendButton: {
    height: 32,
    width: 32,
  },
  iconStyle: {
    marginRight: 0, // default is 12
  },
});

openImagepicker = () => {
  const options = {
    title: 'Send Photo',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  // const { editPhotoprofile, user } = this.props;

  ImagePicker.showImagePicker(options, async (response) => {
    console.log('Response = ', response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }

    await ImgToBase64.getBase64String(`${response.uri}`).then(res => this.setState({
      image: res,
    }))
     .then(() => sendPhoto({ userId: user.id, url: `data:image/png;base64, ${this.state.image}` }))
      .catch(err => console.log('error!!!', err));
  });
};

const shareOptions = {
  title: 'Title',
  message: 'Message to share', // Note that according to the documentation at least one of "message" or "url" fields is required
  url: 'www.example.com',
  subject: 'Subject',
};

const sendButton = send => (
  <Icon.Button
    backgroundColor="blue"
    borderRadius={16}
    color="white"
    iconStyle={styles.iconStyle}
    name="telegram-plane"
    onPress={send}
    size={16}
    style={styles.sendButton}
  />
);
const MessageInput = ({ send }) => (
  <Formik
    initialValues={{ messageText: '', photo: url }}
    onSubmit={({ messageText }, { resetForm }) => {
      send(messageText);
      resetForm({});
    }}
  >
    {({
      handleBlur, handleChange, handleSubmit, values,
    }) => (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={handleChange('messageText')}
            onBlur={handleBlur('messageText')}
            value={values.messageText}
            style={styles.input}
            placeholder="Type your message here!"
          />
        </View>
        <View style={styles.sendButtonContainer}>{sendButton(handleSubmit)}</View>
        <TouchableHighlight onPress={this.openImagepicker}>
          <Icon style={styles.sendButtonContainer} size={27} name="camera" />
        </TouchableHighlight>
      </View>
    )}
  </Formik>
);
MessageInput.propTypes = {
  send: PropTypes.func.isRequired,
};
export default MessageInput;
