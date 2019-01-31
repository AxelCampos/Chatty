import gql from 'graphql-tag';
// get all the users
export const USERS_MAP_QUERY = gql`
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
      searches{
          id
          gender
          civilStatus
          children
          userId{
              id
          }
      }
    }
  }
`;
export default USERS_MAP_QUERY;
