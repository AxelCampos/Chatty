import gql from 'graphql-tag';

export const SEARCHES_QUERY = gql`
    query searches{
        searches{
            id
            userId {
                id
            }
            name
            gender
            civilStatus
            children
        }
    }
`;

/*export const SEARCHES_QUERY = gql`
    query searches($userId: Int){
        searches(userId: $userId){
            id
            userId {
                id
            }
            name
            gender
            civilStatus
            children
        }
    }
`;*/

export default SEARCHES_QUERY;