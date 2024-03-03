import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import tw from 'tailwind-react-native-classnames'
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../slices/authSlice';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const DriverPage = () => {

    const [data, setData] = useState(null);
    const [flag, setFlag] = useState(true);
    const intervalRef = useRef(null);
    const user = useSelector(selectUser);
    const mapRef = useRef(null);

    const zoomMap = ()=>{
        mapRef.current.fitToSuppliedMarkers(["m1","m2"],{
            edgePadding:{
                top:50,bottom:50,right:50,left:50
            }
        })
    }

    const fetchLastAssignedRide = async () => {
        try {
            const response = await fetch(process.env.BASE_URL + "api/passenger/assignedride/" + user._id);

            if (!response.ok) {
                console.error('Error fetching last assigned ride:', response.statusText);
                return;
            }

            const data = await response.json();
            setData(data.data);
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };
    useEffect(() => {
        fetchLastAssignedRide();
    }, [flag]);

    const completeRide = async (rideId) => {
        setFlag(!flag)
        try {
          const response = await fetch(process.env.BASE_URL + "api/passenger/completeride/" + rideId , {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok){
            const errorData = await response.json();
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'An unexpected error occurred. Please try again.',
            });
          }
      
          const responseData = await response.json();
          // Perform any additional actions after successfully completing the ride
        } catch (error) {
          console.error('Error during completing ride:', error);
      
          // Handle errors using the Toast module
          Toast.show({
            type: 'danger', // Adjust based on your Toast module API
            textBody: 'An unexpected error occurred. Please try again.',
            title:"Error"
        });
        }
      };

      const {navigate} = useNavigation();

    return (
        <View>
            <View style={tw`h-1/2`}>
                <View style={tw`flex flex-row justify-between items-center`}>
                    <Text style={tw`text-3xl font-extrabold p-5 `}>Cab <Text style={tw`text-green-300`}>C</Text>onnect</Text>
                    <Text style={tw`bg-green-300 px-4 py-6 rounded-full text-white mr-6`} onPress={()=>{navigate("Profile")}}>Profile</Text>
                </View>
                {
                    data
                    ?
                    <View style={tw`mt-6 flex flex-col justify-center`}>
                        <Text style={tw`font-bold text-3xl text-center `}>New Ride Assigned</Text>
                        <Text style={tw`text-xl mt-2 text-center`}>Name: {data.user.username}</Text>
                        <Text style={tw`text-xl mt-2 text-center`}>Gender: {data.user.gender}</Text>
                        <Text style={tw`text-xl mt-2 text-center`}>Mobile: {data.user.mobile}</Text>
                        <Text style={tw`text-xl mt-2 text-center`}>From: {data.origin.properties.name}</Text>
                        <Text style={tw`text-xl mt-2 text-center`}>To: {data.destination.properties.name}</Text>
                        <TouchableOpacity 
                        onPress={()=>{completeRide(data._id)}}
                        style={tw`bg-black w-52 mx-auto mt-4 rounded-lg`}>
                            <Text style={tw`text-white text-center py-3`}>Ride Completed</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <>
                    <Text style={tw`text-2xl text-center font-bold my-auto`}>No Assigned Rides</Text>
                    <TouchableOpacity style={tw`bg-black mx-20 py-4 rounded`}>
                        <Text style={tw`text-white text-center`} onPress={()=>{setFlag(!flag)}}>Reload</Text>
                    </TouchableOpacity>
                    </>
                }
            </View>
            <View style={tw`h-1/2`}>
                {
                    data &&
                    <MapView
                        style={tw`flex-1`}
                        ref={mapRef}
                        mapType="mutedStandard"
                        initialRegion={{
                            latitude: data.origin.geometry.coordinates[1], // [0] lattitude
                            longitude: data.origin.geometry.coordinates[0], // [1] longitude
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        onMapLoaded={() => { zoomMap() }}
                    >
                        <Marker
                            coordinate={{
                                latitude: data.origin.geometry.coordinates[1], // [1] lattitude
                                longitude: data.origin.geometry.coordinates[0], // [0] longitude
                            }}
                            title="Starting Location"
                            description={data.origin.properties.name + " " + data.origin.properties.state}
                            identifier="m1"
                        />
                        <Marker
                            coordinate={{
                                latitude: data.destination.geometry.coordinates[1], // [1] lattitude
                                longitude: data.destination.geometry.coordinates[0], // [0]longitude
                            }}
                            title="Destination"
                            description={data.destination.properties.name + " " + data.destination.properties.state}
                            identifier="m2"
                        />
                    </MapView>
                }
            </View>
        </View>
    )
}

export default DriverPage