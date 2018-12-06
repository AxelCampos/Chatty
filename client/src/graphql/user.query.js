import gql from 'graphql-tag';
// get the user and all user's groups
export const USER_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
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
        photo
        users {
          id
          photoprofile {
            id
            url
          }
        }
      }
      album {
        id
        url
      }
      friends {
        id
        username
        photoprofile {
          id
          url
        }
      }
      miscreated {
        id
        username
      }
    }
  }
`;
export default USER_QUERY;
