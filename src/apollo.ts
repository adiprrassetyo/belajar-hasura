import { ApolloClient, InMemoryCache } from "@apollo/client";
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: "https://adidew.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret":
      "H9wtRAAsln40ET79H0TVeEcH89teueH6LJbOozVI4hAQsRUXa4dHyvNg37AH4fsB",
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://adidew.hasura.app/v1/graphql",
    connectionParams: {
      headers: {
        "x-hasura-admin-secret":
          "H9wtRAAsln40ET79H0TVeEcH89teueH6LJbOozVI4hAQsRUXa4dHyvNg37AH4fsB",
      },
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
