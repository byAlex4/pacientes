import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

//Screens
import Login from './screens/Login';
import Register from './screens/Register';
//import Home from './assets/Home';
import CallButtonScreen from './screens/CallButtonScreen';
import RoomScreen from './screens/RoomScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading == true ?
        <View style={styles.containerNav}>
          <NavigationContainer style={styles.container}>
            <Stack.Navigator initialRouteName="Call" screenOptions={{ gestureEnabled: false }}>
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name='Registro' component={Register}
                options={{
                  headerTransparent: true,
                  headerTintColor: '#ffff'
                }} />
              <Stack.Screen name='Call' component={CallButtonScreen} options={{ headerShown: false }} />
              <Stack.Screen name='Room' component={RoomScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
        :
        <View style={styles.containerNavLoading}>
          <ActivityIndicator size="large" color="#113663" />
          <Text style={{ textAlign: "center" }}>Inicializando ...</Text>
        </View>
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerNav: {
    flex: 10,
    backgroundColor: '#fff'
  },
  containerNavLoading: {
    flex: 10,
    backgroundColor: '#9DE1FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
