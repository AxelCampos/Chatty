import Sequelize from 'sequelize';
// initialize our database
const db = new Sequelize('chatty', null, null, {
  dialect: 'sqlite',
  storage: './chatty.sqlite',
  logging: false, // mark this true if you want to see logs
});
// define groups
const GroupModel = db.define('group', {
  name: { type: Sequelize.STRING },
  photo: { type: Sequelize.STRING },
});
// define messages
const MessageModel = db.define('message', {
  text: { type: Sequelize.STRING },
});
// define users
const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  country: { type: Sequelize.STRING },
  city: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  age: { type: Sequelize.INTEGER },
  gender: { type: Sequelize.STRING },
  civilStatus: { type: Sequelize.STRING },
  children: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  likes: { type: Sequelize.STRING },
  street: { type: Sequelize.STRING },
  streetNumber: { type: Sequelize.STRING },
  zipcode: { type: Sequelize.STRING },
  birthdate: { type: Sequelize.STRING },
  height: { type: Sequelize.INTEGER },
  weight: { type: Sequelize.INTEGER },
  education: { type: Sequelize.STRING },
  profession: { type: Sequelize.STRING },
  religion: { type: Sequelize.STRING },
  pets: { type: Sequelize.STRING },
  smoker: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
});
// define photos
const PhotoModel = db.define('photo', {
  url: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING },
  comment: { type: Sequelize.STRING },
});
// define lifestyle
const LifestyleModel = db.define('lifestyle', {
  gender: { type: Sequelize.STRING },
  civilStatus: { type: Sequelize.STRING },
  nation: { type: Sequelize.STRING },
  children: { type: Sequelize.STRING },
});
// define activities
const ActivityModel = db.define('activity', {
  type: { type: Sequelize.STRING },
});
const SearchModel = db.define('search', {
  name: { type: Sequelize.STRING },
  gender: { type: Sequelize.STRING },
  civilStatus: { type: Sequelize.STRING },
  children: { type: Sequelize.STRING },
});
const NotificationModel = db.define('notification', {
  text: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING },
});

// users belong to multiple groups
UserModel.belongsToMany(GroupModel, { through: 'GroupUser' });
// users belong to multiple users as friends
UserModel.belongsToMany(UserModel, { through: 'Friends', as: 'friends' });
UserModel.belongsToMany(UserModel, { through: 'Miscreated', as: 'miscreated' });
// messages are sent from users
MessageModel.belongsTo(UserModel);
// messages are sent to groups
MessageModel.belongsTo(GroupModel);
// groups have multiple users
GroupModel.belongsToMany(UserModel, { through: 'GroupUser' });
// photos are sent from users
PhotoModel.belongsTo(UserModel);
// LifestyleModel are chosen by users
LifestyleModel.belongsTo(UserModel);
ActivityModel.belongsToMany(UserModel, { through: 'ActivityUser' });
UserModel.belongsToMany(ActivityModel, { through: 'ActivityUser' });
SearchModel.belongsTo(UserModel);
NotificationModel.belongsTo(UserModel);

const Group = db.models.group;
const Message = db.models.message;
const User = db.models.user;
const Photo = db.models.photo;
const Lifestyle = db.models.lifestyle;
const Activity = db.models.activity;
const Search = db.models.search;
const Notification = db.models.notification;

export {
  db, Group, Message, User, Photo, Lifestyle, Activity, Search, Notification
};
