import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import tw from 'tailwind-react-native-classnames'
import { useNavigation } from '@react-navigation/native'
import SelectDropdown from 'react-native-select-dropdown'
import axios from "axios"
import { Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/authSlice'

const Register = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const usertype = ["I am a passenger", "I am a Driver"]

  const registerUser = async () => {
    if (
      email == "" ||
      userType == "" ||
      username == "" ||
      gender == "" ||
      password == "" ||
      cpassword === "" ||
      mobile === ""
    ) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'All the fields are required',
      });
      return;
    }

    if (password !== cpassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: "Passwords Don't match",
      });
      return;
    }


    try {
      const response = await fetch(process.env.BASE_URL + 'api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          gender,
          userType,
          password,
          mobile
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Handle error response
        if (data?.error == 11000) {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: 'Username or Email Already Exists',
          });
          return;
        }
        else
        {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: 'Failed to create account try again later',
          });
        return;
        }
      }
      dispatch(setUser(data));
      if(data.userType == "Driver")
      {
        navigate("Driverhome")
      }
      else
      {
        navigate("Home")
      }
    } catch (error) {
      console.error('Error during registration:', error);
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
        <View style={tw`my-auto`}>
          <Text style={tw`font-bold text-3xl text-center `}>Create your Account</Text>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            style={tw`px-3 py-2 border bg-gray-200 rounded-xl w-80 mx-auto mt-5`}
            placeholder={"Email"}
          />
          <TextInput
            onChangeText={(text) => setMobile(text)}
            style={tw`px-3 py-2 border bg-gray-200 rounded-xl w-80 mx-auto mt-5`}
            placeholder={"Mobile"}
          />
          <TextInput
            onChangeText={(text) => setUsername(text)}
            style={tw`px-3 py-2 border bg-gray-200 rounded-xl w-80 mx-auto mt-5`}
            placeholder={"Enter Full Name"}
          />
          <SelectDropdown
            defaultButtonText={"Select Gender"}
            buttonStyle={tw` bg-gray-200 mt-5 mx-auto border`}
            data={["Male", "Female"]}
            onSelect={(selectedItem, index) => {
              setGender(selectedItem)
              return selectedItem
            }}
          />
          <View>
            <SelectDropdown
              defaultButtonText={"Select user type"}
              buttonStyle={tw` bg-gray-200 mt-5 mx-auto border`}
              data={usertype}
              onSelect={(selectedItem, index) => {
                if (selectedItem == "I am a passenger") {
                  setUserType("Passenger");
                }
                else {
                  setUserType("Driver")
                }
                return selectedItem
              }}
            />
          </View>
          <TextInput
            style={tw`px-3 py-2 border bg-gray-200 rounded-xl w-80 mx-auto mt-5`}
            placeholder={"Password"}
            onChangeText={(text) => { setPassword(text) }}
          />
          <TextInput
            style={tw`px-3 py-2 border bg-gray-200 rounded-xl w-80 mx-auto mt-5`}
            placeholder={"Confirm password"}
            onChangeText={(text) => { setCPassword(text) }}
          />
          <Text style={tw`text-center text-gray-500 mt-2`}>Already have an account ?</Text>
          <TouchableOpacity
            onPress={() => { navigate("Login") }}
          ><Text style={tw`text-center text-gray-500`}>Login</Text></TouchableOpacity>
          <TouchableOpacity
            onPress={() => { registerUser(); console.log('works') }}
            style={tw`bg-black mx-32 py-4 rounded-xl mt-7`}>
            <Text style={tw`text-white mx-auto text-xl`}>Register</Text>
          </TouchableOpacity>
        </View>
      </AlertNotificationRoot>
    </View>
  )
}

export default Register

const styles = StyleSheet.create({})