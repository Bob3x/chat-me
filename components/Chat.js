// components/Chat.js

import React, { useState, useEffect } from "react";
import { GiftedChat, Bubble, Send, InputToolbar, SystemMessage } from "react-native-gifted-chat";
import {
    StyleSheet,
    View,
    Text,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator
} from "react-native";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

const Chat = ({ route, navigation, db, isConnected }) => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [offlineMessages, setOfflineMessages] = useState([]);

    const { name, backgroundColor, userID } = route.params;

    const syncOfflineMessages = async () => {
        try {
            const storedOfflineMessages = await AsyncStorage.getItem("offline_messages");
            if (storedOfflineMessages && isConnected) {
                const messages = JSON.parse(storedOfflineMessages);
                for (let message of messages) {
                    await addDoc(collection(db, "messages"), message);
                }
                await AsyncStorage.removeItem("offline_messages");
                setOfflineMessages([]);
            }
        } catch (error) {
            console.error("Error syncing offline messages:", error);
            setError("Failed to sync messages");
        }
    };

    useEffect(() => {
        if (isConnected) {
            syncOfflineMessages();
        }
    }, [isConnected]);

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem("cached_messages", JSON.stringify(messagesToCache));
        } catch (error) {
            console.error("Error caching messages:", error);
            setError("Failed to load messages");
        }
    };

    const loadCachedMessages = async () => {
        try {
            const cached = await AsyncStorage.getItem("cached_messages");
            if (cached) {
                setMessages(JSON.parse(cached));
            }
        } catch (error) {
            console.error("Error loading cached messages:", error);
            setError("Failed to load cached messages");
        }
    };

    const onSend = async (newMessages) => {
        try {
            setIsLoading(true);

            // Format and save message
            const message = {
                ...newMessages[0],
                createdAt: isConnected ? serverTimestamp() : new Date(),
                user: {
                    _id: userID,
                    name: name
                }
            };
            if (isConnected) {
                await addDoc(collection(db, "messages"), message);
            } else {
                const newOfflineMessages = [...offlineMessages, message];
                setOfflineMessages(newOfflineMessages);
                await AsyncStorage.setItem("offline_messages".JSON.stringify(offlineMessages));
                setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setError("Failed to send message");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        navigation.setOptions({ title: name });

        if (!isConnected) {
            loadCachedMessages();
            return;
        }

        let unsubMessages;
        const loadMessages = async () => {
            setIsLoading(true);
            try {
                // Create query
                const q = query(collection(db, "messages"), orderBy("createdAt", "desc")); // Fetching messages - "newes first"

                // Real-time messages listener
                unsubMessages = onSnapshot(q, (querySnapshot) => {
                    const newMessages = querySnapshot.docs.map((doc) => {
                        const data = doc.data();
                        const createdAt = data.createdAt
                            ? new Date(data.createdAt.toMillis())
                            : new Date();
                        return {
                            _id: doc.id,
                            ...data,
                            createdAt
                        };
                    });
                    setMessages(newMessages);
                    cacheMessages(newMessages);
                    setIsLoading(false);
                });
            } catch (error) {
                console.error("Loading messages failed:", error);
                setError("Failed to laod messages");
                setIsLoading(false);
                loadCachedMessages();
            }
        };

        loadMessages();

        // Cleanup function
        return () => {
            if (unsubMessages) unsubMessages();
        };
    }, [db, name, isConnected]); // All dependencies

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#c1f6f7",
                        borderRadius: 15,
                        padding: 5
                    },
                    left: {
                        backgroundColor: "#FFF",
                        borderRadius: 15,
                        padding: 5
                    }
                }}
                textStyle={{
                    right: {
                        color: "#000"
                    }
                }}
                timeTextStyle={{
                    right: {
                        color: "#707070"
                    }
                }}
            />
        );
    };

    const renderInputToolbar = (props) => {
        if (isConnected)
            return (
                <InputToolbar
                    {...props}
                    containerStyle={styles.inputToolbar}
                    primaryStyle={styles.inputPrimary}
                    accessoryStyle={styles.inputAccessory}
                />
            );
        else {
            return null;
        }
    };

    const renderSend = (props) => (
        <Send {...props} containerStyle={styles.sendContainer} disabled={isLoading}>
            {isLoading ? (
                <ActivityIndicator size="small" color="#c1f6f7" />
            ) : (
                <View style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </View>
            )}
        </Send>
    );

    const renderLoading = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c1f6f7" />
        </View>
    );

    const renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longtitude,
                        latitude: 0.0922,
                        longitude: 0.0421
                    }}
                />
            );
        }
        return null;
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {error ? <SystemMessage text={error} textStyle={styles.errorText} /> : null}
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderSend={renderSend}
                renderLoading={renderLoading}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                onSend={(messages) => onSend(messages)}
                user={{ _id: userID }}
                placeholder="Type a message"
                alwaysShowSend
                scrollToBottom
                renderSystemMessage={(props) => (
                    <SystemMessage {...props} textStyle={styles.systemMessageText} />
                )}
            />
            {Platform.OS === "android" || Platform.OS === "ios" ? (
                <KeyboardAvoidingView behavior="height" />
            ) : null}
        </View>
    );
};

Chat.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            name: PropTypes.string.isRequired,
            backgroundColor: PropTypes.string.isRequired,
            userID: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    navigation: PropTypes.shape({
        setOptions: PropTypes.func.isRequired,
        navigate: PropTypes.func.isRequired
    }).isRequired,
    db: PropTypes.object.isRequired,
    isConnected: PropTypes.bool.isRequired,
    storage: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    inputToolbar: {
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E8E8E8",
        borderRadius: 25,
        marginHorizontal: 10,
        marginBottom: 5,
        paddingVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },

    sendContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        marginBottom: 5
    },
    sendButton: {
        backgroundColor: "#c1f6f7",
        borderRadius: 20,
        padding: 8,
        paddingHorizontal: 15
    },
    sendButtonText: {
        color: "#000",
        fontWeight: "600"
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 14,
        textAlign: "center",
        marginVertical: 10
    },
    systemMessageText: {
        fontSize: 12,
        color: "#707070",
        fontStyle: "italic"
    }
});

export default Chat;
