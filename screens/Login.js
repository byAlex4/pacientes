import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, Alert, Platform } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Login() {
    const navigation = useNavigation();
    const [txtEmail, setEmail] = React.useState('');
    const [txtPass, setPassword] = React.useState('');

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.txtTitles}>Iniciar Sesión</Text>
            <TextInput placeholderTextColor="#bababa" placeholder="Correo electrónico" keyboardType='email-address' value={txtEmail} onChangeText={setEmail} style={styles.inputStyle} />
            <TextInput placeholderTextColor="#bababa" placeholder="Contraseña" secureTextEntry={true} value={txtPass} onChangeText={setPassword} style={styles.inputStyle} />
            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.buttonText}>ENTRAR</Text>
            </TouchableOpacity>
            <Text style={{ color: 'white', textAlign: 'center', marginTop: windowWidth / 25, marginBottom: windowWidth / 50, fontSize: windowWidth / 22 }}>o Accede con:</Text>
            <View style={{ width: windowWidth - 130, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginBottom: windowWidth / 25 }}>

                <TouchableOpacity style={styles.buttonContainerRSF}>
                    <EvilIcons name="sc-facebook" size={windowWidth / 8} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainerRSG} onPress={() => promptAsync()}>
                    <Ionicons name="logo-google" size={24} color="#E34133" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.buttonText}>REGISTRO</Text>
            </TouchableOpacity>

            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 10,
        minWidth: '100%',
        minHeight: '100%',
        backgroundColor: '#113663',
        justifyContent: 'center',
    },
    txtTitles: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
        paddingBottom: 25,
        paddingHorizontal: 25
    },
    buttonContainer: {
        marginTop: '10%',
        backgroundColor: '#FF5532',
        borderRadius: 10,
        height: 65,
        justifyContent: 'center',
        marginHorizontal: 25,
        marginBottom: 25
    },
    buttonText: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonContainerRSG: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        padding: '5%'
    },

    buttonContainerRSF: {
        backgroundColor: '#1877F2',
        borderRadius: 10,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10
    },
    buttonContainerRSA: {
        backgroundColor: 'black',
        borderRadius: 10,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    inputStyle: {
        borderRadius: 10,
        backgroundColor: '#FFF',
        color: '#707070',
        padding: 15,
        marginHorizontal: 25,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#dadae8'
    },
    repass: {
        color: '#FFF',
        fontSize: windowWidth / 22,
        marginHorizontal: 25,
        marginVertical: 1,
        marginBottom: 40,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },

});

