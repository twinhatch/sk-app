/* eslint-disable no-unused-vars */
import { View, Text, PermissionsAndroid, Platform } from 'react-native';
import React from 'react';
import Geolocation from 'react-native-geolocation-service';
import {
  request,
  PERMISSIONS,
  requestLocationAccuracy,
  check
} from 'react-native-permissions';
import {
  setKey,
  setDefaults,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from 'react-geocode';
import { checkEmail } from '../Helpers/InputsNullChecker';

const CustomCurrentLocation = async getLocation => {
  // const location = {
  //   coords: {
  //     latitude: 28.535517,
  //     longitude: 77.391029,
  //   },
  // };
  // const add = [
  //   {
  //     formatted_address: 'Katargam, Surat, Gujarat',
  //   },
  // ]
  // getLocation(location, add)
  // return
  try {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
        console.log(result);
        if (result === 'granted') {
          currLocation()
        } else {
          request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
            console.log(result);
            if (result === 'granted') {
              currLocation()
            }
          });
        }
      });

    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log(granted, PermissionsAndroid.RESULTS.GRANTED);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            setDefaults({
              key: 'AIzaSyC2HWPbrvHe5C2AjG9R7uD_aT2-wvkO7os', // Your API key here.
              language: 'en', // Default language for responses.
              region: 'es', // Default region for responses.
            });
            fromLatLng(position?.coords?.latitude, position?.coords?.longitude)
              .then(({ results }) => {
                getLocation(position, results);
                const { lat, lng } = results[0].geometry.location;
                console.log(lat, lng);
              })
              .catch(console.error);
          },
          error => {
            console.log(error.code, error.message);
            //   return error;
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        console.log('location permission denied');
      }
    }
  } catch (err) {
    console.log('location err =====>', err);
  }


  const currLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setDefaults({
          key: 'AIzaSyC2HWPbrvHe5C2AjG9R7uD_aT2-wvkO7os', // Your API key here.
          language: 'en', // Default language for responses.
          region: 'es', // Default region for responses.
        });
        fromLatLng(position?.coords?.latitude, position?.coords?.longitude)
          .then(({ results }) => {
            getLocation(position, results);
            const { lat, lng } = results[0].geometry.location;
            console.log(lat, lng);
          })
          .catch(console.error);
      },
      error => {
        console.log(error.code, error.message);
        //   return error;
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }
};

export default CustomCurrentLocation;
