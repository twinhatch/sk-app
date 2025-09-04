/* eslint-disable handle-callback-err */
/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Modal,
  ScrollView,
  Keyboard,
  Animated,
  Linking,
  Dimensions,
  Vibration,
  Easing,
  Alert,
} from 'react-native';
import React, { createRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Constants from '../../Helpers/constant';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polyline } from 'react-native-maps';
import styles from './StyleProvider';
import ActionSheet from 'react-native-actions-sheet';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import { Avatar } from 'react-native-paper';
import { GetApi, Post } from '../../Helpers/Service';
import { Context, UserContext, locContext, toastContext } from '../../../App';
import CustomCurrentLocation from '../../Component/CustomCurrentLocation';
import LocationDropdown from '../../Component/LocationDropdown';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { checkForEmptyKeys } from '../../Helpers/InputsNullChecker';
import CustomToaster from '../../Component/CustomToaster';
import Spinner from '../../Component/Spinner';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import ImageView from 'react-native-image-viewing';
import MapViewDirections from 'react-native-maps-directions';
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
import GetCurrentAddressByLatLong from '../../Component/GetCurrentAddressByLatLong';
import * as geolib from 'geolib';
// import BottomDrawer from 'rn-bottom-drawer';
import Tooltip from 'react-native-walkthrough-tooltip';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import AnimateNumber from 'react-native-animate-number';
import BottomDrawer, {
  BottomDrawerMethods,
} from 'react-native-animated-bottom-drawer';
import useColorAnimation from '../../Component/AnimateBg';
import { socket } from '../../../utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SplashScreen from 'react-native-splash-screen';
import { Coachmark } from 'react-native-coachmark';
import AnimatedTyping from '../../Component/AnimatedTyping';
import { mapStyle } from '../Provider/mapStyle';
import AnimatedPolyline from '../../Component/PolylineAnimation';
// import { useDispatch, useSelector } from 'react-redux';
import { getuserLocation } from '../../redux/store/getuserLocation';
import ConnectionCheck from '../../Component/ConnectionCheck';
// import AnimatedPolyline from '../../Component/PolylineAnimation';

const setNewDateForArival = date => {
  const datec = new Date(date);
  return new Date(datec.setMinutes(datec.getMinutes() + 2));
};

const GOOGLE_MAPS_APIKEY = 'AIzaSyC2HWPbrvHe5C2AjG9R7uD_aT2-wvkO7os';
const colors = [Constants.traveller, Constants.lightTraveller];
const Home = props => {
  const { width, height } = Dimensions.get('window');
  // const h = (height / 100) * 55
  const h = height - 300;
  const ASPECT_RATIO = width / h;
  // const dispatch = useDispatch();

  // console.log('ASPECT_RATIO', ASPECT_RATIO, h);
  const [color, setColor] = useState(colors[0]);

  const [backgroundColor, finished] = useColorAnimation(color);
  const [delta, setDelta] = React.useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [post, setPost] = useState('1');
  const [toast, setToast] = useContext(toastContext);
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useContext(Context);
  const [user, setUser] = useContext(UserContext);
  const [currLoc, setCurLoc] = useContext(locContext);
  const [deviceLoc, setDeviceLoc] = React.useState({});
  const [locationArray, setLocationArray] = React.useState([]);
  const [filedCheck, setfiledCheck] = useState([]);
  const [startAddress, setStartAddress] = React.useState('');
  const [endAddress, setEndAddres] = React.useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openEstimate, setOpeEstimate] = useState(false);
  const actionRef = createRef();
  const actionRef2 = createRef();
  const [packageById, setPackageById] = useState({});
  const [isFocus, setIsFocus] = useState(false);
  const [imageView, setImageView] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [minDate, setMinDate] = useState(setNewDateForArival(new Date()));
  const [maxDate, setMaxDate] = useState(new Date());
  const [selectedate, setSelectedDate] = useState(new Date());
  const [sortRoute, setSortRoute] = useState({});
  const [isAnim, setAnim] = useState(false);
  const [sumitted, setSumitted] = useState(false);
  const [route, setRoute] = useState('');
  const trainAnim = useRef(new Animated.Value(0)).current;
  const animate = useRef(new Animated.Value(0)).current;
  const animate2 = useRef(new Animated.Value(0)).current;
  const animate3 = useRef(new Animated.Value(0)).current;
  const animate4 = useRef(new Animated.Value(0)).current;
  const baloonsAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = React.useState(false);
  const [mot, setMot] = React.useState([]);
  const [filterUser, setFilterUser] = useState([]);
  const [popuoType, setPopupType] = useState('');
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [from, setFrom] = useState('');
  const [step, setStep] = useState(false);

  const [coinSide, setCoinSide] = useState('Heads');
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [isSlowInternet, setIsSlowInternet] = useState(false);

  const step1 = useRef();
  const step2 = useRef();
  const step3 = useRef();
  const step4 = useRef();
  const step5 = useRef();
  const mapRef = useRef(null);
  const animatedValue = new Animated.Value(0);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [animatedCoordinates, setAnimatedCoordinates] = useState([]);
  const [isMapReady, setIsmapready] = useState(false);
  const [travelPlan, setTravelPlan] = useState({
    datetime: new Date(),
    estimate_time: new Date(),
    mot: '',
    seatAvailability: '0',
    profit_potential: '0',
    description: '',
    // address: '',
    fromaddress: '',
    toaddress: '',
    location: [],
    tolocation: [],
    // name: '',
  });
  const [alltraveller, setAlltraveller] = useState([]);
  const [selectTraveller, setSelecttraveller] = useState('');

  const [packagePlans, setPackagePlans] = useState([]);
  const [loc, setLoc] = React.useState({});

  const d = ['MOT', 'Car', 'Train', 'Bike', 'Plane'];

  const MOT = [
    { value: 'Bike' },
    { value: 'Auto' },
    { value: 'Car' },
    { value: 'Bus' },
    { value: 'Train' },
    { value: 'Flight' },
  ];

  const IconMapping = {
    Car: 'car',
    Train: 'train',
    Bike: 'motorcycle',
    Plane: 'plane',
    MOT: 'car',
    Auto: 'car',
    Flight: 'plane',
    Bus: 'bus',
  };

  const seatAvailability = {
    Car: [{ value: '0' }, { value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }, { value: '5' }, { value: '6' }],
    Bike: [{ value: '0' }, { value: '1' }],
    Flight: [],
    Train: [],
    MOT: [],
    Bus: [],
    Auto: [],
  };

  const jumpValue = useRef(new Animated.Value(-250)).current;
  const scalValue = useRef(new Animated.Value(0)).current;

  // useEffect(() => {


  //   socket.on('connect', () => {
  //     socket.emit('joinRoom', { user, key: 'travelerSocket', userkey: 'travellerid' });
  //     console.log('hguguug', socket.id);
  //   })
  //   // return () => {
  //   //   socket.off('connect');
  //   //   socket.on('disconnect', () => {
  //   //     console.log('Disconnected from server');
  //   //   });
  //   // };
  // }, [user]);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        // SplashScreen.hide();
        // setDelta({});
        setLoc({});
        getlocaldata();
        // setMot(MOT);
        flipCoin();
        startJump();
        getProfile();
        // setInterval(() => {
        //   handleButton();
        // }, 1000);
      },
    );
    let timeoutID = null
    // if (Platform.OS === 'android') {
    timeoutID = setInterval(() => {
      flipCoin();
    }, 7000);
    // }

    getlocaldata();

    // socket.on('newpackageCreated', () => {
    //   console.log('newpackageCreated=============>')
    //   setTimeout(() => {

    //     let data = {};
    //     if (travelPlan?.location?.length > 0) {
    //       data.location = travelPlan.location
    //     } else {
    //       data.location = [loc.location.coords.longitude, loc.location.coords.latitude];
    //     }

    //     if (travelPlan?.tolocation?.length > 0) {
    //       data.tolocation = travelPlan?.tolocation
    //     }
    //     packagesNearMe(data);
    //   }, 2000);
    // })
    const willFocusSubscriptions = props.navigation.addListener(
      'beforeRemove',
      async () => {
        setTravelPlan({
          datetime: new Date(),
          estimate_time: new Date(),
          mot: '',
          seatAvailability: '0',
          profit_potential: '0',
          description: '',
          // address: '',
          fromaddress: '',
          toaddress: '',
          location: [],
          tolocation: [],
        });
      },

    );

    return () => {
      willFocusSubscription();
      willFocusSubscriptions();
      clearInterval(timeoutID);
      setTravelPlan({
        datetime: new Date(),
        estimate_time: new Date(),
        mot: '',
        seatAvailability: '0',
        profit_potential: '0',
        description: '',
        // address: '',
        fromaddress: '',
        toaddress: '',
        location: [],
        tolocation: [],
      });
    };
  }, [currLoc]);

  console.log(loc);
  const startJump = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(jumpValue, {
          toValue: -250,  // Jump height
          duration: 0,  // Jump duration
          useNativeDriver: true,
        }),
        // Animated.timing(scalValue, {
        //   toValue: 1,
        //   duration: 1000,
        //   useNativeDriver: true,
        // }),
        Animated.timing(jumpValue, {
          toValue: 100,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(jumpValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(jumpValue, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(jumpValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scalValue, {
          toValue: 0,  // Zoom out
          duration: 0,  // Zoom duration
          useNativeDriver: true,
        }),
        Animated.timing(scalValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };





  useEffect(() => {
    if (routeCoordinates.length > 0) {
      animateRoute();
    }
  }, [routeCoordinates]);
  const markerRef = useRef(null);
  const animatedValue2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animatedValue2.addListener(({ value }) => {
      if (markerRef.current) {
        const { latitude, longitude } = getCoordinatesAlongRoute(value);
        markerRef.current.setNativeProps({ coordinate: { latitude, longitude } });
      }
    });
  }, [animatedValue]);

  const getCoordinatesAlongRoute = (progress) => {
    // Calculate the coordinates based on the progress value
    const start = loc.location;
    const end = loc.tolocation;
    const latitude = start.latitude + (end.latitude - start.latitude) * progress;
    const longitude = start.longitude + (end.longitude - start.longitude) * progress;
    return { latitude, longitude };
  };

  // const animateRoute = () => {
  //   const steps = routeCoordinates.length * 10;
  //   const interval = 2000 / steps; // 2 seconds total for the whole route

  //   routeCoordinates.forEach((coord, index) => {
  //     setTimeout(() => {
  //       setAnimatedCoordinates(current => [...current, coord]);
  //     }, interval * index);
  //   });

  //   Animated.timing(animatedValue, {
  //     toValue: 1,
  //     duration: 200,
  //     useNativeDriver: false,
  //   }).start();
  // };


  const animateRoute = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (travelPlan?.location.length > 0 && travelPlan.tolocation.length > 0) {
      const northeastLat = parseFloat(travelPlan?.location[1]);
      const northeastLan = parseFloat(travelPlan?.location[0]);
      const southwestLat = parseFloat(travelPlan.tolocation[1]);
      const southwestLan = parseFloat(travelPlan.tolocation[0]);
      const latDelta = northeastLat - southwestLat;
      const check = Math.sign(latDelta);
      let calc = check === 1 ? 2 : 7;

      const lngDelta = latDelta * ASPECT_RATIO;
      // const lngDelta = (northeastLan - southwestLan) * 2;
      console.log('delta------>', Math.abs(latDelta), Math.abs(lngDelta));
      setDeviceLoc({
        lat: (travelPlan?.location[1] + travelPlan.tolocation[1]) / 2,
        lng: (travelPlan?.location[0] + travelPlan.tolocation[0]) / 2,
      });
      setLoc({
        location: {
          latitude: travelPlan?.location[1],
          longitude: travelPlan?.location[0],
        },
        tolocation: {
          latitude: travelPlan.tolocation[1],
          longitude: travelPlan.tolocation[0],
        },
      });
      setDelta({
        lat: Math.abs(latDelta),
        lng: Math.abs(lngDelta),
      });
    } else if (
      travelPlan?.location.length > 0 &&
      travelPlan.tolocation.length === 0
    ) {
      setLoc({
        ...loc,
        location: {
          latitude: travelPlan?.location[1],
          longitude: travelPlan?.location[0],
        },
      });
    } else {
      setLoc({
        ...loc,
        tolocation: {
          latitude: travelPlan.tolocation[1],
          longitude: travelPlan.tolocation[0],
        },
      });
    }
  }, [travelPlan]);

  useEffect(() => {
    if (
      loc?.location?.latitude !== undefined &&
      loc.tolocation?.latitude !== undefined
    ) {
      const northeastLat = parseFloat(loc?.location.latitude);
      const southwestLat = parseFloat(loc?.tolocation.latitude);
      const latDelta = northeastLat - southwestLat;
      const check = Math.sign(latDelta);
      let calc = check === 1 ? 2 : 7;
      const lngDelta = latDelta * ASPECT_RATIO;
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

  const getNextColor = (currentColor) => {
    const index = colors.indexOf(currentColor) + 1;
    return index === colors.length ? colors[0] : colors[index];
  };

  useEffect(() => {
    setTimeout(async () => {
      const travellerhome = await AsyncStorage.getItem('travellerhome');
      if (!travellerhome) {
        await step1.current.show();
      }
    }, 5000);
  }, []);

  const handleButton = () => setColor((current) => getNextColor(current));

  const startTrainAnimation = () => {
    const neh = height + 300;
    Animated.timing(trainAnim, {
      toValue: -neh,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  };

  const flipCoin = () => {
    const randomSide = Math.floor(Math.random() * 2);

    // Create a flip animation
    Animated.timing(flipAnimation, {
      toValue: 3,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      // Reset the animation value and set the
      // coin side based on the random result
      flipAnimation.setValue(0);
    });
  };

  const startAnimation = () => {
    const newh = height + 400;
    Animated.timing(baloonsAnim, {
      toValue: -newh,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  };

  const startAnimationwithVibrate = refs => {
    Animated.timing(refs, {
      toValue: 20,
      duration: 100,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(refs, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Vibration.cancel()
    }, 100);
  };

  const getDistance = () => {
    const start = {
      latitude: travelPlan.location[1],
      longitude: travelPlan.location[0],
    };
    const end = {
      latitude: travelPlan.tolocation[1],
      longitude: travelPlan.tolocation[0],
    };
    const da = geolib.getDistance(start, end);
    const ca = geolib.convertDistance(da, 'km');
    console.log(da, ca);
    return ca;
  };

  const getlocaldata = async () => {
    const data = await AsyncStorage.getItem('travelplan');
    if (data !== undefined && data !== null) {
      const mdata = JSON.parse(data);
      setTravelPlan({
        ...travelPlan,
        datetime: new Date(mdata.jurney_date),
        estimate_time: new Date(mdata.estimate_time),
        mot: mdata.mot,
        seatAvailability: mdata.seat_avaibility,
        profit_potential: mdata.profit_potential,
        description: mdata.description,
        fromaddress: mdata.fromaddress,
        toaddress: mdata.toaddress,
        location: mdata.location,
        tolocation: mdata.tolocation,
      });
      setDeviceLoc({
        lat: mdata.location[1],
        lng: mdata.location[0],
      });
      setStartAddress(mdata.fromaddress);
      setTimeout(() => {
        const data = { location: mdata.location, tolocation: mdata.tolocation };
        packagesNearMe(data);
      }, 1000);
      // startJump()

      // jurney_date: travelPlan.datetime,
      // estimate_time: travelPlan.estimate_time,
      // mot: travelPlan.mot,
      // seat_avaibility: travelPlan.seatAvailability,
      // profit_potential: travelPlan.profit_potential,
      // // address: travelPlan.address,
      // location: travelPlan.location,
      // description: travelPlan.description,
      // name: getTravelPlanname(),
      // toaddress: travelPlan.toaddress,
      // fromaddress: travelPlan.fromaddress,
    } else {
      // setLoading(true);
      setTimeout(() => {
        // if (Platform.OS === 'android') {
        ConnectionCheck.isConnected().then(
          async connect => {
            // (connect.type === 'wifi' && connect.details.linkSpeed < 0.25) ||
            if (!connect.isInternetReachable || (connect.isInternetReachable && ((connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || (connect.type === 'cellular' && connect.details.cellularGeneration === '2g')))) {
              setTimeout(() => {
                if (!isSlowInternet) {
                  setIsSlowInternet(true)
                  Alert.alert('Poor connection.', 'Please check your internet connection and retry again', [
                    {
                      text: 'Dismiss',
                      onPress: () => {
                        setIsSlowInternet(true);
                      },
                    },
                  ]);
                }
              }, 1000);
              // startJump()
              getLocation(currLoc.location, currLoc.add);
            } else {
              // console.log('location---------------->', travelPlan.fromaddress, currLoc);
              // if (travelPlan.toaddress === '') {
              setIsSlowInternet(false)
              // startJump()
              if (currLoc?.location === undefined || currLoc?.location === '') {
                CustomCurrentLocation(getCurrLoc);
              } else {
                getLocation(currLoc.location, currLoc.add);
              }
            }
          })
        // } else {
        //   console.log('location---------------->', travelPlan.fromaddress, currLoc);
        //   // if (travelPlan.toaddress === '') {
        //   setIsSlowInternet(false)
        //   // startJump()
        //   if (currLoc?.location === undefined || currLoc?.location === '') {
        //     CustomCurrentLocation(getCurrLoc);
        //   } else {
        //     getLocation(currLoc.location, currLoc.add);
        //   }
        // }
      }, 1000);


    }
  };

  const getCurrLoc = (location, add) => {
    AsyncStorage.setItem('userLcation', JSON.stringify({ location, add }));
    setCurLoc({ location, add });
    getLocation(location, add);
  };

  const getLocation = (res, add) => {
    try {
      setLoading(false);
      // console.log('res==============>', res);
      setStartAddress(add[0].formatted_address);
      setTravelPlan({
        ...travelPlan,
        fromaddress: add[0].formatted_address,
        location: [res.coords.longitude, res.coords.latitude],
      });
      getTravelPlanname();
      setDeviceLoc({
        lat: res.coords.latitude,
        lng: res.coords.longitude,
      });
      setTimeout(() => {
        const data = { location: [res.coords.longitude, res.coords.latitude] };
        packagesNearMe(data);
      }, 1000);

      // if (locationArray.length === 0) {
      //   setLocationArray([
      //     ...locationArray,
      //     {lat: res.coords.latitude, lng: res.coords.longitude},
      //   ]);
      // }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getTravelPlanname = () => {
    if (travelPlan?.fromaddress !== '' && travelPlan?.toaddress !== '') {
      if (getDistance() < 50) {
        const newMot = MOT.filter(f => f.value !== 'Flight');
        setMot(newMot);
        setRoute('LOCAL');
      } else if (getDistance() < 500) {
        setRoute('CITY');
        setMot(MOT);
      } else if (getDistance() < 2000) {
        setRoute('STATE');
        setMot(MOT);
      } else {
        setRoute('COUNTRY');
        const newMot = MOT.filter(
          f => f.value !== 'Bike' && f.value !== 'Bus' && f.value !== 'Auto',
        );
        setMot(newMot);
      }
      let from = travelPlan?.fromaddress.split(',');
      let to = travelPlan?.toaddress.split(',');
      if (from[from.length - 1] !== to[to.length - 1]) {
        // setRoute('COUNTRY');
        // const newMot = MOT.filter(
        //   f => f.value !== 'Bike' && f.value !== 'Bus' && f.value !== 'Auto',
        // );
        // console.log(newMot);
        // setMot(newMot);
        return `${from[from.length - 1].trim()} to ${to[to.length - 1].trim()}`;
      }

      if (from[from.length - 2] !== to[to.length - 2]) {
        // setRoute('STATE');
        // setMot(MOT);
        return `${from[from.length - 2].trim()} to ${to[to.length - 2].trim()}`;
      }

      if (from[from.length - 3] !== to[to.length - 3]) {
        // setRoute('CITY');
        // const newMot = MOT.filter(f => f.value !== 'Flight');
        // setMot(newMot);
        return `${from[from.length - 3].trim()} to ${to[to.length - 3].trim()}`;
      }

      if (from[from.length - 4] !== to[to.length - 4]) {
        // const newMot = MOT.filter(f => f.value !== 'Flight');
        // setMot(newMot);
        // setRoute('LOCAL');
        return `${from[from.length - 4].trim()} to ${to[to.length - 4].trim()}`;
      }
    }
  };

  const packagesNearMe = data => {
    // console.log('packagesNearMe=================>', data);
    Post('packagesNearMe', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        if (res.status) {
          setPackagePlans(res.data.jobs);
          if (
            data?.location?.length > 0 &&
            data?.tolocation?.length > 0 &&
            res.data.jobs.length > 0
          ) {
            const total = packagePlans.reduce((a, f) => a + f.total, 0);
            setTravelPlan({
              ...travelPlan,
              location: data.location,
              tolocation: data.tolocation,
              profit_potential: total.toString(),
              toaddress: data.add,
            });
            // trainAnim.setValue(0);
            // startTrainAnimation();
            // baloonsAnim.setValue(500);
            // startAnimation();
          }
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

  const travellerNearMe = data => {
    Post('travellerNearMe', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        if (res.status) {
          if (res.data.jobs.length > 0) {
            if (data.type === 'chat') {
              getPackageByUser('chat');
            } else {
              Linking.openURL(`tel:${packageById.user.phone}`);
              actionRef2.current.close();
              // actionRef2.current.hide();
            }
          } else {
            setToast(data.err_message);
          }
          // setPackagePlans(res.data.jobs);
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

  const getProfile = () => {
    setLoading(true);
    GetApi('getProfile', { ...props, setInitial }).then(
      async res => {
        if (res) {
          setUser(res.data);
          if (!res.data.verified) {
            getuserplans();
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
          if (res.data.message !== undefined) {
            setToast(res.data.message);
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getuserplans = () => {
    // setLoading(true);
    GetApi('gettravelplanbyuser?from=Connection', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        // console.log('gettravelplanbyuser------->', res);
        if (res) {
          if (res.data.length > 0) {
            setToast('')
            setTimeout(() => {
              setToast('Tap on EDIT and Verify your ID to get started');
              props.navigation.replace('profiletraveller');
            }, 300);
          }
        } else {
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const switchToProvider = () => {
    setLoading(true);
    Post('updateProfile', { type: 'USER' }, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        await step1.current?.hide();
        await step2.current?.hide();
        await step3.current?.hide();
        await step4.current?.hide();
        await step5.current?.hide();
        if (res.status) {
          setUser(res.data);
          await AsyncStorage.setItem('userDetail', JSON.stringify(res.data));
          // props.navigation.navigate('profile');
          props.navigation.replace('provider', {
            screen: 'Home',
          });
          setInitial('provider');
        } else {
          if (res.data.message !== undefined) {
            // setToast(res.data.message);
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const getLocationVaue = (lat, add, set) => {

    // set(add);
    if (set === 'start') {
      // setStartAddress
      setDeviceLoc(lat);
      setTravelPlan({
        ...travelPlan,
        fromaddress: add,
        location: [lat.lng, lat.lat],
      });
      setTimeout(() => {
        const data = { location: [lat.lng, lat.lat] };
        packagesNearMe(data);
      }, 1000);
    }
    if (set === 'end') {
      setTravelPlan({
        ...travelPlan,
        toaddress: add,
        tolocation: [lat.lng, lat.lat],
      });
      setTimeout(() => {
        // location: travelPlan.location,
        const data = {
          tolocation: [lat.lng, lat.lat],
          location: travelPlan.location,
          add,
        };
        packagesNearMe(data);
      }, 1000);
    }

    getTravelPlanname();
  };

  //console.log(travelPlan)

  const submit = async () => {
    let desc = travelPlan.description;
    delete travelPlan.description;
    let { errorString, anyEmptyInputs } = checkForEmptyKeys(travelPlan);
    setfiledCheck(anyEmptyInputs);
    if (anyEmptyInputs.length > 0) {
      setToast('Fill the details properly');
      return;
    }

    if (
      new Date(travelPlan.datetime).getTime() ===
      new Date(travelPlan.estimate_time).getTime()
    ) {
      setSumitted(true);
      Vibration.vibrate();
      setToast('Check your arrival time');
      return;
    }

    if (travelPlan.mot === '' || travelPlan.mot === 'MOT') {
      setfiledCheck(['MOT']);
    }

    const data = {
      jurney_date: travelPlan.datetime,
      estimate_time: travelPlan.estimate_time,
      mot: travelPlan.mot,
      seat_avaibility: travelPlan.seatAvailability,
      profit_potential: travelPlan.profit_potential,
      // address: travelPlan.address,
      location: travelPlan.location,
      description: desc,
      name: getTravelPlanname(),
      toaddress: travelPlan.toaddress,
      fromaddress: travelPlan.fromaddress,
      tolocation: travelPlan.tolocation,
      route,
    };
    // actionRef.current.hide();
    actionRef.current.close();
    await AsyncStorage.setItem('travelplan', JSON.stringify(data));
    props.navigation.navigate('payment', { travelPlan: JSON.stringify(data) });
    return;
  };

  const getPackageById = id => {
    setLoading(true);
    GetApi(`getpackages/${id}`, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        if (res.status) {
          setPackageById(res.data);
          // setTimeout(() => {
          //   actionRef2.current.open();

          // }, 5000);
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

  const getPackageByUser = (type) => {
    setLoading(true);
    Post('gettravelplanbyuserwithlocation', {
      location: packageById.location.coordinates,
      tolocation: packageById.tolocation.coordinates,
      packagePlan: packageById._id,
      newdate: moment().format('YYYY-MM-DD'),
    }, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        // console.log(res);
        if (res.status) {
          res.data.jobs.forEach(element => {
            element.value = element.name;
            element.key = element._id;
          });
          setAlltraveller(res.data.jobs);
          if (res.data.jobs.length > 0) {
            if (type?.type === 'call') {
              Linking.openURL(`tel:${packageById.user.phone}`);
              actionRef2.current.close();
            } else {
              if (res.data.jobs.length > 1) {
                setModalVisible(true);
                setPopupType('chat');
              } else {
                setSelecttraveller(res.data.jobs[0]);
                if (type === 'invite') {
                  sendInvitation(res.data.jobs[0]._id);
                } else {
                  createChat(res.data.jobs[0]);
                }
              }
            }
          } else {
            setToast('Travel plan expired, Add new travel plan');
          }

          // await
        } else {
          setToast(res.message);
          let data = {};
          if (travelPlan.tolocation) {
            data.tolocation = travelPlan.tolocation;
          }
          if (travelPlan.location) {
            data.location = travelPlan.location;
          }
          if (travelPlan.add) {
            data.add = travelPlan.add;
          }
          packagesNearMe(data);
          console.log('error------>', res);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const calculateRemainingTime = jurney_date => {
    const futureDate = moment(jurney_date);
    const now = moment();
    const timeDifference = futureDate.diff(now);
    const remainingTime = moment.duration(timeDifference);

    const days = remainingTime.days();
    const hours = remainingTime.hours();
    const minutes = remainingTime.minutes();

    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hrs' : 'hrs'}`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'mints' : 'mints'}`;
    } else {
      return '0 mints';
    }
  };

  const sendInvitation = (trav) => {
    let days =
      new Date(selectTraveller.estimate_time).getTime() - new Date().getTime();
    let Difference_In_Days = days / (1000 * 3600 * 24);
    // console.log(days, selectTraveller.estimate_time, Difference_In_Days);
    // if (packageById.route === 'COUNTRY') {
    //   if (Difference_In_Days < 7) {
    //     setToast('Travel plan expired, Add new travel plan');
    //     return;
    //   }
    // } else if (packageById.route === 'STATE') {
    //   if (Difference_In_Days < 4) {
    //     setToast('Travel plan expired, Add new travel plan');
    //     return;
    //   }
    // } else if (packageById.route === 'CITY') {
    //   if (Difference_In_Days < 1) {
    //     setToast('Travel plan expired, Add new travel plan');
    //     return;
    //   }
    // }
    // actionRef2.current.hide();
    // console.log('frm invite----------------------->', selectTraveller);
    // actionRef2.current.close();
    setLoading(true);
    const datas = {
      receverId: packageById.user._id,
      packagePlan: packageById._id,
      travelPlan: trav || selectTraveller._id,
      notification: 'Send for invitation',
    };
    // console.log(datas);
    Post('sendinvite', datas, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        if (res.status) {
          setToast('sent invitation successfully');
        } else {

          setToast(res.message);
          // setTimeout(() => {
          //   actionRef2.current.close()
          // }, 500);


          console.log('error------>', res.message);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const createChat = (trav) => {
    // console.log('frm chat----------------------->', selectTraveller);
    setLoading(true);
    const datas = {
      status: 'CONNECTED',
      travellerid: trav?.user?._id || selectTraveller.user._id,
      travelPlan: trav?._id || selectTraveller._id,
      packagePlan: packageById._id,
      packagerid: packageById.user._id,
    };
    Post('accept-invitation', datas, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        setSelecttraveller({});
        setPackageById({});
        if (res.success) {
          // socket.emit('join', res.connection._id);
          props.navigation.navigate('Chat', {
            locationId: res.connection._id,
          });
        } else {
          setToast(res.message);
          if (res.connection._id) {
            // socket.emit('join', res.connection._id);
            props.navigation.navigate('Chats', {
              locationId: res.connection._id,
            });
          } else {
            let data = {};
            if (travelPlan.tolocation) {
              data.tolocation = travelPlan.tolocation;
            }
            if (travelPlan.location) {
              data.location = travelPlan.location;
            }
            if (travelPlan.add) {
              data.add = travelPlan.add;
            }
            packagesNearMe(data);
          }

        }

      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  // console.log('TravelPackage', travelPlan);
  // console.log('PackageByID========>', packageById);
  // const resetCounts = () => {
  //   setHeadsCount(0);
  //   setTailsCount(0);
  // };

  const maxdateForDeparture = (type, date) => {
    // console.log('1=========>', type, date)
    let newDate = new Date(date);
    // console.log('2=========>', newDate)
    let hours = 0;
    if (travelPlan.tolocation.length > 0 && travelPlan.location.length > 0) {
      let km = getDistance();
      // console.log('3=========>km', km)
      if (km <= 50) {
        hours = type === 'departure' ? 12 : 6;
      } else if (km <= 500) {
        hours = type === 'departure' ? 72 : 48;
      } else if (km <= 2000) {
        hours = type === 'departure' ? 96 : 72;
      } else if (km > 2000) {
        hours = type === 'departure' ? 168 : 48;
      }
      // console.log('4=========>hrs', hours)
      newDate = newDate.setHours(newDate.getHours() + hours);
      // console.log('5=========>', newDate)
      // return new Date(newDate);
    }
    // console.log('6=========>', new Date(newDate));
    // return new Date(newDate);
    setMaxDate(new Date(newDate));
  };

  const TourContent = (tourProps) => (
    <View style={{ flex: 1, backgroundColor: Constants.white, marginHorizontal: 10, padding: 10, borderRadius: 10, flexDirection: 'row' }}>
      <Text style={{ color: Constants.black, fontWeight: '700', fontFamily: 'Helvetica', flex: 3 }}>{tourProps?.message}</Text>
      {/* {(!tourProps?.isFirst || tourProps?.isLast) && <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ color: Constants.black, fontWeight: '700', fontSize: 14, textAlign: 'center', fontFamily: 'Helvetica', backgroundColor: Constants.yellow, width: 60, padding: 3, borderRadius: 5, maxHeight: 25 }}>Previous</Text>
      </TouchableOpacity>} */}
      {!tourProps?.isLast && <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ color: Constants.black, fontWeight: '700', fontSize: 14, textAlign: 'center', fontFamily: 'Helvetica', backgroundColor: Constants.yellow, minWidth: 60, padding: 3, borderRadius: 5, maxHeight: 25 }}
          onPress={async () => {
            await tourProps.current.current.hide();
          }}
        >Next</Text>
      </TouchableOpacity>}
      {tourProps?.isLast && <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ color: Constants.black, fontWeight: '700', fontSize: 14, textAlign: 'center', fontFamily: 'Helvetica', backgroundColor: Constants.yellow, width: 60, padding: 3, borderRadius: 5, maxHeight: 25 }}
          onPress={async () => {
            await tourProps.current.current.hide();
          }}
        >Finish</Text>
      </TouchableOpacity>}
    </View>
  );

  const StartMarkerView = useCallback(() => {
    return (
      <View style={{ height: 35, width: 30, position: 'relative' }}>
        <View style={styles.startMarkerView}>
          {/* <Ionicons name="location" size={20} color={Constants.yellow} /> */}
          <View style={{
            position: 'absolute', bottom: -15,
          }}>
            <Ionicons name="caret-down-outline" size={20} color={Constants.yellow} />
          </View>
        </View>
      </View>
    );
  }, []);

  // const CheckImageURL = ({ img }) => {
  //   return new Promise((resolve, reject) => {
  //     fetch(img)
  //       .then(res => {
  //         if (res.status === 404) {
  //           console.log(res.status);
  //           resolve(<Image source={require('../../Assets/newImgs/packageBadge3.png')} style={{ height: 30, width: 30, objectFit: 'cover' }} />);
  //         } else {
  //           resolve(<Image source={{ uri: img }} defaultSource={require('../../Assets/newImgs/packageBadge3.png')} style={{ height: 30, width: 30, objectFit: 'cover' }} />);
  //         }
  //       }, err => {
  //         resolve(<Image source={require('../../Assets/newImgs/packageBadge3.png')} style={{ height: 30, width: 30, objectFit: 'cover' }} />);
  //       });
  //   });

  // }
  // console.log('imagecheck=======>', CheckImageURL('khjij'));
  const PackageIcon = ({ item, index }) => {
    // console.log('image=======>', img);
    return (
      <View style={{ height: 35, width: 30, position: 'relative' }}>
        <View style={[styles.startMarkerView, { borderColor: Constants.red }]}>
          <View style={[styles.startMarkerView, { overflow: 'hidden', borderColor: Constants.red }]}>
            {/* {await checkImageURL(img)}
             */}
            {/* < CheckImageURL img={img} /> */}
            <Image source={{ uri: item.item_image }} onLoadEnd={() => {
              item.isReady = true;
              // setPackagePlans([...packagePlans])
              if (index + 1 === packagePlans.length) {
                setTimeout(() => {
                  setIsmapready(true)
                }, 5000);
              }
            }} defaultSource={require('../../Assets/newImgs/packageBadge3.png')} style={{ height: 30, width: 30, objectFit: 'cover' }} />
          </View>
          {/* <Ionicons name="location" size={20} color={Constants.yellow} /> */}
          <View style={{
            position: 'absolute', bottom: -15,
          }}>
            <Ionicons name="caret-down-outline" size={20} color={Constants.red} />
          </View>
        </View>
      </View>
    );
  };

  const EndMarkerView = useCallback(() => {
    // console.log('called=============>');
    return (
      <Animated.View style={[{ height: 35, width: 30, position: 'relative' },
      {
        transform: [
          {
            rotateY: flipAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            }),

          },
        ],
      }]}>
        <View style={[styles.startMarkerView, { backgroundColor: '#E8FFE0', borderColor: '#8BFF63' }]}>
          {/* <Ionicons name="locate" size={20} color={Constants.black} /> */}
          <View style={{
            position: 'absolute', bottom: -15,
          }}>
            <Ionicons name="caret-down-outline" size={20} color="#8BFF63" />
          </View>
        </View>
      </Animated.View>
    );
  }, []);
  // console.log(mapRef);
  return (
    <SafeAreaView style={styles.container}>
      <Spinner color={'#fff'} visible={loading} />
      <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={2000}
        toast={toast}
        setToast={setToast}
      />
      <ImageView
        images={imageList}
        imageIndex={0}
        visible={imageView}
        onRequestClose={() => setImageView(false)}
      />
      <Animated.View style={[{ backgroundColor, padding: 10 }]}>
        <AnimatedTyping
          text={['Your are on travel mode. Post your travel plan now']}
          styles={{ color: Constants.black, fontWeight: '700', textAlign: 'center', fontFamily: 'Helvetica' }}
        />
        {/* <Text style={{ color: Constants.black, fontWeight: '700', textAlign: 'center', fontFamily: 'Helvetica' }}>Your are on travel mode. Post your travel plan now</Text> */}
      </Animated.View>
      <View style={styles.profileMainView}>
        <View style={{ flexDirection: 'row', width: 100 }}>
          <View style={[styles.center, styles.profileView]}>
            <Ionicons name="location" size={20} color={Constants.traveller} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: Constants.black, fontFamily: 'Helvetica' }}>Location</Text>
            <Text
              numberOfLines={1}
              style={{ fontSize: 15, color: Constants.black, width: 220, fontFamily: 'Helvetica' }}>
              {startAddress}
            </Text>
          </View>
        </View>
        <View style={[styles.center]}>
          <TouchableOpacity
            onPress={() => {
              flipCoin();
              setTimeout(() => {
                props.navigation.navigate('profiletraveller');
              }, 1100);
            }}>
            {coinSide && (
              <Coachmark
                renderContent={() => (
                  <TourContent message="Access your profile page." current={step1} />
                )}
                ref={step1}
                onHide={async () => await step2.current.show()}
              >
                <Animated.Image
                  source={
                    user?.profile
                      ? { uri: user?.profile }
                      : { uri: Constants.dummyProfile }
                  }
                  onError={() => {
                    setUser({ ...user, profile: Constants.dummyProfile });
                  }}

                  style={[
                    {
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                      borderWidth: 2,
                      borderColor: Constants.traveller,
                    },
                    {
                      transform: [
                        {
                          rotateY: flipAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </Coachmark>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.mapView}>
        <MapView
          ref={mapRef}
          style={styles.mapOrigin}
          customMapStyle={mapStyle}
          region={{
            latitude: deviceLoc?.lat || 28.535517,
            longitude: deviceLoc?.lng || 77.391029,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08 * ASPECT_RATIO,
          }}
          provider={MapView.PROVIDER_GOOGLE}>
          {loc?.location?.latitude !== undefined && (
            <Marker
              key={'location'}
              zIndex={9}
              draggable={true}
              onDragStart={() => {
                setIsmapready(false)
              }}
              onDragEnd={loc => {
                GetCurrentAddressByLatLong({
                  lat: loc.nativeEvent.coordinate.latitude,
                  long: loc.nativeEvent.coordinate.longitude,
                }).then(res => {
                  setTravelPlan({
                    ...travelPlan,
                    location: [res.latlng.long, res.latlng.lat],
                    fromaddress: res.results[0].formatted_address,
                  });
                  const newLocationData = {
                    location: [res.latlng.long, res.latlng.lat],
                    tolocation: travelPlan.tolocation,
                    toaddress: travelPlan.toaddress,
                  };
                  packagesNearMe(newLocationData);
                });
              }}
              image={require('../../Assets/newImgs/start.png')}
              coordinate={
                loc?.location
              }
            />
          )}
          {loc?.tolocation?.latitude !== undefined && (
            <Marker
              zIndex={9}
              key={'tolocation'}
              ref={markerRef}
              draggable={true}
              onDragStart={() => {
                setIsmapready(false)
              }}
              onDragEnd={loc => {
                GetCurrentAddressByLatLong({
                  lat: loc.nativeEvent.coordinate.latitude,
                  long: loc.nativeEvent.coordinate.longitude,
                }).then(res => {
                  setTravelPlan({
                    ...travelPlan,
                    tolocation: [res.latlng.long, res.latlng.lat],
                    toaddress: res.results[0].formatted_address,
                  });
                  const newLocationData = {
                    location: travelPlan.location,
                    tolocation: [res.latlng.long, res.latlng.lat],
                    toaddress: res.results[0].formatted_address,
                  };
                  packagesNearMe(newLocationData);
                });
              }}

              image={require('../../Assets/newImgs/end.png')}
              coordinate={
                loc?.tolocation
              }
            />
            //   <EndMarkerView />
            // </Marker>
          )}
          {loc?.location?.latitude !== undefined &&
            loc?.tolocation?.latitude !== undefined && (
              <MapViewDirections
                origin={loc?.location}
                destination={loc?.tolocation}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                onReady={result => {
                  const edgePadding = { top: 100, right: 50, bottom: 100, left: 50 };
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding,
                    animated: true,
                  });
                  // console.log(result.coordinates);
                  setRouteCoordinates(result.coordinates);
                }}
                strokeColor="blue"
              // optimizeWaypoints={true}
              />
            )}

          {packagePlans?.map((item, i) => (
            <Marker
              tracksViewChanges={!isMapReady}
              zIndex={8}
              key={item._id}
              onPress={() => {
                setVisible(true);
                setSortRoute(item);
                const ds = packagePlans.filter(
                  f =>
                    f.location?.coordinates[1] ===
                    item?.location?.coordinates[1],
                );
                if (ds.length > 1) {
                  setFilterUser(ds);
                } else {

                  actionRef2.current.open();
                  setTimeout(() => {
                    setVisible(false);
                    getPackageById(item._id);
                  }, 200);
                }
              }}
              coordinate={{
                latitude: item?.location?.coordinates[1],
                longitude: item?.location?.coordinates[0],
              }}>
              <PackageIcon item={item} index={i} />
            </Marker>
          ))}
        </MapView>
        <View style={styles.fieldView}>
          <View style={{ zIndex: 9 }}>
            <Coachmark ref={step2} onHide={async () => await step3.current.show()}
              renderContent={() => (
                <TourContent message="Enter start location or adjust the start pin 📌  on map." current={step2} />
              )}
            >
              <Animated.View
                style={[
                  styles.startField,
                  { borderWidth: from === 'location' ? 2 : 1 },
                  {
                    transform: [{ translateY: animate3 }],
                  },
                ]}>
                <View style={{ width: 220 }}>
                  <LocationDropdown
                    value={travelPlan?.fromaddress}
                    setIsFocus={setFrom}
                    focus={from === 'location'}
                    from="location"
                    keys="fromaddress"
                    cordinate="location"
                    setTravelPlan={setTravelPlan}
                    travelPlan={travelPlan}
                    multi={'false'}
                    getLocationVaue={(lat, add) =>
                      getLocationVaue(lat, add, 'start')
                    }
                  />
                </View>
                <Ionicons name="locate" size={25} color={Constants.black} />
              </Animated.View>
            </Coachmark>
          </View>
          <View style={{ zIndex: 8 }}>
            <Coachmark ref={step3} onHide={async () => await step4.current.show()}
              renderContent={() => (
                <TourContent message="Enter destination and adjust the End Pin 📌 on map." current={step3} />
              )}
            >
              <Animated.View
                style={[
                  styles.endField,
                  { borderWidth: from === 'tolocation' ? 2 : 1 },
                  {
                    transform: [{ translateY: animate4 }],
                  },
                ]}>
                <View style={{ width: 220 }}>
                  <LocationDropdown
                    value={travelPlan?.toaddress}
                    focus={from === 'tolocation'}
                    from="tolocation"
                    keys="toaddress"
                    placeholder="Your Destination"
                    cordinate="tolocation"
                    setIsFocus={setFrom}
                    setTravelPlan={setTravelPlan}
                    travelPlan={travelPlan}
                    multi={'false'}
                    getLocationVaue={(lat, add) => getLocationVaue(lat, add, 'end')}
                  />
                </View>
                <Ionicons name="locate" size={25} color={Constants.black} />
              </Animated.View>
            </Coachmark>
          </View>
          <Animated.View style={[{ flexDirection: 'row', justifyContent: 'flex-end' }, {
            transform: [{ translateY: jumpValue }, { scaleY: scalValue }],
          }]}>
            <Coachmark ref={step4} onHide={async () => await step5.current.show()}
              renderContent={() => (
                <TourContent message="Add your travel plan details" current={step4} />
              )}
            >
              <Tooltip
                isVisible={toolTipVisible}
                content={
                  <Text style={{ fontWeight: '700', color: Constants.black, fontFamily: 'Helvetica' }}>
                    Add Travel Plan
                  </Text>
                }
                placement="top"
                contentStyle={{ backgroundColor: Constants.traveller }}>
                <TouchableOpacity
                  style={[styles.plusBtn, { transform: [{ scaleY: scalValue }] }]}
                  onLongPress={() => {
                    setToolTipVisible(true);
                    setTimeout(() => {
                      setToolTipVisible(false);
                    }, 2000);
                  }}
                  onPress={() => {
                    if (
                      travelPlan?.toaddress !== '' &&
                      travelPlan?.fromaddress !== ''
                    ) {
                      // actionRef.current.show();
                      actionRef.current.open();
                      const total = packagePlans.reduce((a, f) => a + f.total, 0);
                      setTravelPlan({
                        ...travelPlan,
                        profit_potential: total.toString(),
                      });
                      getTravelPlanname();
                      maxdateForDeparture('departure', new Date());
                      setMinDate(new Date());
                    } else {
                      let refs =
                        travelPlan?.fromaddress === '' ? animate3 : animate4;
                      setFrom(
                        travelPlan?.fromaddress === ''
                          ? 'location'
                          : 'tolocation',
                      );
                      // console.log('vibrate =>');
                      startAnimationwithVibrate(refs);
                      setIsFocus(false);
                      Vibration.vibrate();
                      setTimeout(() => {
                        startAnimationwithVibrate(refs);
                      }, 200);
                      setTimeout(() => {
                        Vibration.cancel();
                        setIsFocus(true);
                      }, 500);
                      // setToast('Please select delivery address then try again');
                    }
                  }}>

                  {/* onPress={() => actionRef.current.show()}> */}
                  <Ionicons name="add" size={30} color={Constants.black} />

                </TouchableOpacity>
              </Tooltip>
            </Coachmark>
          </Animated.View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            bottom: 40,
          }}>
          <Coachmark ref={step5} onHide={async () => await AsyncStorage.setItem('travellerhome', 'shown')}
            renderContent={() => (
              <TourContent message="Switch to Client mode to post your package." isLast current={step5} />
            )}
          >
            <TouchableOpacity
              style={styles.swtichBtn}
              // onPress={() => actionRef2.current.show()}
              onPress={async () => {
                switchToProvider();
              }}>
              <Text
                style={{ marginRight: 5, color: Constants.black, fontSize: 13, fontFamily: 'Helvetica' }}>
                Switch to Provider
              </Text>
              <FontAwesome6 name="shuffle" size={18} color={Constants.black} />
            </TouchableOpacity>
          </Coachmark>
          {/* <Animated.View
            style={[
              {
                zIndex: 9,
                position: 'absolute',
                bottom: -400,
                width: width,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
              },
              {
                transform: [{ translateY: trainAnim }],
              },
            ]}>
            <View style={{ flexDirection: 'column' }}>
              <Image
                source={require('../../Assets/newImgs/train.png')}
                style={{ width: 100, height: 100, marginLeft: -20 }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Constants.traveller,
                  minHeight: 140,
                  width: 90,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: Constants.black,
                    fontWeight: '700',
                    fontSize: 16,
                    fontFamily: 'Helvetica'
                  }}>
                  {`${travelPlan.profit_potential} rs by delivering ${packagePlans.length} packages to ${travelPlan.toaddress}`}
                </Text>
              </View>
            </View>
          </Animated.View> */}
          {/* <Animated.View
            style={[
              {
                zIndex: 9,
                position: 'absolute',
                bottom: -400,
                width: width,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end',
              },
              {
                transform: [{ translateY: baloonsAnim }],
              },
            ]}> */}
          {/* <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 50, top: 160 }}>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.traveller, height: 120, width: 120, borderBottomEndRadius: 102, borderBottomStartRadius: 102, borderTopEndRadius: 118, borderTopStartRadius: 118 }}>
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.traveller, height: 20, width: 20, borderBottomEndRadius: 102, borderBottomStartRadius: 102, borderTopEndRadius: 118, borderTopStartRadius: 118 }}>
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 40, marginTop: -20 }}>
                <View style={{ borderWidth: 1, borderColor: Constants.traveller, height: 100 }}></View>
              </View>
            </View> */}
          {/* <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 50, top: 180 }}>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.traveller, height: 100, width: 100, borderBottomEndRadius: 102, borderBottomStartRadius: 102, borderTopEndRadius: 118, borderTopStartRadius: 118 }}>
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.traveller, height: 20, width: 20, borderBottomEndRadius: 102, borderBottomStartRadius: 102, borderTopEndRadius: 118, borderTopStartRadius: 118 }}>
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 40, marginTop: -20 }}>
                <View style={{ borderWidth: 1, borderColor: Constants.traveller, height: 100 }}></View>
              </View>
            </View> */}
          {/* <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Constants.traveller,
                  height: 160,
                  width: 160,
                  borderBottomEndRadius: 102,
                  borderBottomStartRadius: 102,
                  borderTopEndRadius: 118,
                  borderTopStartRadius: 118,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: Constants.black,
                    fontWeight: '700',
                    fontSize: 18,
                  }}>{`${travelPlan.profit_potential} by delivering ${packagePlans.length} packages to ${travelPlan.toaddress}`}</Text>
              </View>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Constants.traveller,
                  height: 20,
                  width: 20,
                  borderBottomEndRadius: 102,
                  borderBottomStartRadius: 102,
                  borderTopEndRadius: 118,
                  borderTopStartRadius: 118,
                }}></View>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  marginTop: -20,
                }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Constants.traveller,
                    height: 100,
                  }}></View>
              </View>
            </View>
          </Animated.View> */}
        </View>
      </View>

      {/* <BottomDrawer
        containerHeight={560}
        offset={0}
      > */}
      <BottomDrawer
        ref={actionRef}
        closeOnBackdropPress={false}
        initialHeight={750}
      // customStyles={{ flex: 1 }}
      // onBackdropPress={() => {
      //   console.log('pressed');
      // }}
      >
        {/* <View
          style={styles.keyboard}
          behavior={'height'}
          enabled
          keyboardVerticalOffset={20}
          keyboardShouldPersistTaps="always"> */}
        <ImageBackground
          source={require('../../Assets/newImgs/BG.png')}
          style={{ minHeight: 750 }}>
          <View style={{ flex: 1, paddingBottom: 40 }}>

            <KeyboardAwareScrollView
              // style={Styles.keyboard}
              behavior={'height'}
              enabled
              keyboardVerticalOffset={10}
              keyboardShouldPersistTaps="always">
              {/* <ScrollView keyboardShouldPersistTaps="always" style={{ height: 650 }} > */}
              <Text
                style={{
                  color: Constants.blue,
                  textAlign: 'center',
                  fontSize: 12,
                  marginTop: 0,
                  fontFamily: 'Helvetica',
                }}></Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', right: 5, top: 5, zIndex: 50 }}>
                <TouchableOpacity
                  style={[
                    styles.plusBtn,
                    { marginRight: 10, backgroundColor: Constants.traveller },
                  ]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setTimeout(() => {
                      // actionRef.current.hide();
                      actionRef.current.close();
                      setPost('1');
                    }, 500);
                  }}>
                  <Ionicons name="close" size={30} color={Constants.black} />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={styles.itemdetail}>Travel Plan</Text>
                <View style={{ marginTop: 10, paddingHorizontal: 40 }}>
                  {/* <View style={{...styles.normalField, marginTop: 10}}>
                  <TextInput
                    placeholder="Plan Name"
                    placeholderTextColor={Constants.lightgrey}
                    value={travelPlan.name}
                    style={{color: Constants.black}}
                    onChangeText={text =>
                      setTravelPlan({...travelPlan, name: text})
                    }
                  />
                </View> */}
                  {/* {filedCheck.includes('NAME') && (
                  <Text style={{color: 'red'}}>Plan name is required</Text>
                )} */}
                  <TouchableOpacity
                    style={{ ...styles.normalField, marginTop: 10 }}
                    onPress={() => {
                      setOpen(true);
                      setMinDate(new Date());
                      // console.log(maxDate, new Date());
                      setSelectedDate(new Date(travelPlan.datetime));
                      maxdateForDeparture('departure', new Date());
                    }}>
                    <TextInput
                      placeholder="Journey Date"
                      placeholderTextColor={Constants.lightgrey}
                      editable={false}
                      style={{ color: Constants.black, fontFamily: 'Helvetica' }}
                      value={`${moment(travelPlan.datetime).format(
                        'DD/MM/YYYY hh:mm A',
                      )}    Departure`}
                      onPress={() => setOpen(true)}
                    />
                    <FontAwesomeIcon
                      name="calendar"
                      size={15}
                      color={Constants.black}
                    // onPress={() => setOpen(true)}
                    />
                    <DatePicker
                      // style={{ zIndex: '50' }}
                      modal
                      open={open || openEstimate}
                      maximumDate={maxDate}
                      minimumDate={minDate}

                      date={travelPlan.datetime}
                      // androidVariant='nativeAndroid'
                      // maximumDate={maxDate}

                      onConfirm={dates => {
                        // console.log(dates);
                        if (open) {
                          setOpen(false);
                          maxdateForDeparture('arrival', new Date(dates));
                          // setMinDate(setNewDateForArival(new Date(dates)));
                          setMinDate(new Date(dates));
                          setTravelPlan({
                            ...travelPlan,
                            datetime: dates,
                            // estimate_time: setNewDateForArival(new Date(dates)),
                            estimate_time: new Date(dates),
                          });
                        } else {
                          setOpeEstimate(false);
                          setTravelPlan({ ...travelPlan, estimate_time: dates });
                        }
                      }}
                      // onDateChange={d => console.log(d)}
                      onCancel={() => {
                        setOpen(false);
                        setOpeEstimate(false);
                      }}
                    />
                  </TouchableOpacity>
                  {filedCheck.includes('DATETIME') && (
                    <Text style={{ color: 'red', fontFamily: 'Helvetica' }}>
                      {' '}
                      Departure time is required
                    </Text>
                  )}
                  <TouchableOpacity
                    style={{ ...styles.normalField, marginTop: 10 }}
                    onPress={() => {
                      setOpeEstimate(true);
                      setMinDate(new Date(travelPlan.datetime));
                      setSelectedDate(new Date(travelPlan.datetime));
                      maxdateForDeparture('arrival', minDate);
                    }}>
                    <TextInput
                      placeholder="Journey Date"
                      placeholderTextColor={Constants.lightgrey}
                      editable={false}
                      style={{
                        fontFamily: 'Helvetica',
                        color:
                          new Date(travelPlan.datetime).getTime() ===
                            new Date(travelPlan.estimate_time).getTime() &&
                            sumitted
                            ? Constants.red
                            : Constants.black,
                      }}
                      value={`${moment(travelPlan.estimate_time).format(
                        'DD/MM/YYYY hh:mm A',
                      )}    Arrival`}
                    // onPress={() => setOpeEstimate(true)}
                    />
                    <FontAwesomeIcon
                      name="calendar"
                      size={15}
                      color={Constants.black}
                      onPress={() => {
                        setOpeEstimate(true);

                      }}
                    />
                    {/* {openEstimate && <DatePicker
                    style={{ zIndex: '50' }}
                    modal
                    open={openEstimate}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                    date={travelPlan.estimate_time}
                    onConfirm={dates => {
                      setOpeEstimate(false);
                      setTravelPlan({ ...travelPlan, estimate_time: dates });
                    }}
                    onCancel={() => {
                      setOpeEstimate(false);
                    }}
                  />} */}
                  </TouchableOpacity>
                  {filedCheck.includes('ESTIMATE_TIME') && (
                    <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> Arrival time is required</Text>
                  )}
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View
                      style={[
                        // styles.normalField,
                        { flex: 1, flexDirection: 'column' },
                      ]}>
                      <Dropdown
                        style={styles.dropdown}
                        containerStyle={{ borderRadius: 25, overflow: 'hidden' }}
                        itemTextStyle={{ color: Constants.black }}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={mot}
                        maxHeight={300}
                        labelField="value"
                        valueField="value"
                        placeholder="MOT"
                        value={travelPlan.mot}
                        onChange={item => {
                          if (item.value === 'Car' || item.value === 'Bike') {
                            setTravelPlan({
                              ...travelPlan,
                              mot: item.value,
                              seatAvailability: '1',
                            });
                          } else {
                            setTravelPlan({
                              ...travelPlan,
                              mot: item.value,
                              seatAvailability: '0',
                            });
                          }
                        }}
                        renderRightIcon={() => (
                          <FontAwesomeIcon
                            name={IconMapping[travelPlan.mot] || 'car'}
                            size={15}
                            color={Constants.black}
                          />
                        )}
                      />
                    </View>
                    {travelPlan.mot &&
                      seatAvailability[travelPlan.mot].length > 0 && (
                        <View style={[{ flex: 1 }]}>
                          <Dropdown
                            style={styles.dropdown}
                            containerStyle={{
                              borderRadius: 25,
                              overflow: 'hidden',
                            }}
                            itemTextStyle={{ color: Constants.black }}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={seatAvailability[travelPlan?.mot]}
                            maxHeight={300}
                            labelField="value"
                            valueField="value"
                            placeholder="Seats available"
                            value={travelPlan.seatAvailability}
                            onChange={item => {
                              setTravelPlan({
                                ...travelPlan,
                                seatAvailability: item.value,
                              });
                            }}
                            renderRightIcon={() => (
                              <FontAwesomeIcon
                                name={IconMapping[travelPlan.mot]}
                                size={15}
                                color={Constants.black}
                              />
                            )}
                          />
                        </View>
                      )}
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                      {filedCheck.includes('MOT') && (
                        <Text style={{ color: 'red', fontFamily: 'Helvetica' }}>MOT is required</Text>
                      )}
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                      {/* {(travelPlan.mot === 'Bike' || travelPlan.mot === 'Car') && (travelPlan.seatAvailability === '-1' || travelPlan.seatAvailability === '')(
                      <Text style={{ color: 'red' }}> Seat Availability is required</Text>
                    )} */}
                    </View>
                  </View>

                  <View style={{ ...styles.normalField, marginTop: 10 }}>
                    {/* <TextInput
                    placeholder="Profit Potential"
                    placeholderTextColor={Constants.lightgrey}
                    value={travelPlan.profit_potential + 'rs Profit Potential'}
                    editable={false}
                    style={{ color: Constants.black }}
                    onChangeText={text =>
                      setTravelPlan({ ...travelPlan, profit_potential: text })
                    }
                  /> */}
                    <Text
                      style={{
                        color: Constants.black,
                        paddingVertical: 13,
                        fontSize: 16,
                        fontFamily: 'Helvetica',
                      }}>
                      <AnimateNumber
                        interval={5}
                        countBy={5}
                        value={travelPlan?.profit_potential}
                      />{' '}
                      rs Profit Potential
                    </Text>
                  </View>
                  {filedCheck.includes('PROFIT_POTENTIAL') && (
                    <Text style={{ color: 'red' }}>Profit is required</Text>
                  )}

                  <View style={{ ...styles.normalField, marginTop: 10 }}>
                    <TextInput
                      placeholder="Discription of journey"
                      placeholderTextColor={Constants.lightgrey}
                      multiline
                      style={{ height: 70, color: Constants.black }}
                      numberOfLines={3}
                      maxLength={200}
                      textAlignVertical="top"
                      value={travelPlan.description}
                      onChangeText={text =>
                        setTravelPlan({ ...travelPlan, description: text })
                      }
                    />
                  </View>
                  {filedCheck.includes('DESCRIPTION') && (
                    <Text style={{ color: 'red', fontFamily: 'Helvetica' }}>Description is required</Text>
                  )}
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <TouchableOpacity
                    style={[styles.swtichBtn, { width: 100 }]}
                    onPress={() => {
                      getTravelPlanname();
                      submit();
                    }}>
                    <Text style={{ color: Constants.black, fontSize: 13, fontFamily: 'Helvetica' }}>
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </ImageBackground>
        {/* </KeyboardAwareScrollView> */}
      </BottomDrawer>
      {/* </BottomDrawer> */}

      <BottomDrawer
        ref={actionRef2}
        initialHeight={700}
        closeOnBackdropPress={false}>
        <ImageBackground
          source={require('../../Assets/Images/BG.png')}
          style={{ position: 'relative', flex: 1 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              {!packageById?.rejectedBy || !packageById?.rejectedBy?.includes(user._id) && <TouchableOpacity
                style={[
                  styles.plusBtn,
                  { marginLeft: 10, backgroundColor: Constants[initial] },
                ]}
                onPress={() => {
                  setVisible(false);
                  setLoc({
                    location: {
                      latitude: packageById.location?.coordinates[1],
                      longitude: packageById.location?.coordinates[0],
                    },
                    tolocation: {
                      latitude: packageById.tolocation?.coordinates[1],
                      longitude: packageById.tolocation?.coordinates[0],
                    },
                  });
                  actionRef2.current.close();
                  // actionRef2.current.hide();
                  setSortRoute({});
                  setFilterUser([]);
                }}>
                <Avatar.Icon
                  size={30}
                  style={styles.iconViewStyle}
                  icon={() => (
                    <FontAwesome6 size={25} color={Constants.black} name="road" />
                  )}
                />
              </TouchableOpacity>}
            </View>
            <TouchableOpacity
              style={[
                styles.plusBtn,
                { marginRight: 10, backgroundColor: Constants.traveller },
              ]}
              onPress={() => {
                actionRef2.current.close();
                // actionRef2.current.hide();
              }}>
              <Ionicons name="close" size={30} color={Constants.black} />
            </TouchableOpacity>
          </View>
          {/* {!packageById?.rejectedBy || !packageById?.rejectedBy?.includes(user._id) && <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'absolute',
              top: 110,
              right: 0,
            }}>
            <TouchableOpacity
              style={[
                styles.plusBtn,
                {
                  marginRight: 10,
                  backgroundColor: Constants.traveller,
                  width: 40,
                  height: 40,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              onPress={() => {
                // getPackageByUser();
                // setModalVisible(true);
                // setPopupType('chat');
                const data = {
                  tolocation: packageById.tolocation.coordinates,
                  location: packageById.location.coordinates,
                  err_message: 'Post your travel plan first to contact client',
                  type: 'chat',
                };
                setPopupType('chat')
                travellerNearMe(data);
              }}>
              <FontAwesomeIcon
                name="envelope"
                size={25}
                color={Constants.black}
              />
            </TouchableOpacity>
          </View>}
          {!packageById?.rejectedBy || !packageById?.rejectedBy?.includes(user._id) && <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'absolute',
              top: 160,
              right: 0,
            }}>
            <TouchableOpacity
              style={[
                styles.plusBtn,
                {
                  marginRight: 10,
                  backgroundColor: Constants.traveller,
                  width: 40,
                  height: 40,
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              onPress={() => {
                const data = {
                  tolocation: packageById.tolocation.coordinates,
                  location: packageById.location.coordinates,
                  err_message: 'Post your travel plan first to contact client',
                  type: 'call',
                };
                travellerNearMe(data);
                // Linking.openURL(`tel:${packageById.user.phone}`);
                // actionRef2.current.hide();
              }}>
              <FontAwesomeIcon name="phone" size={25} color={Constants.black} />
            </TouchableOpacity>
          </View>} */}
          <View>
            <View style={{ paddingHorizontal: 20 }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // marginTop: 10,
                  }}>
                  <View style={styles.center}>
                    {packageById?.user?.profile ? (
                      <Avatar.Image
                        size={70}
                        source={{ uri: `${packageById?.user?.profile}` }}
                      />
                    ) : (
                      <Avatar.Image
                        size={70}
                        source={require('../../Assets/newImgs/images.png')}
                      />
                    )}
                    {/* <Avatar.Image
                    size={70}
                    source={require('../../Assets/newImgs/images.png')}
                  /> */}
                  </View>
                  <View style={[styles.center, { marginVertical: 5 }]}>
                    <Text
                      style={{
                        color: Constants.white,
                        fontSize: 20,
                        fontWeight: 700,
                        fontFamily: 'Helvetica',
                      }}>
                      {packageById?.user?.fullName}
                    </Text>
                  </View>
                  <StarRatingDisplay
                    starSize={25}
                    rating={packageById?.rating || 0}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    borderRadius: 50,
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    style={styles.center}
                    onPress={() => {
                      setImageList([
                        {
                          uri: packageById?.item_image,
                        },
                      ]);
                      setImageView(true);
                    }}>
                    {packageById?.user?.profile ? (
                      <Avatar.Image
                        size={70}
                        source={{ uri: `${packageById?.item_image}` }}
                      />
                    ) : (
                      <Avatar.Image
                        size={70}
                        source={require('../../Assets/newImgs/images.png')}
                      />
                    )}
                    {/* <Avatar.Image
                    size={70}
                    source={require('../../Assets/newImgs/images.png')}
                  /> */}
                  </TouchableOpacity>
                  <View style={[styles.center, { marginVertical: 5, flexDirection: 'column' }]}>
                    <Text
                      style={{
                        color: Constants.white,
                        fontSize: 20,
                        fontWeight: 700,
                        fontFamily: 'Helvetica',
                      }}>
                      {packageById?.name}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>


                      {!packageById?.rejectedBy || !packageById?.rejectedBy?.includes(user._id) && <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          // position: 'absolute',
                          // top: 110,
                          // right: 0,
                        }}>
                        <TouchableOpacity
                          style={[
                            styles.plusBtn,
                            {
                              marginRight: 10,
                              backgroundColor: Constants.traveller,
                              width: 40,
                              height: 40,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            },
                          ]}
                          onPress={() => {
                            // getPackageByUser();
                            // setModalVisible(true);
                            // setPopupType('chat');
                            const data = {
                              tolocation: packageById.tolocation.coordinates,
                              location: packageById.location.coordinates,
                              err_message: 'Post your travel plan first to contact client',
                              type: 'chat',
                            };
                            setPopupType('chat');
                            // travellerNearMe(data);
                            getPackageByUser(data);
                          }}>
                          <FontAwesomeIcon
                            name="envelope"
                            size={25}
                            color={Constants.black}
                          />
                        </TouchableOpacity>
                      </View>}
                      {!packageById?.rejectedBy || !packageById?.rejectedBy?.includes(user._id) && <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          // position: 'absolute',
                          // top: 160,
                          // right: 0,
                        }}>
                        <TouchableOpacity
                          style={[
                            styles.plusBtn,
                            {
                              marginRight: 10,
                              backgroundColor: Constants.traveller,
                              width: 40,
                              height: 40,
                              padding: 5,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            },
                          ]}
                          onPress={() => {
                            const data = {
                              tolocation: packageById.tolocation.coordinates,
                              location: packageById.location.coordinates,
                              err_message: 'Post your travel plan first to contact client',
                              type: 'call',
                            };
                            getPackageByUser(data);
                            // Linking.openURL(`tel:${packageById.user.phone}`);
                            // actionRef2.current.hide();
                          }}>
                          <FontAwesomeIcon name="phone" size={25} color={Constants.black} />
                        </TouchableOpacity>
                      </View>}
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 3,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: Constants.traveller,
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 10,
                    backgroundColor: Constants.white,
                  }}>
                  {/* <Text
                    style={{
                      color: Constants.black,
                      padding: 5,
                      fontWeight: '500',
                      textAlign: 'center',
                      width: width * 0.8,
                    }}>
                    {packageById?.address}
                  </Text> */}

                  <View style={styles.subCard}>
                    <View
                      style={{
                        flex: 3,
                        flexDirection: 'column',
                        // justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      <Text style={styles.from}>From</Text>
                      <Text style={styles.from}>
                        {packageById?.address}
                      </Text>
                    </View>
                    <View style={[{ flex: 2 }, styles.center]}>
                      <Image
                        source={require('../../Assets/newImgs/Line2.png')}
                        style={{ width: 60, objectFit: 'contain' }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 3,
                        flexDirection: 'column',
                        // justifyContent: 'center',
                        alignItems: 'flex-start',
                      }}>
                      <Text style={styles.to}>TO</Text>
                      <Text style={styles.to}>
                        {packageById?.delivery_address}
                      </Text>
                    </View>
                  </View>

                </View>
                {/* <Text style={{ color: Constants.white, fontSize: 22 }}>To</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: Constants.traveller,
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: Constants.white,
                  }}>
                  <Text
                    style={{
                      color: Constants.black,
                      padding: 5,
                      fontWeight: '500',
                      width: width * 0.8,
                      textAlign: 'center',
                    }}>
                    {packageById?.delivery_address}
                  </Text>
                </View> */}
              </View>

              <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                <View style={[styles.normalField, { flex: 1 }]}>
                  <Text style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                    QTY:
                  </Text>
                  <Text style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                    {packageById?.qty}
                  </Text>
                </View>
                <View style={[styles.normalField, { flex: 1 }]}>
                  <Text style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                    Bonus:
                  </Text>
                  <Text style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                    {packageById?.bonus}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  // marginTop: 10,
                  gap: 10,
                  paddingBottom: 10,
                }}>
                <View
                  style={{
                    ...styles.normalField,
                    marginTop: 10,
                    flex: 1,
                    paddingHorizontal: 5,
                  }}>
                  <Text style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                    Value:
                  </Text>
                  <Text style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                    ₹{packageById?.value}
                  </Text>
                </View>
                {/* <View style={{flexDirection: 'row'}}> */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Constants.traveller,
                    borderRadius: 50,
                    marginTop: 10,
                    gap: 10,
                    padding: 5,
                  }}>
                  <Text style={{ color: Constants.black, fontSize: 20, fontFamily: 'Helvetica' }}>
                    {calculateRemainingTime(packageById?.delivery_date)}
                  </Text>
                  <FontAwesomeIcon
                    name="clock-o"
                    size={20}
                    color={Constants.black}
                  />
                </View>

                {/* </View> */}
              </View>

              {packageById?.description !== '' && (
                <View style={{ ...styles.normalField, marginVertical: 10 }}>
                  <Text style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                    {packageById?.description}
                  </Text>
                </View>
              )}
            </View>
            {/* <Text >{packageById.user._id} - {user._id}</Text> */}
            {/* {packageById?.user?._id !== user._id &&  */}
            {!packageById?.rejectedBy || !packageById?.rejectedBy?.includes(user._id) && <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <TouchableOpacity
                style={[styles.swtichBtn, { width: 100 }]}
                onPress={() => {
                  getPackageByUser('invite');
                  setPopupType('invite');
                  // props.navigation.navigate('paymet');
                }}>
                <Text
                  style={{
                    color: Constants.black,
                    fontSize: 13,
                    fontWeight: '700',
                    fontFamily: 'Helvetica',
                  }}>
                  Send Invite
                </Text>
              </TouchableOpacity>
            </View>}
            {packageById?.rejectedBy && packageById?.rejectedBy?.includes(user._id) && <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <View
                style={[styles.swtichBtn, { width: 100, backgroundColor: Constants.red }]}
              >
                <Text
                  style={{
                    color: Constants.white,
                    fontSize: 13,
                    fontWeight: '700',
                    fontFamily: 'Helvetica',
                  }}>
                  Rejected
                </Text>
              </View>
            </View>}
            {/* } */}
          </View>
        </ImageBackground>
      </BottomDrawer>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>Select Your Traveller Plan</Text>
              {/* <View style={[styles.normalField, {marginVertical: 10}]}> */}
              <Dropdown
                itemTextStyle={{ color: Constants.black, fontFamily: 'Helvetica' }}
                style={[styles.dropdown, { width: 300 }]}
                // activeColor={Constants.red}
                containerStyle={{ borderRadius: 25, overflow: 'hidden' }}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={alltraveller}
                maxHeight={300}
                labelField="name"
                valueField="_id"
                placeholder="Select your traveller plan"
                value={selectTraveller?._id}
                onChange={item => {
                  setSelecttraveller(item);
                  // setItemDetails({...itemDetails, bonus: item.key});
                }}
              />
              {/* <SelectList
                placeholder="Selecy Your Traveller Plan"
                placeholderTextColor={Constants.lightgrey}
                setSelected={item => {
                  console.log(item);
                  setSelecttraveller(item);
                }}
                data={alltraveller}
                save="key"
                search={true}
                boxStyles={[
                  styles.normalField,

                  {marginTop: 10, paddingHorizontal: 10, width: '70%'},
                ]}
                inputStyles={{width: '70%'}}
                dropdownStyles={{
                  backgroundColor: Constants.white,
                  borderColor: Constants.red,
                }}
                dropdownTextStyles={{color: Constants.black}}
              /> */}
              {/* </View> */}
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.cancelButtonStyle}>
                  <Text style={[styles.modalText, { color: Constants.white }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    if (selectTraveller !== '') {
                      setModalVisible(!modalVisible);
                      if (popuoType === 'invite') {
                        sendInvitation();
                      } else {
                        createChat();
                      }
                    } else {
                      setToast('Please select your package');
                    }
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setSortRoute({});
          // Alert.alert('Modal has been closed.');
          setVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView2]}>
            <View>
              <ScrollView horizontal style={{ width: '100%' }}>
                {visible &&
                  filterUser.length > 1 &&
                  filterUser.map(item => (
                    <TouchableOpacity
                      style={{
                        marginHorizontal: 3,
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                      key={item._id}
                      onPress={() => {
                        setSortRoute(item);
                      }}>
                      <Avatar.Image
                        source={{ uri: item?.item_image }}
                        style={{
                          backgroundColor:
                            item._id === sortRoute._id
                              ? Constants.red
                              : Constants.white,
                        }}
                      />
                      <Text
                        style={[
                          styles.textStyle,
                          {
                            color:
                              item._id === sortRoute._id
                                ? Constants.red
                                : Constants.white,
                            textTransform: 'capitalize',
                          },
                        ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  width: '100%',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setLoc({
                      location: {
                        latitude: sortRoute.location?.coordinates[1],
                        longitude: sortRoute.location?.coordinates[0],
                      },
                      tolocation: {
                        latitude: sortRoute.tolocation?.coordinates[1],
                        longitude: sortRoute.tolocation?.coordinates[0],
                      },
                    });
                    setVisible(false);
                    // props.navigation.navigate('routemap', {
                    //   coordinates: [
                    //     {
                    //       latitude: sortRoute.location?.coordinates[1],
                    //       longitude: sortRoute.location?.coordinates[0],
                    //     },
                    //     {
                    //       latitude: sortRoute.tolocation?.coordinates[1],
                    //       longitude: sortRoute.tolocation?.coordinates[0],
                    //     },
                    //   ],
                    //   from: 'traveller',
                    // });
                    setSortRoute({});
                  }}>
                  <Avatar.Icon
                    size={50}
                    style={styles.iconViewStyle}
                    icon={() => (
                      <FontAwesome6
                        size={25}
                        color={Constants.black}
                        name="road"
                      />
                    )}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  {/* <Image
                    source={require('../../Assets/newImgs/packageBadge3.png')}
                  /> */}
                  <Avatar.Image source={{ uri: sortRoute?.item_image }} />
                  <TouchableOpacity
                    onPress={() => {
                      setVisible(false);
                      getPackageById(sortRoute._id);
                      setSortRoute({});
                      actionRef2.current.open();
                      // actionRef2.current.show();
                    }}>
                    <Avatar.Icon
                      size={50}
                      style={styles.iconViewStyle}
                      icon={() => (
                        <FontAwesome6
                          size={25}
                          color={Constants.black}
                          name="users-viewfinder"
                        />
                      )}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSortRoute({});
                    setVisible(false);
                  }}>
                  <Avatar.Icon
                    size={50}
                    style={styles.iconViewStyle}
                    icon={() => (
                      <FontAwesome6
                        size={25}
                        color={Constants.black}
                        name="xmark"
                      />
                    )}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={open || openEstimate}
        onRequestClose={() => {
          setOpen(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={{ textAlign: 'left', fontSize: 20, color: Constants.black }}> Select Date</Text>
              <DatePicker
                maximumDate={maxDate}
                date={selectedate}
                theme="light"
                // androidVariant='nativeAndroid'
                onDateChange={d => {
                  console.log('out===============>', new Date(minDate), new Date(d))
                  if (new Date(minDate) > new Date(d)) {
                    console.log('in===============>', new Date(minDate), new Date(d))
                    setSelectedDate(minDate)
                  } else {
                    setSelectedDate(d)
                  }
                  // console.log(d)
                }
                }
                onStateChange={() => {
                  console.log('called', selectedate)
                }}
                onCancel={() => {
                  setOpen(false);
                  setOpeEstimate(false);
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 20, width: width - 100, marginTop: 10 }}>
              <TouchableOpacity style={{ height: 30, width: 50 }}
                onPress={() => {
                  setOpen(false);
                  setOpeEstimate(false);
                }}
              >
                <Text style={{ color: Constants.blue, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 30, width: 80 }}
                onPress={() => {
                  if (open) {
                    setOpen(false);
                    maxdateForDeparture('arrival', new Date(selectedate));
                    // setMinDate(setNewDateForArival(new Date(dates)));
                    setMinDate(selectedate);
                    setTravelPlan({
                      ...travelPlan,
                      datetime: selectedate,
                      // estimate_time: setNewDateForArival(new Date(dates)),
                      estimate_time: new Date(selectedate),
                    });
                    setSelectedDate(new Date())
                  } else {
                    setOpeEstimate(false);
                    setTravelPlan({ ...travelPlan, estimate_time: selectedate });
                    setSelectedDate(new Date())
                  }
                }}
              >
                <Text style={{ color: Constants.blue, fontSize: 16 }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}


    </SafeAreaView>
  );
};

export default Home;
