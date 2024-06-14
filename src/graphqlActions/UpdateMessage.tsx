import { gql, useMutation } from "@apollo/client";

const UPDATE_MESSAGE = gql`
  mutation UpdateMessage($updateMessageInput: UpdateMessageInput!) {
    updateMessage(updateMessageInput: $updateMessageInput) {
      _id
      content
      # timestamp
      # status
      # sender {
      #   _id
      #   username
      #   email
      #   phone
      # }
    }
  }
`;

export const useUpdateMessage = () => {
  return useMutation(UPDATE_MESSAGE);
};
