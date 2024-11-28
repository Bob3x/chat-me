// components/CustomActions.js

import { TouchableOpacity, Text, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import PropTypes from "prop-types";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
    const [isLoading, setIsLoading] = useState(false);
    const actionSheet = useActionSheet();

    const getLocation = async () => {
        try {
            setIsLoading(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission denied", "Allow location access to share your location");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    location: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    }
                });
            }
        } catch (error) {
            console.error("Error getting location:", error);
            Alert.alert("Error", "Could not get your location");
        } finally {
            setIsLoading(false);
        }
    };

    const uploadImage = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const filename = uri.split("/").pop();
            const imageRef = ref(storage, `images/${userID}/${filename}`);

            await uploadBytes(imageRef, blob);
            const imageURL = await getDownloadURL(imageRef);
            return imageURL;
        } catch (error) {
            throw new Error("Failed to upload image");
        }
    };

    const pickImage = async () => {
        try {
            setIsLoading(true);
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.status !== "granted") {
                Alert.alert("Permission denied", "Allow access to media library");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                quality: 0.5
            });

            if (!result.canceled && result.assets[0]) {
                const imageUrl = await uploadImage(result.assets[0].uri);
                onSend({ image: imageUrl });
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image");
        } finally {
            setIsLoading(false);
        }
    };

    const takePhoto = async () => {
        try {
            setIsLoading(true);
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (permission.status !== "granted") {
                Alert.alert("Permission denied", "Allow access to camera");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                quality: 0.5
            });

            if (!result.canceled && result.assets[0]) {
                const imageUrl = await uploadImage(result.assets[0].uri);
                onSend({ image: imageUrl });
            }
        } catch (error) {
            console.error("Error taking photo:", error);
            Alert.alert("Error", "Failed to take photo");
        } finally {
            setIsLoading(false);
        }
    };

    const onActionPress = () => {
        const options = ["Choose From Library", "Take Picture", "Send Location", "Cancel"];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                        return;
                }
            }
        );
    };

    return (
        <TouchableOpacity
            style={[styles.container, wrapperStyle]}
            onPress={onActionPress}
            disabled={isLoading}
            accessible={true}
            accessibilityLabel="Communication options"
            accessibilityHint="Choose to send an image or your location">
            <View style={styles.wrapper}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#b2b2b2" />
                ) : (
                    <Text style={[styles.iconText, iconTextStyle]}>+</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

CustomActions.propTypes = {
    wrapperStyle: PropTypes.object,
    iconTextStyle: PropTypes.object,
    onSend: PropTypes.func.isRequired,
    storage: PropTypes.object.isRequired,
    userID: PropTypes.string.isRequired
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    iconText: {
        color: "#b2b2b2",
        fontWeight: "bold",
        fontSize: 16,
        backgroundColor: "transparent",
        textAlign: "center"
    }
});

export default CustomActions;
