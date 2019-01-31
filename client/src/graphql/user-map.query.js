import gql from 'graphql-tag';
// get the user and all user's groups
import MESSAGE_FRAGMENT from './message.fragment';

export const USER_MAP_QUERY = gql`
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
      street
      streetNumber
      zipcode
      birthdate
      height
      weight
      education
      profession
      religion
      pets
      smoker
      description
      photoprofile {
        id
        url
      }
      groups {
        id
        name
        messages(messageConnection: { first: 1 }) {
          # we don't need to use variables
          edges {
            cursor
            node {
              ...MessageFragment
            }
          }
        }
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
      searches {
        id
        gender
        civilStatus
        children
        userId {
          id
        }
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;
export default USER_MAP_QUERY;
