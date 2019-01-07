import gql from 'graphql-tag';

export const CREATE_SEARCH_MUTATION = gql`
    mutation createSearch($search: CreateSearchInput!){
        createSearch(search:$search){
            userId{
                id
            }
            name
            gender
            civilStatus
            children
        }
    }
`;
export default CREATE_SEARCH_MUTATION;