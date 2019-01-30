import R from 'ramda';
import { graphql, compose } from 'react-apollo';
import { USERS_PAGE_QUERY } from '../../../graphql/usersPage.query';
import withLoading from '../../../components/withLoading';
import Tendencies from '../components/tendencies';

const ITEMS_PER_PAGE = 8;
const initialUserConnection = { first: ITEMS_PER_PAGE };

// FIXME: la variable pasa como null por algún motivo
const usersPageQuery = graphql(USERS_PAGE_QUERY, {
  options: () => ({}), // fake the user for now
  variables: {
    userConnection: initialUserConnection,
  },

  props: ({ data: { fetchMore, usersPage } }) => ({
    usersPage: usersPage || {},
    loadMoreEntries() {
      return fetchMore({
        // query: ... (you can specify a different query.
        // USERS_PAGE_QUERY is used by default
        variables: {
          userConnection: {
            first: ITEMS_PER_PAGE,
            after: usersPage.edges[usersPage.edges.length - 1].cursor,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          const edgesLens = R.lensPath(['usersPage', 'edges']);
          const pageInfoLens = R.lensPath(['usersPage', 'pageInfo']);

          const moreEdges = R.view(edgesLens, fetchMoreResult);

          // push the new results
          return R.compose(
            R.set(pageInfoLens, R.view(pageInfoLens, fetchMoreResult)),
            R.over(edgesLens, xs => R.concat(xs, moreEdges)),
          )(previousResult);
        },
      });
    },
  }),

});

export default compose(
  usersPageQuery,
  withLoading,
)(Tendencies);
