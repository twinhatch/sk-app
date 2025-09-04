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
import { Post } from '../../Helpers/Service';
import { Context, UserContext, toastContext } from '../../../App';
import Spinner from '../../Component/Spinner';
import CustomToaster from '../../Component/CustomToaster';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import Charges from '../../Helpers/Charges';
import { socket } from '../../../utils';

let charges = {
  COUNTRY: { lp: 20, mp: 3 },
  STATE: { lp: 7, mp: 2 },
  CITY: { lp: 7, mp: 2 },
  LOCAL: { lp: 7, mp: 2 },
};

const width = Dimensions.get('window').width;

const PaymentPro = props => {
  // console.log(props);
  const [toast, setToast] = useContext(toastContext);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [initial, setInitial] = useContext(Context);
  const [travelPlan, setTravelPlan] = useState({});
  const [packagePlan, setPackagePlan] = useState();
  const [charge, setCharge] = useState(0);
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    let data;
    data = JSON.parse(props?.route?.params?.packagePlan);
    setPackagePlan(data);

  }, []);

  useEffect(() => {
    if (packagePlan?.bonus !== undefined) {
      // console.log(packagePlan.value, packagePlan.route, packagePlan.bonus);
      // let lp =
      //   (Number(packagePlan.value) / 100) * charges[packagePlan.route]?.lp;
      // let subAmount = Number(packagePlan.bonus) + lp;
      // let mp = (subAmount / 100) * charges[packagePlan.route]?.mp;
      // let amount = subAmount + mp;
      // console.log(packagePlan.bonus, lp, mp, subAmount, amount);
      // setCharge(amount.toFixed(2));
      const localData = Charges(packagePlan.km, packagePlan.weight, packagePlan?.value, packagePlan?.bonus);
      // console.log(localData);
      setCharge(localData.charge.toFixed(2));
      let data = {
        ...packagePlan,
        phone: packagePlan.formatedPhone,
        total: charge,
      };
      if (packagePlan.pickupaddress === '') {
        data.pickupaddress = packagePlan.address;
      }

      if (packagePlan.pickupaddress === '') {
        data.fulldelivery_address = packagePlan.delivery_address;
      }
      console.log('payment then data ======>', data)

    }
  }, [packagePlan]);

  const submitPackagePlan = () => {
    if (!packagePlan?.address) {
      return;
    }
    if (!checked) {
      setToast('Please accept our terms and condition');
      return;
    }
    const payData = {
      amount: (Number(charge) * 100),
      currency: 'INR',
    };
    setLoading(true)
    Post('create-payment', payData, { ...props, setInitial }).then(async (re) => {
      if (re.status) {
        var options = {
          description: 'Credits towards consultation',
          image: 'https://lh3.googleusercontent.com/9aKvLMPuEtOra2-zrhSMG94vUawxN3clNTylESkeEEXWNcMQKAWjXFUnuoZr-5_CQPk',
          currency: 'INR',
          key: 'rzp_live_qc8SViDoAjPhOW',
          amount: (Number(charge) * 100),
          name: 'SK Travel and Earn',
          order_id: re.data.id,//Replace this with an order_id created using Orders API.
          prefill: {
            email: user.email,
            contact: user.phone,
            name: user.fullName,
          },
          theme: { color: Constants.provider },
        };
        RazorpayCheckout.open(options).then((datas) => {
          // handle success
          let data = {
            ...packagePlan,
            phone: packagePlan.formatedPhone,
            total: charge,
            paymentDetail: datas,
          };
          if (packagePlan.pickupaddress === '') {
            data.pickupaddress = packagePlan.address;
          }

          if (packagePlan.pickupaddress === '') {
            data.fulldelivery_address = packagePlan.delivery_address;
          }
          console.log('payment then data ======>', data)
          setLoading(true);
          Post('createpackage', data, { ...props, setInitial }).then(
            async res => {
              setLoading(false);
              console.log(res);
              if (res.status) {
                setToast(res.data.message);
                await AsyncStorage.removeItem('packageplan');
                socket.emit('packagecreated')
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
        }).catch((error) => {
          setToast('Payment Declined');
          setLoading(false)
          // handle failure
          // alert(`Error: ${error.code} | ${error.description}`);
        });
      } else {
        setToast(re.message);
        setLoading(false)
        console.log(re)
      }
    }, err => {
      console.log(err)
      setLoading(false)
    });



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
            style={{ color: Constants.black, fontSize: 24, fontWeight: '700' }}>
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
          <View style={{ flex: 2 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: Constants.black,
              }}>
              Post your Package.
            </Text>
            <Text style={{ fontSize: 16, color: Constants.black, fontFamily: 'Helvetica' }}>
              Amount to pay in Advance
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: Constants.black,
              }}>
              ₹{charge}
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
                }}>
                +
              </Text>
            </View>

            <View
              style={{
                width: 120,
                height: 120,
                padding: 10,
                backgroundColor: Constants.red,
                borderRadius: 10,
                flexDirection: 'column',
                alignItems: 'start',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 15, color: Constants.white, fontFamily: 'Helvetica' }}>Razor Pay</Text>
              <Text style={{ fontSize: 20, color: Constants.white, fontFamily: 'Helvetica' }}>
                ₹{charge}
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
                  }}>
                  Terms of Service
                </Text>{' '}
                {/* </TouchableOpacity>{' '} */}
                and {/* <TouchableOpacity> */}
                <Text
                  style={{ color: Constants.red, fontSize: 14 }}
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
              submitPackagePlan();
            }}
            style={{
              width: '100%',
              padding: 15,
              backgroundColor: Constants.darkRed,
              borderRadius: 50,
              paddingHorizontal: 40,
            }}>
            <Text
              style={{
                color: Constants.white,
                textAlign: 'center',
                fontSize: 20,
              }}>
              Pay ₹{charge}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentPro;
