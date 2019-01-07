import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet, Text, Alert, View, Image,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { StackActions, NavigationActions } from 'react-navigation';
import Swiper from 'react-native-deck-swiper';
import USER_QUERY from '../graphql/user.query';
import USERS_QUERY from '../graphql/users.query';
import CREATE_CONVERSATION_MUTATION from '../graphql/create-conversation.mutation';
import UPDATE_USER_MUTATION from '../graphql/update-user.mutation';
import EDIT_MISCREATED_MUTATION from '../graphql/edit-miscreated.mutation';
import EDIT_FRIEND_MUTATION from '../graphql/edit-friend.mutation';
import withLoading from '../components/withLoading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  card: {
    flex: 0.8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent',
  },
  image: {
    width: 370,
    height: 448,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 50,
    color: 'white',
  },
  iconsView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  icons: {
    color: 'black',
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 40,
    alignItems: 'center',
    paddingStart: 9,
    paddingEnd: 0,
    width: 75,
    marginHorizontal: 20,
  },
  information: {
    position: 'absolute',
    bottom: 100,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
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
class Match extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      swipedAllCards: false,
      swipeDirection: '',
      isSwipingBack: false,
      cardIndex: 1,
    };
  }

  renderCard = user => (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{
          uri: user.photoprofile.url,
        }}
      />
      <Text style={styles.information}>{user.username}</Text>
    </View>
  );

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true,
    });
  };

  swipeBack = () => {
    if (!this.state.isSwipingBack) {
      this.setIsSwipingBack(true, () => {
        this.swiper.swipeBack(() => {
          this.setIsSwipingBack(false);
        });
      });
    }
  };

  setIsSwipingBack = (isSwipingBack, cb) => {
    this.setState(
      {
        isSwipingBack,
      },
      cb,
    );
  };

  swipeRight = (index) => {
    const { updateUser, editFriend } = this.props;

    const user = this.props.users.sort(this.compareUsers)[index];

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
  };

  swipeLeft = (index) => {
    const { editMiscreated } = this.props;
    const user = this.props.users.sort(this.compareUsers)[index];

    editMiscreated({
      id: 1,
      userId: user.id,
    });
  };

  onSwiped = (index) => {
    const { cardIndex } = this.state;
    this.setState({
      cardIndex: cardIndex + 1,
    });
  };

  compareUsers = (a, b) => a.id - b.id;
  filter=()=>{
    
  }
  create = (index) => {
    const { createConversation, navigation } = this.props;
    const { cardIndex } = this.state;
    const user = this.props.users.sort(this.compareUsers)[index];


    createConversation({
      name: user.username,
      userIds: user.id,
      userId: 1,
      photo: user.photoprofile.url,
    })
      .then((res) => {
        navigation.dispatch(goToNewGroup(res.data.createConversation));
      })
      .catch((error) => {
        Alert.alert('Error Creating New Group', error.message, [{ text: 'OK', onPress: () => {} }]);
      });
  };

  render = () => {
    const { users } = this.props;
    const { swipedAllCards } = this.state;

    return (
      <View style={styles.container}>
        {!swipedAllCards && (
          <Swiper
            ref={(swiper) => {
              this.swiper = swiper;
            }}
            cardIndex={this.state.cardIndex}
            verticalSwipe={false}
            backgroundColor="white"
            onSwiped={this.onSwiped}
            onSwipedRight={this.swipeRight}
            onSwipedLeft={this.swipeLeft}
            onTapCard={this.swipeLeft}
            cards={users.sort(this.compareUsers)}
            stackSize={3}
            renderCard={this.renderCard}
            onSwipedAll={this.onSwipedAllCards}
            stackSeparation={15}
            overlayLabels={{
              left: {
                element: <Text style={styles.text}>NO</Text>,
                title: 'NOPE',
                style: {
                  wrapper: {
                    backgroundColor: 'red',
                    height: 448,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                },
              },
              right: {
                element: <Text style={styles.text}>Me gusta</Text>,
                title: 'Me gusta',
                style: {
                  wrapper: {
                    height: 448,
                    borderRadius: 10,
                    backgroundColor: 'green',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                },
              },
            }}
            animateOverlayLabelsOpacity
            animateCardOpacity
          />
        )}
        {!swipedAllCards && (
          <View style={styles.iconsView}>
            <Icon.Button
              underlayColor="transparent"
              size={50}
              color="black"
              backgroundColor="transparent"
              style={styles.icons}
              name="close"
              onPress={() => this.swiper.swipeLeft()}
              title="Swipe Left"
            />
            <Icon.Button
              underlayColor="transparent"
              style={styles.icons}
              color="black"
              backgroundColor="transparent"
              size={60}
              width={85}
              name="email-outline"
              title="Swipe Left"
              onPress={() => this.create(this.state.cardIndex)}
            />
            <Icon.Button
              underlayColor="transparent"
              style={styles.icons}
              color="black"
              backgroundColor="transparent"
              size={50}
              name="cards-heart"
              onPress={() => this.swiper.swipeRight()}
            />
          </View>
        )}
      </View>
    );
  };
}
const userQuery = graphql(USER_QUERY, {
  options: () => ({
    variables: {
      id: 1,
    },
  }),
  props: ({ data: {loading, user } }) => ({
    loading:loading,
    user:user,
  }),
});
const usersQuery = graphql(USERS_QUERY, {
  options: () => ({}),
  props: ({ data: { users } }) => ({
    users: users || [],
  }),
});
const createConversationMutation = graphql(CREATE_CONVERSATION_MUTATION, {
  props: ({ mutate }) => ({
    createConversation: (group) => 
       mutate({
        variables: { group },
        refetchQueries: [{ query: USERS_QUERY }],
      })
  }),
});
const updateUserMutation = graphql(UPDATE_USER_MUTATION, {
  props: ({ mutate }) => ({
    updateUser: user => mutate({
      variables: { user },
    }),
  }),
});
const editFriendMutation = graphql(EDIT_FRIEND_MUTATION, {
  props: ({ mutate }) => ({
    editFriend: (id, userId) => mutate({
      variables: id,
      userId,
      refetchQueries:[{query:USER_QUERY}],
    }),
    
  }),
});

const editMiscreatedMutation = graphql(EDIT_MISCREATED_MUTATION, {
  props: ({ mutate }) => ({
    editMiscreated: (id, userId) => mutate({
      variables: id,
      userId,
    }),
  }),
});

export default compose(
  updateUserMutation,
  createConversationMutation,
  userQuery,
  usersQuery,
  withLoading,
  editFriendMutation,
  editMiscreatedMutation,
)(Match);
