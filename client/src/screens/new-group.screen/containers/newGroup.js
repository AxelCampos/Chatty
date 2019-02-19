import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { USER_QUERY } from '../../../graphql/user.query';
import CREATE_CONVERSATION_MUTATION from '../../../graphql/create-conversation.mutation';
import NewGroup from '../components/newGroup';

const mapStateToProps = ({ auth }) => ({
  auth,
});

const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({ variables: { id: ownProps.auth.id } }), // fake for now
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
  connect(mapStateToProps),
  userQuery,
  createConversationMutation,
)(NewGroup);
