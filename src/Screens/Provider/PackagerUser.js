/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Pressable,
} from 'react-native';
import React, { createRef, useContext, useEffect, useState } from 'react';
import styles from './StyleProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../../Helpers/constant';
import { Avatar } from 'react-native-paper';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import Spinner from '../../Component/Spinner';
import { GetApi } from '../../Helpers/Service';
import { SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { socket } from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PackagerUser = props => {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [userPlan, setUserPlan] = useState([]);
  const [connectionCard, setConnectionCard] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isData, setIsData] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {
        ProviderUserPlan();
      },
    );
    return () => {
      willFocusSubscription();
    };
  }, []);

  const ProviderUserPlan = () => {
    setLoading(true);
    GetApi('getpackagesbyuser?from=Connection', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('TravelPlan User ---------->', res.data);
        if (res.data) {
          setUserPlan(res.data);
          if (res.data.length > 0) {
            AsyncStorage.setItem('Plans', JSON.stringify(res.data));

            setSelectedItem(res.data[0]._id);
            ProviderCards(res.data[0]._id);
          }
        } else {
          console.log('error------>', res);
        }
      },
      async err => {
        setLoading(false);
        console.log(err); const previousData = await AsyncStorage.getItem('Plans');
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

  const ProviderCards = id => {
    setIsData(true);
    // setLoading(true);
    GetApi(`getconnectionbyplan/${id}`, { ...props, setInitial }).then(
      async res => {
        // setLoading(false);
        // console.log('ProviderPlan cards ---------->', res.data);
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
  };

  const config = {
    // velocityThreshold: 0.3,
    directionalOffsetThreshold: 300,
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
            style={{ color: Constants.black, fontSize: 24, fontWeight: '700' }}>
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
              itemTextStyle={{ color: Constants.black }}
              style={styles.dropdown}
              // activeColor={Constants.pink}
              containerStyle={{ borderRadius: 25, overflow: 'hidden' }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={userPlan}
              searchField="name"
              search
              maxHeight={500}
              labelField="name"
              valueField="_id"
              placeholder="Select your package"
              searchPlaceholder="Search..."
              value={selectedItem}
              onChange={item => {
                console.log(item);
                setSelectedItem(item._id);
                ProviderCards(item._id);
              }}
            />
          )}
          {connectionCard.length > 0 &&
            connectionCard.map(item => {
              return (
                <Pressable
                  key={item._id}
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
                    source={require('../../Assets/newImgs/smallbg.png')}>
                    {/* {item?.open && ( */}
                    <TouchableOpacity
                      style={[styles.reportBtn, { top: 5 }]}
                      onPress={() => {
                        // socket.emit('join', item._id);
                        navigation.navigate('Chat', {
                          locationId: item._id,
                        });
                      }}>
                      <Text style={styles.reportBtntxt}>Chat</Text>
                    </TouchableOpacity>
                    {/* )} */}

                    <View
                      style={[
                        styles.card,
                        { flexDirection: item?.open ? 'column' : 'row' },
                      ]}>
                      <View style={styles.center}>
                        {item?.travellerid?.profile ? (
                          <Avatar.Image
                            size={70}
                            source={{ uri: `${item?.travellerid?.profile}` }}
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
                          {item?.travellerid?.fullName}
                        </Text>
                        {/* <StarRating
                        rating={item?.travellerid?.rating || 0}
                        starSize={20}
                        starStyle={{padding: 0}}
                      /> */}
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
                // <TouchableOpacity
                //   key={item._id}
                //   onPress={() => {
                //     navigation.navigate('Chat', {
                //       locationId: item.notification,
                //     });
                //   }}>
                //   <View key={item._id} style={styles.card}>
                //     <View style={styles.center}>
                //       {item?.travellerid?.profile ? (
                //         <Avatar.Image
                //           size={70}
                //           source={{uri: `${item?.travellerid?.profile}`}}
                //         />
                //       ) : (
                //         <Avatar.Image
                //           size={70}
                //           source={require('../../Assets/newImgs/images.png')}
                //         />
                //       )}
                //     </View>
                //     <View style={[styles.center, {marginVertical: 10}]}>
                //       <Text
                //         style={{
                //           color: Constants.black,
                //           fontSize: 24,
                //           fontWeight: 700,
                //         }}>
                //         {item?.travellerid?.fullName}
                //       </Text>
                //     </View>
                //     <View style={styles.subCard}>
                //       <View
                //         style={{
                //           flex: 3,
                //           flexDirection: 'column',
                //           justifyContent: 'center',
                //           alignItems: 'flex-end',
                //         }}>
                //         <Text style={styles.from}>From</Text>
                //         <Text style={styles.from}>
                //           {item?.travelPlan?.fromaddress}
                //         </Text>
                //       </View>
                //       <View style={[{flex: 2}, styles.center]}>
                //         <Image
                //           source={require('../../Assets/newImgs/Line.png')}
                //           style={{width: 60, objectFit: 'contain'}}
                //         />
                //       </View>
                //       <View
                //         style={{
                //           flex: 3,
                //           flexDirection: 'column',
                //           justifyContent: 'center',
                //           alignItems: 'flex-start',
                //         }}>
                //         <Text style={styles.to}>TO</Text>
                //         <Text style={styles.to}>
                //           {item?.travelPlan?.toaddress}
                //         </Text>
                //       </View>
                //     </View>
                //   </View>
                // </TouchableOpacity>
              );
            })}
        </ScrollView>

        {connectionCard.length === 0 && !isData && (
          <View
            style={{
              flex: 1,
              backgroundColor: Constants.pink,
            }}>
            <Text
              style={{ color: Constants.red, textAlign: 'center', fontSize: 20 }}>
              No Connection Found
            </Text>
          </View>
        )}

        {userPlan.length === 0 && !loading && (
          <View
            style={{
              flex: 1,
              backgroundColor: Constants.pink,
            }}>
            <Text
              style={{ color: Constants.red, textAlign: 'center', fontSize: 20 }}>
              No Package Found
            </Text>
          </View>
        )}
      </GestureRecognizer>
    </SafeAreaView>
  );
};

export default PackagerUser;
