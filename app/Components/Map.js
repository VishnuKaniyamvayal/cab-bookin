import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MapView, { Marker } from 'react-native-maps';
import tw from "tailwind-react-native-classnames"
import { useSelector } from 'react-redux';
import { selectDestination, selectOrigin } from '../slices/navSlice';

const Map = () => {

    const mapRef = useRef(null);

    const origin = useSelector(selectOrigin)
    const destination = useSelector(selectDestination)

    const zoomMap = ()=>{
        mapRef.current.fitToSuppliedMarkers(["m1","m2"],{
            edgePadding:{
                top:50,bottom:50,right:50,left:50
            }
        })
    }

    return (
        <MapView
            style={tw`flex-1`}
            ref={mapRef}
            mapType="mutedStandard"
            initialRegion={{
                latitude: origin.geometry.coordinates[1], // [0] lattitude
                longitude: origin.geometry.coordinates[0], // [1] longitude
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
            onMapLoaded = {()=>{zoomMap()}}
        >
            <Marker
                coordinate={{
                    latitude: origin.geometry.coordinates[1], // [1] lattitude
                    longitude: origin.geometry.coordinates[0], // [0] longitude
                }}
                title="Starting Location"
                description={origin.properties.name + " " + origin.properties.state}
                identifier="m1"
            />
            <Marker
                coordinate={{
                    latitude: destination.geometry.coordinates[1], // [1] lattitude
                    longitude: destination.geometry.coordinates[0], // [0]longitude
                }}
                title="Destination"
                description={destination.properties.name + " " + destination.properties.state}
                identifier="m2"
            />
        </MapView>
    )
}

export default Map