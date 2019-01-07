import gql from 'graphql-tag';

export const DELETE_SEARCH_MUTATION = gql`
  mutation deleteSearch($id: Int!) {
    deleteSearch(id: $id) {
      id
    }
  }
`;
export default DELETE_SEARCH_MUTATION;