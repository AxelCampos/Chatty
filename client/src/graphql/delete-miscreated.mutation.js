import gql from 'graphql-tag';

export const DELETE_MISCREATED_MUTATION = gql`
  mutation deleteMiscreated($id: Int, $userId: Int) {
    deleteMiscreated(id: $id, userId: $userId) {
      id
    }
  }
`;
export default DELETE_MISCREATED_MUTATION;