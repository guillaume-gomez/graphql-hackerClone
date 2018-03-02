import { GC_AUTH_TOKEN } from './Constants';

const {
  Environment,
  Network,
  RecordSource,
  Store,
} = require('relay-runtime');

const store = new Store(new RecordSource());

const network = Network.create((operation, variables) => {
  return fetch(process.env.REACT_APP_RELAY_API_ENDPOINT, {
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
    return response.json();
  })
});

const environment = new Environment({
  network,
  store,
});

export default environment