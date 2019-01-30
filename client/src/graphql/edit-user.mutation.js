import gql from 'graphql-tag';

const EDIT_USER_MUTATION = gql`
  mutation editUser($user: EditUserInput!) {
    editUser(user: $user) {
      id
      username
      photoprofile {
        id
        url
      }
      country
      city
      email
      age
      gender
      civilStatus
      children
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
    }
  }
`;
export default EDIT_USER_MUTATION;
