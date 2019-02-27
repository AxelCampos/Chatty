import React, { PureComponent } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet, Text, Alert, View, Image,
} from 'react-native';

import { StackActions, NavigationActions } from 'react-navigation';
import Swiper from 'react-native-deck-swiper';
import Header from './header';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  card: {
    flex: 0.9,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 5,
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
    width: '100%',
    height: '100%',
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
    borderColor: 'white',
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
    bottom: 150,
    color: 'white',
    fontSize: 20,
    marginHorizontal: 8,
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
      isSwipingBack: false,
      cardIndex: 0,
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
      <Text style={[styles.information, { fontFamily: 'Merienda-Regular' }]}>
        {user.username}
        {', '}
        {user.age}
      </Text>
    </View>
  );

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true,
    });
  };

  swipeBack = () => {
    const { isSwipingBack } = this.state;
    if (!isSwipingBack) {
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
    const { updateUser, editFriend, auth } = this.props;

    const user = this.usersToShow()[index];

    updateUser({
      id: user.id,
      likes: user.likes + 1,
    });

    editFriend({
      id: auth.id,
      userId: user.id,
    }).catch((error) => {
      Alert.alert('Error Creating New Friend', error.message, [{ text: 'OK', onPress: () => { } }]);
    });
  };

  swipeLeft = (index) => {
    const { editMiscreated, auth } = this.props;

    const user = this.usersToShow()[index];

    editMiscreated({
      id: auth.id,
      userId: user.id,
    });
  };

  onSwiped = () => {
    const { cardIndex } = this.state;
    this.setState({
      cardIndex: cardIndex + 1,
    });
  };

  compareUsers = (a, b) => a.id - b.id;

  create = (index) => {
    const { createConversation, navigation, auth } = this.props;
    const user = this.usersToShow()[index];

    createConversation({
      name: user.username,
      userIds: user.id,
      userId: auth.id,
      photo: user.photoprofile.url,
    })
      .then((res) => {
        navigation.dispatch(goToNewGroup(res.data.createConversation));
      })
      .catch((error) => {
        Alert.alert('Error Creating New Group', error.message, [{ text: 'OK', onPress: () => { } }]);
      });
  };

  usersToShow() {
    const { users, user } = this.props;
    return users
      .sort(this.compareUsers)
      .filter(u => u.id !== user.id)
      .filter(u => !user.friends.map(f => f.id).includes(u.id))
      .filter(u => !user.miscreated.map(f => f.id).includes(u.id));
  }

  render = () => {
    const { swipedAllCards, cardIndex } = this.state;

    return (
      <View style={styles.container}>
        {!swipedAllCards && (
          <Swiper
            ref={(swiper) => {
              this.swiper = swiper;
            }}
            cardIndex={cardIndex}
            verticalSwipe={false}
            backgroundColor="white"
            onSwiped={this.onSwiped}
            onSwipedRight={this.swipeRight}
            onSwipedLeft={this.swipeLeft}
            onTapCard={this.swipeLeft}
            cards={this.usersToShow()}
            stackSize={3}
            renderCard={this.renderCard}
            onSwipedAll={this.onSwipedAllCards}
            stackSeparation={15}
            overlayLabels={{
              left: {
                element: <Text style={styles.text}>NO LOVEO</Text>,
                title: 'NO LOVEO',
                style: {
                  wrapper: {
                    backgroundColor: 'red',
                    height: '90%',
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                },
              },
              right: {
                element: <Text style={styles.text}>LOVEO</Text>,
                title: 'LOVEO',
                style: {
                  wrapper: {
                    height: '90%',
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
        {!swipedAllCards && <Header />}
        {!swipedAllCards && !!this.usersToShow().length ? (
          <View style={styles.iconsView}>
            <Icon.Button
              underlayColor="transparent"
              size={50}
              color="white"
              backgroundColor="transparent"
              style={styles.icons}
              name="close"
              onPress={() => this.swiper.swipeLeft()}
              title="Swipe Left"
            />
            <Icon.Button
              underlayColor="transparent"
              style={styles.icons}
              color="white"
              backgroundColor="transparent"
              size={60}
              width={85}
              name="email-outline"
              title="Swipe Left"
              onPress={() => this.create(cardIndex)}
            />
            <Icon.Button
              underlayColor="transparent"
              style={styles.icons}
              color="white"
              backgroundColor="transparent"
              size={50}
              name="cards-heart"
              onPress={() => this.swiper.swipeRight()}
            />
          </View>
        ) : (
            <Text style={{ fontFamily: 'Merienda-Regular' }}>
              Vuelva más tarde, habrá más para ti
          </Text>
          )}
      </View>
    );
  };
}

export default Match;
