/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Animated,
  RefreshControl,
  Modal,
  Easing,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import styles from './StyleProvider';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-paper';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Spinner from '../../Component/Spinner';
import { Context, UserContext, toastContext } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import { GetApi, Post, checkOtpStatus, checkago } from '../../Helpers/Service';
import moment from 'moment';
import ActionSheet from 'react-native-actions-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountDownTime from '../../Component/CountDownTime';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import LocationDropdown from '../../Component/LocationDropdown';
import { socket } from '../../../utils';
import Charges from '../../Helpers/Charges';
import * as geolib from 'geolib';
import ConnectionCheck from '../../Component/ConnectionCheck';
import LinearGradient from 'react-native-linear-gradient';
import CameraPeacker from '../../Component/Camera';

const supportQuery = [
  {
    title: 'Track',
    icon: 'route',
    sub: [
      'Track Package',
      'Track Traveller',
      'Report lost/Damage',
    ],
  },
  {
    title: 'Payments',
    icon: 'money-bill',
    sub: [
      'Posting Charge',
      'Refund',
      'Payouts',
    ],
  },
  {
    title: 'Technical',
    icon: 'triangle-exclamation',
    sub: [
      'In app Bugs',
      'SK app Help',
      'Modify travel plan',
    ],
  },
  {
    title: 'Support',
    icon: 'headset',
    sub: [
      'General Query',
      'Report Issues',
      'Direct chat',
    ],
  },

]

const Profile = props => {
  const [initial, setInitial] = useContext(Context);
  const [user, setUser] = useContext(UserContext);
  const [toast, setToast] = useContext(toastContext);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [selectedPackage, setSelectedPackage] = useState({});
  const [travelPlans, setTravelPlans] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isAnim, setAnim] = useState(false);
  const actionRef = createRef();
  const animate = useRef(new Animated.Value(0)).current;
  const animate2 = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const [openCancelForPickedUp, setopenCancelForPickedUp] = React.useState(false);
  const [refundOpen, setRefundOpen] = React.useState(false);
  const [pendingAmount, setPendingAmount] = React.useState(0);
  const [profileImage, setProfileImage] = React.useState(Constants.dummyProfile);
  const [newLoc, setNewLoc] = useState({
    location: [],
    address: '',
  });
  const [coinSide, setCoinSide] = useState('Heads');
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [isNet, setIsNet] = useState(true);
  const [showSupport, setShowSupport] = React.useState(false);
  const [options, setOptions] = useState([]);
  const [subOpts, setSubOpts] = useState([]);
  const [pendingDeliveryItem, setPendingDeliveryItem] = useState([]);


  let total = 0;
  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        getProfile(true);

      },
    );
    const timeoutID = setInterval(() => {
      flipCoin();
    }, 7000);
    return () => {
      clearInterval(timeoutID);
      willFocusSubscription();
      socket.off('join');
      socket.off('receivedstatus');
      socket.off('joinadmin');
      // socket.on('disconnect', () => {
      //   console.log('Disconnected from server');
      // });
      // socket.off('connect', () => { });

    };
  }, []);

  const flipCoin = () => {
    Animated.timing(flipAnimation, {
      toValue: 3,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      flipAnimation.setValue(0);
    });
  };

  useEffect(() => {
    socket.on('receivedstatus', async (data) => {
      console.log('newStatus==========>', data);
      getPackage();
    });
  }, [socket]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    getProfile();
  }, []);

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

  const getProfile = (type) => {
    setLoading(true);
    GetApi('getProfile', { ...props, setInitial }).then(
      async res => {
        // setLoading(false);
        console.log(res);
        if (res) {
          setProfileData(res.data);
          setUser(res.data);
          if (res?.data?.profile) {
            setProfileImage(res.data.profile);
          }
          // if (res.data.wallet > 0) {
          //   setRefundOpen(true)
          // }
          setIsNet(true)
          AsyncStorage.setItem('profileData', JSON.stringify(res.data));
          if (type) {
            socket.emit('join', res.data._id);
            socket.emit('joinadmin');
          }
          getTravelPlan();
          getPackage()
        } else {
          getTravelPlan();
          getPackage()

          if (res.data.message !== undefined) {
            setToast(res.data.message);
          }
        }
      },
      async err => {
        const previousData = await AsyncStorage.getItem('profileData');
        if (previousData && err === 'Poor connection') {
          setIsNet(false)
          setProfileData(JSON.parse(previousData));
        } else {
          getTravelPlan();
          getPackage()
        }
        setLoading(false);
        console.log(err);
      },
    );
  };



  const cancelPlan = id => {
    setLoading(true);
    const data = { id };
    if (newLoc.address !== '' && newLoc.address !== undefined) {
      data.newLoc = newLoc;
    }
    Post('canceltravelplan', data, { ...props, setInitial }).then(
      async res => {
        // setLoading(false);
        console.log(res);
        if (res) {
          // setProfileData(res.data);
          getTravelPlan();
        } else {
          // console.log('error------>', res);
          getTravelPlan();
          if (res.data.message !== undefined) {
            setToast(res.data.message);
          }
        }
      },
      err => {
        getTravelPlan();
        setLoading(false);
        console.log(err);
      },
    );
  };

  const getPackage = () => {
    setLoading(true);
    GetApi('getconnectionbyuser', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        setRefreshing(false);
        console.log('getpackagesbyuser------->', res.data);
        if (res) {
          let totalpennding = 0;
          let pendingItem = [];
          res.data.forEach(item => {
            if (item.jobStatus !== 'DELIVERED' && item.jobStatus !== 'REVOKE' && item.jobStatus !== 'REJECTED') {
              totalpennding = totalpennding + item.total;
            }
            if (item.jobStatus === 'PICKUP' || item.jobStatus === 'PICUPED') {
              pendingItem.push(item);
            }
          });
          setPendingDeliveryItem(pendingItem);
          setPendingAmount(totalpennding);
          setPackages(res.data);
        } else {
          // console.log('error------>', res);
          if (res.data.message !== undefined) {
            setToast(res.data.message);
          }
        }
      },
      err => {
        setRefreshing(false);
        setLoading(false);
        console.log(err);
      },
    );
  };

  const getTravelPlan = () => {
    // setLoading(true);
    GetApi('gettravelplanbyuser', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('gettravelplanbyuser------->', res);
        if (res) {
          // getPackage();
          setTravelPlans(res.data);
          const data = res.data.map(f => f._id);
          console.log('package ids-------->', data);
          // socket.on('connect', () => {
          //   console.log('hguguug', socket.id);
          // socket.emit('joinRoom', { key: 'travelerSocket', travelPlan: data, masterKey: 'travelPlan' });

          //   // alert(socket.id);
          // });
        } else {
          // getPackage();
          // console.log('error------>', res);
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

  // console.log('profileData', profileData);

  const calculateRemainingTime = jurney_date => {
    const futureDate = moment(jurney_date);
    // Replace with your desired future date and time
    const now = moment();
    // Calculate the difference in milliseconds
    const timeDifference = futureDate.diff(now);
    // Convert the time difference to a duration
    const remainingTime = moment.duration(timeDifference);

    // console.log(remainingTime.days());

    return (
      <View style={{ flexDirection: 'column', gap: 2 }}>
        {remainingTime.days() > 0 && (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 11,
              fontWeight: '400',
              color: Constants.black,
              fontFamily: 'Helvetica',
            }}>{`${remainingTime.days()} days`}</Text>
        )}
        {remainingTime.days() === 0 && (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 11,
              fontWeight: '400',
              color: Constants.black,
              fontFamily: 'Helvetica',
            }}>{`${remainingTime.hours()} hrs,`}</Text>
        )}
        {remainingTime.days() === 0 && (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 11,
              fontWeight: '400',
              color: Constants.black,
              fontFamily: 'Helvetica',
            }}>{`${remainingTime.minutes()} mins`}</Text>
        )}
      </View>
    );
  };

  const switchToTraveller = () => {
    setLoading(true);
    Post(
      'updateProfile',
      { type: 'USER' },
      { ...props, setInitial },
    ).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          await AsyncStorage.setItem('userDetail', JSON.stringify(res.data));
          setUser(res.data);
          setProfileData(res.data);
          props.navigation.replace('profile');
          setInitial('provider');
          //   getTravelPlan();

          // if (res.data.type === 'USER') {
          //   setInitial('provider');
          //   props.navigation.navigate('provider', {
          //     screen: 'Home',
          //   });
          // } else {
          //   setInitial('traveller');
          //   props.navigation.navigate('traveller', {
          //     screen: 'Home',
          //   });
          // }
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

  const handleStatusUpdate = async (items, jobstatus) => {
    let payload = {
      conn_id: items?._id,
      status: jobstatus,
      packagePlan: items?.packagePlan?._id,
    };
    if (jobstatus === 'ACCEPT') {
      payload.delivery_date = items.travelPlan.estimate_time;
      if (items?.packagePlan?.newlocation && items?.packagePlan?.newlocation?.coordinates && items?.packagePlan?.newlocation?.coordinates.length > 0) {
        payload.isCanceled = 'true';
        const start = {
          latitude: items?.packagePlan.location.coordinates[1],
          longitude: items?.packagePlan.location.coordinates[0],
        };
        const end = {
          latitude: items?.packagePlan.tolocation.coordinates[1],
          longitude: items?.packagePlan.tolocation.coordinates[0],
        };
        const da = geolib.getDistance(start, end);
        const ca = geolib.convertDistance(da, 'km');
        const deliveryCharge = Charges(ca);
        payload.accepted_delivery_date = deliveryCharge.delivery_date;
      }
    }

    if (jobstatus === 'PICKUP') {
      if (items?.packagePlan?.newlocation && items?.packagePlan?.newlocation?.coordinates && items?.packagePlan?.newlocation?.coordinates.length > 0) {
        payload.isCanceled = 'true';
      }
    }
    setLoading(true);
    Post('updateStatus', payload).then(res => {
      // console.log(res);
      setLoading(false);
      if (res.success) {
        items.status = res.data.status;
        items.packagePlan.jobStatus = res.data.status;
        if (res.data.status === 'PICKUP' || res.data.status === 'DELIVER') {
          CameraPeacker();
        }
        setPackages([...packages]);
        socket.emit('statuschanged', { con_id: res.data._id, userType: 'packagerid' });
      } else {
        console.log('Error updating status:', res);
      }
    }, err => {
      setLoading(false);
      console.log(err);
    });
  };

  const checkUserPosition = () => {
    let data = {
      colors: [Constants.traveller, Constants.traveller],
    };
    if (profileData?.vault !== undefined) {
      if (profileData.vault < 5000) {
        data = {
          colors: [Constants.traveller, Constants.traveller],
        };
      } else if (profileData.vault < 10000) {
        data = {
          colors: [Constants.bronze, '#88540b', Constants.bronze, '#88540b', Constants.bronze, '#88540b'],
        };
      } else if (profileData.vault < 25000) {
        data = {
          colors: [Constants.silver, '#73787c', Constants.silver, '#73787c', Constants.silver, '#73787c'],
        };
      } else {
        data = {
          colors: ['#Fcfcba', '#bf953f', '#Fcfcba', '#b38728', '#fbf5b7', '#aa771c'],
        };
      }
    }

    return data;
  };

  const addOpt = (opt) => {
    setOptions([opt]);
  };

  const getSupport = (query, subQuery) => {
    const data = {
      support_id: `${user._id}admin`,
      userId: user._id,
      query: query || '',
      sub_query: subQuery || '',
      satisfied: true,
    };
    Post('create-support', data, { ...props, setInitial }).then(
      async res => {
        console.log(res);
        socket.emit('onsupport', `${user?._id}admin`);

      },
      err => {
        console.log(err);
      },
    );
  };

  const updateProfile = (data) => {
    setLoading(true);

    Post('updateProfile', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('res------------->', res);
        if (res.status) {
          setToast('Your wallet amount will be processed shortly');
          checkOtpStatus(false, 'wallet', 2);
          getProfile();
        } else {
          setToast(res.data.message);
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: Constants.traveller }]}>
      <Spinner color={'#fff'} visible={loading} />
      {/* <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      /> */}
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Pressable onPress={() => {
          console.log('kjijijijjij');
          if (isAnim) {
            console.log('kjijijijjij');
            startAnimation();
          }
        }}>
          <View
            style={styles.headerView}
          >
            <View style={styles.headerIconView}>
              <Ionicons
                name="arrow-back"
                size={25}
                color={Constants.black}
                onPress={() => {
                  props.navigation.navigate('traveller', {
                    screen: 'Home',
                  });
                }}
              />
            </View>
            <View style={[{ flex: 10 }, styles.center]}>
              <Text
                style={styles.headerTitleText}>
                Traveller Profile
              </Text>
            </View>
            <View style={[{ flex: 2 }, styles.center]}>
              <TouchableOpacity
                onPress={() => {
                  // if (Platform.OS === 'android') {
                  ConnectionCheck.isConnected().then(
                    async connect => {
                      // (connect.type === 'wifi' && connect.details.linkSpeed < 0.25) ||
                      if (!connect.isInternetReachable || (connect.isInternetReachable && ((connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || (connect.type === 'cellular' && connect.details.cellularGeneration === '2g')))) {
                        Alert.alert('Poor connection.', 'Please check your internet connection and retry again', [
                          {
                            text: 'Dismiss',
                            onPress: () => {
                            },
                          },
                        ]);
                      } else {
                        props.navigation.navigate('EditProfile');
                      }
                    })
                  // } else {
                  //   props.navigation.navigate('EditProfile');
                  // }
                }}
              >
                <Text
                  style={styles.editButtonText}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={styles.profileIocnView}>
            <TouchableOpacity style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              marginBottom: -40,
              marginTop: 20,
            }} onPress={() => {
              // if (Platform.OS === 'android') {
              ConnectionCheck.isConnected().then(
                async connect => {
                  // (connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || 
                  if (!connect.isInternetReachable || (connect.isInternetReachable && ((connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || (connect.type === 'cellular' && connect.details.cellularGeneration === '2g')))) {
                    Alert.alert('Poor connection.', 'Please check your internet connection and retry again', [
                      {
                        text: 'Dismiss',
                        onPress: () => {
                        },
                      },
                    ]);
                  } else {
                    props.navigation.navigate('EditProfile');
                  }
                });
              // } else {
              //   props.navigation.navigate('EditProfile');
              // }
            }}>
              <Animated.Image
                source={
                  { uri: profileImage }
                }
                onError={() => {
                  setProfileImage(Constants.dummyProfile);
                }}
                style={[
                  styles.profileIconAnimatedView,
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
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.mainBg,
              styles.mainBg2,
            ]}>
            {/* <View
              style={styles.supportButtonView}>
              <Animated.View
                style={[
                  { position: 'absolute', right: 20, top: 15 },
                  {
                    transform: [
                      { translateY: isAnim ? 10 : 0 },
                      { translateX: animate },
                    ],
                  },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.plusBtn,
                    styles.supportButton(isAnim),
                  ]}
                  onPress={() => {
                    startAnimation();
                    props.navigation.navigate('Faq');
                  }}>
                  <FontAwesomeIcon
                    name="question"
                    size={30}
                    color={Constants.black}
                  />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[
                  { position: 'absolute', right: 20, top: 15 },
                  {
                    transform: [
                      { translateX: isAnim ? -10 : 0 },
                      { translateY: animate2 },
                    ],
                  },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.plusBtn,
                    styles.supportButton(isAnim),
                  ]}
                  onPress={() => {
                    startAnimation();
                    props.navigation.navigate('Support');
                  }}>
                  <FontAwesomeIcon
                    name="comments"
                    size={30}
                    color={Constants.black}
                  />
                </TouchableOpacity>
              </Animated.View>
              <Pressable
                onPress={() => {
                  startAnimation();
                }}>
                <Image
                  resizeMode="contain"
                  style={styles.supportImg}
                  source={require('../../Assets/newImgs/Button.png')}
                />
              </Pressable>
            </View> */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Pressable
                onPress={() => {
                  // if (Platform.OS === 'android') {
                  ConnectionCheck.isConnected().then(
                    async connect => {
                      // (connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || 
                      if (!connect.isInternetReachable || (connect.isInternetReachable && ((connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || (connect.type === 'cellular' && connect.details.cellularGeneration === '2g')))) {
                        Alert.alert('Poor connection.', 'Please check your internet connection and retry again', [
                          {
                            text: 'Dismiss',
                            onPress: () => {
                            },
                          },
                        ]);
                      } else {
                        startAnimation();
                        getSupport();
                        setShowSupport(true);
                        // props.navigation.navigate('Support');
                      }
                    });
                  // } else {
                  //   startAnimation();
                  //   getSupport();
                  //   setShowSupport(true);
                  // }
                }}
              >
                <Image
                  resizeMode="contain"
                  style={styles.supportImg}
                  source={require('../../Assets/newImgs/Button.png')}
                />
              </Pressable>
              <View
                style={styles.userNameView}>
                <Text
                  style={styles.userNameText}>
                  {profileData?.fullName}
                </Text>
                <StarRatingDisplay
                  starSize={25}
                  rating={profileData?.rating || 0}
                  enableHalfStar={true}
                />
                <Text
                  style={styles.userIdText}>
                  USER ID #{profileData?.userID}
                </Text>
              </View>
              <Pressable
                style={[styles.supportImg, { borderRadius: 25, backgroundColor: Constants.yellow, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => {
                  // if (Platform.OS === 'android') {
                  ConnectionCheck.isConnected().then(
                    async connect => {
                      // (connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || 
                      if (!connect.isInternetReachable || (connect.isInternetReachable && ((connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || (connect.type === 'cellular' && connect.details.cellularGeneration === '2g')))) {
                        Alert.alert('Poor connection.', 'Please check your internet connection and retry again', [
                          {
                            text: 'Dismiss',
                            onPress: () => {
                            },
                          },
                        ]);
                      } else {
                        startAnimation();
                        props.navigation.navigate('Faq');

                      }
                    });
                  // } else {
                  //   startAnimation();
                  //   props.navigation.navigate('Faq');
                  // }

                }}
              >
                <FontAwesomeIcon

                  name="question"
                  size={30}
                  color={Constants.black}
                />
              </Pressable>
            </View>


            {/* travell plan */}


            {/* package plan */}


            <View
              style={{ marginTop: 20, borderRadius: 20, flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <TouchableOpacity
                  onPress={async () => {
                    if (profileData?.wallet > 0) {
                      await checkOtpStatus(true, 'wallet', 2).then(res => {
                        console.log(res, typeof res);
                        if (!res) {
                          setToast('You have reached the maximum attempts. Try again tomorrow');
                          return;
                        } else {
                          if (pendingDeliveryItem.length > 0) {
                            setToast('Complete all deliveries to transfer wallet amount to your UPI');
                          } else {
                            updateProfile({ paymetStatus: 'Payment Pending' });
                          }
                        }
                      });
                    } else {
                      setToast('No wallet amount pending to process');
                    }
                  }}

                  style={{
                    padding: 15,
                    backgroundColor: Constants.traveller,
                    flex: 1,
                    borderRadius: 10,

                  }}>
                  <Text
                    style={{
                      color: Constants.black,
                      textAlign: 'center',
                      fontSize: 16,
                      fontFamily: 'Helvetica',
                    }}>
                    ₹ {profileData?.wallet?.toFixed(2) || 0}{' '}
                    <FontAwesome6
                      name="wallet"
                      color={Constants.black}
                      size={20}
                    />
                  </Text>
                  {/* <Ionicons /> */}
                </TouchableOpacity>
                <LinearGradient
                  colors={checkUserPosition().colors}
                  start={{ x: 0, y: 1.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{
                    padding: 12,
                    backgroundColor: checkUserPosition().colors[1],
                    flex: 1,
                    borderRadius: 8,
                    borderWidth: 3,
                    borderColor: checkUserPosition().colors[1],
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (profileData.vault < 5000) {
                        setToast(`Earn ${5000 - profileData.vault} points to become bronze member.`);
                      } else if (profileData.vault < 10000) {
                        setToast(`Earn ${10000 - profileData.vault} points to become silver member.`);
                      } else if (profileData.vault < 25000) {
                        setToast(`Earn ${25000 - profileData.vault} points to become gold member.`);
                      }
                    }
                    }
                  >
                    <Text
                      style={{
                        color: Constants.black,
                        fontSize: 16,
                        textAlign: 'center',
                        fontFamily: 'Helvetica',
                      }}>
                      {profileData?.vault?.toFixed(2) || 0} {' '}
                      <FontAwesome6
                        name="coins"
                        color={Constants.black}
                        size={20}
                      />
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={{
                    padding: 15,
                    backgroundColor: Constants.traveller,
                    flex: 1,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: Constants.black,
                      textAlign: 'center',
                      fontSize: 16,
                      fontFamily: 'Helvetica',
                    }}>
                    Pending Deliveries  ₹ {pendingAmount?.toFixed(2) || 0}{' '}
                    <FontAwesome6
                      name="wallet"
                      color={Constants.black}
                      size={20}
                    />
                  </Text>
                  {/* <Ionicons /> */}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,

                }}>
                <TouchableOpacity
                  onPress={switchToTraveller}
                  style={{
                    padding: 15,
                    backgroundColor: Constants.traveller,
                    borderRadius: 10,
                    paddingHorizontal: 40,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: Constants.black,
                      textAlign: 'center',
                      fontSize: 16,
                      fontFamily: 'Helvetica',
                    }}>
                    Switch to Provider{' '}
                    <FontAwesome6 name="shuffle" size={18} color={Constants.black} />
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  flex: 1,
                }}>
                <TouchableOpacity
                  style={{
                    padding: 15,
                    backgroundColor: Constants.traveller,
                    borderRadius: 10,
                    paddingHorizontal: 40,
                    flex: 1,
                  }}
                  onPress={() => {
                    props.navigation.navigate('Signin');
                    AsyncStorage.clear();
                    setInitial('Signin');
                  }}>
                  <Text
                    style={{
                      color: Constants.black,
                      textAlign: 'center',
                      fontSize: 16,
                      fontFamily: 'Helvetica',
                    }}>
                    LogOut {' '}
                    <FontAwesome6 name="arrow-right-from-bracket" size={18} color={Constants.black} />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.mainBg,
              styles.mainBg2,
            ]}>
            <View
              style={styles.travelPlanView}>
              <Text
                style={styles.travelPlanTitleText}>
                Travel Plans
              </Text>
              {travelPlans.length > 0 &&
                travelPlans.map((item, idx) => (
                  <Pressable
                    key={idx}
                    style={styles.travelPlanCard}>
                    <View style={styles.travelPlanCardView}>
                      <View
                        style={styles.fromAddressView}>
                        <Text
                          style={styles.feomAddressText}>
                          {item?.fromaddress}
                        </Text>
                      </View>

                      <View
                        style={styles.toAddressView}>
                        <Text
                          style={styles.feomAddressText}>
                          To
                        </Text>
                      </View>

                      <View
                        style={styles.fromAddressView}>
                        <Text
                          style={styles.feomAddressText}>
                          {item?.toaddress}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        gap: 10,
                        marginTop: 10,
                      }}>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          backgroundColor: Constants.yellow,
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 7,
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{ color: Constants.black, fontWeight: '700', fontFamily: 'Helvetica' }}>
                          {item?.checkValue ? ' Arriving in' : new Date().getTime() < new Date(item?.estimate_time).getTime() ? ' Departing in' : 'Arrived'}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'center',
                          }}>
                          {new Date().getTime() < new Date(item?.jurney_date).getTime() && <CountDownTime
                            show={true}
                            startDate={item?.jurney_date}
                            checkValue={value => {
                              if (value === true && item.checkValue !== true) {
                                item.checkValue = true;
                                setTravelPlans([...travelPlans]);
                              }
                            }}
                          />}
                          {new Date().getTime() > new Date(item?.jurney_date).getTime() &&
                            new Date().getTime() < new Date(item?.estimate_time).getTime() && <CountDownTime
                              show={true}
                              startDate={
                                item?.estimate_time
                              }
                              checkValue={value => {
                              }}
                            />}
                          {
                            new Date().getTime() > new Date(item?.estimate_time).getTime() &&
                            <Text style={{ color: Constants.black, fontWeight: '700', fontFamily: 'Helvetica' }}>{checkago(item?.estimate_time)}</Text>}
                          <Image
                            style={{ height: 20, width: 20 }}
                            source={require('../../Assets/newImgs/clock.png')}
                          />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          // cancelPlan(item._id);
                          setSelectedPackage(item);
                          if (item.connections.length > 0) {
                            setopenCancelForPickedUp(true);
                          } else {
                            setOpenCancel(true);
                          }
                          if (isAnim) {
                            console.log('kjijijijjij');
                            startAnimation();
                          }

                        }}
                        style={{
                          flex: 1,
                          backgroundColor: Constants.yellow,
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 7,
                          borderRadius: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 13,
                              fontWeight: '400',
                              color: Constants.black,
                              fontFamily: 'Helvetica',
                            }}>
                            Cancel
                          </Text>

                          <Ionicons
                            name="close"
                            size={25}
                            color={Constants.black}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                ))}
            </View>

          </View>

          <View
            style={[
              styles.mainBg,
              styles.mainBg2,
            ]}>
            <View
              style={{
                // backgroundColor: Constants.lightGreen,
                // marginTop: 20,
                // borderRadius: 20,
                padding: 20,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '700',
                    color: Constants.black,
                    fontFamily: 'Helvetica',
                  }}>
                  Package
                </Text>
                {packages.length > 0 &&
                  packages.map((items, idx) => {
                    let item = items.packagePlan;

                    return (
                      <Pressable
                        key={idx}
                        onPress={() => {
                          if (!item.open) {
                            item.open = true;
                          } else {
                            item.open = false;
                          }
                          setPackages([...packages]);
                          if (isAnim) {
                            console.log('kjijijijjij');
                            startAnimation();
                          }
                        }}
                        style={{
                          width: '100%',
                          borderRadius: 20,
                          borderColor: Constants.green,
                          borderWidth: 2,
                          marginTop: 20,
                          padding: 10,
                        }}>
                        <View
                          key={idx}
                          style={{
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'center',
                          }}>
                          <View style={{ flex: 2 }}>
                            <View
                              style={{

                                flexDirection: 'row',
                                justifyContent: 'center',
                              }}>
                              <View
                                style={{
                                  height: 50,
                                  width: 50,
                                  backgroundColor: Constants.white,
                                  borderRadius: 50,
                                }}>
                                {item?.item_image ? (
                                  <Image
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      borderRadius: 50,
                                    }}
                                    source={{ uri: `${item?.item_image}` }}
                                  />
                                ) : (
                                  <Image
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                    }}
                                    source={require('../../Assets/Images/chat.png')}
                                  />
                                )}
                              </View>
                              <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: Constants.black,
                                    fontFamily: 'Helvetica',
                                  }}>
                                  {item?.user?.fullName}
                                </Text>
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    fontSize: 15,
                                    fontWeight: '400',
                                    color: Constants.black,
                                    fontFamily: 'Helvetica',
                                  }}>
                                  {item?.name}
                                </Text>
                              </View>


                            </View>
                            {(item?.jobStatus === 'PICUPED' || item?.jobStatus === 'DELIVER') && (
                              <View
                                style={{
                                  width: 'auto',
                                  // flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: 10,
                                }}>
                                <Text style={{ color: Constants.black, fontWeight: '700', fontFamily: 'Helvetica' }}>
                                  Reaching In
                                </Text>
                                <View
                                  style={{
                                    width: 'auto',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 5,
                                    backgroundColor: Constants.parrot,
                                    borderRadius: 10,
                                    padding: 10,
                                  }}>
                                  <CountDownTime
                                    show={true}
                                    startDate={item?.accepted_delivery_date}
                                    checkValue={() => { }}
                                  />
                                  <FontAwesomeIcon
                                    name="clock-o"
                                    size={15}
                                    color={Constants.black}
                                  />
                                </View>
                              </View>
                            )}

                          </View>




                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            {item?.jobStatus === 'PICUPED' && item?.active && (
                              <TouchableOpacity
                                onPress={() => {
                                  handleStatusUpdate(items, 'DELIVER');
                                  if (isAnim) {
                                    console.log('kjijijijjij');
                                    startAnimation();
                                  }
                                }}
                                style={{
                                  backgroundColor: Constants.green,
                                  borderRadius: 5,
                                  marginBottom: 10,
                                }}>
                                <Text
                                  style={{
                                    color: Constants.black,
                                    textAlign: 'center',
                                    fontWeight: '700',
                                    paddingVertical: 5,
                                    fontFamily: 'Helvetica',
                                  }}>
                                  Item Deliver
                                </Text>
                              </TouchableOpacity>
                            )}
                            {!item?.active && (
                              <TouchableOpacity
                                onPress={() => {
                                  // handleStatusUpdate(items);
                                  if (isAnim) {
                                    console.log('kjijijijjij');
                                    startAnimation();
                                  }
                                }}
                                style={{
                                  backgroundColor: Constants.red,
                                  borderRadius: 5,
                                  marginBottom: 10,
                                }}>
                                <Text
                                  style={{
                                    color: Constants.white,
                                    textAlign: 'center',
                                    fontWeight: '700',
                                    paddingVertical: 5,
                                    fontFamily: 'Helvetica',
                                  }}>
                                  Package Cancelled
                                </Text>
                              </TouchableOpacity>
                            )}
                            {item?.active &&
                              <View
                                style={{
                                  backgroundColor:
                                    item?.jobStatus === 'ACCEPTED'
                                      ? Constants.parrot
                                      : item?.jobStatus === 'PICKUP'
                                        ? Constants.red
                                        : item?.jobStatus === 'REVOKE'
                                          ? Constants.red
                                          : item?.jobStatus === 'PICUPED'
                                            ? Constants.yellow
                                            : item?.jobStatus === 'DELIVER'
                                              ? Constants.green
                                              : item?.jobStatus === 'DELIVERED' &&
                                              Constants.green,
                                  borderRadius: 5,
                                  paddingHorizontal: 5,
                                }}>
                                <Text
                                  style={{
                                    color: Constants.black,
                                    textAlign: 'center',
                                    fontWeight: '700',
                                    paddingVertical: 5,
                                    fontFamily: 'Helvetica',
                                  }}
                                  onPress={() => {
                                    if (item?.jobStatus === 'ACCEPTED') {
                                      handleStatusUpdate(items, 'PICKUP');
                                      if (isAnim) {
                                        console.log('kjijijijjij');
                                        startAnimation();
                                      }
                                    }

                                  }}
                                >
                                  {item?.jobStatus === 'ACCEPTED'
                                    ? 'Pickup'
                                    : item?.jobStatus === 'PICKUP'
                                      ? 'Verify pending'
                                      : item?.jobStatus === 'PICUPED'
                                        ? 'Picked up'
                                        : item?.jobStatus === 'DELIVER'
                                          ? 'Pending Confirmation'
                                          : item?.jobStatus === 'REVOKE'
                                            ? 'Cancelled Travel Plan'
                                            : item?.jobStatus === 'DELIVERED' &&
                                            'Package delivered'}
                                </Text>
                              </View>}

                            {item?.jobStatus !== 'PENDING' && item?.jobStatus !== 'REVOKE' && item?.jobStatus !== 'CONNECTED' && item?.jobStatus !== 'ACCEPT' && item?.jobStatus !== 'REJECTED' && item?.jobStatus !== 'DELIVERED' && item?.jobStatus !== 'CANCELED' && (
                              <TouchableOpacity
                                onPress={async () => {
                                  let latlng = {
                                    latitude: item?.location?.coordinates[1], longitude: item?.location?.coordinates[0],
                                  };
                                  if (item?.newlocation?.length > 0) {
                                    latlng = { latitude: item?.newlocation?.coordinates[1], longitude: item?.newlocation?.coordinates[0] };
                                  }
                                  if (item?.jobStatus === 'PICUPED' || item?.jobStatus === 'DELIVER') {
                                    latlng = {
                                      zoom: 15,
                                      query: 'San Francisco',
                                      latitude: item?.tolocation?.coordinates[1], longitude: item?.tolocation?.coordinates[0],
                                    };
                                  }
                                  Linking.openURL(`http://maps.google.com/maps?q=${latlng.latitude},${latlng.longitude}`).catch(err => console.error('An error occurred', err));
                                  // openMap(latlng);
                                }}
                                style={{ alignSelf: 'flex-end', marginTop: 10 }}>
                                <Image style={{ height: 40, width: 40 }} source={require('../../Assets/newImgs/google-maps.png')} />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>

                        {item?.open && (
                          <View style={styles.subCard}>
                            <View
                              style={{
                                flex: 3,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                              }}>
                              <Text style={styles.from}>From</Text>
                              <Text style={styles.from}>{item?.pickupaddress}</Text>
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
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text style={styles.to}>TO</Text>
                              <Text style={styles.to}>
                                {item?.fulldelivery_address}
                              </Text>
                            </View>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
              </View>
            </View>
          </View>
        </Pressable>
      </ScrollView>
      <ActionSheet
        ref={actionRef}
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        <View
          style={{
            backgroundColor: Constants.lightTraveller,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <Text
            style={{
              color: Constants.blue,
              textAlign: 'center',
              fontSize: 12,
              marginTop: 10,
              fontFamily: 'Helvetica',
            }}></Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={[
                styles.plusBtn,
                { marginRight: 10, backgroundColor: Constants.traveller },
              ]}
              onPress={() => {
                actionRef.current.hide();
              }}>
              <Ionicons name="close" size={30} color={Constants.black} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              marginVertical: 5,
              fontSize: 29,
              fontWeight: '800',
              color: Constants.black,
              textAlign: 'center',
              fontFamily: 'Helvetica',
            }}>
            Adddress Information
          </Text>
          <View
            style={{
              marginHorizontal: 10,
              marginTop: 10,
              flexDirection: 'column',
              gap: 10,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              backgroundColor: Constants.traveller,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <View
              style={{
                width: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Constants.white,
                borderRadius: 50,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: '600',
                  color: Constants.black,
                  fontFamily: 'Helvetica',
                }}>
                {selectedPackage?.address}
              </Text>
            </View>

            <View style={{}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: '600',
                  color: Constants.white,
                  fontFamily: 'Helvetica',
                }}>
                TO
              </Text>
            </View>

            <View
              style={{
                width: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Constants.white,
                borderRadius: 50,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: '600',
                  color: Constants.black,
                  fontFamily: 'Helvetica',
                }}>
                {selectedPackage?.delivery_address}
              </Text>
            </View>
          </View>
        </View>
      </ActionSheet>
      <Modal
        animationType="none"
        transparent={true}
        visible={openCancel}
        onRequestClose={() => {
          setOpenCancel(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                Are you sure you want to cancel this travel plan?.
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setOpenCancel(false); if (isAnim) {
                      console.log('kjijijijjij');
                      startAnimation();
                    }
                  }}
                  style={styles.cancelButtonStyle}>
                  <Text style={[styles.modalText, { color: Constants.white }]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    cancelPlan(selectedPackage._id);
                    setOpenCancel(false);
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={openCancelForPickedUp}
        onRequestClose={() => {
          setopenCancelForPickedUp(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center', position: 'relative' }}>
              <Text style={styles.textStyle}>
                Are you sure you want to cancel this travel plan?.
              </Text>

              <Text style={styles.textStyle}>
                If yes, Please provide package pickup location...
              </Text>
              <View style={[styles.startField, { marginTop: 10 }]}>
                <LocationDropdown
                  value={newLoc.address}
                  focus={true}
                  setIsFocus={() => { }}
                  placeholder="Package Pickup Location"
                  getLocationVaue={(lat, add) => {
                    const data = {
                      address: add,
                      location: [lat.lng, lat.lat],
                    };
                    console.log(data);
                    setNewLoc(data);
                  }}
                  listMargin={1}
                />
              </View>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setopenCancelForPickedUp(false)}
                  style={styles.cancelButtonStyle}>
                  <Text style={[styles.modalText, { color: Constants.white }]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    if (newLoc.location.length > 0) {
                      cancelPlan(selectedPackage._id);
                      setopenCancelForPickedUp(false);
                    } else {
                      setToast('Please select address from list and then try again');
                    }
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={refundOpen}
        onRequestClose={() => {
          setRefundOpen(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                Tap on edit profile and enter bank details to transfer wallet amount.
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setRefundOpen(false);
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={showSupport}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setShowSupport(false);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, {
            padding: 20,
          }]}>
            <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[styles.textStyle, { fontSize: 22, marginBottom: 20 }]}>
                Support
              </Text>
              <Image source={require('../../Assets/newImgs/sklogo.png')} style={{ height: 100, width: 100, borderRadius: 20 }} />
              {/* <Text style={styles.textStyle}>
                SK
              </Text> */}
              <Text style={[styles.textStyle, { marginTop: 10 }]}>
                Select the option that best describes the subject of your query.</Text>

              <View style={[styles.cancelAndLogoutButtonWrapStyle, { gap: 5, flexWrap: 'wrap' }]}>
                {supportQuery.map((item, i) => (<TouchableOpacity key={i}
                  activeOpacity={0.9}
                  onPress={() => { addOpt(item.title); getSupport(item.title) }}
                  style={[styles.supportOptButton, { width: 150, backgroundColor: options.includes(item.title) ? Constants.pink : Constants.white }]}>
                  <FontAwesome6 name={item.icon} size={16} color={options.includes(item.title) ? Constants.black : Constants.black} />
                  <Text style={[styles.modalText, { color: options.includes(item.title) ? Constants.black : Constants.black }]}>  {item.title}</Text>
                </TouchableOpacity>))}
              </View>
              {/* , borderColor: options.includes(item.title) ? Constants.red : Constants.grey */}

              {supportQuery.map((item, i) => (
                <View key={i} style={{ marginTop: 10, display: options.includes(item.title) ? 'flex' : 'none' }}>
                  <Text style={[styles.textStyle, { marginTop: 10, color: Constants.red }]}>{item?.title}</Text>
                  <View style={[styles.cancelAndLogoutButtonWrapStyle, { gap: 5, marginTop: 5, flexWrap: 'wrap' }]}>
                    {item.sub.map((que, idx) => (<TouchableOpacity key={idx}
                      activeOpacity={0.9}
                      onPress={async () => {
                        setSubOpts([que]);
                        setShowSupport(false);
                        startAnimation();
                        getSupport(item.title, que)
                        setTimeout(() => {
                          setOptions([]);
                          setSubOpts([]);
                        }, 1000);
                        props.navigation.navigate('Support');
                      }}
                      style={[styles.supportOptButton, { minWidth: 150, flex: 0, justifyContent: 'center', backgroundColor: subOpts.includes(que) ? Constants.pink : Constants.white }]}>
                      <Text style={[styles.modalText, { color: subOpts.includes(que) ? Constants.black : Constants.black }]}>{que}</Text>
                    </TouchableOpacity>))}
                  </View>
                </View>))}

              <Text style={[styles.textStyle, { marginTop: 10, fontSize: 14 }]}>Welcome to SK app support. We use your queries and feedback to continually enhance our service and improve your experience.</Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setShowSupport(false)}
                  style={styles.cancelButtonStyle}>
                  <Text style={[styles.modalText, { color: Constants.white }]}>Close</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setShowSupport(false);
                    startAnimation();
                    props.navigation.navigate('Support');
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Continue</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
};

export default Profile;
