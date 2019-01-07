import gql from 'graphql-tag';

const EDIT_FRIEND_MUTATION = gql`
  mutation editFriend($id: Int, $userId: Int) {
    editFriend(id: $id, userId: $userId) {
      id
    }
  }
`;
export default EDIT_FRIEND_MUTATION;
