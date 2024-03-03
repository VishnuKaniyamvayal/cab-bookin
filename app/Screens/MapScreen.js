import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Map from '../Components/Map';
import tw from "tailwind-react-native-classnames"
import { useDispatch, useSelector } from 'react-redux';
import { selectDestination, selectOrigin, selectPlan, setTravelTimeInfo } from '../slices/navSlice';
import { selectUser } from '../slices/authSlice';
import { AlertNotificationRoot, ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';

const MapScreen = () => {

  const origin = useSelector(selectOrigin)
  const plan = useSelector(selectPlan)
  const user = useSelector(selectUser)
  const destination = useSelector(selectDestination)
  const userId = user._id
  totalAmount = 300;

  const dispatch = useDispatch();

  const { navigate } = useNavigation();

  const bookCab = async () => {
    try {
      // Step 1: Fetch available driver details
      const driverResponse = await fetch(process.env.BASE_URL + "api/passenger/getdriver", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!driverResponse.ok) {
        // Handle error response for fetching drivers
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Failed to fetch available drivers. Please try again.',
        });
        return;
      }
  
      const driverData = await driverResponse.json();
      const assignedTo = driverData.data._id;
  
      // Step 2: Deduct coins
      try {
        const coinsResponse = await fetch(process.env.BASE_URL + "api/passenger/reducecoins", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            coinsToReduce: (plan.multiplier * totalAmount),
          }),
        });
  
        const coinsData = await coinsResponse.json();
  
        if (coinsData?.error === "Not enough coins available") {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: "Not enough coins available",
          });
          return;
        }
  
      } catch (coinsError) {
        console.error('Error during coin deduction:', coinsError);
        return;
      }
  
      // Step 3: Book the cab
      const response = await fetch(process.env.BASE_URL + "api/passenger/book", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          origin,
          destination,
          plan,
          assignedTo,
        }),
      });
  
      if (!response.ok) {
        // Handle error response for booking a cab
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Cab booking failed. Please try again.',
        });
        return;
      }
  
      const data = await response.json();
  
      dispatch(setTravelTimeInfo(data));
  
      // If all steps are successful, navigate to success screen
      navigate("Success");
  
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.INFO,
        title: 'Error',
        textBody: error.error,
      });
    }
  };
  

  return (
    <View>
      <View style={tw` h-1/2 `}>
        <Map />
      </View>
      <View style={tw` h-1/2 `}>
        <AlertNotificationRoot>
        <Text style={tw`border-b mx-5 border-gray-300 font-bold text-2xl text-center my-5`}>From: <Text style={tw`ml-3 font-medium`}>{origin.properties.name}</Text></Text>
        <Text style={tw`border-b mx-5 border-gray-300 font-bold text-2xl text-center my-5`}>To: <Text style={tw`ml-3 font-medium`}>{destination.properties.name}</Text></Text>
        <TouchableOpacity
          onPress={bookCab}
          style={tw`bg-black p-4 rounded-xl mx-auto mt-7`}>
          <Text style={tw`text-white font-bold text-center`} >{"Confirm booking and Pay " + (plan.multiplier * totalAmount) + " coins"}</Text>
        </TouchableOpacity>

        </AlertNotificationRoot>
      </View>
    </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({})