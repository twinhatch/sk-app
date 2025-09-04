/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ImageBackground,
  Pressable,
} from 'react-native';
import React, { createRef, useContext, useEffect, useState } from 'react';
import styles from './StyleProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../../Helpers/constant';
// import { Avatar } from 'react-native-paper';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import Spinner from '../../Component/Spinner';
import { GetApi } from '../../Helpers/Service';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { socket } from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const TravelUser = props => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [userPlan, setUserPlan] = useState([]);
  const [connectionCard, setConnectionCard] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [isData, setIsData] = useState(true);
  const navigation = useNavigation();

  // useEffect(() => {
  //   travelUserPlan();
  // }, []);
  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        travelUserPlan();
      },
    );
    return () => {
      willFocusSubscription();
    };
  }, []);

  const travelUserPlan = () => {
    setLoading(true);
    GetApi('gettravelplanbyuser?from=Connection', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('TravelPlan User ---------->', res.data);
        if (res.data) {
          setUserPlan(res.data);
          if (res.data.length > 0) {
            AsyncStorage.setItem('Plans', JSON.stringify(res.data));
            travelCards(res.data[0]._id);
            setSelectedItem(res.data[0]._id);
            // setIsData(true)
          } else {
            // setIsData(false)
          }
        } else {
          console.log('error------>', res);
        }
      },
      async err => {
        setLoading(false);
        console.log(err);

        const previousData = await AsyncStorage.getItem('Plans');
        if (previousData && err === 'Poor connection') {

          setUserPlan(JSON.parse(previousData));
          setSelectedItem(previousData[0]._id);
        }
        const previousData2 = await AsyncStorage.getItem('cards');
        if (previousData2 && err === 'Poor connection') {
          setConnectionCard(JSON.parse(previousData2));
          setIsData(previousData.length > 0);
        }
      },
    );
  };

  const config = {
    // velocityThreshold: 0.3,
    directionalOffsetThreshold: 300,
  };

  const travelCards = id => {
    console.log(id);
    if (id !== undefined) {
      // setLoading(true);
      setIsData(true);
      GetApi(`getconnectionbyplan/${id}`, { ...props, setInitial }).then(
        async res => {
          // setLoading(false);
          console.log('TravelPlan cards ---------->', res.data[0]);
          if (res) {
            setConnectionCard(res.data);
            AsyncStorage.setItem('cards', JSON.stringify(res.data));
            setIsData(res.data.length > 0);
          } else {
            console.log('error------>', res);
          }
        },
        err => {
          // setLoading(false);
          console.log(err);
        },
      );
    }
  };

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
        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
          {/* <Ionicons name="arrow-back" size={25} color={Constants.black} /> */}
        </View>
        <View style={[{ flex: 10 }, styles.center]}>
          <Text
            style={{ color: Constants.black, fontSize: 24, fontWeight: '700', fontFamily: 'Helvetica' }}>
            Chats
          </Text>
        </View>
        <View style={{ flex: 2 }}></View>
      </View>
      <GestureRecognizer
        onSwipeLeft={() => {
          props.navigation.navigate('Home');
        }}
        onSwipeRight={() => {
          props.navigation.navigate('Notification');
        }}
        config={config}
        style={{
          flex: 1,
        }}>
        <ScrollView style={[styles.mainBg, {
          borderRadius: 0, borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }]}>
          {userPlan.length > 0 && (
            <Dropdown
              style={styles.dropdown}
              containerStyle={{ borderRadius: 25, overflow: 'hidden' }}
              itemTextStyle={{ color: Constants.black, fontFamily: 'Helvetica' }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={userPlan}
              searchField="name"
              search
              maxHeight={300}
              labelField="name"
              valueField="_id"
              placeholder="Select your plan"
              searchPlaceholder="Search..."
              value={selectedItem}
              onChange={item => {
                console.log(item);
                setSelectedItem(item._id);
                travelCards(item._id);
              }}
            />
          )}
          {connectionCard.length > 0 &&
            connectionCard?.map((item, i) => {
              return (
                <Pressable
                  key={i}
                  style={styles.cardView}
                  onPress={() => {
                    if (item.open === undefined) {
                      item.open = true;
                    } else {
                      item.open = !item.open;
                    }
                    setConnectionCard([...connectionCard]);
                  }}>
                  <ImageBackground
                    resizeMode="cover"
                    source={require('../../Assets/newImgs/smallbg2.png')}>
                    <TouchableOpacity
                      style={styles.reportBtn}
                      onPress={() => {
                        // socket.emit('join', item._id);
                        navigation.navigate('Chats', {
                          locationId: item._id,
                        });
                      }}>
                      <Text style={styles.reportBtntxt}>Chat</Text>
                    </TouchableOpacity>
                    <View
                      style={[
                        styles.card,
                        { flexDirection: item?.open ? 'column' : 'row' },
                      ]}>
                      <View style={styles.center}>
                        {item?.packagePlan?.item_image ? (
                          <Avatar.Image
                            onError={e => {
                              console.log(e);
                            }}
                            size={70}
                            source={{ uri: `${item?.packagePlan?.item_image}` }}
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
                            flex: 1
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
                    </View>
                    {item?.open && (
                      <View style={{ padding: 20, paddingTop: 0, flex: 1 }}>
                        <View style={[styles.subCard, { flex: 1 }]}>
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
                          <View style={{ ...styles.normalField, marginTop: 10, fontFamily: 'Helvetica' }}>
                            <Text style={{ color: Constants.black, padding: 10, fontFamily: 'Helvetica' }}>
                              {item?.packagePlan?.description}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </ImageBackground>
                </Pressable>
              );
            })}
        </ScrollView>

        {connectionCard.length === 0 && !isData && (
          <View
            style={{
              flex: 1,
              backgroundColor: Constants.lightTraveller,
            }}>
            <Text
              style={{ color: Constants.black, textAlign: 'center', fontSize: 20, fontFamily: 'Helvetica' }}>
              No Connection Found
            </Text>
          </View>
        )}

        {userPlan.length === 0 && !loading && (
          <View
            style={{
              flex: 1,
              backgroundColor: Constants.lightTraveller,
            }}>
            <Text
              style={{ color: Constants.black, textAlign: 'center', fontSize: 20, fontFamily: 'Helvetica' }}>
              No Travel Plan Found
            </Text>
          </View>
        )}
      </GestureRecognizer>
    </SafeAreaView>
  );
};

export default TravelUser;
