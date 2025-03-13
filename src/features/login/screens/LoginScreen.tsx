import { useContext, useEffect, useState } from "react"
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import { LoggedInContext } from "../../../services/LoggedInContext"
import { LoginWebViewModal } from "../components/LoginWebViewModal";
import { useTokenStorage } from "../../../services/useTokenStorage";
import { http } from "../../../services/http";
import { useQuery } from "@apollo/client";
import { GET_REPOSITORY } from "../../../graphql/queries/fetchRepositoryQuery";
import { ApolloProviderWrapper } from "../../../graphql/ApolloProviderWrapper";
import { DashboardScreen } from "../../dashboard/DashboardScreen";

export const LoginScreen = () => {
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext);
    // const { data, loading, error } = useQuery(GET_REPOSITORY);

    const { removeToken } = useTokenStorage();
    const [clientID, setClientID] = useState<string | undefined>(undefined);

    const handleClick = () => {
        setClientID(process.env.CLIENT_ID);
    }

    useEffect(() => {
        if (!!!http.defaults.headers.Authorization || !loggedIn) return;
        http.get("user")
    }, [http, loggedIn]);

    return <View style={[{ flex: 1 }]}>
        <StatusBar
        // barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        {
            loggedIn
                ? <ApolloProviderWrapper>
                    <DashboardScreen />
                </ApolloProviderWrapper>
                : <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: "10%",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            console.log('Login with GitHub');
                            handleClick();
                        }}
                        style={{
                            backgroundColor: 'black',
                            padding: 10,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: 'white' }}>Login with GitHub</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        onPress={() => {
                            console.log('Query');
                            handleClickQuery();
                        }}
                        style={{
                            backgroundColor: 'black',
                            padding: 10,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: 'white' }}>QUERY</Text>
                    </TouchableOpacity> */}
                    <LoginWebViewModal
                        visible={!!clientID}
                        clientID={clientID}
                        closeModal={() => setClientID(undefined)}
                    />

                </View>
        }
    </View >
}