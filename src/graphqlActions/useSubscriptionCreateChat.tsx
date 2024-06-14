import { gql, useSubscription } from "@apollo/client";
import { GET_CURRENT_USER_Chats } from "./GetUsersChats";

const CREATE_CHAT_SUBSCRIPTION = gql`
  subscription {
    chatAdded {
      _id
      name
      users {
        _id
        phone
        username
      }
    }
  }
`;

export const useSubscriptionCreateChat = () => {
  const { data, loading, error } = useSubscription(CREATE_CHAT_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      if (data) {
        const newChat = data.data.chatAdded;

        const chats = client.readQuery({ query: GET_CURRENT_USER_Chats });

        client.writeQuery({
          query: GET_CURRENT_USER_Chats,
          data: {
            me: {
              chats: [...chats.me.chats, newChat],
            },
          },
        });
      }
    },
  });
  return { data, loading, error };
};
