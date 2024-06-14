import { gql, useMutation } from "@apollo/client";

const createMessageDocument = gql`
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      content
      isVoice
    }
  }
`;

export const useCreateMessage = () => {
  return useMutation(createMessageDocument);
};
