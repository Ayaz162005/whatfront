import { gql, useQuery } from "@apollo/client";

// Define your GraphQL query to fetch the current user data
export const GET_CURRENT_USER_Chats = gql`
  query {
    me {
      _id
      username
      email
      phone
      phoneChecked
      emailChecked
      chats {
        name
        _id
        isGroupChat
        receiverName
        senderName
        messages {
          timestamp
          content
          isVoice
        }
        users {
          username
          _id
          phone
        }
      }
    }
  }
`;

// Create the hook useCurrentUser
export const useGetUserChats = () => {
  // Execute the query using useQuery hook
  const { loading, error, data } = useQuery(GET_CURRENT_USER_Chats);
  console.log(data);
  return {
    loading,
    error,
    data,
  };
};
