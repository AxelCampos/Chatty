
import { graphql, compose } from 'react-apollo';
import withLoading from '../../../components/withLoading';
import CREATE_CONVERSATION_MUTATION from '../../../graphql/create-conversation.mutation';
import UPDATE_USER_MUTATION from '../../../graphql/update-user.mutation';
import USER_QUERY from '../../../graphql/user.query';
import EDIT_FRIEND_MUTATION from '../../../graphql/edit-friend.mutation';
import Profile from '../components/profile';

const createConversationMutation = graphql(CREATE_CONVERSATION_MUTATION, {
  props: ({ mutate }) => ({
    createConversation: group => mutate({
      variables: { group },
      refetchQueries: [{ query: USER_QUERY }],
    }),
  }),
});
const updateUserMutation = graphql(UPDATE_USER_MUTATION, {
  props: ({ mutate }) => ({
    updateUser: user => mutate({
      variables: { user },

      update: (store, { data: { updateUser } }) => {
        const data = store.readQuery({
          query: USER_QUERY,
          variables: {
            id: user.id,
          },
        });
        data.user.likes = updateUser.likes;

        store.writeQuery({
          query: USER_QUERY,
          variables: {
            id: user.id,
          },
          data,
        });
      },
    }),
  }),
});
const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({
    variables: {
      id: ownProps.navigation.state.params.userId,
    },
  }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
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

export default compose(
  userQuery,
  withLoading,
  createConversationMutation,
  updateUserMutation,
  editFriendMutation,
)(Profile);
