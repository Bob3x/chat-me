import { useState, useEffect } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
    StyleSheet,
    View,
    Text,
    Platform,
    KeyboardAvoidingView
} from "react-native";

const Chat = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);

    const { name, backgroundColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
        setMessages([
            {
                _id: 1,
                text: "Hello developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any"
                }
            },
            {
                _id: 2,
                text: "This is a system message",
                createdAt: new Date(),
                system: true
            }
        ]);
    }, [name]);

    const onSend = (newMessages) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessages)
        );
    };
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#c1f6f7"
                    },
                    left: {
                        backgroundColor: "#FFF"
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

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: 1
                }}
            />
            {Platform.OS === "android" ? (
                <KeyboardAvoidingView behavior="height" />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "left"
    }
});

export default Chat;
