import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');

  return (
    <View style={StyleSheet.container}>
      <View style={styles.innerContainer}>
        <Text>Start Screen</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChange={setName}
          placeholder="Type your username here"
        />
        <TouchableOpacity
          title="Start Chatting"
          style={styles.button}
          onPress={() => navigation.navigate('Chat', { name: name })}>
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },

  textInput: {
    width: '88%',
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
  },

  button: {
    width: '88%',
    height: '20%',
    backgroundColor: '#757083',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
});

export default Start;
