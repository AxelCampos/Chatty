import { graphql, compose } from 'react-apollo';
import { USERS_QUERY } from '../../../graphql/users.query';
import withLoading from '../../../components/withLoading';
import Tendencies from '../components/tendencies';
const usersQuery = graphql(USERS_QUERY, {
    options: () => ({}), // fake the user for now
    props: ({ data: { users } }) => ({
      users: users || [],
    }),
  });
  
  export default compose(
    usersQuery,
    withLoading,
  )(Tendencies);
  