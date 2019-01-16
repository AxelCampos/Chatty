import { graphql, compose } from 'react-apollo';
import { USER_QUERY } from '../../../graphql/user.query';
import { USERS_QUERY } from '../../../graphql/users.query';
import SEARCHES_QUERY from '../../../graphql/searches.query';
import CREATE_SEARCH_MUTATION from '../../../graphql/create-search.mutation';
import { withLoading } from '../../../components/withLoading';
import LifestyleResult from '../components/lifestyle-result';

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
  options: () => ({}), // fake the user for now
  props: ({ data: { users } }) => ({
    users: users || [],
  }),
});

const searchesQuery = graphql(SEARCHES_QUERY, {
  options: () => ({}),
  /* options: (ownProps) => ({
      variables: {
          id: ownProps.navigation.state.params.userId,
      },
  }), */
  props: ({ data: { searches } }) => ({
    searches: searches || [],
  }),
});

const createSearchMutation = graphql(CREATE_SEARCH_MUTATION, {
  props: ({ mutate }) => ({
    createSearch: search => mutate({
      variables: { search },
      refetchQueries: [{ query: SEARCHES_QUERY }]
      /* ,
  update: (store, { data: { searchGroup } }) => {
    // Read the data from our cache for this query.
    const data = store.readQuery({ query: USER_QUERY, variables: { id: group.userId } });
    // Add our message from the mutation to the end.
    data.user.groups.push(createGroup);
    // Write our data back to the cache.
    store.writeQuery({
      query: USER_QUERY,
      variables: { id: group.userId },
      data,
    });
  }, */
    }),
  }),
});

export default compose(
  createSearchMutation,
  searchesQuery,
  userQuery,
  usersQuery,
  withLoading,
)(LifestyleResult);
