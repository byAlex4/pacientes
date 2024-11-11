import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Register(props) {
    const [txtNombre, setNombre] = React.useState('');
    const [txtEmail, setEmail] = React.useState('');
    const [txtPass, setPassword] = React.useState('');
    const [txtConfirmPass, setConfirmPassword] = React.useState('');

    const { navigation } = props;
    Registrar = () => {
        console.log("Registrar");
        if (!txtNombre) {
            alert('Por favor llenar el Nombre completo');
            return;
        }
        if (!txtEmail) {
            alert('Por favor llenar el Correo electrónico');
            return;
        }
        if (!txtPass) {
            alert('Por favor introducir la contraseña');
            return;
        }
        if (!txtConfirmPass) {
            alert('Por favor introducir la contraseña');
            return;
        }
        if (txtPass != txtConfirmPass) {
            alert('Las contraseñas no coinciden');
            return;
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerCenter}>
                <Text style={styles.TextTitles}>Registro</Text>
                <TextInput placeholderTextColor="#bababa" placeholder="Nombre Completo" value={txtNombre} onChangeText={setNombre} style={styles.inputStyle} />
                <TextInput placeholderTextColor="#bababa" placeholder="Correo electrónico" keyboardType='email-address' value={txtEmail} onChangeText={setEmail} style={styles.inputStyle} />
                <TextInput placeholderTextColor="#bababa" placeholder="Contraseña" value={txtPass} onChangeText={setPassword} secureTextEntry style={styles.inputStyle} />
                <TextInput placeholderTextColor="#bababa" placeholder="Contraseña" value={txtConfirmPass} onChangeText={setConfirmPassword} secureTextEntry style={styles.inputStyle} />
                <TouchableOpacity style={styles.buttonContainer} onPress={() => Registrar()}>
                    <Text style={styles.buttonText}>CREAR CUENTA</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: '100%',
        minHeight: '100%',
        backgroundColor: '#113663',
        justifyContent: 'center'
    },
    containerCenter: {
        alignContent: 'center',
        justifyContent: 'center'
    },
    TextTitles: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
        paddingBottom: 25,
        paddingHorizontal: 25
    },
    buttonContainer: {
        backgroundColor: '#FF5532',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 25,
        marginVertical: 20,
    },
    buttonText: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    inputStyle: {
        borderRadius: 10,
        backgroundColor: '#FFF',
        color: '#707070',
        padding: 15,
        marginHorizontal: 25,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#dadae8',
    },
});

