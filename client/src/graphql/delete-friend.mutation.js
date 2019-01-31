import gql from 'graphql-tag';

export const DELETE_FRIEND_MUTATION = gql`
  mutation deleteFriend($id: Int, $userId: Int) {
    deleteFriend(id: $id, userId: $userId) {
      id
    }
  }
`;
export default DELETE_FRIEND_MUTATION;