import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "https://adidew.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret":
      "H9wtRAAsln40ET79H0TVeEcH89teueH6LJbOozVI4hAQsRUXa4dHyvNg37AH4fsB",
  },
  cache: new InMemoryCache(),
});
