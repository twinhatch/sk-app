/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  RefreshControl,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import React, { createRef, useContext, useEffect, useState } from 'react';
import styles from './StyleProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../../Helpers/constant';
import { Avatar } from 'react-native-paper';
import { Context, UserContext } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import Spinner from '../../Component/Spinner';
import { GetApi, Post } from '../../Helpers/Service';
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { socket } from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConnectionCheck from '../../Component/ConnectionCheck';
import AnimateNumber from 'react-native-animate-number';

const Notification = props => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [user, setUser] = useContext(UserContext)
  const [initial, setInitial] = useContext(Context);
  const [notification, setNotification] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        getNotification(page);
      },
    );
    return () => {
      willFocusSubscription();
    };
  }, []);

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getNotification(1);
    setPage(1)
  }, []);


  const getNotification = (p) => {
    setLoading(true);
    GetApi(`getnotification?page=${p}`, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        setRefreshing(false);
        console.log('Notification ---------->', res.notificationList[0]);
        if (res.success) {
          setCurrentData(res.notificationList);
          if (p === 1) {
            setNotification(res.notificationList);
            AsyncStorage.setItem('Notification', JSON.stringify(res.notificationList));
          } else {
            setNotification([...notification, ...res.notificationList]);
            AsyncStorage.setItem('Notification', JSON.stringify([...notification, ...res.notificationList]));
          }
        } else {
          console.log('error------>', res);
        }
      },
      async err => {
        setRefreshing(false);
        setLoading(false);
        console.log(err);
        const previousData = await AsyncStorage.getItem('Notification');
        if (previousData && err === 'Poor connection') {
          setNotification(JSON.parse(previousData));
        }
      },
    );
  };

  const acceptInvitation = (connect, i) => {
    console.log(connect?.packagePlan?.jobStatus);
    if (connect?.packagePlan?.jobStatus !== 'PENDING' && (connect?.packagePlan?.jobStatus !== 'REJECTED' && connect?.packagePlan?.jobStatus !== 'REVOKE')) {
      setToast('Package already taken');
      return;
    }

    if (connect.status !== 'PENDING') {
      return;
    }

    setLoading(true);
    let data = {
      status: 'CONNECTED',
      travellerid: connect.receverId,
      travelPlan: connect.travelPlan._id,
      packagePlan: connect.packagePlan._id,
      packagerid: connect.senderId._id,
      travelerSocket: socket.id,
    };

    // if (connect?.packagePlan?.jobStatus === 'REJECTED') {
    //   data.status = 'ACCEPTED';
    // }

    if (connect) {
      data.id = connect._id;
    }

    Post('accept-invitation', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res)
        if (res.success) {
          setToast('Accepted successfully');
          connect.status = 'NORMAL';
          // const singledata = notification.find(f => f._id === connect._id)
          notification[0].status = 'CONNECTED';
          setNotification([...notification]);
          // socket.emit('join', res.connection._id);
          navigation.navigate('Chats', {
            locationId: res.connection._id,
          });
        } else {
          setToast(res.message);
          if (res.connection._id) {
            // socket.emit('join', res.connection._id);
            navigation.navigate('Chats', {
              locationId: res.connection._id,
            });
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const config = {
    // velocityThreshold: 0.3,
    directionalOffsetThreshold: 300,
  };

  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getNotification(page + 1);
      setPage(page + 1);
    }
  };


  const renderItem = ({ item, index }) => (
    <Pressable
      style={[
        styles.cardView,
        // index === 0 && { marginTop: 20 },
        index + 1 === notification.length && { marginBottom: 30 },
      ]}
      onPress={() => {
        if (item.open === undefined) {
          item.open = true;
        } else {
          item.open = !item.open;
        }
        setNotification([...notification]);
      }}>
      <ImageBackground
        resizeMode="cover"
        source={require('../../Assets/newImgs/smallbg2.png')}>
        {/* )} */}
        {item.notification && (
          <View style={{
            borderBottomColor: Constants.white,
            borderBottomWidth: 2,
          }} >
            <Text
              style={{
                fontSize: 14,
                color: Constants.black,
                padding: 10,
                fontWeight: '700',
                // borderBottomColor: Constants.white,
                // borderBottomWidth: 2,
                fontFamily: 'Helvetica'
              }}>
              {item.notification}
            </Text>
          </View>
        )}
        {item.status !== 'REVOKE' && <View
          style={[
            styles.card,
            {
              flexDirection: item?.open ? 'column' : 'row',
              position: 'relative',
            },
          ]}>
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              minWidth: 120,
              borderColor: Constants.traveller,
              borderWidth: 1,
              backgroundColor: Constants.white,
              // borderTopEndRadius: 20,
              borderBottomStartRadius: 20,
            }}>
            <Text
              style={{
                color: Constants.black,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '700',
                paddingHorizontal: 5,
                paddingVertical: 5,
                minWidth: 140,
                fontFamily: 'Helvetica'
              }}>
              Earn:{' '}
              <Text
                style={{
                  color: Constants.black,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '700',
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  fontFamily: 'Helvetica'
                }}>
                ₹<AnimateNumber
                  interval={10}
                  countBy={2}
                  value={item?.packagePlan?.total}
                />
                {/* {item?.packagePlan?.total} */}
              </Text>
            </Text>
          </View>
          {/* {item?.open && ( */}
          {/* || (item?.packagePlan && item?.packagePlan?.rejectedBy && !item?.packagePlan?.rejectedBy?.includes(user?._id)) */}
          {(item?.status !== 'NORMAL' && item?.status !== 'REVOKE' && item?.status !== 'REJECTED') && (!item?.packagePlan?.rejectedBy || !item?.packagePlan?.rejectedBy?.includes(user?._id)) && (
            <TouchableOpacity
              style={[
                styles.reportBtn,
                {
                  width: 100,
                  borderTopEndRadius: 0,
                  top: 40,
                  right: 2,
                },
              ]}
              onPress={() => {
                if (item.status === 'PENDING' && (item?.packagePlan?.jobStatus === 'PENDING' || item?.packagePlan?.jobStatus === 'REJECTED' || item?.packagePlan?.jobStatus === 'REVOKE')) {
                  acceptInvitation(item);
                } else {
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
                        navigation.navigate('Chats', {
                          locationId: item.connection,
                        });

                      }
                    });
                  // } else {
                  //   navigation.navigate('Chats', {
                  //     locationId: item.connection,
                  //   });
                  // }
                  // socket.emit('join', item.connection);

                }
              }}>
              <Text style={styles.reportBtntxt}>
                {(item.status === 'PENDING' && (item?.packagePlan?.jobStatus === 'PENDING' || item?.packagePlan?.jobStatus === 'REJECTED' || item?.packagePlan?.jobStatus === 'REVOKE')) ? 'Connect' : 'Chat'}
              </Text>
            </TouchableOpacity>
          )}
          {item?.status === 'NORMAL' && item?.packagePlan?.jobStatus !== 'REJECTED' && item?.packagePlan?.jobStatus !== 'REVOKE' && item?.status !== 'REJECTED' && (!item?.packagePlan?.rejectedBy || !item?.packagePlan?.rejectedBy?.includes(user?._id)) && (
            <TouchableOpacity
              style={[
                styles.reportBtn,
                {
                  width: 100,
                  borderTopEndRadius: 0,
                  top: 40,
                  right: 2,
                },
              ]}
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
                      navigation.navigate('Chats', {
                        locationId: item.connection,
                      });
                    }
                  });
                // } else {
                //   navigation.navigate('Chats', {
                //     locationId: item.connection,
                //   });
                // }
              }}>
              <Text style={styles.reportBtntxt}>Chat</Text>
            </TouchableOpacity>
          )}
          {item?.status === 'REJECTED' || (item?.packagePlan?.rejectedBy && item?.packagePlan?.rejectedBy?.includes(user?._id)) && (
            <View
              style={[
                styles.reportBtn,
                {
                  width: 100,
                  borderTopEndRadius: 0,
                  top: 40,
                  right: 2,
                  backgroundColor: 'red',

                },
              ]}
            >
              <Text style={[styles.reportBtntxt, { color: Constants.white }]}>Rejected</Text>
            </View>
          )}
          <View style={styles.center}>
            {item?.packagePlan?.item_image ? (
              <Avatar.Image
                onError={e => {
                  console.log(e);
                }}
                size={50}
                source={{ uri: `${item?.packagePlan?.item_image}` }}
              //source={require('../../Assets/newImgs/images.png')}
              />
            ) : (
              <Avatar.Image
                size={50}
                source={require('../../Assets/newImgs/images.png')}
              />
            )}
          </View>
          <View
            style={[
              styles.center,
              {
                marginTop: item?.open ? 10 : 0,
                flexDirection: 'column',
                flex: 1,
              },
              !item?.open && { alignItems: 'flex-start' },
            ]}>
            <Text
              style={[
                styles.itemName,
                { marginLeft: item?.open ? 0 : 10 },
              ]}>
              {item?.packagePlan?.name}
            </Text>
          </View>
        </View>}
        {/* <Text
      style={[
        styles.itemName,
        { marginLeft: item?.open ? 0 : 10, fontSize: 14, textAlign: 'center' },
      ]}>
      For Traveller Plan :  {item?.travelPlan?.name}
    </Text> */}
        {item?.open && (
          <View style={{ padding: 20, paddingTop: 0 }}>
            <View style={styles.subCard}>
              <View
                style={{
                  flex: 3,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <Text style={styles.from}>From</Text>
                <Text style={styles.from}>
                  {item?.packagePlan?.newpickup || item?.packagePlan?.address}
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
                <Text style={styles.to}>TO</Text>
                <Text style={styles.to}>
                  {item?.packagePlan?.delivery_address}
                </Text>
              </View>
            </View>
            {item?.packagePlan?.mot && (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                }}>
                <View style={[styles.normalField, { flex: 1 }]}>
                  <Text
                    style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                    {item?.packagePlan?.mot}
                  </Text>
                  <FontAwesomeIcon
                    name={IconMapping[item?.packagePlan?.mot]}
                    size={15}
                    color={Constants.black}
                  />
                </View>
                {item?.packagePlan?.seat_avaibility > 0 && (
                  <View style={[styles.normalField, { flex: 1 }]}>
                    <Text
                      style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                      Seat
                    </Text>
                    <Text
                      style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                      {item?.packagePlan?.seat_avaibility}
                    </Text>
                  </View>
                )}
              </View>
            )}
            {item?.packagePlan?.description !== '' && (
              <View style={{ ...styles.normalField, marginTop: 10 }}>
                <Text style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                  {item?.packagePlan?.description}
                </Text>
              </View>
            )}
          </View>
        )}
      </ImageBackground>
    </Pressable>
  )

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <Spinner color={'#fff'} visible={loading} />
      <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      />
      <View style={{ flexDirection: 'row', paddingHorizontal: 24 }}>
        <View style={[{ flex: 10 }, styles.center]}>
          <Text
            style={{ color: Constants.black, fontSize: 24, fontWeight: '700', fontFamily: 'Helvetica' }}>
            Notification
          </Text>
        </View>
      </View>
      {Platform.OS === 'android' && <GestureRecognizer
        onSwipeRight={() => {
          props.navigation.navigate('History');
        }}
        onSwipeLeft={() => {
          props.navigation.navigate('Traveluser');
        }}
        config={config}
        style={{
          flex: 1,
        }}>
        <FlatList
          contentContainerStyle={{ flex: 1, padding: 20, }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={notification}
          renderItem={renderItem}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.8}
        />

        {notification.length === 0 && !loading && (
          <View
            style={{
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: Constants.lightTraveller,
              marginTop: 20
            }}>
            <Text
              style={{ color: Constants.black, textAlign: 'center', fontSize: 20, fontFamily: 'Helvetica' }}>
              No Data Found{' '}
            </Text>
          </View>
        )}
      </GestureRecognizer>}
      {Platform.OS === 'ios' && <View
        style={{
          flex: 1,
        }}>
        <FlatList
          contentContainerStyle={{ flex: 1, padding: 20, }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={notification}
          renderItem={renderItem}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.8}
        />

        {notification.length === 0 && !loading && (
          <View
            style={{
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: Constants.lightTraveller,
              marginTop: 20
            }}>
            <Text
              style={{ color: Constants.black, textAlign: 'center', fontSize: 20, fontFamily: 'Helvetica' }}>
              No Data Found{' '}
            </Text>
          </View>
        )}
      </View>}
    </SafeAreaView>
  );

};

export default Notification;
