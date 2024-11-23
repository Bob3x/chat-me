import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
    const { name, backgroundColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, [name]);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.textHello}>Hello {name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textHello: {
        fontSize: 18
    }
});

export default Chat;
