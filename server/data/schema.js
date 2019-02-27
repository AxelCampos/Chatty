import { gql } from 'apollo-server';

export const typeDefs = gql`
  # declare custom scalars
  scalar Date

  # input for creating messages
  # text is the message text
  # userId is the id of the user sending the message
  # groupId is the id of the group receiving the message
  input CreateMessageInput {
    groupId: Int!
    userId: Int!
    text: String!
  }
  input CreateConversationInput {
    name: String!
    userIds: Int!
    userId: Int!
    photo: String
  }

  input CreateGroupInput {
    name: String!
    userIds: [Int!]
    userId: Int!
    photo: String
  }

  input CreateSearchInput {
    userId: Int!
    name: String
    gender: String
    civilStatus: String
    children: String
  }

  input CreateNotificationInput {
    type: String
    text: String
    firstUser: Int
    secondUser: Int
  }

  input UpdateGroupInput {
    id: Int!
    name: String
    photo: String
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  input CreatePhotoInput {
    userId: Int
    url: String
  }

  input UpdateUserInput {
    id: Int!
    likes: Int!
  }

  input PhotoInput {
    userId: Int!
    url: String!
    comment: String
  }

  input EditUserInput {
    id: Int!
    username: String
    photoprofile: PhotoInput
    country: String
    city: String
    email: String
    age: Int
    gender: String
    civilStatus: String
    children: String
    street: String
    streetNumber: String
    zipcode: String
    birthdate: String
    height: Int
    weight: Int
    education: String
    profession: String
    religion: String
    pets: String
    smoker: String
    description: String
  }

  #input for relay cursor connections
  input ConnectionInput {
    first: Int
    after: String
    last: Int
    before: String
  }
  type MessageConnection {
    edges: [MessageEdge]
    pageInfo: PageInfo!
  }
  type MessageEdge {
    cursor: String!
    node: Message!
  }
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
  type UserConnection {
    edges: [UserEdge]
    pageInfo: PageInfo!
  }
  type UserEdge {
    cursor: String!
    node: User!
  }
  # a group chat entity
  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User!]! # users in the group
    photo: String
    messages(messageConnection: ConnectionInput): MessageConnection # messages sent to the group
    album: [Photo!]!
    length: Int!
  }

  # a user -- keep type really simple for now
  type User {
    id: Int! # unique id for the user
    country: String
    city: String
    email: String! # we will also require a unique email per user
    username: String! # this is the name we'll show other users
    age: Int
    gender: String
    civilStatus: String
    children: String
    street: String
    streetNumber: String
    zipcode: String
    birthdate: String
    height: Int
    weight: Int
    education: String
    profession: String
    religion: String
    pets: String
    smoker: String
    description: String
    messages: [Message!]! # messages sent by user
    groups: [Group!]! # groups the user belongs to
    friends: [User] # user's friends/contacts
    likes: Int
    album: [Photo!]!
    photoprofile: Photo
    lifestyle: Lifestyle
    activities: [Activity]
    miscreated: [User]
    searches: [Search]
    notifications: [Notification]
    jwt: String
  }

  #union To = User | Group

  #a photo sent from a user to a group/user
  type Photo {
    id: Int!
    url: String!
    name: String!
    createdAt: Date!
    from: User!
    to: Group!
    comment: String
    profile: Boolean!
  }

  # a message sent from a user to a group
  type Message {
    id: Int! # unique id for message
    from: User! # user who sent the message
    text: String! # message text
    createdAt: Date! # when message was created
    to: Group!
  }

  type Lifestyle {
    id: Int!
    gender: String
    civilStatus: String
    nation: String
    children: String
    from: User!
  }

  type Activity {
    id: Int!
    type: String
  }

  type Search {
    id: Int!
    userId: User!
    name: String
    gender: String
    civilStatus: String
    children: String
  }

  type Notification {
    id: Int!
    type: String
    text: String
    firstUser: User
    secondUser: User
    createAt: Date!
  }

  # query for types
  type Query {
    users(email: String, id: Int): [User]
    usersPage(userConnection: ConnectionInput): UserConnection
    # Return a user by their email or id
    user(email: String, id: Int): User
    # Return messages sent by a user via userId
    messages(userId: Int): [Message]
    # Return a group by its id
    group(id: Int): Group
    # Return a photo by its id or name
    photo(id: Int, name: String): [Photo]
    # Return user's lifestyle
    lifestyles(id: Int, userId: Int): [Lifestyle]
    # Return activities
    activities(id: Int, userId: Int): [Activity]
    # Return search
    searches(userId: Int): [Search]
    # Return notifications
    notifications(userId: Int): [Notification]
  }

  type Mutation {
    # send a message to a group
    createMessage(message: CreateMessageInput): Message
    createConversation(group: CreateConversationInput!): Group
    createGroup(group: CreateGroupInput!): Group
    createSearch(search: CreateSearchInput!): Search
    createNotification(notification: CreateNotificationInput): Notification
    createPhoto(photo: CreatePhotoInput): Photo
    deleteGroup(id: Int!): Group
    deleteSearch(id: Int!): Search
    leaveGroup(id: Int!, userId: Int!): Group
    updateGroup(group: UpdateGroupInput!): Group
    updateUser(user: UpdateUserInput!): User
    createUser(user: CreateUserInput!): User
    editUser(user: EditUserInput!): User
    editMiscreated(id: Int, userId: Int): User
    editFriend(id: Int, userId: Int): User
    editPhotoprofile(photo: PhotoInput!): Photo
    deleteMiscreated(id: Int, userId: Int): User
    deleteFriend(id: Int, userId: Int): User
    login(email: String!, password: String!): User
    signup(email: String!, password: String!, username: String): User
  }

   type Subscription {
    # Subscription fires on every message added
    # for any of the groups with one of these groupIds
    messageAdded(userId: Int, groupIds: [Int]): Message
    groupAdded(userId: Int): Group
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
export default typeDefs;
