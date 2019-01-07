import gql from 'graphql-tag';

const EDIT_GROUP_MUTATION = gql`
  mutation UpdateGroup($group: UpdateGroupInput!) {
    updateGroup(group: $group) {
      id
      name
      photo
    }
  }
`;
export default EDIT_GROUP_MUTATION;
