import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "./components/Start";
import Chat from "./components/Chat";

const Stack = createNativeStackNavigator();

const App = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyA5ypyfjPuQsCNqWroE5uBFz7LEpU1l0lg",
        authDomain: "chat-me-app-26012.firebaseapp.com",
        projectId: "chat-me-app-26012",
        storageBucket: "chat-me-app-26012.firebasestorage.app",
        messagingSenderId: "434792060955",
        appId: "1:434792060955:web:d2aa2bd0a84ff73c3a40be"
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Start">
                <Stack.Screen name="Start" component={Start} />
                <Stack.Screen name="Chat" component={Chat}>
                    {(props) => <Chat db={db} {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
