import { useContext, useEffect, useState } from "react"
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import { LoggedInContext } from "../../../services/LoggedInContext"
import { LoginWebViewModal } from "../components/LoginWebViewModal";
import { useTokenStorage } from "../../../services/useTokenStorage";
import { http } from "../../../services/http";
import { useQuery } from "@apollo/client";
import { GET_REPOSITORY } from "../../../graphql/queries/fetchRepositoryQuery";

export const LoginScreen = () => {
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext);
    const { data, loading, error } = useQuery(GET_REPOSITORY);

    const { removeToken } = useTokenStorage();
    const [clientID, setClientID] = useState<string | undefined>(undefined);

    const handleClick = () => {
        setClientID(process.env.CLIENT_ID);
    }

    const handleClickLogoff = () => {
        removeToken().then((result) => {
            setLoggedIn(!result);
        });
    }

    useEffect(() => {
        if (!!!http.defaults.headers.Authorization) return;
        http.get("user")
    }, [http]);

    useEffect(() => {
        console.log('data', data);
    }, [data])

    return <View style={[{ flex: 1 }]}>
        <StatusBar
        // barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        {
            loggedIn
                ? <View>
                    <Text>Logged in you are indeed!</Text>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('logoff');
                            handleClickLogoff();
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
                        <Text style={{ color: 'white' }}>logoff</Text>
                    </TouchableOpacity>
                    <Text>{JSON.stringify(data)}</Text>
                </View>
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