import React from 'react';
import {
  View,
  Button,
  TextInput,
} from 'react-native';
import styles from './styles';

const Search = ({ saveSearch, nameSearch, isdisabled }) => (
  <View>
    <TextInput
      style={styles.input}
      underlineColorAndroid="transparent"
      // placeholderTextColor="#9a73ef"
      autoCapitalize="none"
      placeholder="nombre de la búsqueda"
      onChangeText={name => nameSearch({ name })}
    // value={country}
    />
    <Button disabled={isdisabled} style={styles.buttonCrearSearch} title="OK" onPress={saveSearch} />
  </View>
);

export default Search;
