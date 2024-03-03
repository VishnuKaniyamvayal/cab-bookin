import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import tw from 'tailwind-react-native-classnames'
import { useNavigation } from '@react-navigation/native'
import { AlertNotificationRoot, ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/authSlice'

const Login = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const[ email , setEmail ] = useState("");
  const[ password , setPassword ] = useState("");

  const signInUser = async () => {
    if (email === "" || password === "") {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Email and password are required for sign in',
      });
      return;
    }
  
    try {
      const response = await fetch(process.env.BASE_URL + 'api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (!response.ok) {
        // Handle error response
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Sign-in failed. Please check your credentials and try again.',
        });
        return;
      }
  
      const data = await response.json();
      console.log(data)
      if(data.userType == "Passenger")
      {
        dispatch(setUser(data));
        navigate("Home");
      }
      else if(data.userType == "Driver")
      {
        dispatch(setUser(data));
        navigate("Driverhome");
      }
      // You can handle the successful sign-in response here
    } catch (error) {
      console.error('Error during sign-in:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'An unexpected error occurred. Please try again.',
      });
    }
  };
  return (
    <View style={tw`h-full`}>
      <AlertNotificationRoot>
        <View style={tw `flex flex-row justify-between items-center`}>
        <Text style={tw `text-3xl font-extrabold p-5 `}>Cab <Text style={tw `text-green-300`}>C</Text>onnect</Text>
      </View>
      <View style={tw`my-auto`}>
      <Text style={tw `font-bold text-3xl text-center `}>User Login</Text>
      <TextInput
      onChangeText={(text)=>setEmail(text)}
        style={tw `px-3 py-2 border bg-gray-200 rounded-xl w-80 mx-auto mt-5`}
        placeholder={"Email"}
        />
      <TextInput
        onChangeText={(text)=>setPassword(text)}
        style={tw `px-3 py-2 border bg-gray-200 rounded-xl w-80 mx-auto mt-5`}
        placeholder={"Password"}
        />
      <Text style={tw`text-center text-gray-500`}>Don't have an account ?</Text>
      <TouchableOpacity onPress={()=>{navigate("Register")}}><Text style={tw`text-center text-gray-500`}>Create Account</Text></TouchableOpacity>
      <TouchableOpacity  
       onPress={signInUser}
      style={tw `bg-black mx-32 py-4 rounded-xl mt-7`}>
        <Text
        style={tw`text-white mx-auto text-xl`} >Login</Text>
      </TouchableOpacity>
      </View>
        </AlertNotificationRoot>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({})