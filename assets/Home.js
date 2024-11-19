import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions } from 'react-native';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-web';
import Login from '../screens/Login';
import Register from '../screens/Register';
//import SwiperFlatList from 'react-native-swiper-flatlist';

const { windowHeight, windowWidth } = Dimensions.get('window');
export default function Home() {
    const [notification, setNotification] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [slides, setSlides] = useState([
        { uri: 'https://reddoctors.net/wp-content/uploads/2024/02/img_dispositivos.png' },
        { uri: 'https://reddoctors.net/wp-content/uploads/2024/02/dispositivos.png' },
        { uri: 'https://reddoctors.net/wp-content/uploads/2024/06/Segundo.png' }
    ]);

    useEffect(() => {
        setNotification(true);
        console.log("setNotification")
        const timer = setTimeout(() => {
            console.log('modal');
            setModalVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const Tab = createBottomTabNavigator();
    return (
        <SafeAreaView style={styles.container}>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { Alert.alert("Modal has been closed."); setModalVisible(!modalVisible); }}>
                <View style={styles.modalView}>
                    <View style={styles.modalSubView}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => setModalVisible(false)}>
                            <AntDesign name="closecircle" size={windowWidth / 16} color="rgba(0, 0, 0, 0.5)" />
                        </TouchableOpacity>
                        <SwiperFlatList
                            autoplay
                            autoplayDelay={5}
                            index={0}
                            autoplayLoop
                            autoplayInvertDirection
                            data={slides}
                            style={styles.swiper}
                            renderItem={({ item }) => (
                                <Image style={styles.image} source={item} />
                            )}
                        />
                    </View>
                </View>
            </Modal>

            <Tab.Navigator
                initialRouteName="Buscar"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color }) => {
                        if (route.name === 'Mi Cuenta') {
                            return (
                                <MaterialIcons name="account-circle" size={30} color={color} />
                            );
                        } else if (route.name === 'Buscar') {
                            return (
                                <MaterialCommunityIcons name="magnify" size={30} color={color} />
                            );
                        }
                        else if (route.name === 'Servicios') {
                            return (
                                <MaterialIcons name="assignment" size={30} color={color} />
                            );
                        }
                        else if (route.name === 'Notificaciones') {
                            return (
                                <Ionicons name={focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline'} size={30} color={color} />
                            );
                        }


                    },
                })}
                tabBarOptions={{
                    activeTintColor: '#FFF',
                    inactiveTintColor: '#295C98',
                    style: {


                        backgroundColor: '#0086FF',

                    },
                    labelStyle: {

                    },
                }}
            >
                <Tab.Screen name="Mi Cuenta" component={Login} />
                <Tab.Screen name="Servicios" component={Register} />
                <Tab.Screen name="Buscar" component={Login} />
                <Tab.Screen name="Notificaciones" component={Register} />
            </Tab.Navigator>
            <StatusBar style="auto" />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 10,
        minWidth: '100%',
        minHeight: '100%',
        backgroundColor: '#3ba2ff',
    },
    modalView: {
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 1
    },
    modalSubView: {
        backgroundColor: '#FFF',
        width: '90%',
        height: '90%',
    },
    swiper: {
        minWidth: "100%",
        maxHeight: "60%",
    },
    image: {
        width: "auto",
        height: "auto",
        resizeMode: 'contain',
        position: 'flex',
    },

    buttonContainer: {
        position: 'absolute',
        alignSelf: 'flex-end',
        zIndex: 2,
        top: 3,
        right: windowWidth * -0.03,
        width: windowWidth / 10,
        height: windowHeight / 15,
    },
});
