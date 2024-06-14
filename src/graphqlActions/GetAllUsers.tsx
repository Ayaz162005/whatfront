import { gql, useQuery } from "@apollo/client";

const getAllUsersDocument = gql`
  query {
    users {
      email
    }
  }
`;

export const useGetAllUsers = () => {
  const { data, error, loading } = useQuery(getAllUsersDocument);
  // You might want to return data, error, loading from this custom hook
  return { data, error, loading };
};
