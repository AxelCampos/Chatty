import { graphql, compose } from 'react-apollo';

import { USER_QUERY } from '../../../graphql/user.query';
import withLoading from '../../../components/withLoading';
import User from '../components/user';

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
export default compose(
  userQuery,
  withLoading,
)(User);
