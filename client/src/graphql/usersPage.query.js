import gql from 'graphql-tag';

export const USERS_PAGE_QUERY = gql`
query usersPage ($userConnection: ConnectionInput = { first: 8 }){
   usersPage(userConnection: $userConnection) { 
        edges{
            cursor
            node{
                id
                username
                likes
                city 
                country
                photoprofile{
                    id
                    url
                }

            }
        }
        pageInfo{
            hasNextPage
            hasPreviousPage
        }
    }
}
`;
export default USERS_PAGE_QUERY;
