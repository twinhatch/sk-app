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
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Alert,
  ImageBackground,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import styles from './StyleProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../../Helpers/constant';
import { Avatar } from 'react-native-paper';
import Spinner from '../../Component/Spinner';
import CustomToaster from '../../Component/CustomToaster';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { socket } from '../../../utils';
import { Context, UserContext } from '../../../App';
import { useRoute } from '@react-navigation/native';
import { GetApi, Post } from '../../Helpers/Service';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import CountDownTime from '../../Component/CountDownTime';
import * as geolib from 'geolib';
import Charges from '../../Helpers/Charges';
import CameraPeacker from '../../Component/Camera';
// import GetCurrentAddressByLatLong from '../../Component/GetCurrentAddressByLatLong';

const Chat = props => {
  const route = useRoute();
  const locationId = route.params.locationId;

  const [initial, setInitial] = useContext(Context);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [notificationDetails, setNotificationDetails] = useState({});
  const [packages, setPackages] = useState([]);
  const [status, setStatus] = useState('');
  const [connection, setConnection] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [userId, setUserId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [user, setUser] = useContext(UserContext);
  const [openCancel, setOpenCancel] = React.useState(false);
  const [selectedConn_id, setSelectedConn_id] = useState({});
  const [coinSide, setCoinSide] = useState('Heads');

  const flipAnimation = useRef(new Animated.Value(0)).current;


  // useEffect(() => {
  //   socket.emit('joinRoom', { user, key: 'packagerSocket', userkey: 'packagerid' });
  // }, [user])

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {

        if (locationId) {
          socket.emit('join', locationId)
          // socket.emit('joinRoom', { user, key: 'packagerSocket', userkey: 'packagerid', locationId });
          fetchNotificationData(locationId, false);
        }
        getUserData();

      },
    );
    // OneSignal.Notifications.addEventListener(
    //   'foregroundWillDisplay',
    //   async event => {
    //     console.log(event);
    //     let notification = event.getNotification();
    //     const customData = notification.additionalData;
    //     console.log('Custom Data:', customData);
    //     if (
    //       customData !== undefined &&
    //       customData?.type !== undefined &&
    //       customData?.type === 'status'
    //     ) {
    //       fetchNotificationData(locationId, false);
    //     }
    //   },
    // );
    const timeoutID = setInterval(() => {
      flipCoin();
    }, 7000);
    return () => {
      clearInterval(timeoutID);
      willFocusSubscription();
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

    socket.on('messages', message => {
      if (message.length > 0) {
        // console.log('masages9999999999999999->', message)
        setMessages(message);
      } else {
        setMessages([]);
      }
    });
    socket.on('allmessages', async (message) => {
      if (message.length > 0) {
        setMessages(message);
      }

      socket.on('receivedstatus', async (data) => {
        setStatus(data.newStatus);
        if (data.newStatus === 'REJECTED') {
          setTimeout(() => {
            props.navigation.replace('provider', { screen: 'Packagesuser' });
          }, 1000);
        }
      });

    });


  }, [socket]);

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

  const fetchNotificationData = async (id, notify) => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('conectionId', id);
      const response = await GetApi(`getconnection/${id}?notify=${notify}`);
      if (response) {
        if (response.data) {
          setNotificationDetails(response.data);
          connectionPlan(response.data.packagePlan);
          // console.log('satus===>', response.data?.status)

          // console.log('estimate_time===>', response.data?.travelPlan?.estimate_time)
          // console.log('jurney_date===>', response.data?.travelPlan?.jurney_date)
          // console.log('accepted_delivery_date===>', response.data?.packagePlan?.accepted_delivery_date)
          setStatus(response.data?.status);
          setSelectedConn_id({});
        }

        getChat(response.data);
      } else {
        setRefreshing(false);
        console.log('Error fetching notification details:', response);
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
      fetchNotificationData(locationId, false);
    }
  }, []);

  const connectionPlan = async plan => {
    setLoading(true);
    try {
      const data = {
        location: plan.location.coordinates,
        tolocation: plan.tolocation.coordinates,
      }
      const response = await Post('travellerNearMe', data);
      if (response) {
        // console.log(response.data);
        setConnection(response.data.jobs);
      } else {
        setRefreshing(false);
        console.log('Error fetching notification details:', response);
      }
    } catch (error) {
      setRefreshing(false);
      console.log('Error fetching notification details:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
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
      receiver: noti?.travellerid?._id,
      connection: noti?._id,
      sender: noti?.packagerid?._id,
    };

    socket.emit('getMessages', payloads);
  };

  const createChat = message => {
    const payloads = {
      receiver: notificationDetails?.travellerid?._id,
      message: newMessage,
      connection: notificationDetails?._id,
      sender: notificationDetails?.packagerid?._id,
      key: 'travelerSocket',
    };

    socket.emit('createMessage', payloads);
    setNewMessage('');
  };


  const getDistance = () => {
    console.lo
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
    // console.log(da, ca);
    return ca;
  };

  const handleStatusUpdate = (newStatus, connId) => {
    setStatus(newStatus);
    const payload = {
      conn_id: notificationDetails?._id,
      status: newStatus,
      packagePlan: notificationDetails?.packagePlan?._id,
    };


    if (newStatus === 'ACCEPTED') {
      // console.log(getDistance())
      const deliveryCharge = Charges(getDistance());
      // console.log(deliveryCharge)
      payload.accepted_delivery_date = new Date(deliveryCharge.delivery_date);
      payload.delivery_date = deliveryCharge.delivery_date;
    }
    if (newStatus === 'DELIVERED') {
      const nwetime = moment(new Date()).format('hh:mm A');
      payload.nwetime = nwetime;
      payload.content = `Your package has been delivered by ${notificationDetails?.travellerid?.fullName} at ${nwetime}`;
    }

    if (newStatus === 'PICUPED') {
      const nwetime = moment(new Date()).format('hh:mm A');
      payload.nwetime = nwetime;
      payload.content = `Your package has been picked up by ${notificationDetails?.travellerid?.fullName} at ${nwetime}`;
    }

    Post('updateStatus', payload).then(res => {
      // console.log(res);
      if (res.success) {
        setStatus(newStatus);
        // if (newStatus === 'ACCEPTED') {
        //   socket.emit('joinRoom', locationId);
        // }
        if (newStatus === 'REJECTED') {
          props.navigation.replace('provider', { screen: 'Packagesuser' });
          // props.navigation.replace('Packagesuser');
        } else {
          socket.emit('statuschanged', { con_id: res.data._id, newStatus, key: 'travelerSocket', userType: 'travellerid' });
          if (newStatus === 'DELIVERED') {
            CameraPeacker();
          }
        }
        // console.log(`Status updated to "${newStatus}" for conn_id ${connId}`);
      } else {
        console.log('Error updating status:', res);
      }
    });
  };



  const handleAccept = () => {
    handleStatusUpdate('ACCEPTED');
  };

  const handleReject = () => {
    handleStatusUpdate('REJECTED');
  };

  const handlePickup = type => {
    handleStatusUpdate(type);
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
  const acceptInvitation = connect => {
    // console.log(connect.user)
    const data = {
      status: 'CONNECTED',
      travellerid: connect.user._id,
      travelPlan: connect._id,
      packagePlan: notificationDetails.packagePlan._id,
      packagerid: notificationDetails.packagePlan.user,
      packagerSocket: socket.id,
      from: 'chat',
    };
    // console.log(data)
    setLoading(true);
    Post('accept-invitation', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        // console.log(res);
        if (res.success) {
          props.navigation.replace('Chat',
            {
              locationId: res.connection._id,
            });
          // navigation.navigate('Chat', {
          //   locationId: item._id,
          // });
          // fetchNotificationData(res.connection._id, true);
        } else {
          props.navigation.replace('Chat',
            {
              locationId: res.connection._id,
            });
          // fetchNotificationData(res.connection._id, true);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };



  const timeFrameCheck = (data) => {
    if (data?.finaldeliveryDate) {
      const deliveryDate = moment(data?.finaldeliveryDate).format('YYYY-MM-DD')
      const days = moment().diff(new Date(deliveryDate), 'days');
      return days <= 2;
    }
    return true;
  }

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
          <View>
            {/* <Text style={styles.chatHeading}>Client Window</Text> */}
            {!notificationDetails?.packagePlan?.changedTraveller && status !== 'ACCEPTED' &&
              status !== 'PICKUP' &&
              status !== 'PICUPED' &&
              status !== 'DELIVER' &&
              status !== 'DELIVERED' && (
                <ScrollView
                  horizontal
                  style={{ flexDirection: 'row', margin: 10 }}>
                  {connection.slice(0, 7).map(item => (
                    <TouchableOpacity
                      style={
                        (calculateRemainingTime(
                          item.estimate_time,
                        ) === '0 mints' ||
                          item.user._id ===
                          notificationDetails?.travellerid?._id) && {
                          display: 'none',
                        }
                      }
                      key={item._id}
                      onPress={() => {
                        // props.navigation.navigate('Chat', {
                        //   locationId: item._id,
                        // })
                        setSelectedConn_id(item)
                        setOpenCancel(true)
                        // fetchNotificationData(item._id, true);
                      }}>
                      <View
                        key={item._id}
                        style={{
                          marginHorizontal: 9,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                        <View style={styles.imageContainer}>
                          <Image
                            style={styles.chatImage}
                            source={item?.user?.profile ? { uri: item?.user?.profile } : require('../../Assets/Images/chat.png')}
                          />
                        </View>
                        <Text
                          style={{
                            fontSize: 16,
                            marginTop: 5,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: Constants.black,
                            fontFamily: 'Helvetica'
                          }}>
                          {item.user?.fullName}
                        </Text>
                        <Text
                          style={{
                            color: Constants.black,
                            fontWeight: '600',
                            textAlign: 'center',
                            fontSize: 14,
                          }}>
                          Reaching in
                        </Text>
                        <View
                          style={{
                            ...styles.chatDuration,
                            backgroundColor: Constants.red,
                            borderRadius: 10,
                            padding: 5,
                            display: 'flex',
                            fontFamily: 'Helvetica'
                          }}>

                          <Text style={{ color: Constants.white, fontFamily: 'Helvetica' }}>
                            {calculateRemainingTime(
                              item?.estimate_time,
                            )}
                          </Text>

                          <FontAwesomeIcon
                            name="clock-o"
                            size={15}
                            color={Constants.white}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              gap: 2,
              justifyContent: 'space-between',
              margin: 10,
            }}>
            {/* <Text> {notificationDetails?.travellerid?.profile}</Text> */}

            <View style={{ ...styles.imageContainer, width: 70, height: 70 }}>
              {/* {notificationDetails?.travellerid?.profile && <Image
                style={styles.chatImage}
                source={{ uri: notificationDetails?.travellerid?.profile }}
              />} */}
              {coinSide && (
                <Animated.Image
                  source={
                    notificationDetails?.travellerid?.profile
                      ? { uri: `${notificationDetails?.travellerid?.profile}` }
                      : { uri: Constants.dummyProfile }
                  }
                  onError={() => {
                    setUser({ ...user, profile: Constants.dummyProfile });
                  }}
                  style={[
                    {
                      height: 65,
                      width: 65,
                      borderRadius: 32,
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
              )}
              {/* {notificationDetails?.travellerid?.profile ? (
                <Avatar.Image
                  size={70}
                  source={{ uri: `${notificationDetails?.travellerid?.profile}` }}
                //source={require('../../Assets/newImgs/images.png')}
                />
              ) : (
                <Avatar.Image
                  size={70}
                  source={require('../../Assets/newImgs/images.png')}
                />
              )} */}
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
                  // textAlign: 'center',
                  fontWeight: 'bold',
                  color: Constants.black,
                  textAlign: 'left',
                  fontFamily: 'Helvetica'
                }}>
                {notificationDetails?.travellerid?.fullName}
              </Text>
              <StarRatingDisplay
                starSize={25}
                rating={notificationDetails?.travellerid?.rating || 0}
                enableHalfStar={true}
                starStyle={{ marginLeft: 0 }}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: status === 'REJECTED' ? 'center' : 'flex-end',
                width: 100,
              }}>

              {status === 'CANCELED' && <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    ...styles.chatDuration,
                    backgroundColor: Constants.red,
                    borderRadius: 5,
                    padding: 5,
                    flexDirection: 'column',
                    minWidth: 100
                    // display: 'flex',
                  }}>
                  <Text onPress={createChat} style={{ color: Constants.white, fontFamily: 'Helvetica' }}>
                    Plan
                  </Text>
                  <Text onPress={createChat} style={{ color: Constants.white, fontFamily: 'Helvetica' }}>
                    Cancelled
                  </Text>

                </View>
              </View>}

              {status !== 'DELIVERED' && status !== 'CANCELED' && !notificationDetails?.packagePlan?.accepted_delivery_date && <Text
                style={{
                  color: Constants.black,
                  fontWeight: '600',
                  textAlign: 'center',
                  fontFamily: 'Helvetica'
                }}>
                {notificationDetails?.checkValue ? ' Arriving in' : ' Departing in'}

              </Text>}
              {status !== 'DELIVERED' && status !== 'CANCELED' && notificationDetails?.packagePlan?.accepted_delivery_date && <Text
                style={{
                  color: Constants.black,
                  fontWeight: '600',
                  textAlign: 'center',
                  fontFamily: 'Helvetica'
                }}>
                Reaching in
              </Text>}
              {status !== 'DELIVERED' && status !== 'CANCELED' && <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    ...styles.chatDuration,
                    backgroundColor: Constants.red,
                    borderRadius: 5,
                    padding: 5,
                    display: 'flex',
                  }}>
                  {!notificationDetails?.packagePlan?.accepted_delivery_date && new Date().getTime() < new Date(notificationDetails?.travelPlan?.jurney_date).getTime() && <CountDownTime
                    show={true}
                    color={Constants.white}
                    startDate={notificationDetails?.travelPlan?.jurney_date}
                    checkValue={value => {
                      if (value === true && notificationDetails.checkValue !== true) {
                        notificationDetails.checkValue = true;
                        setConnection([...connection]);
                      }
                    }}
                  />}
                  {!notificationDetails?.packagePlan?.accepted_delivery_date && new Date().getTime() > new Date(notificationDetails?.travelPlan?.jurney_date).getTime() &&
                    new Date().getTime() < new Date(notificationDetails?.travelPlan?.estimate_time).getTime() && <CountDownTime
                      show={true}
                      color={Constants.white}
                      startDate={
                        notificationDetails?.travelPlan?.estimate_time
                      }
                      checkValue={value => {
                      }}
                    />}

                  {notificationDetails?.packagePlan?.accepted_delivery_date && <CountDownTime
                    show={true}
                    color={Constants.white}
                    startDate={
                      notificationDetails?.packagePlan?.accepted_delivery_date
                    }
                    checkValue={value => {
                    }}
                  />}
                  {/* <Text onPress={createChat} style={{ color: Constants.white }}>
                    {calculateRemainingTime(
                      notificationDetails?.packagePlan?.delivery_date,
                    )}
                  </Text> */}
                  <FontAwesomeIcon
                    name="clock-o"
                    size={15}
                    color={Constants.white}
                  />
                </View>
              </View>}
            </View>
          </View>

          <View style={styles.chatContainer}>
            <ImageBackground

              source={require('../../Assets/newImgs/chit.png')}
              style={styles.ChitCountainer}>
              {(status === 'PICUPED' || status === 'DELIVER') && (
                <TouchableOpacity
                  onPress={async () => {
                    props.navigation.navigate('Track', {
                      plan_id: notificationDetails?.packagePlan?._id,
                      to: notificationDetails?.travellerid?._id,
                    });
                  }}
                  style={{ position: 'absolute', left: 10, top: 10, zIndex: 9 }}>
                  <Text
                    style={[
                      {
                        color: 'white',
                        fontSize: 13,
                        textAlign: 'right',
                        marginTop: 2,
                        padding: 7,
                        borderRadius: 5,
                        fontFamily: 'Helvetica'
                      },
                      status === 'PICKUP'
                        ? { backgroundColor: '#BC0505' }
                        : { backgroundColor: 'green' },
                    ]}>
                    Track
                  </Text>
                </TouchableOpacity>
              )}
              <Text
                // onPress={() => { setOpenCancel(true) }}
                style={{
                  color: Constants.black,
                  fontSize: 26,
                  textAlign: 'center',
                  fontFamily: 'Helvetica',
                  fontWeight: '600',
                }}>
                Courier Chit
              </Text>

              {(status === 'PICKUP' ||
                status === 'PICUPED' ||
                status === 'DELIVER' ||
                status === 'DELIVERED') && (
                  <TouchableOpacity
                    onPress={() => {
                      handlePickup(status === 'PICKUP' ? 'PICUPED' : 'DELIVERED');
                    }}
                    disabled={status === 'PICUPED' || status === 'DELIVERED'}
                    style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text
                      style={[
                        {
                          color: 'white',
                          fontSize: 13,
                          textAlign: 'right',
                          marginTop: -30,
                          padding: 7,
                          borderRadius: 5,
                          fontFamily: 'Helvetica'
                        },
                        status === 'DELIVERED'
                          ? { backgroundColor: 'green' }
                          : { backgroundColor: '#BC0505' },
                      ]}>
                      {status === 'PICKUP'
                        ? 'Confirm Pickup'
                        : status === 'PICUPED'
                          ? 'Picked up'
                          : status === 'DELIVER'
                            ? 'Confirm Delivery'
                            : 'Delivered'}
                    </Text>
                  </TouchableOpacity>
                )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // padding: 20,
                }}>
                {notificationDetails?.packagePlan?.item_image && (
                  <Image
                    source={{ uri: notificationDetails?.packagePlan?.item_image }}
                    style={{ width: 70, height: 70 }}
                  />
                )}
                <View style={{ flex: 1, marginLeft: 30 }}>
                  <Text style={styles.chitText}>
                    Number of item:{notificationDetails?.packagePlan?.qty}
                  </Text>

                  <Text style={styles.chitText}>
                    {notificationDetails?.packagePlan?.pickupaddress.length > 7 &&
                      !expanded
                      ? `${notificationDetails?.packagePlan?.pickupaddress.substring(
                        0,
                        7,
                      )}...`
                      : notificationDetails?.packagePlan?.pickupaddress}
                    {notificationDetails?.packagePlan?.pickupaddress.length > 7 && (
                      <Text
                        style={{ color: 'blue', fontSize: 11 }}
                        onPress={() => setExpanded(!expanded)}>
                        {expanded ? '...Less' : 'More'}
                      </Text>
                    )}
                  </Text>
                  <Text style={styles.chitText}>
                    {notificationDetails?.packagePlan?.fulldelivery_address.length >
                      7 && !expanded2
                      ? `${notificationDetails?.packagePlan?.fulldelivery_address.substring(
                        0,
                        7,
                      )}...`
                      : notificationDetails?.packagePlan?.fulldelivery_address}
                    {notificationDetails?.packagePlan?.fulldelivery_address.length >
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
              {status === 'ACCEPT' && (
                // notificationDetails.userType === 'USER' &&
                <>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Constants.skyGreen,
                      padding: 15,
                      borderRadius: 13,
                      width: 125,
                    }}
                    onPress={handleAccept}>
                    <Text
                      style={[styles.acceptButton, { color: Constants.black }]}>
                      Accept
                    </Text>
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
                          ? Constants.pink
                          : Constants.lightTraveller,
                      padding: 10,
                      borderRadius: 10,
                      borderBottomLeftRadius:
                        message.sender?._id !== userId ? 0 : 10,
                      borderBottomRightRadius:
                        message.sender?._id === userId ? 0 : 10,
                      borderWidth: 1,
                      borderColor:
                        message.sender?._id === userId
                          ? Constants.red
                          : Constants.yellow,
                    }}>
                    <Text
                      style={{
                        color: Constants.black,
                        fontSize: 16,
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
                Are you sure you want to switch to a faster traveller for {notificationDetails?.packagePlan?.name} ? You can only use this feature once.
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
                    setOpenCancel(false);
                    acceptInvitation(selectedConn_id);
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {notificationDetails && status !== 'DELIVERED' && timeFrameCheck(notificationDetails.packagePlan) &&
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
              backgroundColor: Constants.red,
              borderRadius: 20,
            }}>
            <Text style={{ color: Constants.white, fontSize: 16, fontFamily: 'Helvetica' }}>
              <Ionicons name="send-sharp" />
            </Text>
          </TouchableOpacity>
        </View>}
    </SafeAreaView>
  );
};

export default Chat;
