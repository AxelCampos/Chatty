import { graphql, compose } from 'react-apollo';

import USER_QUERY from '../../../graphql/user.query';
import USERS_QUERY from '../../../graphql/users.query';
import CREATE_CONVERSATION_MUTATION from '../../../graphql/create-conversation.mutation';
import UPDATE_USER_MUTATION from '../../../graphql/update-user.mutation';
import EDIT_FRIEND_MUTATION from '../../../graphql/edit-friend.mutation';
import EDIT_MISCREATED_MUTATION from '../../../graphql/edit-miscreated.mutation';

import { withLoading } from '../../../components/withLoading';

import Match from '../components/match';

const userQuery = graphql(USER_QUERY, {
  options: () => ({
    variables: {
      id: 1,
    },
  }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
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
    createConversation: group => mutate({
      variables: { group },
      refetchQueries: [{ query: USERS_QUERY }],
    }),
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
      refetchQueries: [{ query: USER_QUERY }],
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
