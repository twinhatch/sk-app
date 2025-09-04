/* eslint-disable no-unreachable */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
  Animated,
  Modal,
  ScrollView,
  Keyboard,
  Linking,
  Dimensions,
  Vibration,
  Easing,
  ActivityIndicator,
  Alert,

} from 'react-native';
// import { Marquee } from '@animatereactnative/marquee';
import React, { createRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Constants from '../../Helpers/constant';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import styles from './StyleProvider';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { GetApi, Post, ApiFormData } from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import { Context, locContext, toastContext } from '../../../App';
import LocationDropdown from '../../Component/LocationDropdown';
import DatePicker from 'react-native-date-picker';
import PhoneInput, { isValidNumber } from 'react-native-phone-number-input';
import moment from 'moment';
import { checkForEmptyKeys } from '../../Helpers/InputsNullChecker';
import CustomToaster from '../../Component/CustomToaster';
import { Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraGalleryPeacker from '../../Component/CameraGalleryPeacker';
import { Dropdown } from 'react-native-element-dropdown';
import { UserContext } from '../../../App';
import MapViewDirections from 'react-native-maps-directions';
import * as geolib from 'geolib';
import GetCurrentAddressByLatLong from '../../Component/GetCurrentAddressByLatLong';
import Tooltip from 'react-native-walkthrough-tooltip';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import BottomDrawer, {
} from 'react-native-animated-bottom-drawer';
import useColorAnimation from '../../Component/AnimateBg';
import Charges from '../../Helpers/Charges';
import SplashScreen from 'react-native-splash-screen';
import { Coachmark } from 'react-native-coachmark';
import AnimatedTyping from '../../Component/AnimatedTyping';
import { mapStyle } from './mapStyle';
import ConnectionCheck from '../../Component/ConnectionCheck';
// import { useDispatch, useSelector } from 'react-redux';
// import { getuserLocation } from '../../redux/store/getuserLocation';
import CustomCurrentLocation from '../../Component/CustomCurrentLocation';
// import Toast from 'react-native-toast-message';



const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
const MOT = ['MOT', 'Car', 'Train', 'Bike', 'Flight'];
const matdata = [
  { value: 'yes', id: 'hjijijj' },
  { value: 'yes', id: 'hjijijj' },
];

const data = [
  { value: 'Local', key: '50' },
  { value: 'Domestic', key: '100' },
  { value: 'International', key: '500' },
];

const itemQty = [
  { value: '1 item', key: '1' },
  { value: '2 items', key: '2' },
  { value: '3 items', key: '3' },
  { value: '4 items', key: '4' },
  { value: '5 items', key: '5' },
];

const colors = [Constants.provider, Constants.pink];

const GOOGLE_MAPS_APIKEY = 'AIzaSyC2HWPbrvHe5C2AjG9R7uD_aT2-wvkO7os';

const Home = props => {
  // const dispatch = useDispatch();
  const { width, height } = Dimensions.get('window');
  const h = height - 200;
  const ASPECT_RATIO = width / h;
  const [color, setColor] = useState(colors[0]);
  const [backgroundColor, finished] = useColorAnimation(color);
  const [toast, setToast] = useContext(toastContext);
  const [post, setPost] = useState('2');
  const [post2, setPost2] = useState('1');
  const [isAnim, setAnim] = useState(false);
  const [isAnim3, setAnim3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useContext(Context);
  const [user, setUser] = useContext(UserContext);
  const [currLoc, setCurLoc] = useContext(locContext);
  const [deviceLoc, setDeviceLoc] = React.useState({});
  const [locationArray, setLocationArray] = React.useState([]);
  const [startAddress, setStartAddress] = React.useState('');
  const [endAddress, setEndAddres] = React.useState('');
  const [filedCheck, setfiledCheck] = useState([]);
  const [allPackage, setAllPackage] = useState([]);
  const [selectPacakge, setSelectPackage] = useState('');
  const itemName = useRef(null);
  const [itemDetails, setItemDetails] = useState({
    name: '',
    bonus: '',
    item_image: '',
    weight: '0.2',
    value: '500',
    qty: '1',
    address: '',
    location: [],
    delivery_date: new Date(),
    pickupaddress: '',
    delivery_address: '',
    track: [],
    tolocation: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [receiptDetail, setReceiptDetail] = useState({
    phone: '',
    description: '',
    formatedPhone: '',
    fulldelivery_address: '',
  });
  const [rideDetail, setRideDetail] = useState({
    name: '',
    mot: 'Car',
    seat_avaibility: '0',
    ridechedule: new Date(),
  });
  const [travellerPlans, setTravellerPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [travelPlanById, setTravelPlanById] = useState({});
  const [isFocus, setIsFocus] = useState(false);
  const [phone, setPhone] = useState(false);
  const [filterUser, setFilterUser] = useState([]);
  const [popuoType, setPopupType] = useState('');
  const [sortRoute, setSortRoute] = useState('');
  const actionRef = createRef();
  const actionRef2 = createRef();
  const actionRef3 = createRef();
  const cameraRef = createRef();
  const [coinSide, setCoinSide] = useState('Heads');
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [timeinterval, setIntrval] = useState(null);
  const [imageLoader, setImageLoader] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [delta, setDelta] = React.useState({});
  const [loc, setLoc] = React.useState({});
  const [from, setFrom] = useState('');
  const [isSlowInternet, setIsSlowInternet] = useState(false);
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [selectedate, setSelectedDate] = useState(new Date());
  const trainAnim = useRef(new Animated.Value(0)).current;
  const animate = useRef(new Animated.Value(0)).current;
  const animate2 = useRef(new Animated.Value(0)).current;
  const animate3 = useRef(new Animated.Value(0)).current;
  const animate4 = useRef(new Animated.Value(0)).current;
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const baloonsAnim = useRef(new Animated.Value(0)).current;
  const seatAvailability = {
    Car: [0, 1, 2, 3],
    Bike: [0, 1, 2],
    Plane: [],
    Train: [],
    // MOT: [],
  };

  const step1 = useRef();
  const step2 = useRef();
  const step3 = useRef();
  const step4 = useRef();
  const step5 = useRef();
  const jumpValue = useRef(new Animated.Value(-250)).current;
  const scalValue = useRef(new Animated.Value(0)).current;

  console.log(user?.profile);

  const IconMapping = {
    Car: 'car',
    Train: 'train',
    Bike: 'motorcycle',
    Plane: 'plane',
    Flight: 'plane',
    MOT: 'car',
    Bus: 'bus',
    Auto: 'car',
  };

  // useEffect(() => {


  //   socket.on('connect', () => {
  //     socket.emit('joinRoom', { user, key: 'packagerSocket', userkey: 'packagerid' });
  //     console.log('hguguug', socket.id);
  //   })
  //   // return () => {
  //   //   socket.off('connect');
  //   //   socket.on('disconnect', () => {
  //   //     console.log('Disconnected from server');
  //   //   });
  //   // };
  // }, [user]);

  const getNextColor = (currentColor) => {
    const index = colors.indexOf(currentColor) + 1;
    return index === colors.length ? colors[0] : colors[index];
  };

  const startJump = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(jumpValue, {
          toValue: -250,  // Jump height
          duration: 0,  // Jump duration
          useNativeDriver: true,
        }),
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

  const handleButton = () => setColor((current) => getNextColor(current));

  const startTrainAnimation = () => {
    const neh = height + 300;
    Animated.timing(trainAnim, {
      toValue: -neh,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  };

  const startAnimation = () => {
    Animated.timing(animate, {
      toValue: isAnim ? 0 : -45,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(animate2, {
      toValue: isAnim ? 0 : 45,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setAnim(!isAnim);
  };

  const startBallonAnimation = () => {
    const neh = height + 300;
    Animated.timing(baloonsAnim, {
      toValue: -neh,
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
    setAnim3(!isAnim3);
    setTimeout(() => {
      Animated.timing(refs, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Vibration.cancel()
    }, 100);
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

  useEffect(() => {
    setTimeout(async () => {
      const clienthome = await AsyncStorage.getItem('clienthome');
      if (!clienthome) {
        await step1?.current?.show();
      }
    }, 5000);
  }, []);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        SplashScreen.hide();
        setDelta({});
        setLoc({});
        getlocalData();
        flipCoin();
        startJump()
        console.log('charges=============>', Charges(8, 8, 280));
        // copilotEvents.on("stop", listener);
        // setInterval(() => {
        //   handleButton()
        // }, 1000);

      },
    );

    // const tmOut = setInterval(() => {
    //   setTimeout
    // }, interval);(() => {
    //   flipCoin();
    // }, 7000);
    let timeoutID = null
    // if (Platform.OS === 'android') {
    timeoutID = setInterval(() => {
      flipCoin();
    }, 7000);
    // }


    console.log(locContext);
    getlocalData();
    return () => {
      clearInterval(timeoutID);
      willFocusSubscription();
    };
  }, []);

  // const listener = () => {
  //   console.log('start--------->')
  // }
  const mapRef = useRef(null);



  useEffect(() => {
    if (itemDetails?.location.length > 0 && itemDetails.tolocation.length > 0) {
      const northeastLat = parseFloat(itemDetails?.location[1]);
      const southwestLat = parseFloat(itemDetails.tolocation[1]);
      const latDelta = northeastLat - southwestLat;
      // const latDelta = 0.0922;
      const lngDelta = latDelta * ASPECT_RATIO;
      console.log(Math.abs(latDelta), Math.abs(lngDelta));
      setDeviceLoc({
        lat: (itemDetails?.location[1] + itemDetails.tolocation[1]) / 2,
        lng: (itemDetails?.location[0] + itemDetails.tolocation[0]) / 2,
      });
      setLoc({
        location: {
          latitude: itemDetails?.location[1],
          longitude: itemDetails?.location[0],
        },
        tolocation: {
          latitude: itemDetails.tolocation[1],
          longitude: itemDetails.tolocation[0],
        },
      });
      setDelta({
        lat: Math.abs(latDelta),
        lng: Math.abs(lngDelta),
      });
    } else if (
      itemDetails?.location.length > 0 &&
      itemDetails.tolocation.length === 0
    ) {
      setLoc({
        ...loc,
        location: {
          latitude: itemDetails?.location[1],
          longitude: itemDetails?.location[0],
        },
      });
    } else {
      setLoc({
        ...loc,
        tolocation: {
          latitude: itemDetails.tolocation[1],
          longitude: itemDetails.tolocation[0],
        },
      });
    }
  }, [itemDetails]);

  useEffect(() => {
    if (
      loc?.location?.latitude !== undefined &&
      loc.tolocation?.latitude !== undefined
    ) {
      const northeastLat = parseFloat(loc?.location.latitude);
      const southwestLat = parseFloat(loc?.tolocation.latitude);
      const latDelta = northeastLat - southwestLat;
      // const latDelta = 0.0922;
      const lngDelta = latDelta * ASPECT_RATIO;
      console.log(Math.abs(latDelta), Math.abs(lngDelta));
      setDeviceLoc({
        lat: (loc?.location.latitude + loc?.tolocation.latitude) / 2,
        lng: (loc?.location.longitude + loc?.tolocation.longitude) / 2,
      });
      // setLoc({
      //   location: { latitude: itemDetails?.location[1], longitude: itemDetails?.location[0] },
      //   tolocation: { latitude: itemDetails.tolocation[1], longitude: itemDetails.tolocation[0] }
      // })
      setDelta({
        lat: Math.abs(latDelta),
        lng: Math.abs(lngDelta),
      });
    }
  }, [loc]);

  const getDistance = () => {
    const start = {
      latitude: itemDetails.location[1],
      longitude: itemDetails.location[0],
    };
    const end = {
      latitude: itemDetails.tolocation[1],
      longitude: itemDetails.tolocation[0],
    };
    const da = geolib.getDistance(start, end);
    const ca = geolib.convertDistance(da, 'km');
    console.log(da, ca);
    return ca;
  };

  const getlocalData = async () => {



    const localdata = await AsyncStorage.getItem('packageplan');
    setPost('1');
    if (localdata !== undefined && localdata !== null) {
      const mdata = JSON.parse(localdata);
      console.log(mdata);
      if (mdata.type === 'ride') {
        setReceiptDetail({
          name: mdata.name,
          mot: mdata.mot,
          seat_avaibility: mdata.seat_avaibility,
          ridechedule: new Date(mdata.ridechedule),
        });
        setItemDetails({
          ...itemDetails,
          address: mdata.address,
          location: mdata.location,
          tolocation: mdata.tolocation,
          delivery_date: new Date(mdata.delivery_date),
          delivery_address: mdata.delivery_address,
        });
      } else {
        setItemDetails({
          name: mdata.name,
          bonus: mdata.bonus,
          item_image: mdata.item_image,
          weight: mdata.weight,
          value: mdata.value,
          qty: mdata.qty,
          address: mdata.address,
          location: mdata.location,
          tolocation: mdata.tolocation,
          delivery_date: new Date(mdata.delivery_date),
          pickupaddress: mdata.pickupaddress,
          delivery_address: mdata.delivery_address,
        });
        setReceiptDetail({
          phone: mdata.phone,
          description: mdata.description,
          formatedPhone: mdata.formatedPhone,
          fulldelivery_address: mdata.fulldelivery_address,
        });
        setPhone(mdata.phone);
      }
      console.log(mdata.location);
      setStartAddress(mdata.address);
      const data = { location: mdata.location, tolocation: mdata.tolocation };
      // travellerNearMe(data);
    } else {
      // setLoading(true);
      setTimeout(() => {
        // if (Platform.OS === 'android') {
        ConnectionCheck.isConnected().then(
          async connect => {
            // 
            console.log('connected============>', connect)

            if ((!connect.isInternetReachable || (connect.isInternetReachable && ((connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || (connect.type === 'cellular' && connect.details.cellularGeneration === '2g'))))) {
              setTimeout(() => {
                if (!isSlowInternet) {
                  setIsSlowInternet(true)
                  Alert.alert('Poor connection.', 'Please check your internet connection and retry again', [
                    {
                      text: 'Dismiss',
                      onPress: () => {
                        setIsSlowInternet(true)
                      },
                    },
                  ]);
                }
              }, 1000);
              getLocation(currLoc.location, currLoc.add);
            } else {
              setIsSlowInternet(false);
              if (currLoc?.location === undefined || currLoc?.location === '') {
                CustomCurrentLocation(getCurrLoc);
              } else {
                getLocation(currLoc.location, currLoc.add);
              }
            }
          })
        // } else {
        //   setIsSlowInternet(false);
        //   if (currLoc?.location === undefined || currLoc?.location === '') {
        //     CustomCurrentLocation(getCurrLoc);
        //   } else {
        //     getLocation(currLoc.location, currLoc.add);
        //   }
        // }

      }, 1000);


      // dispatch(getuserLocation(currLoc))
      // getLocation(currLoc.location, currLoc.add);
      // // CustomCurrentLocation(getLocation);
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
      console.log(add[0].formatted_address);
      setStartAddress(add[0].formatted_address);
      setItemDetails({
        ...itemDetails,
        address: add[0].formatted_address,
        // pickupaddress: add[0].formatted_address,
        location: [res.coords.longitude, res.coords.latitude],
      });
      console.log(res);
      setDeviceLoc({
        lat: res.coords.latitude,
        lng: res.coords.longitude,
      });
      const data = { location: [res.coords.longitude, res.coords.latitude] };
      // travellerNearMe(data);

      if (locationArray.length === 0) {
        setLocationArray([
          ...locationArray,
          { lat: res.coords.latitude, lng: res.coords.longitude },
        ]);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const travellerNearMe = data => {
    Post('travellerNearMe', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('jobs=======>', res.data.jobs.length);
        if (res.status) {
          setTravellerPlans(res.data.jobs);

          // setTimeout(() => {
          console.log(data.location, data.tolocation, res.data.jobs.length);
          if (
            data?.location?.length > 0 &&
            data?.tolocation?.length > 0 &&
            res.data.jobs.length > 0
          ) {
            // trainAnim.setValue(0);
            // startTrainAnimation();
            // baloonsAnim.setValue(0);
            // startBallonAnimation();
          }
          // }, 2000);
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

  const packagesNearMe = data => {
    Post('packagesNearMe', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res.data.jobs);
        if (res.status) {
          if (res.data.jobs.length > 0) {
            if (data.type === 'chat') {
              getPackageByUser();
              setModalVisible(true);
              setPopupType('chat');
            } else {
              Linking.openURL(`tel:${travelPlanById.user.phone}`);
              // actionRef3.current.hide();
              actionRef3.current.close();

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

  const switchToTraveller = () => {
    setLoading(true);
    Post('updateProfile', { type: 'TRAVELLER' }, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        await step1.current?.hide();
        await step2.current?.hide();
        await step3.current?.hide();
        await step4.current?.hide();
        await step5.current?.hide();
        if (res.status) {
          setUser(res.data);
          await AsyncStorage.setItem('userDetail', JSON.stringify(res.data));
          props.navigation.replace('traveller', {
            screen: 'Home',
          });
          // props.navigation.navigate('profile');
          setInitial('traveller');
        } else {
          console.log('error------>', res);
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
    console.log(lat, add);
    // set(add);
    if (set === 'start') {
      setDeviceLoc(lat);
      const data = { location: [lat.lng, lat.lat] };
      // travellerNearMe(data);
      setItemDetails({
        ...itemDetails,
        address: add,
        // pickupaddress: add,
        location: [lat.lng, lat.lat],
      });
    }
    if (set === 'end') {
      setItemDetails({
        ...itemDetails,
        delivery_address: add,
        tolocation: [lat.lng, lat.lat],
      });

      // setReceiptDetail({
      //   ...receiptDetail,
      //   fulldelivery_address: add,
      // });

      const data = {
        location: itemDetails.location,
        tolocation: [lat.lng, lat.lat],
      };

      // travellerNearMe(data);
      // getDistance();
    }
  };

  const post1 = () => {
    if (itemDetails.name === '') {
      // setToast('Item Name is required');
      setfiledCheck(['ITEMNAME']);
      itemName.current?.focus();
      Vibration.vibrate();
      return;
    }
    console.log(itemDetails);
    let { errorString, anyEmptyInputs } = checkForEmptyKeys({
      name: itemDetails.name,
      item_image: itemDetails.item_image,
      address: itemDetails.address,
    });


    setfiledCheck(anyEmptyInputs);
    if (anyEmptyInputs.length > 0) {
      setToast('Fill the  details properly');
      return;
    }
    let absentData = {};
    let localData = Charges(getDistance());
    if (itemDetails.value < 500 || itemDetails.value === '') {
      // setItemDetails({...itemDetails, value: '50'});
      absentData.value = '500';
      // setToast('Worth default value will be 50rs');
      // return;
    }
    if (itemDetails.weight < 0.2 || itemDetails.weight === '') {
      // setItemDetails({...itemDetails, weight: '0.2'});
      absentData.weight = '0.2';
      // setToast('Default value will be 0.2 kg');
      // return;
    }
    if (itemDetails.qty < 1 || itemDetails.qty === '') {
      // setItemDetails({...itemDetails, value});
      absentData.qty = '1';
      // setToast('Default value will be 0.2 kg');
      // return;
    }
    // console.log('new bonus=============>', getPlanDefaultValue())
    if (
      Number(itemDetails.bonus) < Number(localData.bonus) ||
      itemDetails.bonus === ''
    ) {
      absentData.bonus = localData.bonus;
    }
    // console.log(absentData)
    setItemDetails({
      ...itemDetails,
      ...absentData,
      route: getPlanDefaultValue().route,
      km: getPlanDefaultValue().km,
    });
    // console.log({ ...itemDetails, ...absentData });
    setPost('2');
  };

  const payPost = async type => {
    console.log(receiptDetail);
    if (receiptDetail.formatedPhone === '') {
      // itemName.current?.focus();
      if (Platform.OS === 'android') {
        setToast('Phone Number is required');
      } else {
        Alert.alert('Phone Number is required')
      }


      Vibration.vibrate();
      return;
    }
    console.log(receiptDetail);
    let desc = receiptDetail.description;
    delete receiptDetail.phone;
    delete receiptDetail.description;
    // let { errorString, anyEmptyInputs } = checkForEmptyKeys(
    //   type === 'ride' ? rideDetail : receiptDetail,
    // );
    // setfiledCheck(anyEmptyInputs);
    // if (anyEmptyInputs.length > 0) {
    //   setToast('Fill the  details properly');
    //   return;
    // }
    if (!isValidNumber(receiptDetail.formatedPhone)) {
      if (Platform.OS === 'android') {
        setToast('Invalid Phone Number');
      } else {
        Alert.alert('Invalid Phone Number')
      }
      return;
    }
    console.log(itemDetails);
    let datas = {};
    if (type === 'ride') {
      actionRef2.current.close();
      // actionRef2.current.hide();
      datas = {
        ...rideDetail,
        address: itemDetails.address,
        delivery_date: itemDetails.delivery_date,
        delivery_address: itemDetails.delivery_address,
        location: itemDetails.location,
        type,
      };
    } else {
      actionRef.current.close();
      // actionRef.current.hide();
      datas = {
        ...itemDetails,
        ...receiptDetail,
        type,
        phone,
        description: desc,
      };
    }
    await AsyncStorage.setItem('packageplan', JSON.stringify(datas));
    props.navigation.navigate('paymentpro', {
      packagePlan: JSON.stringify(datas),
    });
  };

  const getTravelPlanById = id => {
    setLoading(true);
    GetApi(`gettravelplan/${id}`, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setTravelPlanById(res.data);
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

  const getPackageByUser = () => {
    setLoading(true);

    GetApi('getpackagesbyuser', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          res.data.forEach(element => {
            element.value = element.name;
            element.key = element._id;
          });
          setAllPackage(res.data);
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

  const sendInvitation = () => {
    actionRef3.current.close();
    // actionRef3.current.hide();
    setLoading(true);
    const datas = {
      receverId: travelPlanById.user._id,
      travelPlan: travelPlanById._id,
      packagePlan: selectPacakge,
      notification: 'Send for invitation',
    };
    Post('sendinvite', datas, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.success) {
          setToast('sent invitation successfully');
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

  const getImageValue = async img => {
    console.log(img);
    setTimeout(() => {
      if (img?.assets?.length > 0) {
        setImageLoader(true);
        ApiFormData(img.assets[0]).then(
          res => {
            setImageLoader(false);
            console.log(res);
            if (res.status) {
              setItemDetails({
                ...itemDetails,
                item_image: res.data.file,
              });
            }
          },
          err => {
            setImageLoader(false);
            console.log(err);
          },
        );
      }
    }, 1000);


  };

  const createChat = () => {
    setLoading(true);
    const datas = {
      status: 'CONNECTED',
      travellerid: travelPlanById.user._id,
      travelPlan: travelPlanById._id,
      packagePlan: selectPacakge._id,
      packagerid: selectPacakge.user._id,
    };
    Post('accept-invitation', datas, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        setTravelPlanById({});
        setSelectPackage({});
        // socket.emit('join', res.connection._id);
        props.navigation.navigate('Chat', {
          locationId: res.connection._id,
        });
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const getPlanDefaultValue = () => {
    let newdate = new Date();
    let d = {};
    let nd = '';
    if (itemDetails?.address !== '' && itemDetails?.delivery_address !== '') {
      if (getDistance() < 10) {
        nd = newdate.setHours(newdate.getHours() + 4);
        d = {
          value: '10',
          type: 'local',
          route: 'LOCAL',
          km: getDistance(),
          delivery_date: new Date(nd),
        };
        // setMinDate(nd);
      } else if (getDistance() < 20) {
        nd = newdate.setHours(newdate.getHours() + 6);
        d = {
          value: '10',
          type: 'local',
          route: 'LOCAL',
          km: getDistance(),
          delivery_date: new Date(nd),
        };
        // setMinDate(nd)
      } else if (getDistance() < 50) {
        nd = newdate.setHours(newdate.getHours() + 10);
        d = {
          value: '25',
          type: 'local',
          route: 'LOCAL',
          km: getDistance(),
          delivery_date: new Date(nd),
        };
        // setMinDate(nd)
      } else if (getDistance() < 200) {
        // let nd = newdate.setDate(newdate.getDate() + 1);
        nd = newdate.setHours(newdate.getHours() + 24);
        d = {
          value: '100',
          type: 'local',
          route: 'LOCAL',
          km: getDistance(),
          delivery_date: new Date(nd),
        };
        // setMinDate(nd)
      } else if (getDistance() < 500) {
        // let nd = newdate.setDate(newdate.getDate() + 2);
        nd = newdate.setHours(newdate.getHours() + 48);
        d = {
          value: '100',
          type: 'local',
          route: 'LOCAL',
          km: getDistance(),
          delivery_date: new Date(nd),
        };
        // setMinDate(nd)
      } else if (getDistance() < 800) {
        // let nd = newdate.setDate(newdate.getDate() + 4);
        nd = newdate.setHours(newdate.getHours() + 96);
        d = {
          value: '100',
          type: 'district to district',
          route: 'CITY',
          km: getDistance(),
          delivery_date: new Date(nd),
        };
        // setMinDate(nd)
      } else if (getDistance() < 2000) {
        // let nd = newdate.setDate(newdate.getDate() + 8);
        let nd = newdate.setHours(newdate.getHours() + 130);
        d = {
          value: '200',
          type: 'state to state',
          route: 'STATE',
          km: getDistance(),
          delivery_date: new Date(nd),
        };
        // setMinDate(nd)
      } else {
        // let nd = newdate.setDate(newdate.getDate() + 8);
        nd = newdate.setHours(newdate.getHours() + 160);
        d = {
          value: '500',
          type: 'country to country',
          route: 'COUNTRY',
          km: getDistance(),
          delivery_date: new Date(nd),
        };
      }
      console.log('local data--------->', nd, d);
      // setMinDate(d.delivery_date);
      // setItemDetails({
      //   ...itemDetails,
      //   // bonus: d.value,
      //   delivery_date: d.delivery_date,
      // });
    }
    return d;
  };

  const TourContent = (tourProps) => (
    <View style={{ flex: 1, backgroundColor: Constants.white, marginHorizontal: 10, padding: 10, borderRadius: 10, flexDirection: 'row' }}>
      <Text style={{ color: Constants.black, fontWeight: '700', fontFamily: 'Helvetica', flex: 3 }}>{tourProps?.message}</Text>
      {/* {(!tourProps?.isFirst || tourProps?.isLast) && <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ color: Constants.black, fontWeight: '700', fontSize: 14, textAlign: 'center', fontFamily: 'Helvetica', backgroundColor: Constants.yellow, width: 60, padding: 3, borderRadius: 5, maxHeight: 25 }}>Previous</Text>
      </TouchableOpacity>} */}
      {!tourProps?.isLast && <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ color: Constants.white, fontWeight: '700', fontSize: 14, textAlign: 'center', fontFamily: 'Helvetica', backgroundColor: Constants.red, minWidth: 60, padding: 3, borderRadius: 5, maxHeight: 25 }}
          onPress={async () => {
            await tourProps.current.current.hide();
          }}
        >Next</Text>
      </TouchableOpacity>}
      {tourProps?.isLast && <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={{ color: Constants.white, fontWeight: '700', fontSize: 14, textAlign: 'center', fontFamily: 'Helvetica', backgroundColor: Constants.red, width: 60, padding: 3, borderRadius: 5, maxHeight: 25 }}
          onPress={async () => {
            await tourProps.current.current.hide();
          }}
        >Finish</Text>
      </TouchableOpacity>}
    </View>
  );

  const StartMarkerView = () => (
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

  const EndMarkerView = () => (
    <View style={{ height: 35, width: 30, position: 'relative' }}>
      <View style={[styles.startMarkerView, { backgroundColor: '#E8FFE0', borderColor: '#8BFF63' }]}>
        {/* <Ionicons name="locate" size={20} color={Constants.black} /> */}
        <View style={{
          position: 'absolute', bottom: -15,
        }}>
          <Ionicons name="caret-down-outline" size={20} color="#8BFF63" />
        </View>
      </View>
    </View>
  );
  return (

    <SafeAreaView style={styles.container}>
      <Spinner color={'#fff'} visible={loading} />
      {/* <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={3000}
        toast={toast}
        setToast={setToast}
      /> */}

      <Animated.View style={[{ backgroundColor, padding: 10 }]}>
        <AnimatedTyping
          text={['Your are on client mode. Post your package now']}
          styles={{ color: Constants.white, fontWeight: '700', textAlign: 'center', fontFamily: 'Helvetica' }}
        />
        {/* <Text style={{ color: Constants.white, fontWeight: '700', textAlign: 'center', fontFamily: 'Helvetica' }}>Your are on client mode. Post your package now</Text> */}
      </Animated.View>
      <View style={styles.profileMainView}>

        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.center, styles.profileView]}>
            <Ionicons name="location" size={20} color="#E8503A" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{
              color: Constants.black, fontFamily: 'Helvetica',
            }}>Location</Text>
            <Text
              numberOfLines={2}
              style={{ fontSize: 15, color: Constants.black, width: 220 }}>
              {startAddress}
            </Text>
          </View>
        </View>
        <View style={[styles.center, { width: 100 }]}>
          <TouchableOpacity
            onPress={() => {
              flipCoin();
              setTimeout(() => {
                props.navigation.navigate('profile');
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
                      ? { uri: `${user?.profile}` }
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
                      borderColor: Constants.provider,
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
            {/* {user?.profile ? (
              <Avatar.Image


                size={50}
                source={{ uri: `${user?.profile}` }}
              />
            ) : (
              <Avatar.Image


                size={50}
                source={require('../../Assets/newImgs/images.png')}
              />
            )} */}
          </TouchableOpacity>
          {/* <Ionicons
            name="person"
            size={25}
            color={Constants.black}
            onPress={() => {
              props.navigation.navigate('profile');
            }}
          /> */}
        </View>
      </View>
      <View style={styles.mapView}>
        <MapView
          style={styles.mapOrigin}
          customMapStyle={mapStyle}
          ref={mapRef}
          region={{
            latitude: deviceLoc?.lat || 28.535517,
            longitude: deviceLoc?.lng || 77.391029,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08 * ASPECT_RATIO,
          }}
          provider={MapView.PROVIDER_GOOGLE}>
          {loc?.location?.latitude !== undefined && (
            <Marker
              zIndex={9}
              draggable={true}
              onDragEnd={loc => {
                setLoc({
                  ...loc,
                  location: loc.nativeEvent.coordinate,
                });
                GetCurrentAddressByLatLong({
                  lat: loc.nativeEvent.coordinate.latitude,
                  long: loc.nativeEvent.coordinate.longitude,
                }).then(res => {
                  console.log(res);
                  setItemDetails({
                    ...itemDetails,
                    location: [res.latlng.long, res.latlng.lat],
                    address: res.results[0].formatted_address,
                  });
                });
              }}
              image={require('../../Assets/newImgs/start.png')}
              coordinate={loc.location}
            />
          )}
          {loc?.tolocation?.latitude !== undefined && (
            <Marker
              draggable={true}
              zIndex={9}
              onDragEnd={loc => {
                setLoc({
                  ...loc,
                  tolocation: loc.nativeEvent.coordinate,
                });
                GetCurrentAddressByLatLong({
                  lat: loc.nativeEvent.coordinate.latitude,
                  long: loc.nativeEvent.coordinate.longitude,
                }).then(res => {
                  console.log(res);
                  setItemDetails({
                    ...itemDetails,
                    tolocation: [res.latlng.long, res.latlng.lat],
                    delivery_address: res.results[0].formatted_address,
                  });
                });
              }}
              image={require('../../Assets/newImgs/end.png')}
              coordinate={loc.tolocation}
            />
          )}
          {loc?.location?.latitude !== undefined &&
            loc?.tolocation?.latitude !== undefined && (
              <MapViewDirections
                origin={loc.location}
                destination={loc.tolocation}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor={Constants.provider}
                // optimizeWaypoints={true}

                onReady={result => {
                  const edgePadding = { top: 50, right: 50, bottom: 50, left: 50 };
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding,
                    animated: true,
                  });
                }}

              />
            )}
          {/* {travellerPlans?.map(item => (
            <Marker
              zIndex={8}
              key={item._id}
              onPress={() => {
                const d = travellerPlans.filter(
                  f =>
                    f.location?.coordinates[1] ===
                    item?.location?.coordinates[1],
                );
                console.log(d);

                if (d.length > 1) {
                  setFilterUser(d);
                  setVisible(true);
                  setSortRoute(item);
                } else {
                  setVisible(false);
                  getTravelPlanById(item._id);
                  actionRef3.current.open();
                }
              }}
              image={require('../../Assets/newImgs/travellerBadge1.png')}
              coordinate={{
                latitude: item?.location?.coordinates[1],
                longitude: item?.location?.coordinates[0],
              }}
            />
          ))} */}
        </MapView>
        <View style={styles.fieldView}>
          <View style={{ zIndex: 9 }}>
            <Coachmark
              renderContent={() => (
                <TourContent message="Enter start location or adjust the start pin 📌  on map." current={step2} />
              )}
              ref={step2}
              onHide={async () => await step3.current.show()}
            >
              <Animated.View
                style={[
                  styles.startField,
                  { borderWidth: from === 'location' ? 2 : 1 },
                  {
                    transform: [{ translateY: animate3 }],
                  },
                ]}>
                <View style={{ width: 250 }}>
                  <LocationDropdown
                    value={itemDetails.address}
                    setIsFocus={setFrom}
                    focus={from === 'location'}
                    from="location"
                    keys="address"
                    cordinate="location"
                    setItemDetails={setItemDetails}
                    itemDetails={itemDetails}
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
            <Coachmark
              renderContent={() => (
                <TourContent message="Enter destination and adjust the End Pin 📌 on map." current={step3} />
              )}
              ref={step3}
              onHide={async () => await step4.current.show()}
            >
              <Animated.View
                style={[
                  styles.endField,
                  { borderWidth: from === 'tolocation' ? 2 : 1 },
                  {
                    transform: [{ translateY: animate4 }],
                  },
                ]}>
                <View style={{ width: 250 }}>
                  <LocationDropdown
                    value={itemDetails.delivery_address}
                    setIsFocus={setFrom}
                    focus={from === 'tolocation'}
                    from="tolocation"
                    keys="delivery_address"
                    cordinate="tolocation"
                    placeholder="Package Destination Address"
                    setItemDetails={setItemDetails}
                    itemDetails={itemDetails}
                    multi={'false'}
                    getLocationVaue={(lat, add) => getLocationVaue(lat, add, 'end')}
                  />
                </View>
                <Ionicons name="locate" size={25} color={Constants.black} />
              </Animated.View>
            </Coachmark>
          </View>


          <Animated.View style={[{ flexDirection: 'row', justifyContent: 'flex-end', position: 'relative' }, {
            transform: [{ translateY: jumpValue }, { scaleY: scalValue }],
          }]}>

            <Animated.View
              style={[
                { position: 'absolute', right: 0 },
                {
                  transform: [
                    { translateY: isAnim ? 10 : 0 },
                    { translateX: animate },
                  ],
                },
              ]}>
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() => {
                  startAnimation();
                  actionRef2.current.open();
                  // actionRef2.current.show();
                }}>
                <Image
                  style={{ height: isAnim ? 35 : 30, width: isAnim ? 35 : 30 }}
                  source={require('../../Assets/newImgs/ride.png')}
                />
                {/* <Ionicons name="add" size={30} color={Constants.white} /> */}
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                { position: 'absolute', right: 0 },
                {
                  transform: [
                    { translateX: isAnim ? -10 : 0 },
                    { translateY: animate2 },
                  ],
                },
              ]}>
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() => {
                  startAnimation();
                  // actionRef.current.show();
                  actionRef.current.open();
                  // const d = getPlanDefaultValue();
                  const d = Charges(getDistance());
                  console.log('charges+++++++++++++++++++', d);
                  setItemDetails({
                    ...itemDetails,
                    bonus: d.bonus,
                    delivery_date: d.delivery_date,
                  });
                  // getPlanDefaultValue();
                }}>
                <Image
                  style={{ height: isAnim ? 35 : 30, width: isAnim ? 35 : 30 }}
                  source={require('../../Assets/newImgs/bxs_package.png')}
                />
                {/* <Ionicons name="add" size={30} color={Constants.white} /> */}
              </TouchableOpacity>
            </Animated.View>
            <Coachmark ref={step4} onHide={async () => await step5.current.show()}
              renderContent={() => (
                <TourContent message="Add your package details for courier." current={step4} />
              )}
            >
              <Tooltip
                isVisible={toolTipVisible}
                content={
                  <Text style={{ fontWeight: '700', color: Constants.white, fontFamily: 'Helvetica' }}>
                    Add Your Package
                  </Text>
                }
                placement="top"
                contentStyle={{ backgroundColor: Constants.provider }}>
                {/* <CopilotStep text="Add your package here!" order={3} name="add">

                <CopilotTouchableOpacity */}

                <TouchableOpacity
                  style={[styles.plusBtn, { transform: [{ scaleY: scalValue }] }]}
                  onLongPress={() => {
                    setToolTipVisible(true);
                    setTimeout(() => {
                      setToolTipVisible(false);
                    }, 2000);
                  }}
                  onPress={() => {
                    // start();
                    // return;
                    if (
                      itemDetails?.delivery_address !== '' &&
                      itemDetails?.address !== ''
                    ) {
                      const d = Charges(getDistance());
                      console.log('charges+++++++++++++++++++', d);
                      setItemDetails({
                        ...itemDetails,
                        bonus: d.bonus,
                        delivery_date: new Date(d.delivery_date),

                      });
                      setSelectedDate(new Date(d.delivery_date));
                      setMinDate(new Date(d.delivery_date));
                      // startAnimation();
                      actionRef.current.open();
                    } else {
                      let refs =
                        itemDetails?.address === '' ? animate3 : animate4;
                      setFrom(
                        itemDetails?.address === '' ? 'location' : 'tolocation',
                      );
                      startAnimationwithVibrate(refs);
                      Vibration.vibrate();
                      setIsFocus(false);
                      setTimeout(() => {
                        setIsFocus(true);
                        Vibration.cancel();
                      }, 500);
                      setTimeout(() => {
                        startAnimationwithVibrate(refs);
                      }, 200);
                      // setToast('Please select delivery address then try again');
                    }
                  }}>

                  <Ionicons name="add" size={30} color={Constants.white} />
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

          <Coachmark ref={step5} onHide={async () => await AsyncStorage.setItem('clienthome', 'opened')}
            renderContent={() => (
              <TourContent message="Switch to Traveller mode to post your travel plan." isLast current={step5} />
            )}

          >

            <TouchableOpacity
              style={styles.swtichBtn}
              onPress={switchToTraveller}>
              <Text
                style={{ marginRight: 5, color: Constants.white, fontSize: 13, fontFamily: 'Helvetica' }}>
                Switch to Traveller
              </Text>
              <FontAwesome6 name="shuffle" size={18} color={Constants.white} />
            </TouchableOpacity>
          </Coachmark>
          {/* </CopilotTouchableOpacity> */}
          {/* </CopilotStep> */}
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
                  backgroundColor: Constants.provider,
                  minHeight: 140,
                  width: 90,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: Constants.white,
                    fontWeight: '700',
                    fontSize: 16,
                  }}>
                  {`There are ${travellerPlans.length} travellers are travelling to ${itemDetails.delivery_address}`}
                </Text>
              </View>
            </View>
          </Animated.View> */}
          {/* <Animated.View style={[{ zIndex: 9, position: 'absolute', bottom: -400, width: width, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }, {
            transform: [
              { translateY: baloonsAnim },
            ],
          }]}> */}
          {/* <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 50, top: 160 }}>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.provider, height: 120, width: 120, borderBottomEndRadius: 102, borderBottomStartRadius: 102, borderTopEndRadius: 118, borderTopStartRadius: 118 }}>
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.provider, height: 20, width: 20, borderBottomEndRadius: 102, borderBottomStartRadius: 102, borderTopEndRadius: 118, borderTopStartRadius: 118 }}>
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 40, marginTop: -20 }}>
                <View style={{ borderWidth: 1, borderColor: Constants.provider, height: 100 }}></View>
              </View>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 50, top: 180 }}>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.provider, height: 100, width: 100, borderBottomEndRadius: 102, borderBottomStartRadius: 102, borderTopEndRadius: 118, borderTopStartRadius: 118 }}>
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.provider, height: 20, width: 20, borderBottomEndRadius: 102, borderBottomStartRadius: 102, borderTopEndRadius: 118, borderTopStartRadius: 118 }}>
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 40, marginTop: -20 }}>
                <View style={{ borderWidth: 1, borderColor: Constants.provider, height: 100 }}></View>
              </View>
            </View> */}
          {/* <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.provider, height: 160, width: 160, borderBottomEndRadius: 102, borderBottomStartRadius: 102, borderTopEndRadius: 118, borderTopStartRadius: 118 }}>
                <Text style={{ textAlign: 'center', color: Constants.white, fontWeight: '700', fontSize: 18 }}>{`${travellerPlans.length} travellers are travelling to ${itemDetails.delivery_address}`}</Text>
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Constants.provider, height: 20, width: 20, borderBottomEndRadius: 102, borderBottomStartRadius: 102, borderTopEndRadius: 118, borderTopStartRadius: 118 }}>
              </View>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 40, marginTop: -20 }}>
                <View style={{ borderWidth: 1, borderColor: Constants.provider, height: 100 }}></View>
              </View>
            </View>
          </Animated.View> */}
        </View>
      </View>

      <BottomDrawer
        ref={actionRef}
        initialHeight={600}
        closeOnBackdropPress={false}>
        <ImageBackground
          style={{ position: 'relative', flex: 1 }}
          source={require('../../Assets/newImgs/BG.png')}
          resizeMode="cover">
          <ScrollView keyboardShouldPersistTaps="always" sty style={{ flex: 1 }}>
            {/* <Toast /> */}
            <Text
              style={{
                color: Constants[initial],
                fontWeight: '700',
                textAlign: 'center',
                fontSize: 14,
                marginTop: 10,
              }}>
              {post}/2
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                position: 'absolute',
                top: 0,
                right: 10,
              }}>
              <TouchableOpacity
                style={[
                  styles.plusBtn,
                  { marginRight: 10, backgroundColor: Constants[initial] },
                ]}
                onPress={() => {
                  Keyboard.dismiss();
                  setTimeout(() => {
                    actionRef.current.close();
                    // actionRef.current.hide();
                    setPost('1');
                  }, 500);
                }}>
                <Ionicons name="close" size={30} color={Constants.white} />
              </TouchableOpacity>
            </View>
            {post === '1' ? (
              <View>
                <Text style={styles.itemdetail}>Item Details</Text>
                <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
                  <View style={styles.normalField}>
                    {/* <Text style={styles.labels}>Item Name</Text> */}
                    <TextInput
                      ref={itemName}
                      style={{ color: Constants.black }}
                      placeholder="Item Name"
                      maxLength={20}
                      placeholderTextColor={Constants.lightgrey}
                      value={itemDetails.name}
                      onChangeText={name =>
                        setItemDetails({ ...itemDetails, name })
                      }
                    />
                    {itemDetails.name === '' && (
                      <Image
                        source={require('../../Assets/newImgs/sk.png')}
                        style={{ height: 20, width: 20, objectFit: 'contain' }}
                      />
                    )}
                  </View>
                  {filedCheck.includes('ITEMNAME') && itemDetails.name === '' && (
                    <Text style={{ color: 'red', fontFamily: 'Helvetica' }}>Item Name is required</Text>
                  )}

                  <View style={[styles.normalField, { marginTop: 10 }]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}>
                      <Text style={{ color: Constants.black, fontFamily: 'Helvetica' }}>Bonus (Rs): </Text>
                      <TextInput
                        style={{ color: Constants.black }}
                        placeholder="Bonus"
                        placeholderTextColor={Constants.lightgrey}
                        value={`${itemDetails.bonus}`}
                        onBlur={() => {

                          // let defaultValue = getPlanDefaultValue();
                          let defaultValue = Charges(getDistance());
                          if (
                            Number(itemDetails.bonus) < Number(defaultValue.bonus) ||
                            itemDetails.bonus === ''
                          ) {
                            setItemDetails({ ...itemDetails, bonus: defaultValue.bonus });
                          } else {
                            setItemDetails({ ...itemDetails });
                          }

                        }}
                        keyboardType='numeric'
                        onChangeText={bonus => {

                          setItemDetails({ ...itemDetails, bonus });
                        }}
                      />
                    </View>
                    {itemDetails.bonus === '' && (
                      <Image
                        source={require('../../Assets/newImgs/sk.png')}
                        style={{ height: 20, width: 20, objectFit: 'contain' }}
                      />
                    )}
                  </View>
                  {/* <Dropdown
                    itemTextStyle={{color: Constants.black}}
                    style={styles.dropdown}
                    // activeColor={Constants[initial]}
                    containerStyle={{borderRadius: 25, overflow: 'hidden'}}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    maxHeight={300}
                    labelField="value"
                    valueField="key"
                    placeholder="Bonus"
                    value={itemDetails.bonus}
                    onChange={item => {
                      console.log(item);
                      setItemDetails({...itemDetails, bonus: item.key});
                    }}
                  /> */}

                  <View

                    style={[
                      styles.normalField,
                      { marginTop: 10, paddingHorizontal: 20, zIndex: 9 },
                    ]}>
                    <View style={{ width: width - 80, minHeight: 45 }} >
                      <LocationDropdown
                        setIsFocus={setIsFocus}
                        focus={isFocus}
                        placeholder="Pickup address"
                        value={itemDetails.pickupaddress}
                        setItemDetails={setItemDetails}
                        itemDetails={itemDetails}
                        keys="pickupaddress"
                        getLocationVaue={(lat, add) =>
                          setItemDetails({
                            ...itemDetails,
                            pickupaddress: add,
                            // location: [lat.lng, lat.lat],
                          })
                        }
                      />
                    </View>

                    {/* {itemDetails.pickupaddress === '' && (
                      <Image
                        source={require('../../Assets/newImgs/sk.png')}
                        style={{ height: 20, width: 20, objectFit: 'contain' }}
                      />
                    )} */}
                  </View>

                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    <TouchableOpacity
                      style={[styles.normalField, { marginTop: 10, flex: 1 }]}
                      onPress={() => {
                        cameraRef.current.show();
                        console.log('called');
                      }}>
                      <TextInput
                        style={{ width: 100, color: Constants.black }}
                        placeholder="Upload Image"
                        editable={false}
                        placeholderTextColor={Constants.lightgrey}
                        value={itemDetails.item_image}
                        onChangeText={item_image =>
                          setItemDetails({ ...itemDetails, item_image })
                        }
                      />
                      {/* <TouchableOpacity
                      > */}
                      {imageLoader && (
                        <ActivityIndicator
                          size={25}
                          animating={true}
                          color={Constants.black}
                        />
                      )}
                      {!imageLoader && (
                        <Ionicons
                          name="image"
                          size={25}
                          color={Constants.black}
                        />
                      )}
                      {/* </TouchableOpacity> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.normalField, { marginTop: 10, flex: 1 }]}
                      onPress={() => {
                        console.log('itemdetai==========>', itemDetails.weight);
                        if (itemDetails.weight >= 10) {
                          setItemDetails({
                            ...itemDetails,
                            weight: 0.2,
                          });
                        } else {
                          if (itemDetails.weight >= 1) {
                            setItemDetails({
                              ...itemDetails,
                              weight: Number(itemDetails.weight) + 1,
                            });
                          } else {
                            setItemDetails({
                              ...itemDetails,
                              weight: (
                                Number(itemDetails.weight) + 0.2
                              ).toFixed(1),
                            });
                          }
                        }
                      }}>
                      <TextInput
                        style={{ color: Constants.black }}
                        keyboardType="numeric"
                        placeholder="Weight"
                        editable={false}
                        placeholderTextColor={Constants.lightgrey}
                        value={itemDetails.weight.toString()}
                      // onChangeText={weight => {
                      //   if (weight > 10) {
                      //     setToast('you can add maximum 10 kgs items');
                      //     return;
                      //   }

                      //   setItemDetails({ ...itemDetails, weight });
                      // }}
                      />

                      <Image
                        source={require('../../Assets/newImgs/game-icons_weight.png')}
                        style={{ height: 25, width: 25, zIndex: 9 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    {/* <Dropdown
                      itemTextStyle={{ color: Constants.black }}
                      style={[styles.dropdown, { flex: 1 }]}
                      // activeColor={Constants[initial]}
                      containerStyle={{ borderRadius: 25, overflow: 'hidden' }}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={itemQty}
                      maxHeight={500}
                      labelField="value"
                      valueField="key"
                      placeholder="No. of Item"
                      value={itemDetails.qty}
                      dropdownPosition="top"
                      onChange={item => {
                        console.log(item);
                        setItemDetails({ ...itemDetails, qty: item.key });
                      }}
                    /> */}
                    <TouchableOpacity
                      onPress={() => {
                        console.log('itemdetai==========>', itemDetails.qty);
                        if (itemDetails.qty >= 5) {
                          setItemDetails({
                            ...itemDetails,
                            qty: 1,
                          });
                        } else {
                          setItemDetails({
                            ...itemDetails,
                            qty: Number(itemDetails.qty) + 1,
                          });
                        }
                      }}
                      style={[
                        styles.normalField,
                        {
                          flex: 1,
                          paddingHorizontal: 20,
                          height: 50,
                          marginTop: 10,
                        },
                      ]}>
                      <TextInput
                        keyboardType="numeric"
                        style={{ color: Constants.black }}
                        placeholder="No. of Item"
                        editable={false}
                        placeholderTextColor={Constants.lightgrey}
                        value={`${itemDetails.qty} item(s)`}
                      // onChangeText={qty => {
                      //   if (qty > 5) {
                      //     setToast('you can add maximum 5 items');
                      //     return;
                      //   }
                      //   if (qty !== '' && qty < 1) {
                      //     setItemDetails({ ...itemDetails, qty: '1' });
                      //     setToast('Default value will be 1 qty');
                      //     return;
                      //   }
                      //   setItemDetails({ ...itemDetails, qty });
                      // }}
                      />
                    </TouchableOpacity>
                    <View
                      style={[
                        styles.normalField,
                        {
                          flex: 1,
                          paddingHorizontal: 20,
                          height: 50,
                          marginTop: 10,
                          justifyContent: 'flex-start',
                        },
                      ]}>
                      <Text style={{ color: Constants.black, fontFamily: 'Helvetica' }}>Worth (Rs):</Text>
                      <TextInput
                        style={{ color: Constants.black }}
                        keyboardType="numeric"
                        placeholder="Worth"
                        placeholderTextColor={Constants.lightgrey}
                        value={itemDetails.value}
                        onChangeText={value => {
                          if (value > 10000) {
                            console.log(value)
                            // setTimeout(() => {
                            if (Platform.OS === 'android') {
                              setToast(
                                'Items for courier must not exceed value of 10,000rs',
                              );
                            } else {
                              Alert.alert('Items for courier must not exceed value of 10,000rs')
                            }

                            // }, 1000);


                          } else {
                            setItemDetails({ ...itemDetails, value });
                          }
                          // if (
                          //   value !== '' &&
                          //   value.length === 2 &&
                          //   value < 50
                          // ) {
                          //   setTimeout(() => {
                          //     setItemDetails({...itemDetails, value: '50'});
                          //     setToast('Default value will be 50rs');
                          //   }, 200);
                          //   return;
                          // }

                        }}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss(); setTimeout(() => {
                        setOpen(true);
                      }, 200);
                    }}
                    style={[
                      styles.normalField,
                      {
                        marginTop: 10,
                        paddingHorizontal: 20,
                        justifyContent: 'flex-start',
                      },
                    ]}>
                    <Text style={{ color: Constants.black, fontFamily: 'Helvetica' }}>Deadline: </Text>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <TextInput
                        placeholder="Delievery Deadline"
                        placeholderTextColor={Constants.lightgrey}
                        style={{ color: Constants.black }}
                        value={moment(itemDetails.delivery_date).format(
                          'DD/MM/YYYY hh:mm A',
                        )}
                        editable={false}
                        focusable={false}
                      />
                      <FontAwesomeIcon
                        name="calendar"
                        size={15}
                        color={Constants.black}
                      />
                    </View>
                  </TouchableOpacity>
                  <DatePicker
                    style={{ zIndex: '50' }}
                    modal
                    open={open}
                    minimumDate={new Date(minDate)}
                    // maximumDate={maxDate}
                    // androidVariant="nativeAndroid"
                    date={itemDetails.delivery_date}
                    onConfirm={date => {

                      setOpen(false);
                      setItemDetails({ ...itemDetails, delivery_date: date });
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
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
                      post1();
                      // Keyboard.dismiss();
                    }}>
                    <Text style={{ color: Constants.white, fontSize: 13, fontFamily: 'Helvetica' }}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.itemdetail}>Recipient Details</Text>

                <View style={{ marginTop: 10, paddingHorizontal: 40 }}>
                  <View style={[styles.normalField, { zIndex: 9 }]}>
                    <View style={{ width: width - 75, minHeight: 45 }}>
                      <LocationDropdown
                        placeholder="Delivery address"
                        setIsFocus={setIsFocus}
                        focus={isFocus}
                        value={receiptDetail.fulldelivery_address}
                        setItemDetails={setReceiptDetail}
                        itemDetails={receiptDetail}
                        keys="fulldelivery_address"
                        getLocationVaue={(lat, add) =>
                          setReceiptDetail({
                            ...receiptDetail,
                            fulldelivery_address: add,
                          })
                        }
                      />
                    </View>
                    {/* {receiptDetail.fulldelivery_address === '' && (
                      <Image
                        source={require('../../Assets/newImgs/sk.png')}
                        style={{ height: 20, width: 20, objectFit: 'contain' }}
                      />
                    )} */}
                  </View>

                  <View
                    style={[
                      styles.normalField,
                      { marginTop: 10, paddingLeft: 0 },
                    ]}>
                    <PhoneInput
                      ref={itemName}
                      value={phone}
                      layout="first"
                      onChangeText={text => {
                        console.log(text);
                        setPhone(text);
                        // setReceiptDetail({
                        //   ...receiptDetail,
                        //   phone: text,
                        // });
                      }}
                      onChangeFormattedText={text => {
                        setReceiptDetail({
                          ...receiptDetail,
                          formatedPhone: text,
                        });
                        // console.log(text);
                      }}
                      containerStyle={{
                        height: 45,
                        backgroundColor: Constants.white,
                        borderRadius: 25,
                      }}
                      textContainerStyle={{
                        height: 45,
                        backgroundColor: Constants.white,
                        borderRadius: 25,
                      }}
                      textInputStyle={{ height: 40 }}
                      codeTextStyle={{ height: 25 }}
                    />
                  </View>

                  <View
                    style={[
                      styles.normalField,
                      { marginTop: 10, alignItems: 'flex-start', paddingTop: 10 },
                    ]}>
                    <TextInput
                      placeholder="Delivery Instructions"
                      style={{ color: Constants.black }}
                      placeholderTextColor={Constants.lightgrey}
                      numberOfLines={5}
                      multiline={true}
                      maxLength={200}
                      textAlignVertical="top"
                      value={receiptDetail.description}
                      onChangeText={description => {
                        setReceiptDetail({ ...receiptDetail, description });
                      }}
                    />
                    {receiptDetail.description === '' && (
                      <Image
                        source={require('../../Assets/newImgs/sk.png')}
                        style={{ height: 20, width: 20, objectFit: 'contain' }}
                      />
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginVertical: 10,
                    }}>
                    <TouchableOpacity
                      style={[styles.swtichBtn2, { width: 100 }]}
                      onPress={() => setPost('1')}>
                      <Text
                        style={{
                          color: Constants[initial],
                          fontSize: 13,
                          fontWeight: '700',
                        }}>
                        Back
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.swtichBtn, { width: 100 }]}
                      onPress={() => {
                        // Keyboard.dismiss();
                        payPost('package');
                      }}>
                      <Text
                        style={{
                          color: Constants.white,
                          fontSize: 13,
                          fontWeight: '700',
                        }}>
                        Post
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </ImageBackground>

        <CameraGalleryPeacker
          refs={cameraRef}
          getImageValue={getImageValue}
          base64={false}
        />
      </BottomDrawer>

      <BottomDrawer
        ref={actionRef2}
        initialHeight={430}
        closeOnBackdropPress={false}>
        <ImageBackground
          source={require('../../Assets/Images/BG2.png')}
          style={{ position: 'relative', flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={[
                styles.plusBtn,
                { marginRight: 10, backgroundColor: Constants[initial] },
              ]}
              onPress={() => {
                // actionRef2.current.hide();
                actionRef2.current.close();
              }}>
              <Ionicons name="close" size={30} color={Constants.white} />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={{ ...styles.itemdetail, color: Constants.white }}>
              Share Ride
            </Text>
            <View style={{ marginTop: 10, paddingHorizontal: 40 }}>
              <View style={styles.normalField}>
                <TextInput
                  placeholder="Ride Name"
                  placeholderTextColor={Constants.lightgrey}
                  value={rideDetail.name}
                  onChangeText={name => setRideDetail({ ...rideDetail, name })}
                />
                {rideDetail.name === '' && (
                  <Image
                    source={require('../../Assets/newImgs/sk.png')}
                    style={{ height: 20, width: 20, objectFit: 'contain' }}
                  />
                )}
              </View>
              <View
                style={[
                  styles.normalField,
                  { marginTop: 10, paddingHorizontal: 10 },
                ]}>
                <SelectDropdown
                  data={MOT}
                  defaultButtonText="MOT"
                  defaultValue={rideDetail.mot}
                  renderDropdownIcon={() => (
                    <FontAwesomeIcon
                      name={IconMapping[rideDetail.mot]}
                      size={15}
                      color={Constants.black}
                    />
                  )}
                  rowStyle={{ textAlign: 'left' }}
                  buttonTextStyle={{
                    color: Constants.black,
                    fontSize: 13,
                  }}
                  // textAlign: 'left',
                  buttonStyle={{
                    backgroundColor: Constants.white,
                    width: '100%',
                    borderRadius: 25,
                  }}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setRideDetail({
                      ...rideDetail,
                      mot: selectedItem,
                    });
                  }}
                />
              </View>

              {rideDetail.mot &&
                seatAvailability[rideDetail.mot].length > 0 && (
                  <View
                    style={[
                      styles.normalField,
                      { marginTop: 10, paddingHorizontal: 10 },
                    ]}>
                    <SelectDropdown
                      data={seatAvailability[rideDetail.mot]}
                      defaultButtonText="No of people"
                      defaultValue={rideDetail.seat_avaibility}
                      renderDropdownIcon={() => (
                        <Ionicons
                          name="chevron-down"
                          size={20}
                          color={Constants.black}
                        />
                      )}
                      rowStyle={{ textAlign: 'left' }}
                      buttonTextStyle={{
                        color: Constants.black,
                        fontSize: 13,
                      }}
                      // textAlign: 'left',
                      buttonStyle={{
                        backgroundColor: Constants.white,
                        width: '100%',
                        borderRadius: 25,
                      }}
                      onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index);
                        setRideDetail({
                          ...rideDetail,
                          seat_avaibility: selectedItem,
                        });
                      }}
                    />
                  </View>
                )}
              <View
                style={[
                  styles.normalField,
                  { marginTop: 10, paddingHorizontal: 10 },
                ]}>
                <TextInput
                  placeholder="Delievery Deadline"
                  placeholderTextColor={Constants.lightgrey}
                  style={{ color: Constants.black }}
                  value={moment(rideDetail.ridechedule).format(
                    'DD/MM/YYYY hh:mm A',
                  )}
                  editable={false}
                />
                <FontAwesomeIcon
                  name="calendar"
                  size={15}
                  color={Constants.black}
                  onPress={() => setOpen(true)}
                />
                <DatePicker
                  style={{ zIndex: '50' }}
                  modal
                  open={open}
                  minimumDate={new Date()}
                  androidVariant="nativeAndroid"
                  date={itemDetails.delivery_date}
                  onConfirm={date => {
                    setOpen(false);
                    setRideDetail({ ...rideDetail, ridechedule: date });
                    setItemDetails({ ...itemDetails, delivery_date: date });
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </View>

              {/* <View style={{flexDirection: 'row', marginTop: 10}}>
                <View
                  style={[
                    styles.normalField,
                    {
                      flex: 1,
                      backgroundColor: Constants[initial],
                      color: Constants.white,
                    },
                  ]}>
                  <TextInput
                    placeholder="Schedule"
                    color={Constants.white}
                    placeholderTextColor={Constants.white}
                  />
                  <FontAwesomeIcon
                    name="calendar"
                    size={15}
                    color={Constants.white}
                  />
                </View>
                <View
                  style={[
                    styles.normalField,
                    {
                      flex: 1,
                      backgroundColor: Constants[initial],
                      justifyContent: 'center',
                    },
                  ]}>
                  <Text style={{color: Constants.white, textAlign: 'center'}}>
                    Ride Now
                  </Text>
                </View>
              </View> */}
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <TouchableOpacity
                style={[styles.swtichBtn, { width: 100 }]}
                onPress={() => payPost('ride')}>
                <Text style={{ color: Constants.white, fontSize: 13, fontFamily: 'Helvetica' }}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </BottomDrawer>

      <BottomDrawer
        initialHeight={520}
        ref={actionRef3}
        closeOnBackdropPress={false}>
        <ImageBackground
          source={require('../../Assets/Images/BG.png')}
          style={{ position: 'relative', flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[
                styles.plusBtn,
                { marginLeft: 10, backgroundColor: Constants[initial] },
              ]}
              onPress={() => {
                setVisible(false);
                setLoc({
                  location: {
                    latitude: travelPlanById.location?.coordinates[1],
                    longitude: travelPlanById.location?.coordinates[0],
                  },
                  tolocation: {
                    latitude: travelPlanById.tolocation?.coordinates[1],
                    longitude: travelPlanById.tolocation?.coordinates[0],
                  },
                });
                // actionRef3.current.hide();
                actionRef3.current.close();
                setSortRoute({});
                setFilterUser([]);
              }}>
              <Avatar.Icon
                size={30}
                style={styles.iconViewStyle}
                icon={() => (
                  <FontAwesome6 size={25} color={Constants.white} name="road" />
                )}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.plusBtn,
                { marginRight: 10, backgroundColor: Constants[initial] },
              ]}
              onPress={() => {
                // actionRef3.current.hide();
                actionRef3.current.close();
              }}>
              <Ionicons name="close" size={30} color={Constants.white} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 50,
              right: 0,
              backgroundColor: Constants.darkRed,
              borderRadius: 20,
              marginTop: 10,
              gap: 10,
              padding: 5,
              paddingHorizontal: 10,
            }}>
            <Text style={{ color: Constants.white, fontSize: 20, fontFamily: 'Helvetica' }}>
              {calculateRemainingTime(travelPlanById?.jurney_date)}
            </Text>
            <FontAwesomeIcon name="clock-o" size={20} color={Constants.white} />
          </View>
          <View
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
                  backgroundColor: Constants[initial],
                  width: 40,
                  height: 40,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              onPress={() => {
                // props.navigation.navigate('provider', {
                //   screen: 'Chat',
                // });
                const data = {
                  tolocation: travelPlanById.tolocation.coordinates,
                  location: travelPlanById.location.coordinates,
                  err_message: 'Post your package first to contact traveller',
                  type: 'chat',
                };
                packagesNearMe(data);
              }}>
              <FontAwesomeIcon
                name="envelope"
                size={25}
                color={Constants.white}
              />
            </TouchableOpacity>
          </View>
          <View
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
                  backgroundColor: Constants[initial],
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
                  tolocation: travelPlanById.tolocation.coordinates,
                  location: travelPlanById.location.coordinates,
                  err_message: 'Post your package first to contact traveller',
                  type: 'call',
                };
                packagesNearMe(data);
              }}>
              <FontAwesomeIcon name="phone" size={25} color={Constants.white} />
            </TouchableOpacity>
          </View>
          <View>
            <View style={{ marginTop: 10, paddingHorizontal: 40 }}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <View style={styles.center}>
                  {travelPlanById?.user?.profile ? (
                    <Avatar.Image
                      size={70}
                      source={{ uri: `${travelPlanById?.user?.profile}` }}
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
                <View style={[styles.center, { marginVertical: 10 }]}>
                  <Text
                    style={{
                      color: Constants.white,
                      fontSize: 24,
                      fontWeight: 700,
                    }}>
                    {travelPlanById?.user?.fullName}
                  </Text>
                </View>
                <StarRatingDisplay
                  starSize={25}
                  rating={travelPlanById?.rating || 0}
                />
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
                    borderColor: Constants[initial],
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: Constants.white,
                  }}>
                  <Text
                    style={{
                      color: Constants.black,
                      padding: 5,
                      fontWeight: '500',
                    }}>
                    {travelPlanById?.fromaddress}
                  </Text>
                  {/* <TextInput editable={false}
                    value={travelPlanById?.address}
                    placeholderTextColor={Constants.black}
                    style={{ color: Constants.black }} /> */}
                </View>
                <Text style={{ color: Constants.white, fontSize: 22, fontFamily: 'Helvetica' }}>To</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: Constants[initial],
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: Constants.white,
                  }}>
                  <Text
                    style={{
                      color: Constants.black,
                      padding: 5,
                      fontWeight: '500',
                    }}>
                    {travelPlanById?.toaddress}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                <View style={[styles.normalField, { flex: 1 }]}>
                  <Text style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                    {travelPlanById?.mot}
                  </Text>
                  <FontAwesomeIcon
                    name={IconMapping[travelPlanById.mot]}
                    size={15}
                    color={Constants.black}
                  />
                </View>
                {travelPlanById?.seat_avaibility !== 0 &&
                  travelPlanById?.seat_avaibility !== '0' && (
                    <View style={[styles.normalField, { flex: 1 }]}>
                      <Text style={{ color: Constants.black, padding: 10 }}>
                        {travelPlanById?.seat_avaibility}
                      </Text>
                      <FontAwesomeIcon
                        name={IconMapping[travelPlanById.mot]}
                        size={15}
                        color={Constants.black}
                      />
                    </View>
                  )}
              </View>

              {travelPlanById?.description !== '' && (
                <View style={{ ...styles.normalField, marginTop: 10 }}>
                  <Text style={{
                    color: Constants.black, padding: 10, fontFamily: 'Helvetica',
                  }}>
                    {travelPlanById?.description}
                  </Text>
                </View>
              )}
            </View>
            {/* {travelPlanById?.user?._id !== user._id &&  */}

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <TouchableOpacity
                style={[styles.swtichBtn, { width: 100 }]}
                onPress={() => {
                  getPackageByUser();
                  setModalVisible(true);
                  setPopupType('invite');
                }}>
                <Text style={{ color: Constants.white, fontSize: 13, fontFamily: 'Helvetica' }}>
                  Send Invite
                </Text>
              </TouchableOpacity>
            </View>
            {/* } */}
          </View>
        </ImageBackground>
      </BottomDrawer>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>Select Your Package</Text>
              <Dropdown
                itemTextStyle={{ color: Constants.black }}
                style={[styles.dropdown, { width: 300 }]}
                containerStyle={{ borderRadius: 25, overflow: 'hidden' }}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={allPackage}
                maxHeight={300}
                labelField="name"
                valueField="_id"
                placeholder="Selecy your package"
                value={selectPacakge.name}
                onChange={item => {
                  console.log(item);
                  setSelectPackage(item);
                }}
              />
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(true)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    if (selectPacakge !== '') {
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
                        source={{ uri: item?.user?.profile }}
                        style={{
                          backgroundColor:
                            item._id === sortRoute._id
                              ? Constants[initial]
                              : Constants.white,
                        }}
                      />
                      <Text
                        style={[
                          styles.textStyle,
                          {
                            color:
                              item._id === sortRoute._id
                                ? Constants[initial]
                                : Constants.white,
                            textTransform: 'capitalize',
                          },
                        ]}>
                        {item.user.fullName}
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
                    setVisible(false);
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
                    //   from: 'provider',
                    // });
                    setSortRoute({});
                    setFilterUser([]);
                  }}>
                  <Avatar.Icon
                    size={50}
                    style={styles.iconViewStyle}
                    icon={() => (
                      <FontAwesome6
                        size={25}
                        color={Constants.white}
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
                  <Avatar.Image source={{ uri: sortRoute?.user?.profile }} />
                  <TouchableOpacity
                    onPress={() => {
                      setVisible(false);
                      getTravelPlanById(sortRoute._id);
                      // actionRef3.current.show();
                      actionRef3.current.open();
                      setSortRoute({});
                      setFilterUser([]);
                    }}>
                    <Avatar.Icon
                      size={50}
                      style={styles.iconViewStyle}
                      icon={() => (
                        <FontAwesome6
                          size={25}
                          color={Constants.white}
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
                        color={Constants.white}
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


    </SafeAreaView >

  );
};

export default Home;
