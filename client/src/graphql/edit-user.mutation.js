import gql from 'graphql-tag';

const EDIT_USER_MUTATION = gql`
    mutation editUser($user: EditUserInput!){
        editUser(user:$user){
            id
            username
            country
            city
            email
            age
            gender
            civilStatus
            children
            likes
        }
    }
`;
export default EDIT_USER_MUTATION;