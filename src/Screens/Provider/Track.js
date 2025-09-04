/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { View, Text, Dimensions, StatusBar, Platform } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import styles from './StyleProvider';
import { GetApi } from '../../Helpers/Service';
import { Context } from '../../../App';
import MapViewDirections from 'react-native-maps-directions';
import Constants from '../../Helpers/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const GOOGLE_MAPS_APIKEY = 'AIzaSyC2HWPbrvHe5C2AjG9R7uD_aT2-wvkO7os';

const Track = props => {
  const { width, height } = Dimensions.get('window');
  // const h = (height / 100) * 55
  const h = height - 200;
  const ASPECT_RATIO = width / h;
  console.log(props.route);
  const { plan_id, to } = props.route.params;
  const [deviceLoc, setDeviceLoc] = React.useState({});
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [packageById, setPackageById] = useState({});
  const [loc, setLoc] = React.useState({});
  const [delta, setDelta] = React.useState({});
  const [track, setTrack] = React.useState({});

  useEffect(() => {
    let timeoutID
    if (plan_id) {

      // checkNotificationStatus(true);
      getPackageById(plan_id, false, true);
      timeoutID = setInterval(() => {
        getPackageById(plan_id, false, false);
        // checkNotificationStatus(false);
      }, 30000);
      // getPackageById(plan_id);
    }
    return () => {
      clearInterval(timeoutID);

    };
  }, [plan_id]);

  const checkNotificationStatus = async (type) => {
    const data = await AsyncStorage.getItem(plan_id);
    console.log('notification--->', data, new Date(), new Date(Number(data)));
    const hours = moment().diff(new Date(Number(data)), 'hours');
    if (hours >= 1) {
      getPackageById(plan_id, false, type);
    } else {
      getPackageById(plan_id, false, type);
    }
    console.log('hours--->', hours);
  };

  useEffect(() => {
    if (
      loc?.location?.latitude !== undefined &&
      loc.tolocation?.latitude !== undefined
    ) {
      const northeastLat = parseFloat(loc?.location.latitude);
      const southwestLat = parseFloat(loc?.tolocation.latitude);
      const latDelta = northeastLat - southwestLat;
      const lngDelta = latDelta * ASPECT_RATIO * 5;
      console.log(Math.abs(latDelta), Math.abs(lngDelta));
      setDeviceLoc({
        lat: (loc?.location.latitude + loc?.tolocation.latitude) / 2,
        lng: (loc?.location.longitude + loc?.tolocation.longitude) / 2,
      });
      setDelta({
        lat: Math.abs(latDelta),
        lng: Math.abs(lngDelta),
      });
    }
  }, [loc]);

  const getPackageById = (id, type, loads) => {
    console.log(id);
    setLoading(loads);
    GetApi(`getpackages/${id}?push=${type}`, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res.data.track.coordinates);
        console.log(res.data.location.coordinates);
        console.log(res.data.tolocation.coordinates);
        if (res.status) {
          setPackageById(res.data);
          console.log('type======>', res.data);
          if (type) {
            console.log('called=======>');
            await AsyncStorage.setItem(
              plan_id,
              new Date().getTime().toString(),
            );
          }
          if (res.data.track !== undefined && res.data.track !== null) {
            setLoc({
              location: {
                latitude: res.data?.location.coordinates[1],
                longitude: res.data?.location.coordinates[0],
              },
              tolocation: {
                latitude: res.data?.tolocation.coordinates[1],
                longitude: res.data?.tolocation.coordinates[0],
              },
            });
            setTrack({
              latitude: res.data?.track.coordinates[1],
              longitude: res.data?.track.coordinates[0],
            });
          }
          // await
        } else {
          console.log('error------>', res);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={[
          styles.mapOrigin,
          { height: Dimensions.get('screen').height - StatusBar.currentHeight },
        ]}
        region={{
          latitude: deviceLoc?.lat || 28.535517,
          longitude: deviceLoc?.lng || 77.391029,
          latitudeDelta: delta?.lat > 0.07 ? delta?.lat : 0.07,
          longitudeDelta: delta?.lng > 0.07 ? delta?.lng : 0.07,
        }}
        provider={MapView.PROVIDER_GOOGLE}>
        {!!track?.latitude && (
          <Marker
            image={require('../../Assets/newImgs/travellerBadge2.png')}
            coordinate={track}
          />
        )}
        {!!deviceLoc?.lat && (
          <Marker
            image={require('../../Assets/newImgs/start.png')}
            coordinate={loc.location}
          />
        )}
        {!!deviceLoc?.lat && (
          <Marker
            image={require('../../Assets/newImgs/end.png')}
            coordinate={loc.tolocation}
          />
        )}

        {/* {loc?.location?.latitude !== undefined &&
          loc?.tolocation?.latitude !== undefined && (
            <MapViewDirections
              origin={loc.location}
              destination={loc.tolocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor={Constants.blue}
              optimizeWaypoints={true}
            />
          )} */}

        {track?.latitude !== undefined &&
          loc?.tolocation?.latitude !== undefined && (
            <MapViewDirections
              origin={track}
              destination={loc.tolocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              strokeColor={Constants.red}
              optimizeWaypoints={true}
            />
          )}
      </MapView>
    </View>
  );
};

export default Track;
