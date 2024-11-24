import { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ImageBackground
} from "react-native";

const Start = ({ navigation }) => {
    const [name, setName] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/Background.png")}
                style={styles.imgContainer}>
                <Text style={styles.appTitle}>Chat Me</Text>
                <View style={styles.innerContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder="Type your username"
                    />
                    <Text style={styles.textColors}>Select your Backgroud</Text>
                    <View style={styles.colorsContainer}>
                        {colors.map((color, index) => (
                            <TouchableOpacity // background colors picker
                                key={index}
                                style={[
                                    styles.colorCircle,
                                    { backgroundColor: color },
                                    backgroundColor === color &&
                                        styles.selectedColor
                                ]}
                                onPress={() => setBackgroundColor(color)}
                            />
                        ))}
                    </View>
                    <TouchableOpacity // Chat button (switch screens)
                        title="Start Chatting"
                        style={styles.button}
                        onPress={() =>
                            navigation.navigate("Chat", {
                                name: name,
                                backgroundColor: backgroundColor
                            })
                        }>
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
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
    }
});

export default Start;
