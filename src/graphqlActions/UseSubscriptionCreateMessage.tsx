import { gql, useSubscription } from "@apollo/client";
import { GetMessagesByChatId } from "./GetMessagesWithChat";
import { GET_CURRENT_USER_Chats } from "./GetUsersChats";
const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription {
    messageAdded {
      _id
      content
      chat {
        _id
      }
      sender {
        _id
        phone
      }
    }
  }
`;
export const useSubscriptionCreateMessage = () => {
  const { data, loading, error } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      if (data) {
        const messagesQueryOptions = {
          query: GetMessagesByChatId,
          variables: { chatId: data.data.messageAdded.chat._id },
        };

        const newMessage = data.data.messageAdded;

        const messages = client.readQuery({ ...messagesQueryOptions });

        if (messages) {
          client.writeQuery({
            ...messagesQueryOptions,
            data: {
              getAllMessagesByChatId: [
                ...messages.getAllMessagesByChatId,
                newMessage,
              ],
            },
          });
        } else {
          client.writeQuery({
            ...messagesQueryOptions,
            data: {
              getAllMessagesByChatId: [newMessage],
            },
          });
        }

        const mess = client.readQuery({
          query: GET_CURRENT_USER_Chats,
        });

        client.writeQuery({
          query: GET_CURRENT_USER_Chats,
          data: {
            me: {
              chats: mess.me.chats.map((chat: any) => {
                if (chat._id === data.data.messageAdded.chat._id) {
                  return {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                  };
                }
                return chat;
              }),
            },
          },
        });
      }
    },
  });
  console.log(data, "messageSubscription");
  return { data, loading, error };
};
