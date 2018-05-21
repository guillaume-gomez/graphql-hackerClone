import {
  commitMutation,
  graphql
} from 'react-relay';
import environment from '../Environment';

const mutation = graphql`
  mutation SigninUserMutation($input: SigninUserInput!) {
    signinUser(input: $input) {
      token
      user {
        id
      }
    }
  }
`;

export default (email, password, callback) => {
  const variables = {
    input: {
      email: {
        email,
        password
      },
      clientMutationId: ""
    },
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response, error) => {
        const id = response ? response.signinUser.user.id : null;
        const token = response ? response.signinUser.token : null;
        const errorMessage = error ? error[0].message : null;
        callback(id, token, errorMessage);
      },
      onError: err => console.error(err)
    },
  )
}