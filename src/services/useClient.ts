import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useTokenStorage } from "./useTokenStorage";
import { useEffect, useState } from "react";

export const useClient = () => {
  const { getToken } = useTokenStorage();
  const [client, setClient] = useState(new ApolloClient({
    uri: "https://api.github.com/graphql",
    cache: new InMemoryCache(),
  }));

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const token = await getToken(); // Await the token
        const apolloClient = new ApolloClient({
          uri: "https://api.github.com/graphql",
          cache: new InMemoryCache(),
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        setClient(apolloClient); // Set the client once initialized
      } catch (error) {
        console.error('Failed to initialize Apollo Client:', error);
      }
    };

    initializeClient();
  }, []);

  return client;
};