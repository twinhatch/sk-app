/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import { View, Text, Dimensions, StatusBar } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import styles from './StyleProvider';
import { GetApi } from '../../Helpers/Service';
import { Context } from '../../../App';
import MapViewDirections from 'react-native-maps-directions';
import Constants from '../../Helpers/constant';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const GOOGLE_MAPS_APIKEY = 'AIzaSyC2HWPbrvHe5C2AjG9R7uD_aT2-wvkO7os';

const RouteMap = props => {
  const [coordinates, setcoordinates] = useState(
    props.route.params.coordinates || [],
  );
  const [deviceLoc, setDeviceLoc] = React.useState({});
  const [delta, setDelta] = React.useState({});

  console.log(coordinates);
  const northeastLat = coordinates[1]?.latitude;
  const southwestLat = coordinates[0]?.latitude;
  const LATITUDE_DELTA = northeastLat - southwestLat;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const icon = {
    provider: require('../../Assets/newImgs/travellerBadge1.png'),
    traveller: require('../../Assets/newImgs/packageBadge3.png'),
  };

  const color = {
    provider: Constants.blue,
    traveller: Constants.red,
  };
  useEffect(() => {
    // if (travelPlan?.location.length > 0 && travelPlan.tolocation.length > 0) {
    const northeastLat = parseFloat(props.route.params.coordinates[0].latitude);
    const southwestLat = parseFloat(props.route.params.coordinates[1].latitude);
    const latDelta = northeastLat - southwestLat;
    const lngDelta = latDelta * ASPECT_RATIO * 4;
    console.log(Math.abs(latDelta), Math.abs(lngDelta));
    setDeviceLoc({
      lat:
        (props.route.params.coordinates[0].latitude +
          props.route.params.coordinates[1].latitude) /
        2,
      lng:
        (props.route.params.coordinates[0].longitude +
          props.route.params.coordinates[1].longitude) /
        2,
    });
    setDelta({
      lat: Math.abs(latDelta),
      lng: Math.abs(lngDelta),
    });
    // }
  }, [props.route.params.coordinates]);

  return (
    <View>
      {coordinates.length > 0 && (
        <MapView
          style={[
            styles.mapOrigin,
            { height: Dimensions.get('screen').height - StatusBar.currentHeight },
          ]}
          region={{
            latitude: deviceLoc?.lat || 37.4224016,
            longitude: deviceLoc?.lng || -122.0847864,
            // latitudeDelta: LATITUDE_DELTA,
            // longitudeDelta: LONGITUDE_DELTA,
            latitudeDelta: delta?.lat || 0.1724,
            longitudeDelta: delta?.lng || 0.1724,
          }}
          provider={PROVIDER_GOOGLE}>
          <MapViewDirections
            origin={coordinates[0]}
            destination={coordinates[1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor={color[props.route.params.from]}
            optimizeWaypoints={true}
          />
          {coordinates?.map((item, i) => (
            <Marker
              key={i}
              image={icon[props.route.params.from]}
              coordinate={item}></Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

export default RouteMap;
