import GraphQLDate from 'graphql-date';
import {
  Group, Message, User, Photo, Lifestyle, Activity, Search
} from './connectors';

export const resolvers = {
  Date: GraphQLDate,
  Query: {
    group(_, args) {
      return Group.find({ where: args });
    },
    messages(_, args) {
      return Message.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
    },
    users(_, args) {
      return User.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
    },
    user(_, args) {
      return User.findOne({
        where: args,
      });
    },
    photo(_, args) {
      return Photo.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
    },
    lifestyles(_, args) {
      return Lifestyle.findAll({
        where: args,
      });
    },
    activities(_, args) {
      return Activity.findAll({
        where: args,
      });
    },
    searches(_, args) {
      return Search.findAll({
        where: args,
      });
    },
  },
  Mutation: {
    createMessage(
      _,
      {
        message: { text, userId, groupId },
      },
    ) {
      return Message.create({
        userId,
        text,
        groupId,
      });
    },
    async createConversation(
      _,
      {
        group: { name, userIds, userId,photo },
      },
    ) {
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      const friend = await User.findOne({
        where: {
          id: userIds,
        },
      });
      const group = await Group.create({
        name,
        photo,
        users: [user, friend],
      });
      await group.addUsers([user, friend]);
      return group;
    },
    async createGroup(
      _,
      {
        group: { name, userIds, userId,photo},
      },
    ) {
      const user = await User.findOne({ where: { id: userId } });
      const friends = await user.getFriends({ where: { id: { $in: userIds } } });
      const group = await Group.create({
        name,
        photo,
        users: [user, ...friends],
      });
      await group.addUsers([user, ...friends]);
      return group;
    },
    createSearch(
      _,
      {
        search: { name, userId, gender, civilStatus, children },
      },
    ) {
      const search = Search.create({
        name,
        userId,
        gender,
        civilStatus,
        children,
      });
      return search;
    },
    async deleteGroup(_, { id }) {
      const group = await Group.findOne({ where: id });
      const users = await group.getUsers();
      await group.removeUsers(users);
      await Message.destroy({ where: { groupId: group.id } });
      await group.destroy();
      return group;
    },
    async deleteSearch(_, { id }) {
      const search = await Search.findOne({ where: id });
      await search.destroy();
      return search;
    },
    async leaveGroup(_, { id, userId }) {
      const group = await Group.findOne({ where: { id } });
      await group.removeUser(userId);
      const users = await group.getUsers();
      if (!users.length) {
        await Message.destroy({ where: { groupId: group.id } });
        await group.destroy();
      }
      return group;
    },
    async updateUser(
      _,
      {
        user: { id, likes },
      },
    ) {
      const user = await User.findOne({ where: { id } }).then(user => user.update({ likes }));
      return user;
    },
    updateGroup(
      _,
      {
        group: { id, name, photo },
      },
    ) {
      return Group.findOne({ where: { id } }).then(group => group.update({ name, photo }));
    },

    createUser(
      _,
      {
        user: { username, email, password },
      },
    ) {
      return User.create({
        username,
        email,
        password,
      });
    },

    editUser(
      _,
      {
        user: {
          id, username, country, city, email, age, gender, civilStatus, children, likes,
        },
      },
    ) {
      return User.findOne({ where: { id } }).then(user => user.update({
        username,
        country,
        city,
        email,
        age,
        gender,
        civilStatus,
        children,
        likes,
      }));
    },
    async editMiscreated(_, { id, userId }) {
      const craco = await User.findOne({ where: { id: userId } });
      const user = await User.findOne({ where: { id } });
      await user.addMiscreated(craco);
      return user;
    },
    async editFriend(_, { id, userId }) {
      const friend = await User.findOne({ where: { id: userId } });
      const user = await User.findOne({ where: { id } });
      await user.addFriend(friend);
      return user;
    },
  },

  Group: {
    users(group) {
      return group.getUsers();
    },
    messages(group) {
      return Message.findAll({
        where: { groupId: group.id },
        order: [['createdAt', 'DESC']],
      });
    },
  },
  Message: {
    to(message) {
      return message.getGroup();
    },
    from(message) {
      return message.getUser();
    },
  },
  User: {
    messages(user) {
      return Message.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });
    },
    groups(user) {
      return user.getGroups();
    },
    friends(user) {
      return user.getFriends();
    },
    album(user) {
      return Photo.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });
    },
    photoprofile(user) {
      return Photo.findOne({
        where: { userId: user.id },
      });
    },
    lifestyle(user) {
      return Lifestyle.findOne({
        where: { userId: user.id },
      });
    },
    activities(user) {
      return user.getActivities();
    },
    miscreated(user) {
      return user.getMiscreated();
    },
    searches(user) {
      return Search.findAll({
        where: { userId: user.id },
      });
    },
  },
  Photo: {
    to(photo) {
      return photo.getGroup();
    },
    from(photo) {
      return photo.getUser();
    },
  },
  Lifestyle: {
    from(lifestyle) {
      return lifestyle.getUser();
    },
  },
  Activity: {
    subscription(activity) {
      return activity.getUsers();
    },
  },
  Search: {
    userId(search) {
      return search.getUser();
    },
  },
  /* To: {
    __resolveType(obj) {
      if (obj.email) {
        return user.getUser();
      }
      return group.getGroup();
    },
  },
*/
};

export default resolvers;
