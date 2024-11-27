import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { useEffect } from "react";
import { Alert } from "react-native";

const Stack = createNativeStackNavigator();

const App = () => {
    console.log("Env vars loaded:", !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY);
    const firebaseConfig = {
        apiKey: "AIzaSyCfGyh2glxqbQNPVhWXN9o5VqVOkvoGxoc",
        authDomain: "chat-me-app-4769c.firebaseapp.com",
        projectId: "chat-me-app-4769c",
        storageBucket: "chat-me-app-4769c.firebasestorage.app",
        messagingSenderId: "1056529809586",
        appId: "1:1056529809586:web:e7da97ec48118512d409ab"
    };
    console.log("Firebase Config:", firebaseConfig);
    // Initialize Firebase and checks for duplicates
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);
    const storage = getStorage(app);

    // offline - online status
    const connectionStatus = useNetInfo();

    useEffect(() => {
        if (connectionStatus.isConnected === false) {
            Alert.alert("Connection lost!");
            disableNetwork(db);
        } else if (connectionStatus.isConnected === true) {
            enableNetwork(db);
        }
    }, [connectionStatus.isConnected, db]);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Start">
                <Stack.Screen name="Start" component={Start} />
                <Stack.Screen name="Chat">
                    {(props) => (
                        <Chat
                            isConnected={connectionStatus.isConnected}
                            db={db}
                            storage={storage}
                            {...props}
                        />
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
