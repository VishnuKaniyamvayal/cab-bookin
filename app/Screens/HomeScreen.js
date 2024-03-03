import { Image, StyleSheet, Text, View , TextInput , Button, TouchableOpacity, Modal , FlatList} from 'react-native'
import tw from "tailwind-react-native-classnames"
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setOrigin , setDestination } from '../slices/navSlice';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { selectUser } from '../slices/authSlice';


const HomeScreen = () => {

  const [autofillFrom, setAutofillFrom] = useState([]);
  const [autofillTo, setAutofillTo] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [Globalfrom, setGlobalFrom] = useState(null);
  const [Globalto, setGlobalTo] = useState(null);
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  
  useEffect(() => {
    console.log("run")
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    if (user == null) {
      navigate('Login');
    }
    else
    {
      console.log(user)
    }

  };

  const fetchAutofillSuggestions = async (input, type) => {
    try {
      const response = await fetch(`http://photon.komoot.io/api/?q=${input}&limit=5`);
      const data = await response.json();
      if (type === "from") {
        setAutofillFrom(data.features);
      } else if (type === "to") {
        setAutofillTo(data.features);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (text, type) => {
    if (type === "from") {
      setFrom(text);
      fetchAutofillSuggestions(text, "from");
    } else if (type === "to") {
      setTo(text);
      fetchAutofillSuggestions(text, "to");
    }
  };

  const handleOnClickBook = ()=>{
    if(Globalfrom == null || from == null)
    {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please Select the from location',
      })
      return
    }
    if(Globalto == null || to == null)
    {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please Select the to location',
      })
      return
    }
    dispatch(setOrigin(Globalfrom));
    dispatch(setDestination(Globalto));
    navigate("Plan")
  }

  const { navigate } = useNavigation();

  return (
    <AlertNotificationRoot>
        
    <View style={tw `bg-white h-full`}>
      <View style={tw `flex flex-row justify-between items-center`}>
        <Text style={tw `text-3xl font-extrabold p-5 `}>Cab <Text style={tw `text-green-300`}>C</Text>onnect</Text>
        <Text style={tw `bg-green-300 px-4 py-6 rounded-full text-white mr-6`} onPress={()=>{navigate("Profile")}}>Profile</Text>
      </View>
        <Text style={tw `px-4 mt-9 text-xl font-semibold text-gray-500`}>Lets <Text style={tw` text-2xl font-bold`}>Ride!</Text></Text>
      <TextInput
        style={tw `px-3 py-2 border bg-gray-200 rounded-xl w-80 mx-auto mt-32`}
        placeholder={"From:"}
        value={from}
        onChangeText={(text) => handleInputChange(text, "from")}
      />
      <View style={tw `mx-auto border px-10 border-gray-300 rounded-xl mt-2`}>
        {
          autofillFrom.map((match,index)=>(
            match.properties.type == "city" || match.properties.type == "street" ?
            
          <TouchableOpacity key={index} onPress={()=>{setGlobalFrom(match);setFrom((match.properties.name ? match.properties.name : "") + ", "  + (match.properties.county ? match.properties.county : "") + ", " +  (match.properties.postcode ? match.properties.postcode : "") + ", " + (match.properties.country ? match.properties.country : ""));setAutofillFrom([])}}>
            <Text style={tw`border-b border-gray-300 py-2 text-left`}>{ (match.properties.name ? match.properties.name : "") + ", "  + (match.properties.county ? match.properties.county : "") + ", " +  (match.properties.postcode ? match.properties.postcode : "") + ", " + (match.properties.country ? match.properties.country : "")  }</Text>
          </TouchableOpacity>
          :
          ""
        )) 
        }
      </View>
      <TextInput
        style={tw ` px-3 py-2 border bg-gray-200 rounded-xl w-80 mx-auto mt-11`}
        placeholder={"To:"}
        value={to}
        onChangeText={(text) => handleInputChange(text, "to")}
      />
      <View style={tw `mx-auto border px-10 border-gray-300 rounded-xl mt-2`}>
        {
          autofillTo.map((match,index)=>(
            match.properties.type == "city" || match.properties.type == "street" ?
          <TouchableOpacity key={index} onPress={()=>{setGlobalTo(match);setTo((match.properties.name ? match.properties.name : "") + ", "  + (match.properties.county ? match.properties.county : "") + ", " +  (match.properties.postcode ? match.properties.postcode : "") + ", " + (match.properties.country ? match.properties.country : ""));setAutofillTo([])}}>
            <Text style={tw`border-b border-gray-300 py-2 text-left`}>{ (match.properties.name ? match.properties.name : "") + ", "  + (match.properties.county ? match.properties.county : "") + ", " +  (match.properties.postcode ? match.properties.postcode : "") + ", " + (match.properties.country ? match.properties.country : "")  }</Text>
          </TouchableOpacity>
          :
          ""
          )) 
        }
      </View>
    <TouchableOpacity onPress={handleOnClickBook}style={tw`bg-black p-4 w-32 rounded-xl mx-auto mt-7`}>
      <Text style={tw`text-white font-bold text-center`} >{'Book ->'}</Text>
    </TouchableOpacity>

    </View>
</AlertNotificationRoot>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  
})