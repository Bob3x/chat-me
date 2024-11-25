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
        width: "100%",
        height: "100%", // Add explicit height
        justifyContent: "center",
        alignItems: "center"
    },

    appTitle: {
        fontSize: 34,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 30
    },

    innerContainer: {
        width: "88%",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 10
    },

    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 15,
        opacity: 0.5
    },

    textColors: {
        fontSize: 16,
        fontWeight: "300",
        color: "#171717",
        marginBottom: 10
    },

    colorsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginBottom: 20
    },

    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 10
    },

    selectedColor: {
        borderWidth: 2,
        borderColor: "#757083"
    },

    button: {
        backgroundColor: "#757083",
        borderRadius: 8,
        padding: 10,
        alignItems: "center"
    },

    buttonText: {
        fontSize: 16,
        fontWeight: 600,
        color: "#FFFFFF"
    },

    buttonDisabled: {
        opacity: 0.7
    },

    inputError: {
        borderColor: "red"
    },
    errorText: {
        color: "red",
        marginTop: 5
    }
});

export default Start;
