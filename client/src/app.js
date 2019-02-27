import React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHttpLink } from 'apollo-link-http';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { ReduxCache, apolloReducer } from 'apollo-cache-redux';
import ReduxLink from 'apollo-link-redux';
import { onError } from 'apollo-link-error';
import Config from 'react-native-config';
import thunk from 'redux-thunk';
import { setContext } from 'apollo-link-context';
import { AsyncStorage } from 'react-native';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistStore, persistCombineReducers } from 'redux-persist';
import auth from './reducers/auth.reducer';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import AppWithNavigationState, { navigationReducer, navigationMiddleware } from './navigation';

const URL = Config.SERVER_URL;
const config = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['nav', 'apollo'], // don't persist nav for now
};
const store = createStore(
  persistCombineReducers(config, {
    apollo: apolloReducer,
    nav: navigationReducer,
    auth,
  }),
  {}, // initial state
  composeWithDevTools(applyMiddleware(thunk, navigationMiddleware)),
);
const cache = new ReduxCache({ store });
const reduxLink = new ReduxLink(store);
const errorLink = onError((errors) => {
  console.log(errors);
});
const httpLink = createHttpLink({ uri: `http://${URL}` });

export const wsClient = new SubscriptionClient(
  `ws://${Config.SERVER}/graphql`,
  {
    reconnect: true,
    connectionParams: {
      // Pass any arguments you want for initialization
    },
  },
);

const webSocketLink = new WebSocketLink(wsClient);

const requestLink = ({ queryOrMutationLink, subscriptionLink }) => ApolloLink.split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  subscriptionLink,
  queryOrMutationLink,
);

// middleware for requests
const middlewareLink = setContext((req, previousContext) => {
  // get the authentication token from local storage if it exists
  const { jwt } = store.getState().auth;
  if (jwt) {
    return {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    };
  }
  return previousContext;
});
const link = ApolloLink.from([
  reduxLink,
  errorLink,
  requestLink({
    queryOrMutationLink: middlewareLink.concat(httpLink),
    subscriptionLink: webSocketLink,
  }),
]);

export const client = new ApolloClient({
  link,
  cache,
});
const persistor = persistStore(store);
const App = () => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppWithNavigationState />
      </PersistGate>
    </Provider>
  </ApolloProvider>
);
export default App;
