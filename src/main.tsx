import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./route.tsx";
import { Toaster } from "react-hot-toast";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:3000/graphql", // backend link, check backend console for link
  })
);
const getToken = () => {
  return localStorage.getItem("token");
};
const authLink = setContext((_, { headers }) => {
  const token = getToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const splitLink = split(
  ({ query }) => {
    const definition = query.definitions[0];
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
      {/* <App /> */}
    </ApolloProvider>
  </React.StrictMode>
);
