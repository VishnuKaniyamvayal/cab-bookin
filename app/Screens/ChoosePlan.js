import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import tw from "tailwind-react-native-classnames"
import { useDispatch } from 'react-redux';
import { setPlan } from '../slices/navSlice';
import { useNavigation } from '@react-navigation/native';

const ChoosePlan = () => {

    const dispatch = useDispatch();

    const { navigate } = useNavigation();

    const handlePlan = ( plan )=>{
        dispatch(setPlan(plan));
        navigate("Map");
    }

    const plans = [
        {
            _id:1,
            plan:"Platinum ride",
            features:"priority booking, luxury vehicle, Flexible Cancellation, Loyalty Rewards",
            multiplier: 1.8
        },
        {
            _id:2,
            plan:"Gold ride",
            features:"Fast Track Booking, comfortable vehicles, Standard Cancellation Policy, Loyalty Rewards",
            multiplier: 1.4
        },
        {
            _id:3,
            plan:"Silver ride",
            features:"Standard Booking, Standard Cancellation Policy, Occasional Discounts",
            multiplier:1.1
        },
    ]

    return (
        <View>
            <View style={tw`flex flex-row justify-between items-center`}>
                <Text style={tw`text-3xl font-extrabold p-5 `}>Cab <Text style={tw`text-green-300`}>C</Text>onnect</Text>
                <Text style={tw`bg-green-300 px-4 py-6 rounded-full text-white mr-6`} onPress={"Profile"}>Profile</Text>
            </View>
            <Text style={tw`text-3xl text-center mt-9 font-bold`}>Choose your ride.</Text>
            {
                plans.map((plan)=>(
            <TouchableOpacity key={plan._id} onPress={()=>{handlePlan(plan)}} style={tw `bg-black text-white flex flex-col justify-between px-10 py-10 mx-4 my-5 rounded-xl shadow-sm`}>
                <Text style={tw `text-white text-2xl text-center `}>{plan.plan}</Text>
                <Text style={tw `text-white text-sm text-center`}>Features: {plan.features}</Text>
            </TouchableOpacity>
                ))
            }
        </View>
    )
}

export default ChoosePlan

const styles = StyleSheet.create({})