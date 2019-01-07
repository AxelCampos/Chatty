import gql from 'graphql-tag';

const CREATE_USER_MUTATION = gql`
  mutation createUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      username
      email
    }
  }
`;
export default CREATE_USER_MUTATION;
