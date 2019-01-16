import { graphql, compose } from 'react-apollo';
import GROUP_QUERY from '../../../graphql/group.query';
import CREATE_MESSAGE_MUTATION from '../../../graphql/create-message.mutation';
import { withLoading } from '../../../components/withLoading';
import Messages from '../components/messages';

const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({
    variables: {
      groupId: ownProps.navigation.state.params.groupId,
    },
  }),
  props: ({ data: { loading, group } }) => ({
    loading,
    group,
  }),
});

const createMessageMutation = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ mutate }) => ({
    createMessage: message => mutate({
      variables: { message },
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'Message',
          id: -1,
          text: message.text,
          createdAt: new Date().toISOString(),
          from: {
            __typename: 'User',
            id: 1,
            username: 'Liza43',
          },
          to: {
            __typename: 'Group',
            id: message.groupId,
          },
        },
      },
      update: (store, { data: { createMessage } }) => {
        // Read the data from our cache for this query
        const groupData = store.readQuery({
          query: GROUP_QUERY,
          variables: {
            groupId: message.groupId,
          },
        });
        // Add our message from the mutation to the end
        groupData.group.messages.unshift(createMessage);
        // Write our data back to the cache.
        store.writeQuery({
          query: GROUP_QUERY,
          variables: {
            groupId: message.groupId,
          },
          data: groupData,
        });
      },
    }),
  }),
});
export default compose(
  groupQuery,
  createMessageMutation,
  withLoading,
)(Messages);
