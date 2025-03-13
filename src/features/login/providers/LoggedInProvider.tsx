import { useEffect, useState } from "react";
import { LoggedInContext } from "../../../services/LoggedInContext";
import { useTokenStorage } from "../../../services/useTokenStorage";
import { http } from "../../../services/http";

type LoggedInProviderProps = {
    children: React.ReactNode;
};

export const LoggedInProvider = ({ children }: LoggedInProviderProps) => {
    const { haveToken, getToken, removeToken, setToken } = useTokenStorage();
    const [loggedIn, setLoggedIn] = useState(false);

    const setAuthorizationHeader = async () => {
        const token = await getToken();
        if (!token) return;
        http.defaults.headers.Authorization = `bearer ${token}`;
    };

    useEffect(() => {
        haveToken().then((result) => {
            setLoggedIn(result);
            setAuthorizationHeader();
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

    return (
        <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
            {children}
        </LoggedInContext.Provider>
    );
};