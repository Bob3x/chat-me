import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";

const CustomActions = () => {
    return (
        <TouchableOpacity>
            <View>
                <Text>+</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10
    },
    wrapper: {
        borderRadius: 13,
        borderColor: "#b2b2b2",
        borderWidth: 2,
        flex: 1
    },
    iconText: {
        color: "#b2b2b2",
        fontWeight: "600",
        fontSize: 10,
        backgroundColor: "transperant",
        textAlign: "center"
    }
});

export default CustomActions;
