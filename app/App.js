
import { StatusBar } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import store from "./store";
import { Provider } from "react-redux";
import HomeScreen from './Screens/HomeScreen';
import Login from './Screens/Login';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './Screens/MapScreen';
import ChoosePlan from './Screens/ChoosePlan';
import Register from './Screens/Register';
import Success from './Screens/Success';
import DriverPage from './Screens/DriverPage';
import Profile from './Screens/Profile';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
      <View style={styles.container}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
        <Stack.Screen name="Driverhome" component={DriverPage} options={{headerShown:false}} />
        <Stack.Screen name="Login" component={Login}  options={{headerShown:false}} />
        <Stack.Screen name="Map" component={MapScreen}  options={{headerShown:false}} />
        <Stack.Screen name="Plan" component={ChoosePlan}  options={{headerShown:false}} />
        <Stack.Screen name="Register" component={Register}  options={{headerShown:false}} />
        <Stack.Screen name="Success" component={Success}  options={{headerShown:false}} />
        <Stack.Screen name="Profile" component={Profile}  options={{headerShown:false}} />
      </Stack.Navigator>
      </View>
    </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    backgroundColor:'#E5E5E5',
    flex:1
  },
});
