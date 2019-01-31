import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  StyleSheet, Text, TouchableHighlight, View, Image,
} from 'react-native';

const styles = StyleSheet.create({
  tendencyContainer: {
    flex: 1,
    width: 160,
    height: 180,
    alignItems: 'center',
    backgroundColor: '#F3E7E4',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    margin: 10,
  },

  userName: {
    fontSize: 12,
    position: 'absolute',
    bottom: 22,
    left: 10,
    color: 'black',
  },
  userImage: {
    width: 150,
    height: 135,
    borderRadius: 10,
  },
  userLikes: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    width: 40,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  textLikes: {
    color: 'white',
    marginLeft: 3,
  },
  textLocation: {
    fontSize: 10,
    position: 'absolute',
    bottom: 5,
    left: 10,
  },
});

const Tendency = ({
  users: {
    id, country, city, username, photoprofile, likes, age,
  },
  goToProfiles,
  reduceString,
}) => (
  <TouchableHighlight key={id} onPress={goToProfiles} underlayColor="transparent">
    <View style={styles.tendencyContainer}>
      <Image style={styles.userImage} source={{ uri: photoprofile.url }} />

      <Text style={styles.userName}>
        {username}

        {', '}
        {age}
      </Text>
      <Text style={styles.textLocation}>
        {reduceString(city)}
        {', '}
        {reduceString(country)}
      </Text>
      <View style={styles.userLikes}>
        <Icon size={12} name="heart" color="#F0625A" />
        <Text style={styles.textLikes}>{likes}</Text>
      </View>
    </View>
  </TouchableHighlight>
);
Tendency.propTypes = {
  goToProfiles: PropTypes.func.isRequired,
  reduceString: PropTypes.func.isRequired,
  users: PropTypes.shape({
    id: PropTypes.number,
    country: PropTypes.string,
    city: PropTypes.string,
    username: PropTypes.string,
    age: PropTypes.number,
    likes: PropTypes.number,
    photoprofile: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    }),
  }),
};
export default Tendency;
