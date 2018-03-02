import { SubscriptionClient } from 'subscriptions-transport-ws';
import { GC_AUTH_TOKEN } from './Constants';

const {
  Environment,
  Network,
  RecordSource,
  Store,
} = require('relay-runtime');

const store = new Store(new RecordSource());

export const fetchQuery = (operation, variables) => {
  return fetch(`https://api.graph.cool/relay/v1/${process.env.REACT_APP_PROJECT_ID}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(GC_AUTH_TOKEN)}`
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

const setupSubscription = (config, variables, cacheConfig, observer) => {
  const query = config.text;

  const subscriptionClient = new SubscriptionClient(`wss://subscriptions.graph.cool/v1/${process.env.REACT_APP_PROJECT_ID}`, {reconnect: true})
  subscriptionClient.subscribe({query, variables}, (error, result) => {
    observer.onNext({data: result})
  })
}

const network = Network.create(fetchQuery, setupSubscription)

const environment = new Environment({
  network,
  store,
});

export default environment;