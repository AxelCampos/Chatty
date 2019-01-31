import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableHighlight,
    Button,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import Searches from '../components/searches';
import withLoading from '../../../components/withLoading';
import SEARCHES_QUERY from '../../../graphql/searches.query';
import DELETE_SEARCH_MUTATION from '../../../graphql/delete-search.mutation';

const deleteSearchMutation = graphql(DELETE_SEARCH_MUTATION, {
    props: ({ mutate }) => ({
        deleteSearch: id => mutate({
            variables: { id },
            refetchQueries: [{ query: SEARCHES_QUERY }],
            /* ,
                  update: (store, { data: { deleteSearch } }) => {
                      //  Read the data from our cache for this query.
                      const data = store.readQuery({ query: SEARCH_QUERY, variables: { id: 1 } });
                      //  Add our message from the mutation to the end.
                      data.search = data.search.filter(item => deleteSearch.id !== item.id);
                      //  Write our data back to the cache.
                      store.writeQuery({
                          query: SEARCH_QUERY,
                          variables: { id: 1 },
                          data,
                      });
                  }, */
        }),
    }),
});

const searchesQuery = graphql(SEARCHES_QUERY, {
    options: () => ({}),
    /* options: (ownProps) => ({
        variables: {
            id: ownProps.navigation.state.params.userId,
        },
    }), */
    props: ({ data: { searches } }) => ({
        searches: searches || [],
    }),
});

export default compose(
    deleteSearchMutation,
    searchesQuery,
    withLoading,
)(Searches);
