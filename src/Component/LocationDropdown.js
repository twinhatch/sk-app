/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Image,
  TextInput,
  Platform,
  Animated,
} from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../Helpers/constant';
import axios from 'axios';
import {
  request,
  PERMISSIONS,
  requestLocationAccuracy,
} from 'react-native-permissions';
import Styles from '../Screens/Auth/Styles';
// import debounce from 'lodash.debounce';

// AIzaSyAshORpoR1zzvluMgps8NQXO8avnVLnsL4

const LocationDropdown = props => {
  const [showList, setShowList] = useState(false);
  const [prediction, setPredictions] = useState([]);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({});
  const refInput = useRef(null);
  const animate = useRef(new Animated.Value(0)).current;
  const [isAnim, setAnim] = useState(false);

  useEffect(() => {
    setAddress(props.value);
  }, [props.value]);

  useEffect(() => {
    setShowList(props?.focus);
    if (props?.focus) {
      console.log(props?.focus);
      refInput.current.focus();
      // Animated.timing(animate, {
      //   toValue: isAnim ? 0 : -45,
      //   duration: 300,
      //   useNativeDriver: true,
      // }).start();
    } else {
      // refInput.current?.blur();
    }
  }, [props]);

  useEffect(() => {
    // getLocation();
    setDefaults({
      key: 'AIzaSyC2HWPbrvHe5C2AjG9R7uD_aT2-wvkO7os', // Your API key here.
      language: 'en', // Default language for responses.
      region: 'es', // Default region for responses.
    });
  }, []);

  // const getLocation = async () => {
  //   try {
  //     if (Platform.OS === 'ios') {
  //       request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async result => {
  //         console.log(result);
  //       });
  //     } else {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       );
  //       console.log(PermissionsAndroid.RESULTS.GRANTED, granted);
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log('You can use the location');
  //       } else {
  //         console.log('location permission denied');
  //         // alert("Location permission denied");
  //       }
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  const GOOGLE_PACES_API_BASE_URL =
    'https://maps.googleapis.com/maps/api/place';

  const GooglePlacesInput = async text => {
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=AIzaSyC2HWPbrvHe5C2AjG9R7uD_aT2-wvkO7os&input=${text}`;

    try {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async result => {
          console.log(result);
          if (result === 'granted') {
            setShowList(true);
            const results = await axios.request({
              method: 'get',
              params: {
                types: ['address'],
                componentRestrictions: { country: 'in' },
              },

              url: apiUrl,
            });
            if (results) {
              const {
                data: { predictions },
              } = results;
              setPredictions(predictions);
              setShowList(true);
            }
          } else {
            getLocation();
          }
        });
      } else {
        const check = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (check) {
          setShowList(true);
          const result = await axios.request({
            method: 'post',
            url: apiUrl,
          });
          if (result) {
            const {
              data: { predictions },
            } = result;
            setPredictions(predictions);
            setShowList(true);
          }
        } else {
          getLocation();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkLocation = async add => {
    try {
      // Geocode.setKey('AIzaSyC2HWPbrvHe5C2AjG9R7uD_aT2-wvkO7os');
      if (add) {
        fromAddress(add).then(
          response => {
            console.log(response.results[0].address_components[0].types);
            const cityRegex = /,\s*([^,]+)$/; // Regex to extract the city from the address
            const matches = add.match(cityRegex);
            console.log('check--------->', add, matches);
            const lat = response.results[0].geometry.location;
            setLocation(lat);
            props.getLocationVaue(lat, add);
          },
          error => {
            console.error(error);
          },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const debouncedSave = () => {
  //   debounce(nextValue => {
  //     console.log('jiojij');
  //     setShowList(false);
  //   }, 2000);
  // };

  return (
    <>
      <Animated.View
        style={[
          { flexDirection: 'row', position: 'relative' },
          {
            transform: [{ translateY: isAnim ? 10 : 0 }, { translateX: animate }],
          },
        ]}>
        <TextInput
          style={[
            Styles.input,
            {
              color: Constants.black,
              width: 250,
            },
            props?.multi === 'false' ? { height: 45 } : { minHeight: 45 },
          ]}
          ref={refInput}
          maxLength={150}
          multiline={props?.multi === 'false' ? false : true}
          onBlur={() => {
            props.setIsFocus(false);
            setShowList(false);
          }}
          autoFocus={props.focus}
          placeholder={props?.placeholder || 'Address'}
          placeholderTextColor={Constants.lightgrey}
          value={address}

          onPressIOut={() => {
            setShowList(false);
          }}
          onFocus={() => {
            if (
              props?.setItemDetails &&
              props?.keys !== 'delivery_address' &&
              props?.keys !== 'address'
            ) {
              props.setIsFocus(true);
            }
          }}
          onChangeText={locations => {

            if (props?.setItemDetails) {
              if (
                props?.keys === 'delivery_address' ||
                props?.keys === 'address'
              ) {
                if (locations.length === 0) {
                  props?.setItemDetails({
                    ...props.itemDetails,
                    [props.keys]: locations,
                    [props.cordinate]: [],
                  });
                  props.setIsFocus(props.from);
                }
              } else {
                console.log(locations);
                props.setIsFocus(true);
                props?.setItemDetails({
                  ...props.itemDetails,
                  [props.keys]: locations,
                });

              }
            }
            if (props?.setTravelPlan) {
              if (locations.length === 0) {
                props?.setTravelPlan({
                  ...props.travelPlan,
                  [props.keys]: locations,
                  [props.cordinate]: [],
                });
                props.setIsFocus(props.from);
              }
            }
            GooglePlacesInput(locations);
            setAddress(locations);
          }}
        />
      </Animated.View>
      {prediction !== '' && showList && (
        <View style={[prediction && styles.list, props?.listMargin && { top: props?.listMargin, left: -20 }]}>
          {prediction.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: Constants.lightgrey,
              }}>
              <Ionicons
                name="earth"
                size={18}
                color={Constants.yellow}
                style={{ marginHorizontal: 5 }}
              />
              <Text
                style={styles.item}
                onPress={() => {
                  console.log(item);
                  refInput.current?.blur();
                  props?.setIsFocus(false);
                  setAddress(item.description);
                  checkLocation(item.description);
                  setShowList(false);
                }}>
                {item.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  editjobinput: {
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    lineHeight: 12,
    marginLeft: 2,
  },
  amountTimeMainView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  amountTime: {
    color: Constants.white,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 5,
    lineHeight: 18,
  },
  list: {
    marginVertical: 10,
    // marginHorizontal: 20,
    borderColor: Constants.lightgrey,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: Constants.white,
    position: 'absolute',
    marginTop: 50,
    // top: 120,
    left: -10,
    zIndex: 9,
    // padding: 10,
  },
  item: {
    // padding: 10,
    fontSize: 13,
    height: 'auto',
    marginVertical: 5,
    overflow: 'visible',
    // borderBottomWidth: 1,
    // borderBottomColor: 'lightgrey',
    // fontFamily: 'Mulish-SemiBold',
    width: Dimensions.get('window').width - 100,
    flexWrap: 'wrap',
    color: Constants.black,
  },
  validateBorder: {
    borderBottomColor: Constants.black,
    borderBottomWidth: 1,
    paddingBottom: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default LocationDropdown;
