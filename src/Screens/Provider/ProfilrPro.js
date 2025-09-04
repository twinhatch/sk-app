/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
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
  Touchable,
  Pressable,
  Animated,
  RefreshControl,
  Modal,
  Easing,
  Alert,
  Platform,
} from 'react-native';
import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import styles from './StyleProvider';
import Constants from '../../Helpers/constant';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-paper';
import { StatusBar } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome6Pro from 'react-native-vector-icons/FontAwesome6Pro';
import Spinner from '../../Component/Spinner';
import { Context, UserContext } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import { GetApi, Post, checkOtpStatus } from '../../Helpers/Service';
import moment from 'moment';
import ActionSheet from 'react-native-actions-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountDownTime from '../../Component/CountDownTime';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { socket } from '../../../utils';
import ConnectionCheck from '../../Component/ConnectionCheck';
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
      'Modify package plan',
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

const ProfilrPro = props => {
  const [initial, setInitial] = useContext(Context);
  const [user, setUser] = useContext(UserContext);
  const [toast, setToast] = useState('');
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
  const [refundOpen, setRefundOpen] = React.useState(false);
  const [refundOpen2, setRefundOpen2] = React.useState(false);
  const [coinSide, setCoinSide] = useState('Heads');
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [profileImage, setProfileImage] = React.useState(Constants.dummyProfile);
  const [showSupport, setShowSupport] = React.useState(false);
  const [options, setOptions] = useState([]);
  const [subOpts, setSubOpts] = useState([]);
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
      // socket.off('joinRoom');
      socket.off('join');
      socket.off('receivedstatus');
      socket.off('joinadmin');
      // socket.on('disconnect', () => {
      //   console.log('Disconnected from server');
      // });
      // socket.on('disconnect', () => {
      //   console.log('Disconnected from server');
      // });
    };
  }, []);

  const flipCoin = () => {
    const randomSide = Math.floor(Math.random() * 2);
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
      // console.log('newStatus==========>', data);
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
        // console.log(res);
        if (res) {
          setProfileData(res.data);

          AsyncStorage.setItem('profileData', JSON.stringify(res.data));
          if (type) {
            socket.emit('join', res.data._id);
            socket.emit('joinadmin');
          }
          if (res?.data?.profile) {
            setProfileImage(res.data.profile);
          }

          // if (res?.data?.refund > 0) {
          //   setRefundOpen(true)
          // }
          setUser(res.data);
          flipCoin();
          getPackage();
        } else {
          // console.log('error------>', res);

          getPackage();

          if (res.data.message !== undefined) {
            setToast(res.data.message);
          }
        }
      },
      async err => {
        const previousData = await AsyncStorage.getItem('profileData');
        if (previousData && err === 'Poor connection') {
          setProfileData(JSON.parse(previousData));
        } else {
          getPackage();
        }
        setLoading(false);
        console.log(err);
      },
    );
  };

  const cancelPackagePlan = id => {
    setLoading(true);
    Post('cancelpackage', { id }, { ...props, setInitial }).then(
      async res => {
        // setLoading(false);
        // console.log(res);
        if (res) {
          // setProfileData(res.data);
          if (selectedPackage?.connections.length > 0) {
            socket.emit('statuschanged', { con_id: selectedPackage.connections[0]._id, key: 'travelerSocket' });
          }
          getPackage();
        } else {
          // console.log('error------>', res);
          setSelectedPackage({});
          getPackage();
          if (res.data.message !== undefined) {
            setToast(res.data.message);
          }
        }
      },
      err => {
        getPackage();
        setLoading(false);
        console.log(err);
      },
    );
  };

  const cancelPlan = id => {
    setLoading(true);
    Post('canceltravelplan', { id }, { ...props, setInitial }).then(
      async res => {
        // setLoading(false);
        // console.log(res);
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
    // setLoading(true);
    GetApi('getpackagesbyuser', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        setRefreshing(false);
        console.log('getpackagesbyuser------->', res.data[0]);
        if (res) {
          setPackages(res.data);
          const data = res.data.map(f => f._id);
          // console.log('package ids-------->', data);

          // socket.on('connect', () => {
          //   console.log('hguguug', socket.id);
          // socket.emit('joinRoom', { key: 'packagerSocket', packagePlan: data, masterKey: 'packagePlan' });
          // });
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
        // console.log('gettravelplanbyuser------->', res.data[0]);
        if (res) {
          // getPackage();
          setTravelPlans(res.data);
        } else {
          // getPackage();
          // console.log('error------>', res);
          if (res.data.message !== undefined) {
            setToast(res.data.message);
          }
        }
      },
      err => {
        // getPackage();
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

  const splitAddress = str => {
    const arr = str.split(',');
    return arr[0];
  };

  const switchToTraveller = () => {
    setLoading(true);
    Post(
      'updateProfile',
      { type: 'TRAVELLER' },
      { ...props, setInitial },
    ).then(
      async res => {
        setLoading(false);
        // console.log(res);
        if (res.status) {
          await AsyncStorage.setItem('userDetail', JSON.stringify(res.data));
          setUser(res.data);
          // setProfileData(res.data);
          setInitial('traveller');
          props.navigation.replace('profiletraveller');

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

  const handleStatusUpdate = (newStatus, item) => {

    let payload = {
      status: newStatus,
      packagePlan: item?._id,
      prestatus: item.jobStatus,
    };

    if (item.connections.length > 0) {
      const data = item.connections.find(f => f.status === item.jobStatus);
      if (data) {
        payload.con_id = data._id;
      }
    }

    // console.log(payload)



    if (newStatus === 'DELIVERED' || newStatus === 'PICUPED') {

      const nwetime = moment(new Date()).format('hh:mm A');
      payload.nwetime = nwetime;

    }

    // console.log(item.connections)

    Post('updateStatus', payload).then(res => {
      // console.log(res);
      if (res.success) {

        socket.emit('statuschanged', { con_id: res.data._id, newStatus, userType: 'travellerid' });
        // console.log(`Status updated to "${newStatus}" for conn_id ${connId}`);
        if (newStatus === 'DELIVERED') {
          CameraPeacker();
        }
      } else {
        console.log('Error updating status:', res);
      }
    });
  };

  const addOpt = (opt) => {
    setOptions([opt])
    // if (!options.includes(opt)) {
    //   setOptions([...options, opt]);
    // } else {
    //   const newopt = options.filter(f => f !== opt);
    //   setOptions(newopt);
    // }
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
        // if (!query && !subQuery) {
        // }
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
          setToast('Your refund will be processed shortly');
          checkOtpStatus(false, 'refund', 2);
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
    <SafeAreaView style={[styles.container, { backgroundColor: Constants.red }]} >
      <Spinner color={'#fff'} visible={loading} />
      <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      />
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {/* <StatusBar
          backgroundColor={Constants.red}
          barStyle="light-content"
          translucent={false}
        /> */}
        <Pressable onPress={() => {
          if (isAnim) {
            // console.log('kjijijijjij');
            startAnimation();
          }
        }}>

          <View
            style={{
              flexDirection: 'row',
              // paddingHorizontal: 24,
              paddingVertical: 20,
              flex: 1,

            }}>
            <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="arrow-back"
                size={25}
                color={Constants.white}
                onPress={() => {
                  props.navigation.navigate('provider', {
                    screen: 'Home',
                  });
                }}
              />
            </View>
            <View style={[{ flex: 10 }, styles.center]}>
              <Text
                style={{ color: Constants.white, fontSize: 24, fontWeight: '700', minWidth: 200, textAlign: 'center', fontFamily: 'Helvetica' }}>
                Client Profile
              </Text>
            </View>
            <View style={[{ flex: 2 }, styles.center]}>
              <TouchableOpacity
                onPress={() => {
                  // if (Platform.OS === 'android') {
                  ConnectionCheck.isConnected().then(
                    async connect => {
                      // 
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

                }}
              >
                <Text
                  style={{
                    color: Constants.white,
                    fontSize: 15,
                    fontWeight: '700',
                    minWidth: 35,
                    textAlign: 'right',
                    fontFamily: 'Helvetica',
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              zIndex: 8,
            }}>
            {/* {profileData?.profile ? ( */}
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
                  // 
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
              {coinSide &&
                <Animated.Image

                  source={
                    { uri: profileImage }
                  }
                  onError={() => {
                    setProfileImage(Constants.dummyProfile);
                  }}
                  style={[
                    {
                      height: 100,
                      width: 100,
                      borderRadius: 50,
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
              }
            </TouchableOpacity>

          </View>
          <View
            style={[
              styles.mainBg,
              { backgroundColor: Constants.white, zIndex: 7, flex: 1, flexDirection: 'column', position: 'relative', paddingBottom: 20 },
            ]}>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                position: 'relative',
              }}>
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
                  style={[styles.plusBtn, { height: isAnim ? 40 : 30, width: isAnim ? 40 : 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
                  onPress={() => {
                    startAnimation();
                    props.navigation.navigate('Faq');
                  }}>
                  <FontAwesomeIcon name="question" size={30} color={Constants.white} />
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
                  style={[styles.plusBtn, { height: isAnim ? 40 : 30, width: isAnim ? 40 : 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
                  onPress={() => {
                    startAnimation();
                    props.navigation.navigate('Support');
                  }}>
                  <FontAwesomeIcon name="comments" size={30} color={Constants.white} />
                </TouchableOpacity>
              </Animated.View>
              <Pressable
                onBlur={() => {
                  // console.log('dfsfd')
                  startAnimation();
                }}
                onPress={() => {
                  startAnimation();
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 50,
                    width: 50,
                    position: 'absolute',
                    right: 0,
                    top: 15,
                    zIndex: 9,
                  }}
                  source={require('../../Assets/newImgs/Button-1.png')}
                />
              </Pressable>
            </View> */}

            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Pressable
                onPress={() => {
                  // if (Platform.OS === 'android') {
                  ConnectionCheck.isConnected().then(
                    async connect => {
                      // 
                      if (!connect.isInternetReachable || (connect.isInternetReachable && ((connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || (connect.type === 'cellular' && connect.details.cellularGeneration === '2g')))) {
                        Alert.alert('Poor connection.', 'Please check your internet connection and retry again', [
                          {
                            text: 'Dismiss',
                            onPress: () => {
                            },
                          },
                        ]);
                      } else {
                        setShowSupport(true)
                        getSupport()
                        startAnimation();
                        // props.navigation.navigate('Support');

                      }
                    });
                  // } else {
                  //   setShowSupport(true)
                  //   getSupport()
                  //   startAnimation();
                  // }
                }}
              >


                {/* }}> */}
                <Image
                  resizeMode="contain"
                  style={styles.supportImg}
                  source={require('../../Assets/newImgs/Button-1.png')}
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
                  color={Constants.red}
                />
                <Text
                  style={styles.userIdText}>
                  USER ID #{profileData?.userID}
                </Text>
              </View>
              <Pressable
                style={[styles.supportImg, { borderRadius: 25, backgroundColor: Constants.red, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => {
                  // if (Platform.OS === 'android') {
                  ConnectionCheck.isConnected().then(
                    async connect => {
                      // 
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
                  color={Constants.white}
                />
              </Pressable>
            </View>

            {/* packages */}


            <View
              style={{ marginTop: 20, borderRadius: 20, flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  flex: 1,
                }}>
                <TouchableOpacity
                  onPress={async () => {
                    if (profileData?.refund > 0) {
                      await checkOtpStatus(true, 'refund', 2).then(res => {
                        console.log(res, typeof res);
                        if (!res) {
                          setToast('You have reached the maximum attempts. Try again tomorrow');
                          return;
                        } else {
                          updateProfile({ paymetStatus: 'Payment Pending' });
                        }
                      });
                    } else {
                      setToast('No refund pending to process');
                    }
                  }
                  }
                  style={{
                    padding: 15,
                    backgroundColor: Constants.darkRed,
                    // flex: 2,
                    paddingHorizontal: 30,
                    borderRadius: 10,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flex: 1,

                  }}>
                  <Text
                    style={{
                      color: Constants.white,
                      textAlign: 'center',
                      fontSize: 18,
                      minWidth: 170,
                      fontFamily: 'Helvetica',
                    }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Helvetica' }}>Refund: </Text> ₹{profileData?.refund?.toFixed(2)}{' '}
                    <FontAwesome6
                      name="wallet"
                      color={Constants.white}
                      size={20}
                    />
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
                  onPress={switchToTraveller}
                  style={{
                    padding: 15,
                    backgroundColor: Constants.darkRed,
                    borderRadius: 10,
                    paddingHorizontal: 40,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: Constants.white,
                      textAlign: 'center',
                      fontSize: 18,
                      fontFamily: 'Helvetica',
                    }}>
                    Switch to Traveller{' '}
                    <FontAwesome6 name="shuffle" size={18} color={Constants.white} />
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
                    backgroundColor: Constants.darkRed,
                    borderRadius: 10,
                    paddingHorizontal: 40,
                    flex: 1,
                  }}
                  onPress={() => { props.navigation.navigate('Signin'); AsyncStorage.clear(); setInitial('Signin'); }}>
                  <Text
                    style={{
                      color: Constants.white,
                      textAlign: 'center',
                      fontSize: 18,
                      fontFamily: 'Helvetica',
                    }}>
                    LogOut{' '}
                    <FontAwesome6 name="arrow-right-from-bracket" size={18} color={Constants.white} />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.mainBg,
              { backgroundColor: Constants.white, zIndex: 7, flex: 1, flexDirection: 'column', position: 'relative', paddingBottom: 20 },
            ]}>
            <View
              style={{
                marginTop: 10,
                // backgroundColor: Constants.lightGreen,
                // borderRadius: 20,
                // padding: 20,
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
                    minWidth: 100,
                    fontFamily: 'Helvetica',
                  }}>
                  Package
                </Text>
                {packages.length > 0 &&
                  packages.map((item, idx) => (
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
                          // console.log('kjijijijjij');
                          startAnimation();
                        }
                        // actionRef.current.show();
                        // setSelectedPackage(item);
                      }}
                      style={{
                        width: '100%',
                        borderRadius: 20,
                        borderColor: Constants.green,
                        borderWidth: 2,
                        marginTop: 10,
                        padding: 10,
                      }}>
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          gap: 5,
                          alignItems: 'flex-start',
                        }}>
                        <View
                          style={{
                            flex: 2,
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

                        {item.status === 'Approved' && <View style={{ flex: 1 }}>
                          <View
                            style={{
                              backgroundColor:
                                (item?.jobStatus === 'PENDING' || item?.jobStatus === 'REJECTED' || item?.jobStatus === 'REVOKE' || item?.jobStatus === 'ACCEPT')
                                  ? Constants.parrot
                                  : item?.jobStatus === 'ACCEPTED'
                                    ? Constants.red
                                    : item?.jobStatus === 'PICKUP'
                                      ? Constants.red
                                      : item?.jobStatus === 'PICUPED'
                                        ? Constants.green
                                        : item?.jobStatus === 'DELIVER'
                                          ? Constants.green
                                          : item?.jobStatus === 'DELIVERED' &&
                                          Constants.grey,
                              borderRadius: 10,
                            }}>
                            <Text
                              onPress={() => {
                                if (item?.jobStatus === 'DELIVER') {
                                  handleStatusUpdate('DELIVERED', item);
                                }
                                if (item?.jobStatus === 'PICKUP') {
                                  handleStatusUpdate('PICUPED', item);
                                }
                              }}
                              style={{
                                color: Constants.black,
                                textAlign: 'center',
                                fontWeight: '700',
                                paddingVertical: 5,
                                fontFamily: 'Helvetica',
                              }}>
                              {(item?.jobStatus === 'PENDING' || item?.jobStatus === 'REJECTED' || item?.jobStatus === 'REVOKE' || item?.jobStatus === 'ACCEPT')
                                ? 'Waiting for traveller'
                                : item?.jobStatus === 'ACCEPTED'
                                  ? 'Pick up pending'
                                  : item?.jobStatus === 'PICKUP'
                                    // ? 'Verify pending'
                                    ? 'Confirm Pickup'
                                    : item?.jobStatus === 'PICUPED'
                                      ? 'Picked up'
                                      : item?.jobStatus === 'DELIVER'
                                        ? 'Confirm Delivery'
                                        : item?.jobStatus === 'DELIVERED' &&
                                        'Package delivered'}
                            </Text>
                          </View>
                          {item?.jobStatus === 'PICUPED' && (
                            <TouchableOpacity
                              onPress={() =>
                                // props.navigation.navigate('Track', {
                                //   plan_id: item._id,
                                // })
                                props.navigation.navigate('Track', {
                                  plan_id: item._id,
                                  to: '',
                                })
                              }
                              style={{
                                flex: 1,
                                borderColor: Constants.red,
                                borderWidth: 2,
                                backgroundColor: Constants.white,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 7,
                                borderRadius: 10,
                                marginTop: 10,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  gap: 5,
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontSize: 13,
                                    fontWeight: '700',
                                    color: Constants.red,
                                    fontFamily: 'Helvetica',
                                  }}>
                                  Track
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                          {(item?.jobStatus === 'PENDING' ||
                            item?.jobStatus === 'ACCEPT' ||
                            item?.jobStatus === 'ACCEPTED' ||
                            item?.jobStatus === 'REJECTED' || item?.jobStatus === 'REVOKE') && (
                              <TouchableOpacity
                                onPress={() => {
                                  setSelectedPackage(item);
                                  setOpenCancel(true);
                                }}
                                style={{
                                  flex: 1,
                                  backgroundColor: Constants.yellow,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: 7,
                                  borderRadius: 10,
                                  marginTop: 10,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    gap: 5,
                                    justifyContent: 'space-between',
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
                            )}
                        </View>}
                      </View>
                      {item?.jobStatus === 'PICUPED' && item.status === 'Approved' && (
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
                      {item.status !== 'Approved' && (
                        <View
                          style={{
                            width: 'auto',
                            // flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 10,
                          }}>
                          <Text style={{ color: Constants.blue, fontWeight: '700', fontFamily: 'Helvetica' }}>
                            Your package rejected by admin. Contact Support team for clarification.
                          </Text>

                        </View>
                      )}
                      {item?.open && <View style={styles.subCard}>
                        <View
                          style={{
                            flex: 3,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          <Text style={[styles.from, { color: Constants.black }]}>From</Text>
                          <Text style={[styles.from, { color: Constants.black }]}>
                            {item?.pickupaddress}
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
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                          }}>
                          <Text style={[styles.to, { color: Constants.black }]}>TO</Text>
                          <Text style={[styles.to, { color: Constants.black }]}>
                            {item?.fulldelivery_address}
                          </Text>
                        </View>
                      </View>}

                    </Pressable>
                  ))}
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
            backgroundColor: Constants.pink,
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
                { marginRight: 10, backgroundColor: Constants.red },
              ]}
              onPress={() => {
                actionRef.current.hide();
              }}>
              <Ionicons name="close" size={30} color={Constants.white} />
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
              backgroundColor: Constants.red,
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
          // Alert.alert('Modal has been closed.');
          setOpenCancel(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                Are you sure you want to cancel this package?.
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setOpenCancel(false)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    cancelPackagePlan(selectedPackage._id);
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
        visible={refundOpen}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setRefundOpen(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                Tap on edit profile and enter bank details to transfer refund amount.
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                {/* <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setOpenCancel(false)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>Ok</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    // cancelPackagePlan(selectedPackage._id);
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
        visible={refundOpen2}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setRefundOpen2(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                Transfer Refund amount to your account ?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setRefundOpen2(false)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    // cancelPackagePlan(selectedPackage._id);
                    setRefundOpen2(false);
                    setRefundOpen(true);
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
                  onPress={() => { addOpt(item.title); getSupport(item.title); }}
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
                        getSupport(item.title, que);
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
                  <Text style={styles.modalText}>Close</Text>
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

export default ProfilrPro;
