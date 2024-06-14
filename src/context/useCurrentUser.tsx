import { gql, useQuery } from "@apollo/client";

// Define your GraphQL query to fetch the current user data
export const GET_CURRENT_USER = gql`
  query {
    me {
      _id
      username
      email
      phone
      phoneChecked
      emailChecked
    }
  }
`;

// Create the hook useCurrentUser
export const useCurrentUser = () => {
  // Execute the query using useQuery hook
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  return {
    loading,
    error,
    data,
  };
};
