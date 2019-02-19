import gql from "graphql-tag";

const SIGNUP_MUTATION = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      jwt
      username
    }
  }
`;

export default SIGNUP_MUTATION;
