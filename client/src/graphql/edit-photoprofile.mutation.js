import gql from 'graphql-tag';

const EDIT_PHOTOPROFILE_MUTATION = gql`
  mutation editPhotoprofile($photo: PhotoInput!) {
    editPhotoprofile(photo: $photo) {
      id
    }
  }
`;

export default EDIT_PHOTOPROFILE_MUTATION;
