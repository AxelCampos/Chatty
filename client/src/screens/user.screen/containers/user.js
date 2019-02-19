import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { USER_QUERY } from '../../../graphql/user.query';
import withLoading from '../../../components/withLoading';
import Profile from '../../profile.screen/components/profile';

const mapStateToProps = ({ auth }) => ({
  auth,
});

const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({
    variables: {
      id: ownProps.auth.id,
    },
  }),
  props: ({ data: { loading, user } }) => ({
    loading,
    user,
    loggedUser: true,
  }),
});
export default compose(
  connect(mapStateToProps),
  userQuery,
  withLoading,
)(Profile);
