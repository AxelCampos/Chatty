import gql from 'graphql-tag';
const CREATE_CONVERSATION_MUTATION=gql`
    mutation createConversation( $group: CreateConversationInput!){
        createConversation(group:$group){
            id
            name
            users{
                id
            }
        }
    }
`;
export default CREATE_CONVERSATION_MUTATION;