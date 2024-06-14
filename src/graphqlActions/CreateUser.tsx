import { gql, useMutation } from "@apollo/client";

const createUserDocument = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      user {
        _id
        username
        email
        phoneChecked
        emailChecked
      }
      token {
        access_token
      }
    }
  }
`;

export const useCreateUser = () => {
  return useMutation(createUserDocument);
};
