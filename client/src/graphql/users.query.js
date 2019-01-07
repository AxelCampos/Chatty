import gql from 'graphql-tag';
// get all the users
export const USERS_QUERY = gql`
  query users {
    users {
      id
      email
      username
      age
      gender
      civilStatus
      children
      city
      country
      likes
      photoprofile {
        id
        url
      }
      groups {
        id
        name
      }
      album {
        id
        url
      }
    }
  }
`;
export default USERS_QUERY;
