import PropTypes from 'prop-types';
import {
  View, Image, Text, Alert, ScrollView, FlatList, TouchableHighlight,
} from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackActions, NavigationActions } from 'react-navigation';
import ActionButton from 'react-native-circular-action-menu';
import styles from './styles';
import OtherUserIcons from './otherUserIcons';
import CurrentUserIcons from '../../user.screen/components/currentUserIcons';

const goToNewGroup = group => StackActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'Main' }),
    NavigationActions.navigate({
      routeName: 'Messages',
      params: { groupId: group.id, title: group.name },
    }),
  ],
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableScrollViewScroll: true,
    };
    this.create = this.create.bind(this);
    this.addLike = this.addLike.bind(this);
  }

  keyExtractor = item => item.id.toString();

  renderItem = ({ item }) => (
    <TouchableHighlight
      onPress={() => this.setState({ img: item })}
      key={item.id}
      underlayColor="transparent"
    >
      <View style={styles.photoContainer}>
        <Image source={{ uri: item ? item.url : undefined }} style={styles.albumImage} />
      </View>
    </TouchableHighlight>
  );

  goTosettings = () => {
    const {
      navigation: { navigate },
      auth,
    } = this.props;
    navigate('EditProfile', {
      userId: auth.id,
    });
  };

  addLike() {
    const { updateUser, user, editFriend } = this.props;

    updateUser({
      id: user.id,
      likes: user.likes + 1,
    });

    editFriend({
      id: 1,
      userId: user.id,
    }).catch((error) => {
      Alert.alert('Error Creating New Friend', error.message, [{ text: 'OK', onPress: () => {} }]);
    });
  }

  create() {
    const {
      createConversation,
      navigation,
      user: { username, id, photoprofile },
    } = this.props;

    createConversation({
      name: username,
      userIds: id,
      userId: 1,
      photo: photoprofile ? photoprofile.url : undefined,
    })
      .then((res) => {
        navigation.dispatch(goToNewGroup(res.data.createConversation));
      })
      .catch((error) => {
        Alert.alert('Error Creating New Group', error.message, [{ text: 'OK', onPress: () => {} }]);
      });
  }

  render() {
    const {
      auth,
      user,
      navigation: { navigate },
    } = this.props;
    const profileUser = user || auth || {};
    const { enableScrollViewScroll, img = profileUser.photoprofile } = this.state;
    return (
      <View
        style={styles.container}
        onStartShouldSetResponderCapture={() => {
          this.setState({ enableScrollViewScroll: true });
        }}
      >
        <View style={styles.userNameContainer}>
          <Text style={styles.userName}>{profileUser.username}</Text>
          {auth && profileUser.id === auth.id ? (
            <CurrentUserIcons
              settings={this.goTosettings}
              setImage={newImage => this.setState({ img: `data:image/jpeg;base64,${newImage}` })}
            />
          ) : (
            <OtherUserIcons create={this.create} addLike={this.addLike} liked={false} />
          )}
        </View>
        <ScrollView
          scrollEnabled={enableScrollViewScroll}
          ref={(myScroll) => {
            this.myScroll = myScroll;
          }}
        >
          <View style={styles.containerImage}>
            <Image style={styles.userImage} source={{ uri: img ? img.url : undefined }} />
          </View>
          <FlatList
            styles={styles.album}
            data={profileUser.album}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ListEmptyComponent={<View />}
            horizontal
          />
          <View style={styles.userInformacion}>
            <View style={styles.conexionStyle}>
              <Icon size={11.5} name="home-circle" />
              <Text style={[styles.locationUser, styles.textStyle]}>{profileUser.city}</Text>
            </View>
            <View style={styles.conexionStyle}>
              <Icon size={10} name="circle" color="green" />
              <Text style={styles.textStyle}>Ultima conexión: 13h</Text>
            </View>
            <Text>Aquí iría una patata o lo que cohone queráis</Text>
          </View>
        </ScrollView>
        {auth && profileUser.id === auth.id ? (
          <ActionButton
            btnOutRange="rgba(208, 170, 230,1)"
            buttonColor="rgba(185, 104, 233,1)"
            position="left"
            degrees={360}
            icon={<Icon name="menu" size={30} />}
          >
            <ActionButton.Item title="MyLikes" onPress={() => navigate('MyLikes')}>
              <Icon name="heart" size={30} />
            </ActionButton.Item>
            <ActionButton.Item title="whoLikes" onPress={() => navigate('WhoLikesMe')}>
              <Icon name="fire" size={30} />
            </ActionButton.Item>
            <ActionButton.Item title="Match" onPress={() => navigate('MatchList')}>
              <Icon name="bullseye-arrow" size={30} />
            </ActionButton.Item>
          </ActionButton>
        ) : (
          undefined
        )}
      </View>
    );
  }
}

Profile.propTypes = {
  updateUser: PropTypes.func,
  editFriend: PropTypes.func,
  createConversation: PropTypes.func,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
  }),
  user: PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
    city: PropTypes.string,
    age: PropTypes.number,
    likes: PropTypes.number,
    photoprofile: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    }),
  }),
};

export default Profile;
