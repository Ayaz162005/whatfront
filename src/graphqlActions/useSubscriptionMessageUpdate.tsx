import { gql, useSubscription } from "@apollo/client";

export const MESSAGE_UPDATED_SUBSCRIPTION = gql`
  subscription {
    messageUpdated {
      content
    }
  }
`;

export const useMessageUpdatedSubscription = () => {
  const { data, loading, error } = useSubscription(
    MESSAGE_UPDATED_SUBSCRIPTION
  );
  return { data, loading, error };
};
