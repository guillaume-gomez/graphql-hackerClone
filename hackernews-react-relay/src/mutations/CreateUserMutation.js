import {
  commitMutation,
  graphql
} from 'react-relay';
import environment from '../Environment';

const mutation = graphql`
  mutation CreateUserMutation($createUserInput: SignupUserInput!, $signinUserInput: SigninUserInput!) {
    createUser(input: $createUserInput) {
      user {
        id
      }
    }

    signinUser(input: $signinUserInput) {
      token
      user {
        id
      }
    }
  }
`;

export default (name, email, password, callback) => {
  const variables = {
    createUserInput: {
      name,
      authProvider: {
        email: {
          email,
          password
        }
      },
      clientMutationId: ""
    },
    // 2
    signinUserInput: {
      email: {
        email,
        password
      },
      clientMutationId: ""
    }
  }

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response, error) => {
        const id = response ? response.createUser.user.id : null;
        const token = response ? response.signinUser.token : null;
        const errorMessage = error ? error[0].message : null;
        callback(id, token, errorMessage);
      },
      onError: err => console.error(err)
    },
  )
}