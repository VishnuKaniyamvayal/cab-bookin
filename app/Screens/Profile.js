import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'tailwind-react-native-classnames'
import { useDispatch, useSelector } from 'react-redux'
import { removeUser, selectUser } from '../slices/authSlice'
import { useNavigation } from '@react-navigation/native'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'

const Profile = () => {

    
    const user = useSelector(selectUser);
    
    const [coins,setCoins] = useState(user.availableCoins);
    
    const {navigate} = useNavigation();

    const dispatch = useDispatch();

    const logout = ()=>{
        dispatch(removeUser());
        navigate('Login')
    }

    const handleAddCoins = async (coinsToAdd) => {
        try {
          const response = await fetch(process.env.BASE_URL + "api/passenger/addcoins", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coinsToAdd: parseInt(coinsToAdd),
              userId: user._id,
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'An unexpected error occurred. Please try again.',
            });
          }
    
          const responseData = await response.json();
          setCoins(responseData.data.availableCoins);

          // Handle successful response, update UI or show a success message
        } catch (error) {
          console.error('Error adding coins:', error);
    
          // Handle errors, update UI or show an error message
        }
      };

    return (
        <View style={tw`h-full`}>
            <View style={tw`flex flex-row justify-between items-center`}>
                <Text style={tw`text-3xl font-extrabold p-5 `}>Cab <Text style={tw`text-green-300`}>C</Text>onnect</Text>
                {
            user.userType == "Passenger" ?
                <Text style={tw`bg-green-300 px-4 py-6 rounded-full text-white mr-6`} onPress={() => { navigate("Home") }}>Go to home</Text>
               : 
               <Text style={tw`bg-green-300 px-4 py-6 rounded-full text-white mr-6`} onPress={() => { navigate("Driverhome") }}>Go to home</Text>
                }
            </View>
            <View style={tw`my-auto`}>
            <Text style={tw ` text-2xl text-center mt-1 `}>Name:{user.username}</Text>
            <Text style={tw ` text-2xl text-center mt-1 `}>Email:{user.email}</Text>
            <Text style={tw ` text-2xl text-center mt-1 `}>Gender:{user.gender}</Text>
            <Text style={tw ` text-2xl text-center mt-1 `}>Mobile:{user.mobile}</Text>
            {
            user.userType == "Passenger" &&
            <>
            <Text style={tw`bg-black text-white mx-10 text-center py-6 `}>Your balance : {coins}</Text>
            <Text 
            onPress={()=>{handleAddCoins(1000)}}
            style={tw`bg-black text-white mx-10 text-center py-6  mt-2`}>Add 1000 coins (test purpose only)</Text>
            </>
            }
            <TouchableOpacity
                onPress={logout}
            >
            <Text style={tw`bg-black text-white mx-10 text-center py-6 mt-2`}>Logout</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default Profile