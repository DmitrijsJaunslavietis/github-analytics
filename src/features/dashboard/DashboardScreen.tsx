import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LoggedInContext } from "../../services/LoggedInContext";
import { useTokenStorage } from "../../services/useTokenStorage";
import { useQuery } from "@apollo/client";
import { GET_REPOSITORY } from "../../graphql/queries/fetchRepositoryQuery";
import { http } from "../../services/http";

export const DashboardScreen = () => {
    const { setLoggedIn } = useContext(LoggedInContext);
    const { removeToken } = useTokenStorage();
    const { data, error, loading } = useQuery(GET_REPOSITORY);

    const handleClickLogoff = () => {
        removeToken().then((result) => {
            delete http.defaults.headers.Authorization;
            setLoggedIn(!result);
        });
    }

    return <View>
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
    </View>
}