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

const Chat = ({ route, navigation, db }) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(true);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { name, backgroundColor, userID } = route.params;

    const onSend = async (newMessages) => {
        try {
            setIsLoading(true);
            // Optimistic update
            setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

            // Format and save message
            const message = {
                ...newMessages[0],
                createdAt: serverTimestamp(),
                user: {
                    _id: userID,
                    name: name
                }
            };

            await addDoc(collection(db, "messages"), message);
        } catch (error) {
            console.error("Failed to send message:", error);
            setError("Failed to send message");
            // Rollback on error
            setMessages((previousMessages) =>
                previousMessages.filter((msg) => msg._id !== newMessages[0]._id)
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        navigation.setOptions({ title: name });

        let unsubMessages;

        const loadMessages = async () => {
            setIsLoading(true);
            try {
                if (isConnected) {
                    // Clean up previous subscription
                    if (unsubMessages) unsubMessages();

                    // Create query
                    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
                    // Fetching messages - "newes first"

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
                        setIsLoading(false);
                    });
                }
            } catch (error) {
                console.error("Loading messages failed:", error);
                setError("Failed to laod messages");
                setIsLoading(false);
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

    const renderInputToolbar = (props) => (
        <InputToolbar
            {...props}
            containerStyle={styles.inputToolbar}
            primaryStyle={styles.inputPrimary}
            accessoryStyle={styles.inputAccessory}
        />
    );

    const renderSend = (props) => (
        <Send {...props} containerStyle={styles.sendContainer} disabled={isLoading}>
            {isLoading ? (
                <ActivityIndicator size="small" color="#c1f6f7" />
            ) : (
                <View style={styles.sendButton}>
                    <Text styles={styles.sendButtonText}>Send</Text>
                </View>
            )}
        </Send>
    );

    const renderLoading = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c1f6f7" />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {error ? <SystemMessage text={error} textStyle={styles.errorText} /> : null}
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderSend={renderSend}
                renderLoading={renderLoading}
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
