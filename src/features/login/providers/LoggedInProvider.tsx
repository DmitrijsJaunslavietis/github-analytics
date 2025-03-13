import { useEffect, useState } from "react";
import { LoggedInContext } from "../../../services/LoggedInContext";
import { useTokenStorage } from "../../../services/useTokenStorage";
import { http } from "../../../services/http";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

type LoggedInProviderProps = {
    children: React.ReactNode;
};

export const LoggedInProvider = ({ children }: LoggedInProviderProps) => {
    const { haveToken, getToken, removeToken, setToken } = useTokenStorage();
    const [loggedIn, setLoggedIn] = useState(false);

    let client = new ApolloClient({
        uri: 'https://api.github.com/graphql',
        cache: new InMemoryCache()
    });

    const setAuthorizationHeader = async () => {
        const token = await getToken();
        http.defaults.headers.Authorization = `bearer ${token}`;
        client = new ApolloClient({
            uri: 'https://api.github.com/graphql',
            headers: {
                Authorization: `bearer ${token})}`,
            },
            cache: new InMemoryCache()
        });
    };

    useEffect(() => {
        haveToken().then((result) => {
            setLoggedIn(result);
        });
        http.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response.status === 401) {
                    removeToken();
                    setLoggedIn(false);
                }
                return Promise.reject(error);
            }
        );
    }, []);

    useEffect(() => {
        if (loggedIn) {
            setAuthorizationHeader();
            
        } else {
            delete http.defaults.headers.Authorization;
        }
    }, [loggedIn]);

    return (
        <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </LoggedInContext.Provider>
    );
};