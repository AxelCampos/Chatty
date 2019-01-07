import gql from 'graphql-tag';

const EDIT_MISCREATED_MUTATION = gql`
  mutation editMiscreated($id: Int, $userId: Int) {
    editMiscreated(id: $id, userId: $userId) {
      id
    }
  }
`;
export default EDIT_MISCREATED_MUTATION;
