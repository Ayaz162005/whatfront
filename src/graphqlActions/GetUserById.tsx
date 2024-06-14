import { gql, useQuery } from "@apollo/client";

const GET_USER_BY_ID = gql`
  query User($id: String!) {
    user(id: $id) {
      username
      email
      _id
      phone
      emailChecked
    }
  }
`;

export const useGetUserById = (userId: string) => {
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  return { data, loading, error };
};
