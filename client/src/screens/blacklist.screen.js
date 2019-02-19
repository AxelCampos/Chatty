import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { graphql, compose } from "react-apollo";

import { connect } from "react-redux";
import { USERS_QUERY } from "../graphql/users.query";
import { USER_QUERY } from "../graphql/user.query";
import withLoading from "../components/withLoading";

const mapStateToProps = ({ auth }) => ({
  auth
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center"
  },
  tendencyContainer: {
    flex: 1,
    width: 160,
    height: 180,
    alignItems: "center",
    backgroundColor: "#F3E7E4",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    margin: 10
  },

  userName: {
    fontSize: 12,
    position: "absolute",
    bottom: 22,
    left: 10,
    color: "black"
  },
  userImage: {
    width: 150,
    height: 135,
    borderRadius: 10
  },
  userLikes: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    width: 40,
    alignItems: "center",
    paddingHorizontal: 4
  },
  textLikes: {
    color: "white",
    marginLeft: 3
  },
  textLocation: {
    fontSize: 10,
    position: "absolute",
    bottom: 5,
    left: 10
  }
});

const Tendency = ({
  users: { id, country, city, username, photoprofile, likes, age },
  goToProfiles,
  reduceString
}) => (
  <TouchableHighlight
    key={id}
    onPress={goToProfiles}
    underlayColor="transparent"
  >
    <View style={styles.tendencyContainer}>
      <Image style={styles.userImage} source={{ uri: photoprofile.url }} />

      <Text style={styles.userName}>
        {username}

        {", "}
        {age}
      </Text>
      <Text style={styles.textLocation}>
        {reduceString(city)}
        {", "}
        {reduceString(country)}
      </Text>
      <View style={styles.userLikes}>
        <Icon size={12} name="heart" color="#F0625A" />
        <Text style={styles.textLikes}>{likes}</Text>
      </View>
    </View>
  </TouchableHighlight>
);

class Blacklist extends Component {
  keyExtractor = item => item.id.toString();

  goToProfiles = user => () => {
    const {
      users,
      navigation: { navigate }
    } = this.props;

    navigate("Profile", { userId: user.id });
  };

  renderItem = ({ item }) => (
    <Tendency
      users={item}
      goToProfiles={this.goToProfiles(item)}
      reduceString={this.reduceString}
    />
  );

  compare = (a, b) => b.likes - a.likes;

  reduceString = a => {
    let shortword = " ";

    if (a.length >= 10) {
      for (let i = 0; i < 10; i++) {
        shortword += a.charAt(i);
      }
      shortword += "...";
    } else {
      shortword = a;
    }
    return shortword;
  };

  selectBlacklist = item => {
    const { user } = this.props;
    console.log("user", user);
    console.log("item", item);
    return user.miscreated.filter(dato => dato.id == item.id).length !== 0;
  };

  render() {
    const { users } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          data={users
            .filter(this.selectBlacklist)
            .sort(this.compare)
            .slice()}
          numColumns={2}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({
    variables: {
      id: ownProps.auth.id
    }
  }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user
  })
});

const usersQuery = graphql(USERS_QUERY, {
  options: () => ({}), // fake the user for now
  props: ({ data: { users } }) => ({
    users: users || []
  })
});

export default compose(
  connect(mapStateToProps),
  userQuery,
  usersQuery,
  withLoading
)(Blacklist);

/* const Blacklist = () => (
    <View>
        <Text>Blacklist</Text>
    </View>
)

export default Blacklist; */
