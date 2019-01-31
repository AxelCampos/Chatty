import { graphql, compose } from 'react-apollo';
import { USER_QUERY } from '../../../graphql/user.query';
import CREATE_CONVERSATION_MUTATION from '../../../graphql/create-conversation.mutation';
import NewGroup from '../components/newGroup';

const userQuery = graphql(USER_QUERY, {
  options: () => ({ variables: { id: 1 } }), // fake for now
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
  }),
});

const createConversationMutation = graphql(CREATE_CONVERSATION_MUTATION, {
  props: ({ mutate }) => ({
    createConversation: group => mutate({
      variables: { group },
      refetchQueries: [{ query: USER_QUERY }],
    }),
  }),
});

export default compose(
  userQuery,
  createConversationMutation,
)(NewGroup);
