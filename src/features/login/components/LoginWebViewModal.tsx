import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, ModalProps, View } from "react-native";
import WebView from "react-native-webview";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";
import { http } from "../../../services/http";
import { useTokenStorage } from "../../../services/useTokenStorage";
import { LoggedInContext } from "../../../services/LoggedInContext";

interface ILoginWebViewModalProps extends ModalProps {
    clientID: string | undefined;
    closeModal: () => void;
}

export const LoginWebViewModal = ({ ...props }: ILoginWebViewModalProps) => {
    const { setToken } = useTokenStorage();
    const { setLoggedIn } = useContext(LoggedInContext);
    const [loading, setLoading] = useState(false);

    const closeModalHandler = () => {
        props.closeModal();
    }

    const getToken = async (code: string) => {
        setLoading(true);
        await axios.get("http://10.0.2.2:3000/auth/login?code=" + code).then((response) => {
            if (response.data.error) return;
            const token = response.data.access_token;
            const type = response.data.token_type;
            setToken(token).then((success: boolean) => {
                setLoading(false);
                setLoggedIn(success);
            });
        }).catch((error) => {
            setLoading(false);
            Alert.alert("Error", "An error occurred while trying to log in.");
        });
    }

    const handleWebViewNavigationStateChange = async (newNavState: any) => {
        const { url, title } = newNavState;
        if (url?.includes("code")) {
            const code = url.split("code=")[1];
            props.closeModal();
            getToken(code);
        }
    };

    return <Modal
        {...props}
        style={{ paddingHorizontal: 0 }}
        onDismiss={() => closeModalHandler()}
    >
        <View
            style={{ height: "100%", }}
        >
            {
                loading
                && <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            }
            <WebView
                source={{
                    uri: `https://github.com/login/oauth/authorize?client_id=${props.clientID}`,
                }}
                style={{ marginTop: 20 }}
                javaScriptEnabled={true}
                onNavigationStateChange={handleWebViewNavigationStateChange}
            />
        </View>
    </Modal >
}