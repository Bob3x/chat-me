import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "./components/Start";
import Chat from "./components/Chat";
import {
    EXPO_PUBLIC_FIREBASE_API_KEY,
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    EXPO_PUBLIC_FIREBASE_APP_ID
} from "@env";
const Stack = createNativeStackNavigator();

const App = () => {
    console.log("Env vars loaded:", !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY);
    const firebaseConfig = {
        apiKey: EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: EXPO_PUBLIC_FIREBASE_APP_ID
    };
    console.log("Firebase Config:", firebaseConfig);
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Start">
                <Stack.Screen name="Start" component={Start} />
                <Stack.Screen name="Chat">
                    {(props) => <Chat db={db} {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
