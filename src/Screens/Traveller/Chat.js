/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-dupe-keys */
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  AppState,
  ImageBackground,
  TextInput,
  Easing,
  Animated,
  Linking,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './StyleProvider';
import Constants from '../../Helpers/constant';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { socket } from '../../../utils';
import { Context, UserContext, toastContext } from '../../../App';
import { Post } from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import CustomToaster from '../../Component/CustomToaster';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GetApi } from '../../Helpers/Service';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCurrentLocation from '../../Component/CustomCurrentLocation';
import DeviceInfo from 'react-native-device-info';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { LogLevel, OneSignal } from 'react-native-onesignal';
// import openMap, { createMapLink, createOpenLink } from 'react-native-open-maps';
import Charges from '../../Helpers/Charges';
import * as geolib from 'geolib';
import CuurentLocation from '../../Component/CuurentLocation';
// import getDirections from 'react-native-google-maps-directions';
import CameraPeacker from '../../Component/Camera';


const Chat = props => {
  const route = useRoute();

  const locationId = route.params.locationId;

  const [initial, setInitial] = useContext(Context);
  const [toast, setToast] = useContext(toastContext);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [notificationDetails, setNotificationDetails] = useState({});
  // const [nearmePackage, setNearmePackage] = useState([])
  const [packages, setPackages] = useState([]);
  const [status, setStatus] = useState('');
  const [chatFetched, setChatFetched] = useState(false);
  const [connection, setConnection] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [userId, setUserId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [coinSide, setCoinSide] = useState('Heads');
  const flipAnimation = useRef(new Animated.Value(0)).current;

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

  // useEffect(() => {
  //   socket.emit('joinRoom', { user, key: 'travelerSocket', userkey: 'travellerid' });
  // }, [user]);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        getUserData();
        flipCoin();
        if (locationId) {
          socket.emit('join', locationId);
          // socket.emit('joinRoom', { user, key: 'travelerSocket', userkey: 'travellerid', locationId });
          fetchNotificationData(locationId);
        }
      },
    );
    // OneSignal.Notifications.addEventListener('foregroundWillDisplay', async (event) => {
    //   // console.log(event)
    //   let notification = event.getNotification();
    //   const customData = notification.additionalData;
    //   // console.log('Custom Data:', customData);
    //   if (customData !== undefined && customData?.type !== undefined && customData?.type === 'status') {
    //     fetchNotificationData(locationId);
    //   }
    // });
    const timeoutID = setInterval(() => {
      flipCoin();
    }, 7000);

    return () => {
      willFocusSubscription();
      clearInterval(timeoutID);
      socket.off('join');
      // socket.off('allmessages');
      // socket.off('messages');
      // socket.off('receivedstatus');
      // return () => {
      //   socket.off('join');
      //   socket.off('allmessages');
      //   socket.off('messages');
      //   socket.off('receivedstatus');
      //   // socket.on('disconnect', () => {
      //   //   console.log('Disconnected from server');
      //   // });
      // };

    };
  }, []);


  useEffect(() => {


    socket.on('error', error => {
      console.error('Socket.io Error:', error);
    });
    socket.on('allmessages', async (message) => {
      console.log('mymessage==========>', message[0]);
      if (message.length > 0) {
        setMessages(message);
      }
    });
    socket.on('messages', message => {
      if (message.length > 0) {
        setMessages(message);
      }
    });
    socket.on('joined-user', data => {
      console.log(`new user joind --------------> ${data}`)
    });

    socket.on('receivedstatus', async (data) => {
      console.log('newStatus==========>', data);
      setStatus(data.newStatus);
      if (data.newStatus === 'REJECTED') {
        setTimeout(() => {
          props.navigation.replace('traveller', { screen: 'Traveluser' })
        }, 1000);
      }
    });


    return () => {
      socket.off('allmessages');
      socket.off('messages');
      socket.off('receivedstatus');
    };
  }, [socket]);

  // useEffect(() => {
  //   if (notificationDetails) {
  //     getChat();
  //   }
  // }, [notificationDetails, socket]);



  const fetchNotificationData = async id => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('conectionId', id);
      const response = await GetApi(`getconnection/${id}`);
      console.log(response);
      if (response) {
        setNotificationDetails(response.data);
        // connectionPlan(response.data.travelPlan?._id);
        // console.log(response.data?.status)
        console.log('satus===>', response.data?.status);
        console.log('satus===>', response.data?.status);
        console.log('satus===>', response.data?.status);
        console.log('satus===>', response.data?.status);
        setStatus(response.data?.status);
        getChat(response.data);
        setRefreshing(false);
      } else {
        setRefreshing(false);
        // console.log('Error fetching notification details:', response);
      }
    } catch (error) {
      setRefreshing(false);
      console.log('Error fetching notification details:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (locationId) {
      fetchNotificationData(locationId);
    }
  }, []);

  const connectionPlan = async id => {
    setLoading(true);
    try {
      const response = await GetApi(`getconnectionbyplan/${id}`);
      if (response) {
        setConnection(response.data);
        getChat();
      } else {
        setRefreshing(false);
        // console.log('Error fetching notification details:', response);
      }
    } catch (error) {
      setRefreshing(false);
      console.log('Error fetching notification details:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleConnectionClick = id => {
    fetchNotificationData(id);
  };

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userDetail');
      if (userData) {
        const userDatas = JSON.parse(userData);
        if (userDatas && userDatas._id) {
          setUserId(userDatas._id);
        } else {
          console.log('User data is missing _id field.');
        }
      } else {
        console.log('User data not found in local storage.');
      }
    } catch (error) {
      console.error('Error retrieving user data from local storage:', error);
    }
  };

  const getChat = (noti) => {
    const payloads = {
      receiver: noti?.packagerid?._id,
      message: newMessage,
      connection: noti?._id,
      sender: noti?.travellerid?._id,
    };
    socket.emit('getMessages', payloads);
  };

  const createChat = message => {
    const payloads = {
      receiver: notificationDetails?.packagerid?._id,
      message: newMessage,
      connection: notificationDetails?._id,
      sender: notificationDetails?.travellerid?._id,
      key: 'packagerSocket',
    };

    socket.emit('createMessage', payloads);
    setNewMessage('');
  };

  const getDistance = () => {
    const start = {
      latitude: notificationDetails?.packagePlan.location.coordinates[1],
      longitude: notificationDetails?.packagePlan.location.coordinates[0],
    };
    const end = {
      latitude: notificationDetails?.packagePlan.tolocation.coordinates[1],
      longitude: notificationDetails?.packagePlan.tolocation.coordinates[0],
    };
    const da = geolib.getDistance(start, end);
    const ca = geolib.convertDistance(da, 'km');
    console.log(da, ca);
    return ca;
  };


  const handleStatusUpdate = async (newStatus, location, add) => {
    // setStatus(newStatus);
    let payload = {
      conn_id: notificationDetails?._id,
      status: newStatus,
      packagePlan: notificationDetails?.packagePlan?._id,
      travelPlan: notificationDetails?.travelPlan?._id,
    };
    if (newStatus === 'ACCEPT') {
      payload.delivery_date = notificationDetails.travelPlan.estimate_time;
      if (notificationDetails?.packagePlan?.newlocation && notificationDetails?.packagePlan?.newlocation?.coordinates && notificationDetails?.packagePlan?.newlocation?.coordinates.length > 0) {
        payload.isCanceled = 'true';
        const deliveryCharge = Charges(getDistance());
        payload.accepted_delivery_date = deliveryCharge.delivery_date;
      }
    }

    if (newStatus === 'PICKUP') {

      if (notificationDetails?.packagePlan?.newlocation && notificationDetails?.packagePlan?.newlocation?.coordinates && notificationDetails?.packagePlan?.newlocation?.coordinates.length > 0) {
        payload.isCanceled = 'true';
      }
    }

    if (location !== undefined && location !== null) {
      payload.track = [location.coords.longitude, location.coords.latitude];
      payload.token = await DeviceInfo.getAndroidId();
      // payload.address = add[0].formatted_address;

    }

    console.log(payload);

    Post('updateStatus', payload).then(res => {
      // console.log(res);
      if (res.success) {
        setStatus(newStatus);
        if (res.success) {
          if (payload.isCanceled && newStatus === 'ACCEPT') {
            setStatus('ACCEPTED');
          }
          if (newStatus === 'PICKUP' || newStatus === 'DELIVER') {
            if (payload.isCanceled) {
              setStatus('PICUPED');
            }
            CameraPeacker();
          }
          if (newStatus === 'REJECTED') {
            props.navigation.replace('traveller', { screen: 'Traveluser' });
          } else {
            socket.emit('statuschanged', { con_id: res.data._id, newStatus: res.data.status, key: 'packagerSocket', userType: 'packagerid' });
          }
        } else {
          setToast(res.message);
          if (res.connection._id) {
          } else {
            setToast(res.message);
            props.navigation.replace('traveller', { screen: 'Traveluser' });
          }
        }

      } else {
        console.log('Error updating status:', res);
      }
    });
  };

  const handleAccept = () => {
    // handleStatusUpdate('ACCEPT');
    CuurentLocation(getLocation);
  };
  const getLocation = (res) => {
    handleStatusUpdate('ACCEPT', res);
  };

  const handleReject = () => {
    handleStatusUpdate('REJECTED');
  };

  const handlePickup = (type) => {
    if (type === 'DELIVER') {
      handleStatusUpdate('DELIVER');
      return;
    }
    handleStatusUpdate('PICKUP');
    // CustomCurrentLocation(getLocation);
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
      return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
    } else {
      return '0 min';
    }
  };

  const getPackage = () => {
    setLoading(true);
    GetApi('getpackagesbyuser', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        if (res) {
          setPackages(res.data);
        } else {
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
  useEffect(() => {
    getPackage();
  }, []);
  const timeFrameCheck = (data) => {
    if (data?.finaldeliveryDate) {
      const deliveryDate = moment(data?.finaldeliveryDate).format('YYYY-MM-DD');
      const days = moment().diff(new Date(deliveryDate), 'days');
      return days <= 2;
    }
    return true;
  };

  const handleGetDirections = (source) => {
    CustomCurrentLocation((res) => {
      const destination = {
        // longitude: res.coords.longitude,
        // latitude: res.coords.latitude,
        longitude: '72.8312383',
        latitude: '21.2266205',
      };
      const data = {
        source,

        params: [
          {
            key: 'travelmode',
            value: 'driving',        // may be "walking", "bicycling" or "transit" as well
          },
          {
            key: 'dir_action',
            value: 'navigate',       // this instantly initializes navigation using the given travel mode
          },
        ],

      };
      console.log(data);
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${source.latitude},${source.longitude}&origin=${destination.latitude},${destination.longitude}&travelmode=driving`).catch(err => console.error('An error occurred', err));

      // getDirections(data);
    });

  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}>
        <Spinner color={'#fff'} visible={loading} />
        <CustomToaster
          color={Constants.black}
          backgroundColor={Constants.white}
          timeout={5000}
          toast={toast}
          setToast={setToast}
        />
        <View
          style={{ flexDirection: 'row', paddingHorizontal: 24, marginTop: 15 }}>
          <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="arrow-back"
              size={25}
              color={Constants.black}
              onPress={() => {
                props.navigation.goBack();
              }}
            />
          </View>
          <View style={[{ flex: 10 }, styles.center]}>
            {/* <Text
              style={{ color: Constants.black, fontSize: 24, fontWeight: '700' }}>
              Chats
            </Text> */}
          </View>
          <View style={{ flex: 2 }}></View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {/* <View>
            <Text style={styles.chatHeading}>Traveller Window</Text>
          </View> */}

          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              gap: 2,
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <View style={{ ...styles.imageContainer, width: 70, height: 70 }}>
              {coinSide &&
                <Animated.Image
                  source={
                    user?.profile
                      ? { uri: `${notificationDetails?.packagerid?.profile}` }
                      : { uri: Constants.dummyProfile }
                  }
                  onError={() => {
                    notificationDetails.packagerid = {
                      profile: Constants.dummyProfile
                    }
                    setNotificationDetails({ ...notificationDetails });
                  }}
                  style={[
                    {
                      height: 65,
                      width: 65,
                      borderRadius: 32,
                      borderWidth: 2,
                      borderColor: Constants.traveller,
                      // marginBottom: -40,
                      // marginTop: 20,
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
              {/* <Image
                style={styles.chatImage}
                source={require('../../Assets/Images/chat.png')}
              /> */}
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  marginTop: 5,
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: Constants.black,
                  textAlign: 'left',
                  fontFamily: 'Helvetica'
                }}>
                {notificationDetails?.packagerid?.fullName}
              </Text>
              <StarRatingDisplay
                starSize={25}
                rating={notificationDetails?.packagerid?.rating || 0}
                enableHalfStar={true}
                starStyle={{ marginLeft: 0 }}
              />

            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                width: 100,
              }}>
              {status !== 'DELIVERED' && <Text
                style={{
                  color: Constants.black,
                  fontWeight: '600',
                  textAlign: 'center',
                  fontFamily: 'Helvetica'
                }}>
                Deliver in
              </Text>}
              {status !== 'DELIVERED' && <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    ...styles.chatDuration,
                    backgroundColor: Constants.traveller,
                    borderRadius: 10,
                    padding: 5,
                    display: 'flex',
                  }}>
                  <Text onPress={createChat} style={{ color: Constants.black, fontFamily: 'Helvetica' }}>
                    {calculateRemainingTime(
                      notificationDetails?.packagePlan?.delivery_date,
                    )}
                  </Text>
                  <FontAwesomeIcon
                    name="clock-o"
                    size={15}
                    color={Constants.black}
                  />
                </View>
              </View>}
            </View>
          </View>

          <View style={styles.chatContainer}>
            <ImageBackground source={require('../../Assets/newImgs/chit.png')} style={styles.ChitCountainer}>
              <Text style={{ color: Constants.black, fontSize: 26, textAlign: 'center', fontFamily: 'Helvetica' }}>
                Courier Chit
              </Text>
              {status !== 'PENDING' && status !== 'CONNECTED' && status !== 'ACCEPT' && status !== 'REJECTED' && status !== 'DELIVERED' && status !== 'CANCELED' && (
                <TouchableOpacity
                  onPress={async () => {
                    let latlng = {
                      latitude: notificationDetails?.packagePlan?.location?.coordinates[1], longitude: notificationDetails?.packagePlan?.location?.coordinates[0],
                    };
                    if (notificationDetails?.packagePlan?.newlocation?.length > 0) {
                      latlng = { latitude: notificationDetails?.packagePlan?.newlocation?.coordinates[1], longitude: notificationDetails?.packagePlan?.newlocation?.coordinates[0] };
                    }
                    if (status === 'PICUPED' || status === 'DELIVER') {
                      latlng = {
                        // zoom: 15,
                        // query: 'San Francisco',
                        latitude: notificationDetails?.packagePlan?.tolocation?.coordinates[1], longitude: notificationDetails?.packagePlan?.tolocation?.coordinates[0],
                      };
                    }
                    // handleGetDirections(latlng);
                    // Linking.openURL(`https://www.google.com/maps/dir/?api=1&&destination=${latlng.latitude},${latlng.longitude}`).catch(err => console.error('An error occurred', err));
                    Linking.openURL(`http://maps.google.com/maps?q=${latlng.latitude},${latlng.longitude}`).catch(err => console.error('An error occurred', err));
                    // openMap(latlng);
                  }}
                  style={{ position: 'absolute', left: 10, top: 10, zIndex: 9 }}>
                  <Image style={{ height: 40, width: 40 }} source={require('../../Assets/newImgs/google-maps.png')} />
                </TouchableOpacity>
              )}
              {(status !== 'CONNECTED' && status !== 'REJECTED') && (
                <TouchableOpacity
                  onPress={() => { handlePickup(status === 'ACCEPTED' ? 'PICKUP' : 'DELIVER'); }}
                  disabled={status !== 'ACCEPTED' && status !== 'PICUPED'}
                  style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text
                    style={{
                      color: Constants.black,
                      fontSize: 13,
                      backgroundColor:
                        status === 'DELIVERED' ? 'green' : '#BC0505',
                      textAlign: 'right',
                      marginTop: -30,
                      padding: 7,
                      borderRadius: 10,
                      fontFamily: 'Helvetica'
                    }}>
                    {status === 'ACCEPT'
                      ? 'Verification Pending'
                      : status === 'ACCEPTED'
                        ? 'Confirm Pickup'
                        : status === 'PICKUP'
                          ? 'Under Review'
                          : status === 'PICUPED' ?
                            'Confirm Delivery' : status === 'DELIVER' ?
                              'Confirm Pending' : 'Delivered'}
                  </Text>
                </TouchableOpacity>
              )}

              {(status === 'REJECTED') && (
                <TouchableOpacity
                  onPress={() => { handlePickup(status === 'ACCEPTED' ? 'PICKUP' : 'DELIVER'); }}
                  disabled={status !== 'ACCEPTED' && status !== 'PICUPED'}
                  style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text
                    style={{
                      color: Constants.white,
                      fontSize: 13,
                      backgroundColor:
                        '#BC0505',
                      textAlign: 'right',
                      marginTop: -30,
                      padding: 7,
                      borderRadius: 10,
                      fontFamily: 'Helvetica'
                    }}>
                    Rejected
                  </Text>
                </TouchableOpacity>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // padding: 20,
                }}>
                <Image
                  source={{ uri: notificationDetails?.packagePlan?.item_image }}
                  style={{ width: 70, height: 70 }}
                />
                <View style={{ flex: 1, marginLeft: 25 }}>
                  <Text style={styles.chitText}>
                    Number of item:{notificationDetails?.packagePlan?.qty}
                  </Text>

                  {!notificationDetails.packagePlan?.newpickup && <Text style={styles.chitText}>
                    {notificationDetails?.packagePlan?.address.length > 7 &&
                      !expanded
                      ? `${notificationDetails?.packagePlan?.address.substring(
                        0,
                        7,
                      )}...`
                      : notificationDetails?.packagePlan?.address}
                    {notificationDetails?.packagePlan?.address.length > 7 && (
                      <Text
                        style={{ color: 'blue', fontSize: 11, fontFamily: 'Helvetica' }}
                        onPress={() => setExpanded(!expanded)}>
                        {expanded ? '...Less' : 'More'}
                      </Text>
                    )}
                  </Text>}

                  {notificationDetails.packagePlan?.newpickup && <Text style={styles.chitText}>
                    {notificationDetails?.packagePlan?.newpickup.length > 7 &&
                      !expanded
                      ? `${notificationDetails?.packagePlan?.newpickup.substring(
                        0,
                        7,
                      )}...`
                      : notificationDetails?.packagePlan?.newpickup}
                    {notificationDetails?.packagePlan?.newpickup.length > 7 && (
                      <Text
                        style={{ color: 'blue', fontSize: 11, fontFamily: 'Helvetica' }}
                        onPress={() => setExpanded(!expanded)}>
                        {expanded ? '...Less' : 'More'}
                      </Text>
                    )}
                  </Text>}

                  <Text style={styles.chitText}>
                    {notificationDetails?.packagePlan?.delivery_address.length >
                      7 && !expanded2
                      ? `${notificationDetails?.packagePlan?.delivery_address.substring(
                        0,
                        7,
                      )}...`
                      : notificationDetails?.packagePlan?.delivery_address}
                    {notificationDetails?.packagePlan?.delivery_address.length >
                      7 && (
                        <Text
                          style={{ color: 'blue', fontSize: 12, fontFamily: 'Helvetica' }}
                          onPress={() => setExpanded2(!expanded2)}>
                          {expanded2 ? '...Less' : 'More'}
                        </Text>
                      )}
                  </Text>

                  <Text style={styles.chitText}>
                    {notificationDetails?.packagePlan?.phone}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 50 }}>
                  <Text style={styles.chitText}>
                    Weight:{notificationDetails?.packagePlan?.weight}
                  </Text>

                  <Text style={styles.chitText}>
                    Worth:{notificationDetails?.packagePlan?.value}
                  </Text>

                  <Text style={styles.chitText}>
                    Bonus:{notificationDetails?.packagePlan?.bonus}
                  </Text>
                </View>
              </View>
            </ImageBackground>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {status === 'CONNECTED' &&
                // notificationDetails.userType === 'TRAVELLER' &&
                (
                  <>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Constants.skyGreen,
                        padding: 15,
                        borderRadius: 13,
                        width: 125,
                      }}
                      onPress={handleAccept}>
                      <Text style={styles.acceptButton}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'red',
                        padding: 15,
                        borderRadius: 13,
                        width: 125,
                      }}
                      onPress={handleReject}>
                      <Text style={styles.rejectButton}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
            </View>

            <View style={{ flex: 1, flexDirection: 'column', margin: 10 }}>
              {messages.map((message, idx) => (
                <View
                  key={idx}
                  style={{
                    alignSelf:
                      message.sender._id === userId ? 'flex-end' : 'flex-start',
                    marginVertical: 5,
                    flexDirection: 'column',
                    maxWidth: '60%',
                  }}>
                  {/* {message.sender._id === userId && (
                    <Text
                      style={{
                        color: Constants.black,
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginVertical: 5,
                      }}>
                      {message.sender.fullName}
                    </Text>
                  )} */}
                  <View
                    style={{
                      backgroundColor:
                        message.sender?._id === userId
                          ? Constants.lightTraveller
                          : Constants.pink,
                      padding: 10,
                      borderRadius: 10,
                      borderBottomLeftRadius:
                        message.sender?._id !== userId ? 0 : 10,
                      borderBottomRightRadius:
                        message.sender?._id === userId ? 0 : 10,
                      borderWidth: 1,
                      borderColor:
                        message.sender?._id === userId
                          ? Constants.yellow
                          : Constants.red,
                    }}>
                    <Text
                      style={{
                        color: Constants.black,
                        fontSize: 15,
                        padding: 0,
                        fontFamily: 'Helvetica'
                      }}>
                      {message.message}
                    </Text>
                  </View>
                  <Text
                    style={{
                      alignSelf:
                        message.sender._id === userId
                          ? 'flex-end'
                          : 'flex-start',
                      color: Constants.black,
                      fontSize: 10,
                      marginTop: 3,
                      fontWeight: 'bold',
                      fontFamily: 'Helvetica'
                    }}>
                    {moment(message.createdAt).format('DD/MM/YYYY, hh:mm:ss A')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
      {(notificationDetails && status !== 'REJECTED' && status !== 'DELIVERED' && timeFrameCheck(notificationDetails.packagePlan)) &&
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10,
            marginBottom: 10,
          }}>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderColor: Constants.grey,
              borderWidth: 2,
              borderRadius: 20,
              paddingHorizontal: 15,
              marginRight: 10,
              color: Constants.black,
              fontFamily: 'Helvetica'
              // backgroundColor: Constants.white,
            }}
            placeholderTextColor={Constants.grey}
            placeholder="Type your message..."
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
          />
          <TouchableOpacity
            onPress={createChat}
            disabled={newMessage.length === 0}
            style={{
              padding: 15,
              backgroundColor: Constants.traveller,
              borderRadius: 20,
            }}>
            <Text style={{ color: Constants.black, fontSize: 16, fontFamily: 'Helvetica' }}>
              <Ionicons name="send-sharp" />
            </Text>
          </TouchableOpacity>
        </View>
      }

      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginBottom: 10,
        }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderColor: Constants.grey,
            borderWidth: 2,
            borderRadius: 20,
            paddingHorizontal: 15,
            marginRight: 10,
          }}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={text => setNewMessage(text)}
        />
        <TouchableOpacity
          onPress={createChat}
          style={{
            padding: 15,
            backgroundColor: Constants.traveller,
            borderRadius: 20,
          }}>
          <Text style={{color: Constants.white, fontSize: 16}}>
            <Ionicons name="send-sharp" />
          </Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default Chat;
