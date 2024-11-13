import React, { useState } from 'react';
import { View, Button, StyleSheet, TextInput, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';

const CallButtonScreen = () => {
    const navigation = useNavigation();
    const [roomId, setRoomId] = useState('');

    const joinCall = () => {
        // Navega a la sala con el ID ingresado
        if (roomId.trim()) {
            navigation.navigate('Room', { roomId: roomId.trim() });
        } else {
            alert("Please enter a valid room ID.");
        }
    };

    const startCall = () => {
        // Genera un nuevo ID de sala y navega
        const newRoomId = uuidv4();
        navigation.navigate('Room', { roomId: newRoomId });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Enter Room ID:</Text>
            <TextInput
                style={styles.input}
                placeholder="Room ID"
                value={roomId}
                onChangeText={setRoomId}
            />
            <Button title="Join Call" onPress={joinCall} />
            <View style={styles.separator} />
            <Button title="Start New Call" onPress={startCall} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        width: '80%',
        padding: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 16,
        textAlign: 'center',
    },
    separator: {
        height: 20,
    },
});

export default CallButtonScreen;
