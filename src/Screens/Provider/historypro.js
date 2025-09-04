/* eslint-disable no-sparse-arrays */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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
  Modal,
  TextInput,
  FlatList,
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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating-widget';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';


const History = props => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [singleConn, setSingleConn] = useState({});
  const [details, setDetails] = useState('');
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        getHistory(page);
      },
    );
    return () => {
      willFocusSubscription();
    };
  }, []);

  const ratting = (user, rating) => {
    setLoading(true);
    const data = {
      user,
      description: '',
      rating,
    };
    Post('sendreview', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('rating ---------->', res);
        // if (res.success) {
        //   setHistory(res.data);
        // } else {
        //   console.log('error------>', res);
        // }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const createReport = () => {

    if (details === '') {
      setToast('Report Description is required');
      return;
    }
    setLoading(true);
    const data = {
      issue: details,
      user: singleConn.user._id,
      userType: 'USER',
      connection: singleConn.connections[0]._id,
    };
    Post('report', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('rating ---------->', res);
        setModalVisible(false);
        setSingleConn({});
        setToast(res.data.message);
        setDetails('');
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  const getHistory = (p) => {
    setLoading(true);
    GetApi(`getPackagesByUserHistory?page=${p}`, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('history ---------->', res.data[0]?.rating);
        if (res.status) {
          setCurrentData(res.data);
          if (p === 1) {
            setHistory(res.data);
            AsyncStorage.setItem('History', JSON.stringify(res.data));
          } else {
            setHistory([...history, ...res.data]);
            AsyncStorage.setItem('History', JSON.stringify([...history, ...res.data]))
          }
          setHistory(res.data);
        } else {
          console.log('error------>', res);
        }
      },
      async err => {
        setLoading(false);
        const previousData = await AsyncStorage.getItem('History');
        if (previousData && err === 'Poor connection') {
          setHistory(JSON.parse(previousData));
        }
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
      getHistory(page + 1);
      setPage(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={[
        styles.cardView,

      ]}
      onPress={() => {
        if (item.open === undefined) {
          item.open = true;
        } else {
          item.open = !item.open;
        }
        setHistory([...history]);
      }}>
      <ImageBackground
        resizeMode="cover"
        source={require('../../Assets/newImgs/smallbg.png')}>
        {item?.open && item.jobStatus !== 'TIMEUP' && (
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => {
              console.log('clicked')
              // props.navigation.navigate('Report', { ...item });
              setModalVisible(true);
              setSingleConn(item);
            }}>
            <Text style={styles.reportBtntxt}>Report</Text>
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.card,
            { flexDirection: item?.open ? 'column' : 'row' },
          ]}>
          <View style={styles.center}>
            {item?.traveller?.profile || item?.user?.profile ? (
              <Avatar.Image
                size={70}
                source={{ uri: `${item.jobStatus !== 'TIMEUP' ? item?.traveller?.profile : item?.user?.profile}` }}
              //source={require('../../Assets/newImgs/images.png')}
              />
            ) : (
              <Avatar.Image
                size={70}
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
              {item.jobStatus !== 'TIMEUP' ? item?.traveller?.fullName : item?.user?.fullName}
            </Text>
            {item.jobStatus !== 'TIMEUP' && <StarRating
              rating={item?.rating?.rating || 0}
              onChange={rate => {
                if (item?.rating) {
                  item.rating.rating = rate;
                } else {
                  item.rating = {
                    rating: rate,
                  };
                }
                setHistory([...history]);
                ratting(item?.traveller._id, rate);
              }}
              starSize={20}
              starStyle={{ padding: 0 }}
              enableHalfStar={false}
            />}
            {item.jobStatus === 'TIMEUP' && <Text
              style={[
                styles.itemName,
                { marginLeft: item?.open ? 0 : 10 },
              ]}>
              TIMEUP
            </Text>}
          </View>
          {/* {!item?.open && ( */}
          <View
            style={[{
              flex: 3,
              flexDirection: 'column',
              justifyContent: 'center',

            }, item?.open ? { alignItems: 'center' } : { alignItems: 'flex-end' }]}>
            <Text style={styles.itemName}>{item.name}</Text>
            {/* <Text style={styles.from} numberOfLines={3}>
            {item?.address}
          </Text> */}
          </View>
          {/* )} */}
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
                {item?.address}
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
                {item?.delivery_address}
              </Text>
            </View>
          </View>
        )}
      </ImageBackground>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Spinner color={'#fff'} visible={loading} />
      <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      />
      <View style={{ flexDirection: 'row', paddingHorizontal: 24 }}>
        {/* <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="arrow-back" size={25} color={Constants.black} />
        </View> */}
        <View style={[{ flex: 10 }, styles.center]}>
          <Text
            style={{ color: Constants.black, fontSize: 24, fontWeight: '700', minWidth: 100, textAlign: 'center' }}>
            History
          </Text>
        </View>
        {/* <View style={{flex: 2}}></View> */}
      </View>
      {Platform.OS === 'android' && <GestureRecognizer
        onSwipeRight={() => {
          props.navigation.navigate('Home');
        }}
        onSwipeLeft={() => {
          props.navigation.navigate('Notification');
        }}
        config={config}
        style={{
          flex: 1,
        }}>
        {history.length === 0 && !loading && (
          <View
            style={{
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: Constants.pink,
            }}>
            <Text
              style={{ color: Constants.red, textAlign: 'center', fontSize: 20 }}>
              No Data Found
            </Text>
          </View>
        )}
        <FlatList
          style={{
            padding: 20,
          }}
          data={history}
          renderItem={renderItem}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.8}
        />
      </GestureRecognizer>}
      {Platform.OS === 'ios' && <View
        style={{
          flex: 1,
        }}>
        {history.length === 0 && !loading && (
          <View
            style={{
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: Constants.pink,
            }}>
            <Text
              style={{ color: Constants.red, textAlign: 'center', fontSize: 20 }}>
              No Data Found
            </Text>
          </View>
        )}
        <FlatList
          style={{
            padding: 20,
          }}
          data={history}
          renderItem={renderItem}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.8}
        />
      </View>}
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
              <Text style={styles.textStyle}>Report</Text>
              <View style={{ width: '100%' }}>
                <TextInput
                  multiline={true}
                  numberOfLines={5}
                  maxLength={500}
                  value={details}
                  placeholder="Description"
                  placeholderTextColor={Constants.grey}
                  textAlignVertical="top"
                  style={{
                    textAlign: 'left',
                    color: Constants.black,
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    minHeight: 100,
                    borderWidth: 1,
                    width: 300,
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 10,
                    fontFamily: 'Helvetica',
                  }}
                  onChangeText={detail => setDetails(detail)}
                />
              </View>

              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setModalVisible(false);
                    setSingleConn({});
                  }}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    createReport();
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Add Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default History;
