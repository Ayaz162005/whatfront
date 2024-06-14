import { gql, useMutation } from "@apollo/client";
const CREATE_CHAT = gql`
  mutation CreateChat($CreateChatInput: CreateChatInput!) {
    createChat(createChatInput: $CreateChatInput) {
      _id
      name
      receiverName
      senderName
      isGroupChat

      users {
        _id
        username
        email
        phone
      }
    }
  }
`;
export const useCreateChat = () => {
  const [createChat, { data, error, loading }] = useMutation(CREATE_CHAT);
  return { createChat, data, error, loading };
};
