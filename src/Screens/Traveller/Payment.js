/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Linking, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './StyleProvider';
import Constants from '../../Helpers/constant';
import { Checkbox } from 'react-native-paper';
import { GetApi, Post } from '../../Helpers/Service';
import { Context, UserContext, toastContext } from '../../../App';
import Spinner from '../../Component/Spinner';
import CustomToaster from '../../Component/CustomToaster';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';

let charges = {
  COUNTRY: 30,
  STATE: 15,
  CITY: 10,
  LOCAL: 5,
};

const width = Dimensions.get('window').width;

const Payment = props => {
  console.log(props);
  const [toast, setToast] = useContext(toastContext);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [initial, setInitial] = useContext(Context);
  const [travelPlan, setTravelPlan] = useState({});
  const [packagePlan, setPackagePlan] = useState();
  const [charge, setCharge] = useState(0);
  const [user, setUser] = useContext(UserContext);
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    let data;
    if (props?.route?.params?.travelPlan) {
      data = JSON.parse(props?.route?.params?.travelPlan);
      setTravelPlan(data);
    } else if (props?.route?.params?.packagePlan) {
      data = JSON.parse(props?.route?.params?.packagePlan);
      setPackagePlan(data);
    }
    getProfile()
    console.log('props------->', data);
  }, []);

  const getProfile = () => {
    setLoading(true);
    GetApi('getProfile', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res) {
          setUser(res.data);
          setProfileData(res.data)
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

  const submit = () => {
    if (!travelPlan?.jurney_date) {
      return;
    }
    if (!checked) {
      setToast('Please accept our terms and condition');
      return;
    }
    if (profileData.completedDelivery >= 20 && profileData.vault >= (Number(charges[travelPlan.route]) * 3)) {
      postTravellPlan();
      return;
    }

    const payData = {
      amount: (Number(charges[travelPlan.route]) * 100),
      currency: 'INR',
    };
    setLoading(true);
    Post('create-payment', payData, { ...props, setInitial }).then(async (re) => {
      if (re.status) {
        setLoading(false);
        var options = {
          description: 'Credits towards consultation',
          image: 'https://lh3.googleusercontent.com/9aKvLMPuEtOra2-zrhSMG94vUawxN3clNTylESkeEEXWNcMQKAWjXFUnuoZr-5_CQPk',
          currency: 'INR',
          key: 'rzp_live_qc8SViDoAjPhOW',
          amount: (Number(charges[travelPlan.route]) * 100),
          name: 'SK Travel and Earn',
          order_id: re.data.id,//Replace this with an order_id created using Orders API.
          prefill: {
            email: user.email,
            contact: user.phone,
            name: user.fullName,
          },
          theme: { color: Constants.traveller },
        };
        RazorpayCheckout.open(options).then((datas) => {
          // handle success
          postTravellPlan(datas)
        }).catch((error) => {
          setToast('Payment Declined');
        });
      } else {
        setToast(re.message);
        setLoading(false)
        console.log(re)
      }
    }, err => {
      setLoading(false);
      console.log(err);
    },);
  };

  const postTravellPlan = (datas) => {
    setLoading(true);
    travelPlan.payamount = charges[travelPlan.route];
    if (datas) {
      travelPlan.paymentDetail = datas;
    }
    Post('createtravelplan', travelPlan, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setToast(res.data.message);
          await AsyncStorage.removeItem('travelplan');
          if (res.data.verified) {
            props.navigation.replace('traveller', { screen: 'home' });
          } else {
            props.navigation.replace('EditProfile');
          }

        } else {
          setToast(res.message);
          console.log('error------>', res);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  }

  const submitPackagePlan = () => {
    if (!packagePlan?.address) {
      return;
    }
    if (!checked) {
      setToast('Please accept our terms and condition');
      return;
    }
    const data = {
      ...packagePlan,
      phone: packagePlan.formatedPhone,
    };
    setLoading(true);
    Post('createpackage', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setToast(res.data.message);
          await AsyncStorage.removeItem('packageplan');
          props.navigation.replace('provider', { screen: 'home' });
        } else {
          setToast(res.message);
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
    <SafeAreaView style={styles.container}>
      <Spinner color={'#fff'} visible={loading} />
      {/* <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      /> */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 24 }}>
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
          <Text
            style={{ color: Constants.black, fontSize: 24, fontWeight: '700', fontFamily: 'Helvetica' }}>
            Payment
          </Text>
        </View>
        <View style={{ flex: 2 }} />
      </View>
      <View
        style={{
          height: '94%',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginTop: 10,
        }}>
        <View
          style={{
            width: '100%',
            borderBottomWidth: 1,
            borderColor: Constants.grey,
            padding: 10,
            flexDirection: 'row',
          }}>
          <View style={{ flex: 4 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: Constants.black,
                fontFamily: 'Helvetica'
              }}>
              Post your Travel Plan.
            </Text>
            <Text style={{ fontSize: 20, color: Constants.black, fontFamily: 'Helvetica' }}>
              Amount to pay in Advance
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: Constants.black,
                fontFamily: 'Helvetica'
              }}>
              ₹{charges[travelPlan.route]}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <Text
            style={{
              color: Constants.black,
              textAlign: 'left',
              fontWeight: 'bold',
              fontSize: 20,
              fontFamily: 'Helvetica'
            }}>
            Pay with
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderWidth: 1,
                borderColor: Constants.grey,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 40,
                  color: Constants.black,
                  textAlign: 'center',
                  fontFamily: 'Helvetica'
                }}>
                +
              </Text>
            </View>

            <View
              style={{
                width: 120,
                height: 120,
                padding: 10,
                backgroundColor: Constants.traveller,
                borderRadius: 10,
                flexDirection: 'column',
                alignItems: 'start',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 15, color: Constants.black, fontFamily: 'Helvetica' }}>Razor Pay</Text>
              <Text style={{ fontSize: 20, color: Constants.black, fontFamily: 'Helvetica' }}>
                ₹{charges[travelPlan.route]}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: 10,
              zIndex: 9,
            }}>
            <Checkbox.Android
              label="item"
              status={checked ? 'checked' : 'unchecked'}
              uncheckedColor={Constants.blue}
              onPress={() => setChecked(!checked)}
              style={{ borderColor: Constants.blue, borderWidth: 1 }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 5,
              }}>
              <Text
                style={{
                  color: Constants.black,
                  flexWrap: 'wrap',
                  fontSize: 14,
                  margin: 0,
                  width: width - 70,
                  fontFamily: 'Helvetica'
                }}>
                Yes, I Accept the {' '}
                {/* <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}> */}
                <Text
                  onPress={() =>
                    Linking.openURL(
                      'https://www.sadanamkayyilundo.in/terms-condition',
                    )
                  }
                  style={{
                    color: Constants.red,
                    fontSize: 14,
                    fontFamily: 'Helvetica'
                  }}>
                  Terms of Service
                </Text>{' '}
                {/* </TouchableOpacity>{' '} */}
                and {/* <TouchableOpacity> */}
                <Text
                  style={{ color: Constants.red, fontSize: 14, fontFamily: 'Helvetica' }}
                  onPress={() =>
                    Linking.openURL(
                      'https://www.sadanamkayyilundo.in/privacy-policy',
                    )
                  }>
                  Privacy Policy
                </Text>
                {/* </TouchableOpacity> */}
              </Text>
              {/* <Text
                style={{
                  flexWrap: 'wrap',
                  fontSize: 15,
                  margin: 0,
                  color: Constants.black,
                }}>
                Yes, I Accept the
                <Text style={{ color: Constants.red }}>
                  {' terms & Conditions'}
                </Text>
              </Text> */}
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              //props.navigation.goBack();
              if (packagePlan?.name) {
                submitPackagePlan();
              } else {
                submit();
              }
            }}
            style={{
              width: '100%',
              padding: 15,
              backgroundColor: Constants.traveller,
              borderRadius: 50,
              paddingHorizontal: 40,
            }}>
            <Text
              style={{
                color: Constants.black,
                textAlign: 'center',
                fontSize: 20,
                fontFamily: 'Helvetica'
              }}>
              Pay ₹{charges[travelPlan.route]}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Payment;
