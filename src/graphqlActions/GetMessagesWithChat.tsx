import { gql, useQuery } from "@apollo/client";

export const GetMessagesByChatId = gql`
  query getAllMessagesByChatId($chatId: String!) {
    getAllMessagesByChatId(chatId: $chatId) {
      _id
      content
      timestamp
      status
      isVoice
      sender {
        _id
        username
        email
        phone
      }
    }
  }
`;
export const useGetMessagesWithChat = (chatId: string) => {
  const { data, error, loading } = useQuery(GetMessagesByChatId, {
    variables: { chatId },
  });
  return { data, error, loading };
};
