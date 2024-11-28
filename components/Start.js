// components/Start.js

import { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ImageBackground,
    Alert
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";
import PropTypes from "prop-types";

const Start = ({ navigation }) => {
    // Set username and background color
    const [name, setName] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

    // Sign in
    const signInUser = async () => {
        if (!name.trim()) {
            setError("Please enter a username");
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            const auth = getAuth();
            const result = await signInAnonymously(auth);
            navigation.navigate("Chat", {
                userID: result.user.uid,
                name: name,
                backgroundColor: backgroundColor
            });
        } catch (err) {
            setError("Unable to sign in, try again later!");
            console.error("Sing in failed!", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/Background.png")}
                style={styles.imgContainer}>
                <Text style={styles.appTitle}>Chat Me</Text>
                <View style={styles.innerContainer}>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <TextInput
                        style={[styles.textInput, error && styles.inputError]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Type your username"
                        accessible={true}
                        accessibilityLabel="Username input"
                        accessibilityHint="Enter your username"
                    />
                    <Text style={styles.textColors}>Select your Backgroud</Text>
                    <View style={styles.colorsContainer}>
                        {colors.map((color, index) => (
                            <TouchableOpacity // background color picker
                                key={index}
                                accessible={true}
                                accessibilityRole="button"
                                accessibilityLabel="Color picker"
                                accessibilityHint="Choose your chat's background color"
                                style={[
                                    styles.colorCircle,
                                    { backgroundColor: color },
                                    backgroundColor === color && styles.selectedColor
                                ]}
                                onPress={() => setBackgroundColor(color)}
                            />
                        ))}
                    </View>
                    <TouchableOpacity // Chat button (switch screens)
                        accesible={true}
                        accessibilityLabel="Start Chatting"
                        accessibilityRole="Button"
                        accessibilityHint="Open your chat screen"
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={signInUser}
                        disabled={isLoading}>
                        <Text style={styles.buttonText}>
                            {isLoading ? "Signing in..." : "Start Chatting"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

Start.propTypes = {
    navigation: PropTypes.object.isRequired
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    imgContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    innerContainer: {
        width: "88%",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 20,
        borderRadius: 10
    },

    appTitle: {
        fontSize: 34,
        fontWeight: "600",
        color: "#FFFFFF",
        marginBottom: 30
    },

    textInput: {
        width: "100%",
        padding: 15,
        borderWidth: 1,
        borderColor: "#757083",
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: "#FFFFFF"
    },

    textColors: {
        fontSize: 16,
        fontWeight: "500",
        color: "#757083",
        marginBottom: 15
    },

    colorsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginBottom: 25
    },

    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 5
    },

    selectedColor: {
        borderWidth: 3,
        borderColor: "#757083"
    },

    button: {
        backgroundColor: "#757083",
        width: "100%",
        borderRadius: 8,
        padding: 15,
        alignItems: "center"
    },

    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF"
    },

    buttonDisabled: {
        opacity: 0.7
    },

    inputError: {
        borderColor: "#FF3B30"
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 14,
        marginTop: 5,
        marginBottom: 10
    }
});

export default Start;
