import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, Observable, split } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import fetch from 'isomorphic-unfetch';
import config from '../config';
import { getAccessToken, getNewAccessToken } from './auth';

let apolloClient = null;

interface IProcess {
  browser: boolean;
}

declare var process: IProcess;

interface IGlobal {
  fetch: any;
}
declare var global: IGlobal;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState) {
  const httpLink = new BatchHttpLink({
    uri: config.gqlUrl,
    credentials: 'same-origin'
  });

  const authLink = setContext((_, { headers }) => {
    const accessToken = getAccessToken();

    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    };
  });

  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (const err of graphQLErrors) {
          switch (err.extensions.code) {
            case 'UNAUTHENTICATED':
              // error code is set to UNAUTHENTICATED
              // when AuthenticationError thrown in resolver
              return new Observable(observer => {
                getNewAccessToken()
                  .then(accessToken => {
                    operation.setContext(({ headers = {} }) => ({
                      headers: {
                        // Re-add old headers
                        ...headers,
                        // Switch out old access token for new one
                        authorization: accessToken
                          ? `Bearer ${accessToken}`
                          : ''
                      }
                    }));
                  })
                  .then(() => {
                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer)
                    };

                    // Retry last failed request
                    forward(operation).subscribe(subscriber);
                  })
                  .catch(error => {
                    // No refresh or client token available, we force user to login
                    observer.error(error);
                  });
              });
          }
        }
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
        // if you would also like to retry automatically on
        // network errors, we recommend that you use
        // apollo-link-retry
      }
    }
  );

  const link = ApolloLink.from([authLink, errorLink]).concat(httpLink);

  const wsLink = process.browser
    ? new WebSocketLink({
        uri: config.wsgqlUrl,
        options: {
          reconnect: true,
          connectionParams: () => {
            const accessToken = getAccessToken();
            return { accessToken };
          }
        }
      })
    : null;

  const isSubscriptionOperation = ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  };

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: process.browser ? split(isSubscriptionOperation, wsLink, link) : link,
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
