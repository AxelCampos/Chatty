import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';
import { withFilter, ForbiddenError } from 'apollo-server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  Group, Message, User, Photo, Lifestyle, Activity, Search, Notification,
} from './connectors';
import configurationManager from '../configurationManager';

const JWT_SECRET = configurationManager.jwt.secret;


export const resolvers = {
  Date: GraphQLDate,
  PageInfo: {
    hasNextPage(connection) {
      return connection.hasNextPage();
    },
    hasPreviousPage(connection) {
      return connection.hasPreviousPage();
    },
  },
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
    usersPage(_, { userConnection = {} }) {
      const {
        first, last, before, after,
      } = userConnection || { first: 8 };


      let whereSQL = '';
      const cursor = Buffer.from(before || after || '', 'base64').toString().split('patata');
      const likes = cursor[0];
      const id = cursor[1];

      if (before) {
        // convert base-64 to utf8 id
        whereSQL = `CAST(likes AS integer) > ${likes} OR CAST(likes AS integer) = ${likes} AND id < ${id}`; // { $gt: Buffer.from(before, 'base64').toString() };
      } else if (after) {
        whereSQL = `CAST(likes AS integer) < ${likes} OR CAST(likes AS integer) = ${likes} AND id > ${id}`; // { $lt: Buffer.from(after, 'base64').toString() };
      }
      return User.findAll({
        where: Sequelize.literal(whereSQL),
        order: Sequelize.literal('CAST(likes AS integer) DESC, id'),
        limit: first || last,
      }).then((users) => {
        const edges = users.map(user => ({
          cursor: Buffer.from(`${user.likes.toString()}patata${user.id.toString()}`).toString('base64'), // FIXME: hace falta que el cursor incluya en un String id Y likes, porque hacen falta ambos pal orden
          node: user, // the node is the user itself
        }));

        return {
          edges,
          pageInfo: {
            hasNextPage() {
              if (users.length < (last || first)) {
                return Promise.resolve(false);
              }

              return User.findOne({

                where: {
                  id: {

                    [before ? '$gt' : '$lt']: users[users.length - 1].id,
                  },
                },
                order: [['id', 'DESC']],
              }).then(user => !!user);
            },
            hasPreviousPage() {
              return User.findOne({
                where: {
                  id: {
                    [before ? '$gt' : '$lt']: 1,
                  },
                },
                order: [['id']],
              }).then(user => !!user);
            },
          },
        };
      });
    },
    user(_, args) {
      if (!args || !args.id) {
        return {};
      }
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
    notifications(_, args) {
      return Notification.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
    },
  },
  Mutation: {
    createMessage(
      _,
      {
        message: { text, groupId },
      },
      ctx,
    ) {
      if (!ctx.user) {
        throw new ForbiddenError('Unauthorized');
      }
      return ctx.user.then((user) => {
        if (!user) {
          throw new ForbiddenError('Unauthorized');
        }
        return Message.create({
          userId: user.id,
          text,
          groupId,
        });
      });
    },
    async createConversation(
      _,
      {
        group: {
          name, userIds, userId, photo,
        },
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
        group: {
          name, userIds, userId, photo,
        },
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
        search: {
          name, userId, gender, civilStatus, children,
        },
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
    createNotification(
      _,
      {
        notification: {
          type, text, firstUser, secondUser,
        },
      },
    ) {
      return Message.create({
        type,
        text,
        firstUser,
        secondUser,
      });
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
      const user = await User.findOne({ where: { id } })
        .then(userFound => userFound.update({ likes }));
      return user;
    },
    updateGroup(
      _,
      {
        group: { id, name, photo },
      },
    ) {
      return Group.findOne({ where: { id } })
        .then(group => group.update({ name, photo }));
    },

    createUser(
      _,
      {
        user: { username, email, password },
      },
    ) {
      const user = User.create({
        username,
        email,
        password,
      });
      user.createPhoto({ url: 'http://blogs.grupojoly.com/la-sastreria/files/Manolo-Garc%C3%ADa.jpg', profile: true });
      return user;
    },

    async editPhotoprofile(
      _,
      {
        photo: { userId, url, comment },
      },
    ) {
      const userPhoto = await Photo.findOne({ where: { userId } }); // add profile: true to where, when photos profile work correctly
      await userPhoto.update({ profile: true, url });
      return userPhoto;
    },

    editUser(
      _,
      {
        user: {
          id, username, photoprofile, country, city, email, age, gender, civilStatus, children, street, streetNumber, zipcode, birthdate, height, weight, education, profession, religion, pets, smoker, description,
        },
      },
    ) {
      return User.findOne({ where: { id } }).then(user => user.update({
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
      }));
    },
    async editMiscreated(_, { id, userId }) {
      const craco = await User.findOne({ where: { id: userId } });
      const user = await User.findOne({ where: { id } });
      await user.addMiscreated(craco);
      await user.removeFriend(craco);
      // }
      return user;
    },
    async editFriend(_, { id, userId }) {
      const friend = await User.findOne({ where: { id: userId } });
      const user = await User.findOne({ where: { id } });
      await user.addFriend(friend);
      return user;
    },
    async deleteMiscreated(_, { id, userId }) {
      const craco = await User.findOne({ where: { id: userId } });
      const user = await User.findOne({ where: { id } });
      await user.removeMiscreated(craco);
      return user;
    },
    async deleteFriend(_, { id, userId }) {
      const friend = await User.findOne({ where: { id: userId } });
      const user = await User.findOne({ where: { id } });
      await user.removeFriend(friend);
      return user;
    },
    login(_, { email, password }, ctx) {
      // find user by email
      return User.findOne({ where: { email } }).then((user) => {
        if (user) {
          // validate password
          return bcrypt.compare(password, user.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                },
                JWT_SECRET,
              );
              ctx.user = Promise.resolve(user);
              user.jwt = token; // eslint-disable-line no-param-reassign
              return user;
            }
            return Promise.reject(new Error('password incorrect'));
          });
        }
        return Promise.reject(new Error('email not found'));
      });
    },
    signup(_, { email, password, username }, ctx) {
      // find user by email
      return User.findOne({ where: { email } }).then((existing) => {
        if (!existing) {
          // hash password and create user
          return bcrypt
            .hash(password, 10)
            .then(hash => User.create({
              email,
              password: hash,
              username: username || email,
            }))
            .then((user) => {
              const { id } = user;
              const token = jwt.sign({ id, email }, JWT_SECRET);
              ctx.user = Promise.resolve(user);
              user.jwt = token; // eslint-disable-line no-param-reassign
              return user;
            });
        }
        return Promise.reject(new Error('email already exists')); // email already exists
      });
    },
  },

  Group: {
    users(group) {
      return group.getUsers();
    },
    messages(group, { messageConnection = {} }) {
      const {
        first, last, before, after,
      } = messageConnection;

      // base query -- get messages from the right group
      const where = { groupId: group.id };

      // because we return messages from newest -> oldest
      // before actually means newer (id > cursor)
      // after actually means older (id < cursor)

      if (before) {
        // convert base-64 to utf8 id
        where.id = { $gt: Buffer.from(before, 'base64').toString() };
      }

      if (after) {
        where.id = { $lt: Buffer.from(after, 'base64').toString() };
      }

      return Message.findAll({
        where,
        order: [['id', 'DESC']],
        limit: first || last,
      }).then((messages) => {
        const edges = messages.map(message => ({
          cursor: Buffer.from(message.id.toString()).toString('base64'),
          // convert id to cursor
          node: message,
          // the node is the message itself
        }));
        return {
          edges,
          pageInfo: {
            hasNextPage() {
              if (!messages || !messages.length) {
                return Promise.resolve(false);
              }
              if (messages.length < (last || first)) {
                return Promise.resolve(false);
              }
              return Message.findOne({
                where: {
                  groupId: group.id,
                  id: {
                    [before ? '$gt' : '$lt']: messages[messages.length - 1].id,
                  },
                },
                order: [['id', 'DESC']],
              }).then(message => !!message);
            },
            hasPreviousPage() {
              return Message.findOne({
                where: {
                  groupId: group.id,
                  id: where.id,
                },
                order: [['id']],
              }).then(message => !!message);
            },
          },
        };
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
  Notification: {
    firstUser(notification) {
      return notification.getUser();
    },
    secondUser(notification) {
      return notification.getUser();
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
