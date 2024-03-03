import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from "tailwind-react-native-classnames"
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { selectTravelTimeInfo } from '../slices/navSlice';

const Success = () => {

    const user = useSelector(selectUser);

    const { navigate } = useNavigation();

    const travelInfo = useSelector(selectTravelTimeInfo)

    const assignedTo = travelInfo.data.assignedTo;

    const updateRating = async (userId, newRating) => {
        try {
            const response = await fetch(process.env.BASE_URL + "api/passenger/updaterating", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    newRating,
                }),
            });

            if (!response.ok) {
                // Handle error response
                console.error('Error updating rating:', response.statusText);
                // Handle the error appropriately, e.g., show a toast message
                return;
            }

            const data = await response.json();
            if (data) {
                navigate("Home")
                console.log(data)
            }

        } catch (error) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'An unexpected error occurred. Please try again.',
            });
        }
    };

    return (
        <View style={tw`h-full flex flex-col items-center justify-center`}>
            <View style={tw`flex flex-row justify-between items-center`}>
                <Text style={tw`text-3xl font-extrabold p-5 `}>Cab <Text style={tw`text-green-300`}>C</Text>onnect</Text>
            </View>
            <Text style={tw`text-4xl text-center text-green-500`}>Booking Success</Text>
            <Text style={tw`m-4`}>Your Cab Driver is on the way</Text>
            <Text>Give a review after Reaching Your destination</Text>
            <View style={tw`flex flex-row px-6`}>
                <TouchableOpacity onPress={() => { updateRating(assignedTo, 1) }} style={tw` mx-4 mt-4 bg-green-500 px-4 py-3 rounded`}>
                    <Text style={tw` text-white `}>1</Text>
                </TouchableOpacity >
                <TouchableOpacity onPress={() => { updateRating(assignedTo, 2) }} style={tw` mx-4 mt-4 bg-green-500 px-4 py-3 rounded`}>
                    <Text style={tw` text-white `}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { updateRating(assignedTo, 3) }} style={tw` mx-4 mt-4 bg-green-500 px-4 py-3 rounded`}>
                    <Text style={tw` text-white `}>3</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { updateRating(assignedTo, 4) }} style={tw` mx-4 mt-4 bg-green-500 px-4 py-3 rounded`}>
                    <Text style={tw` text-white `}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { updateRating(assignedTo, 5) }} style={tw` mx-4 mt-4 bg-green-500 px-4 py-3 rounded`}>
                    <Text style={tw` text-white `}>5</Text>
                </TouchableOpacity>
            </View>
            <Text style={tw`m-4`}>This helps us serve better</Text>
        </View>
    )
}

export default Success