import { ApolloProvider } from "@apollo/client";
import { ApolloProviderProps } from "@apollo/client/react/context";
import { useClient } from "../services/useClient";

class IApolloProviderWrapper implements Omit<ApolloProviderProps<any>, 'client'> {
    children: React.ReactNode;
}

export const ApolloProviderWrapper = ({ children, ...props }: IApolloProviderWrapper) => {
    const client = useClient();

    return (
        <ApolloProvider {...props} client={client}>
            {children}
        </ApolloProvider>
    );
}