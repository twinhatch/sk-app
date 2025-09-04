/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Pressable,
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
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import Spinner from '../../Component/Spinner';
import { GetApi, Post } from '../../Helpers/Service';
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { socket } from '../../../utils';
import moment from 'moment';
import StarRating from 'react-native-star-rating-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConnectionCheck from '../../Component/ConnectionCheck';
import CameraPeacker from '../../Component/Camera';
// import { FlatList } from 'react-native-actions-sheet';

const NotificationPro = props => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getNotification(1);
    setPage(1);
  }, []);

  const handleStatusUpdate = (items, newStatus, type) => {
    setLoading(true);

    const payload = {
      conn_id: items?.connection,
      status: newStatus,
      packagePlan: items?.packagePlan?._id,
      noti_id: items._id,
    };

    if (newStatus === 'DELIVERED') {
      payload.nwetime = moment(new Date()).format('hh:mm A');
    }

    if (newStatus === 'PICUPED') {
      if (type === 'no') {
        payload.confirm = 'no';
      }
      const nwetime = moment(new Date()).format('hh:mm A');
      // payload.content = `Your package has been picked up by ${items?.travellerid?.fullName} at ${nwetime}`;
    }

    Post('updateStatus', payload).then(res => {
      console.log(res);
      setLoading(false);
      if (res.success) {
        items.status = 'NORMAL';
        setNotification([...notification]);
        // if (newStatus === 'ACCEPTED') {
        //   socket.emit('joinRoom', locationId);
        // }

        socket.emit('statuschanged', { con_id: items?.connection, newStatus, key: 'travelerSocket' });
        // console.log(`Status updated to "${newStatus}" for conn_id ${connId}`);
        if (newStatus === 'DELIVERED') {
          CameraPeacker();
        }
      } else {
        console.log('Error updating status:', res);
      }
      // eslint-disable-next-line handle-callback-err
    }, (err) => {
      setLoading(false);
    });
  };

  const getNotification = (p) => {
    setLoading(true);
    GetApi(`getnotification?page=${p}`, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
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

          setRefreshing(false);
        } else {
          setRefreshing(false);

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

  const acceptInvitation = connect => {
    if (connect.status !== 'PENDING') {
      return;
    }
    setLoading(true);
    const data = {
      id: connect._id,
      status: 'CONNECTED',
      travellerid: connect.senderId._id,
      travelPlan: connect.travelPlan._id,
      packagePlan: connect.packagePlan._id,
      packagerid: connect.receverId,
      packagerSocket: socket.id,
    };
    Post('accept-invitation', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.success) {
          setToast('Accepted successfully');
          connect.status = 'CONNECTED';
          const singledata = notification.find(f => f._id === connect._id);
          singledata.status = 'CONNECTED';
          setNotification([...notification]);
          // socket.emit('join', res.connection._id)

          navigation.navigate('Chat', {
            locationId: res.connection._id,
          });
        } else {
          // socket.emit('join', res.connection._id)
          setToast(res.message);
          navigation.navigate('Chat', {
            locationId: res.connection._id,
          });
          console.log('error------>', res);
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

  // const ListEndLoader = () => {
  //   if (!isFirstPageReceived && isLoading) {
  //     return <ActivityIndicator size={'large'} />;
  //   }
  // };

  // if (!isFirstPageReceived && isLoading) {
  //   return <ActivityIndicator size={'small'} />;
  // }

  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getNotification(page + 1);
      setPage(page + 1);
    }
  };


  const renderItem = ({ item }) => (
    <Pressable
      style={[
        styles.cardView,
        // i === 0 && { marginTop: 20 },
        // i + 1 === notification.length && { marginBottom: 20 },
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
        source={require('../../Assets/newImgs/smallbg.png')}>


        {item.notification && (
          <View style={{
            borderBottomColor: Constants.white,
            borderBottomWidth: 2,
          }} >

            <Text
              style={{
                fontSize: 14,
                color: Constants.white,
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

        <View
          style={[
            styles.card,
            {
              flexDirection: item?.open ? 'column' : 'row',
              position: 'relative',
            },
          ]}>
          {item.travelPlan && item.status !== 'NORMAL' &&
            item.status !== 'TRACK' &&
            item.status !== 'DELIVER' &&
            item.status !== 'PICKUP' &&
            item.status !== 'REVOKE' &&
            item?.packagePlan?.jobStatus !== 'REJECTED' &&
            item?.packagePlan?.jobStatus !== 'REVOKE' && (
              <TouchableOpacity
                style={[styles.reportBtn, { width: 100 }]}
                onPress={() => {
                  if (item.status === 'PENDING') {
                    acceptInvitation(item);
                  } else {
                    // if (Platform.OS === 'android') {
                    ConnectionCheck.isConnected().then(
                      async connect => {
                        // (connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || 
                        if (!connect.isInternetReachable || (connect.isInternetReachable && ((connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || (connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || (connect.type === 'cellular' && connect.details.cellularGeneration === '2g')))) {
                          Alert.alert('Poor connection.', 'Please check your internet connection and retry again', [
                            {
                              text: 'Dismiss',
                              onPress: () => {
                              },
                            },
                          ]);
                        } else {
                          navigation.navigate('Chat', {
                            locationId: item.connection,
                          });

                        }
                      });
                    // } else {
                    //   navigation.navigate('Chat', {
                    //     locationId: item.connection,
                    //   });
                    // }
                    // socket.emit('join', item.connection)

                  }
                }}
              // disabled={item.status !== 'PENDING'}
              >
                <Text style={styles.reportBtntxt}>
                  {item.status === 'PENDING'
                    ? 'Connect'
                    : 'Connected'}
                </Text>
              </TouchableOpacity>
            )}
          {(item.status === 'NORMAL' ||
            item.status === 'TRACK' ||
            // item.status === 'DELIVER' ||
            item.status === 'PICKUP') &&
            item?.packagePlan?.jobStatus !== 'REJECTED' &&
            item?.packagePlan?.jobStatus !== 'REVOKE' && (
              <TouchableOpacity
                style={[styles.reportBtn]}
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
                        navigation.navigate('Chat', {
                          locationId: item.connection,
                        });

                      }
                    });
                  // } else {
                  //   navigation.navigate('Chat', {
                  //     locationId: item.connection,
                  //   });
                  // }
                }}>
                <Text style={styles.reportBtntxt}>Chat</Text>
              </TouchableOpacity>
            )}
          {item.status === 'DELIVER' && (
            <View style={[{
              position: 'absolute',
              right: 0,
              top: 0,
            }]}>
              <TouchableOpacity
                style={[styles.reportBtn, { position: 'relative' }]}
                onPress={() =>
                  handleStatusUpdate(item, 'DELIVERED')
                }>
                <Text style={styles.reportBtntxt}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.reportBtn, { position: 'relative', marginTop: 2 }]}
                onPress={() =>
                  handleStatusUpdate(item, 'PICUPED', 'no')
                  // props.navigation.navigate('Track', {
                  //   plan_id: item?.packagePlan?._id,
                  //   to: '',
                  // })
                }>
                <Text style={styles.reportBtntxt}>No</Text>
              </TouchableOpacity>
            </View>
          )}
          {item.status === 'TRACK' && (
            <TouchableOpacity
              style={[styles.reportBtn, { top: 45 }]}
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
                      props.navigation.navigate('Track', {
                        plan_id: item?.packagePlan?._id,
                        to: '',
                      })

                    }

                  })
                // } else {
                //   props.navigation.navigate('Track', {
                //     plan_id: item?.packagePlan?._id,
                //     to: '',
                //   })
                // }
              }

              }>
              <Text style={styles.reportBtntxt}>Track</Text>
            </TouchableOpacity>
          )}

          <View style={styles.center}>
            {item?.senderId?.profile ? (
              <Avatar.Image
                size={50}
                defaultSource={require('../../Assets/newImgs/images.png')}
                source={{ uri: `${item.travelPlan ? item?.senderId?.profile : item.packagePlan.item_image}` }}
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

              },
              !item?.open && { alignItems: 'flex-start' },
            ]}>
            <Text
              style={[
                styles.itemName,
                { marginLeft: item?.open ? 0 : 10 },
              ]}>
              {item?.senderId?.fullName}
            </Text>
            <Text
              style={[
                styles.itemName,
                { marginLeft: item?.open ? 0 : 10, fontSize: 14 },
              ]}>
              {item.packagePlan.name}
            </Text>
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
              <Text style={styles.from}>
                {item?.packagePlan?.address}
              </Text>
            </View>
            <View style={[{ flex: 2 }, styles.center]}>
              <Image
                source={require('../../Assets/newImgs/Line.png')}
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
        )}
      </ImageBackground>
    </Pressable>
  );

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
        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
          {/* <Ionicons name="arrow-back" size={25} color={Constants.black} /> */}
        </View>
        <View style={[{ flex: 10 }, styles.center]}>
          <Text
            style={{ color: Constants.black, fontSize: 24, fontWeight: '700', minWidth: 150, textAlign: 'center' }}>
            Notification
          </Text>
        </View>
        <View style={{ flex: 2 }}></View>
      </View>

      {Platform.OS === 'android' && <GestureRecognizer
        onSwipeRight={() => {
          props.navigation.navigate('History');
        }}
        onSwipeLeft={() => {
          props.navigation.navigate('Packagesuser');
        }}

        config={config}
        style={{
          flex: 1,
        }}>
        <FlatList
          style={{
            padding: 20,
          }}
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
            }}>
            <Text
              style={{ color: Constants.red, textAlign: 'center', fontSize: 20 }}>
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
          style={{
            padding: 20,
          }}
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
            }}>
            <Text
              style={{ color: Constants.red, textAlign: 'center', fontSize: 20 }}>
              No Data Found{' '}
            </Text>
          </View>
        )}
      </View>}
    </SafeAreaView>
  );
};

export default NotificationPro;
