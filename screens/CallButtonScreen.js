import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';

const CallButtonScreen = () => {
    const navigation = useNavigation();

    const startCall = () => {
        const roomId = uuidv4();
        navigation.navigate('Room', { roomId });
    };

    return (
        <View style={styles.container}>
            <Button title="Start Call" onPress={startCall} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CallButtonScreen;
