import { gql } from 'apollo-server';

export const typeDefs = gql`
  # declare custom scalars
  scalar Date

  # input for creating messages
  # text is the message text
  # userId is the id of the user sending the message
  # groupId is the id of the group receiving the message
  input CreateMessageInput {
    userId: Int!
    groupId: Int!
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

  input UpdateGroupInput {
    id: Int!
    name: String
    photo: String
  }

  input UpdateUserInput {
    id: Int!
    likes: Int!
  }

  input EditUserInput {
    id: Int!
    username: String
    country: String!
    city: String!
    email: String!
    age: Int!
    gender: String
    civilStatus: String
    children: String
    likes: Int
  }

  # a group chat entity
  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User!]! # users in the group
    photo: String
    messages: [Message!]! # messages sent to the group
    album: [Photo!]!
    length: Int!
  }

  # a user -- keep type really simple for now
  type User {
    id: Int! # unique id for the user
    country: String!
    city: String!
    email: String! # we will also require a unique email per user
    username: String! # this is the name we'll show other users
    age: Int!
    gender: String
    civilStatus: String
    children: String
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
    subscription: [User]
  }

  type Search {
    id: Int!
    userId: User!
    name: String
    gender: String
    civilStatus: String
    children: String
  }

  # query for types
  type Query {
    users(email: String, id: Int): [User]
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
  }

  type Mutation {
    # send a message to a group
    createMessage(message: CreateMessageInput): Message
    createConversation(group: CreateConversationInput!): Group
    createGroup(group: CreateGroupInput!): Group
    createSearch(search: CreateSearchInput!): Search
    deleteGroup(id: Int!): Group
    deleteSearch(id: Int!): Search
    leaveGroup(id: Int!, userId: Int!): Group
    updateGroup(group: UpdateGroupInput!): Group
    updateUser(user: UpdateUserInput!): User
    editUser(user: EditUserInput!): User
    editMiscreated(id: Int, userId: Int): User
    editFriend(id: Int, userId: Int): User
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;
export default typeDefs;
