import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase-config";
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import SignIn from "./screens/SignIn";
import Main from "./screens/Main";
import { ActivityIndicator, Alert, View } from "react-native";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(false);
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    });

    useEffect(() => {
        WebBrowser.warmUpAsync();

        return () => {
            WebBrowser.coolDownAsync();
        };
    }, []);

    const checkCurrentUser = async () => {
        try {
            setLoading(true);
            const result = await SecureStore.getItemAsync("user");
            const userData = result ? JSON.parse(result) : null;
            setCurrentUser(userData);
            console.log(result);
        } catch (error) {
            Alert.alert("checkCurrentUser", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const credentials = GoogleAuthProvider.credential(id_token);
            try {
                signInWithCredential(auth, credentials);
            } catch (error) {
                Alert.alert("Auth", error.message);
            }
        }
    }, [response]);

    useEffect(() => {
        checkCurrentUser();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(JSON.stringify(user, null, 4));
                await SecureStore.setItemAsync(
                    "user",
                    JSON.stringify(user.uid)
                );
                setCurrentUser(user);
            }
        });
        return () => unsubscribe();
    }, []);

    const onSignOut = async () => {
        try {
            await signOut(auth);
            await SecureStore.deleteItemAsync("user");
            setCurrentUser(null);
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size={"large"} />
            </View>
        );
    } else
        return currentUser ? (
            <Main onSignOut={onSignOut} />
        ) : (
            <SignIn promptAsync={promptAsync} />
        );
}
