/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  NativeModules,
  TextInput,
} from 'react-native';

import React, { useState, useContext, useEffect } from 'react';
import Constants from '../../Helpers/constant';
import Styles from './Styles';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import { Post } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import OneSignal from 'react-native-onesignal';
import { Context, UserContext } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
// import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { PassIcon, UserInputIcon } from '../../Component/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { OneSignal } from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import { socket } from '../../../utils';
import SplashScreen from 'react-native-splash-screen';

// const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});

const SignIn = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [user, setUser] = useContext(UserContext);
  const [showPass, setShowPass] = useState(true);
  const [filedCheck, setfiledCheck] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: '',
    password: '',
  });

  const [users, setUsers] = useState();

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      async () => {

        // await AsyncStorage.removeItem('user');
        const u = await AsyncStorage.getItem('user');
        if (u) {
          SplashScreen.hide();
          console.log('JSON.parse(u)========>', JSON.parse(u));
          setUsers(JSON.parse(u));
          setUserDetail({
            ...userDetail,
            email: JSON.parse(u).username,
          });
        } else {
          setUsers(u);
        }

      },
    );

    return () => {
      willFocusSubscription();
    };
  }, []);

  // useEffect(() => {
  //   const deviceState =
  //     OneSignal.User.pushSubscription.getIdAsync();
  //   console.log('devicestate----->', deviceState);
  // }, [OneSignal]);



  const submitProvider = () => {
    props.navigation.navigate('provider', {
      screen: 'Home',
    });
    return;
  };

  const submitTraveller = async () => {
    const player_id = await OneSignal.User.pushSubscription.getIdAsync();
    const device_token =
      await OneSignal.User.pushSubscription.getTokenAsync();

    console.log('devicestate----->', player_id, device_token);
    console.log(userDetail);
    let { errorString, anyEmptyInputs } = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);

    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      const emailcheck = checkEmail(userDetail.email);
      if (!emailcheck) {
        setToast('Your email id is invalid');
        return;
      }
      // : await DeviceInfo.getAndroidId(),
      const data = {
        email: userDetail.email.toLowerCase(),
        password: userDetail.password,
        player_id,
        device_token: device_token || await DeviceInfo.getAndroidId(),
      };
      setLoading(true);

      // OneSignal.getDeviceState().then(
      //   async d => {
      // console.log('d==========>', d);
      // (data.device_token = d.pushToken), (data.player_id = d.userId);
      console.log('data==========>', data);

      Post('login', data, { ...props, setInitial }).then(
        async res => {

          console.log('------------>', res);
          if (res.status) {
            if (res.data.type === 'USER' || res.data.type === 'TRAVELLER') {
              await AsyncStorage.setItem(
                'userDetail',
                JSON.stringify(res.data),
              );
              // socket.on('connect', () => {
              //   console.log('soket id from appjs ->', socket.id);
              // })
              setUser(res.data);
              setUserDetail({
                email: '',
                password: '',
              });
              if (res.data.type === 'USER') {
                setLoading(false);
                setInitial('user');
                props.navigation.replace('provider', {
                  screen: 'Home',
                });

              }
              if (res.data.type === 'TRAVELLER') {
                setLoading(false);
                setInitial('traveller');
                props.navigation.replace('traveller', {
                  screen: 'Home',
                });

              }
              setLoading(false);
            } else {
              setLoading(false);
              setToast('Sorry, Only normal user could use this app');
            }
          } else {
            setLoading(false);
            console.log(res.message);
            setToast(res.message);
            // Toaster(res.message);
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    }
  };

  return (
    <SafeAreaView style={Styles.container}>
      {/* <View
        style={Styles.container}
        colors={['#000', '#000', '#14110B', '#D8B075']}> */}
      <Spinner color={'#fff'} visible={loading} />
      <CustomToaster
        color={Constants.black}
        backgroundColor={Constants.white}
        timeout={5000}
        toast={toast}
        setToast={setToast}
      />

      <KeyboardAwareScrollView
        style={Styles.keyboard}
        behavior={'height'}
        enabled
        keyboardVerticalOffset={10}
        keyboardShouldPersistTaps="always">
        <View style={Platform.OS === 'ios' && { padding: 20 }}>
          <Text style={Styles.title}>Let’s Sign You In</Text>
          <Text style={Styles.subtitle}>
            Welcome back, you’ve been missed!
          </Text>
          <View
            style={[Styles.fieldView, { marginTop: 80, position: 'relative' }]}>
            <Text style={[Styles.label, { minWidth: 105 }]}>Email Address</Text>
            <TextInput
              style={Styles.input}
              // placeholder="UserID or Email"
              placeholder="Email Address"
              placeholderTextColor={Constants.lightgrey}
              value={userDetail.email}
              onChangeText={email => setUserDetail({ ...userDetail, email })}
            />
          </View>
          {filedCheck.includes('EMAIL') && (
            <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> Email is required</Text>
          )}

          <View style={[Styles.fieldView, { position: 'relative' }]}>
            <Text style={[Styles.label, { minWidth: 75 }]}>Password</Text>
            <TextInput
              style={Styles.input}
              placeholder="Password"
              secureTextEntry={showPass}
              placeholderTextColor={Constants.lightgrey}
              value={userDetail.password}
              onChangeText={password =>
                setUserDetail({ ...userDetail, password })
              }
            />
            <TouchableOpacity
              onPress={() => {
                setShowPass(!showPass);
              }}
              style={[Styles.iconView, { borderRightWidth: 0 }]}>
              <Ionicons
                name={showPass ? 'eye-off' : 'eye'}
                size={25}
                color={Constants.grey}
              />
            </TouchableOpacity>
          </View>
          {filedCheck.includes('PASSWORD') && (
            <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> Password is required</Text>
          )}

          {/* <View
            style={[
              {
                marginTop: 30,
                flex: 1,
                alignItems: 'center',
              },
            ]}> */}
          <TouchableOpacity style={[Styles.applyBtn, { marginTop: 30 }]} onPress={submitTraveller}>
            <Text
              style={[
                Styles.applyBtnTxt,
                { fontSize: 16, lineHeight: 25, fontFamily: 'Helvetica' },
              ]}>
              SignIn
            </Text>

          </TouchableOpacity>
          {/* </View> */}
        </View>



        <View style={{ flexDirection: 'column', marginTop: 20 }}>
          {/* <View style={{flex: 1, alignItems: 'flex-Start'}}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('ForgotPassword');
                }}>
                <Text
                  style={[
                    Styles.forgot,
                    Platform.OS === 'ios' && {marginRight: 20},
                  ]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View> */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Signup')}>
              <Text style={[Styles.forgot]}>
                Dont’s have an account?{' '}
                <Text style={{ color: Constants.red, fontFamily: 'Helvetica' }}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ForgotPassword')}>
              <Text style={[Styles.forgot]}>
                <Text style={{ color: Constants.red, fontFamily: 'Helvetica' }}>Forgot Password?</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View
          style={[
            {
              flex: 1,
              alignItems: 'center',
            },
            Platform.OS == 'ios' && {padding: 20},
          ]}>
          {/* <TouchableOpacity onPress={checkSupport} style={[Styles.applyBtn]}>
            <Text style={[Styles.applyBtnTxt, {fontSize: 22, lineHeight: 25}]}>
              Finger print
            </Text>
          </TouchableOpacity> */}
        {/* </View> */}

        {/* <View style={Styles.acountBtn}>
            <Text style={Styles.Already}>Don't have an Account ?</Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Signup')}>
              <Text style={Styles.signin}> Sign up</Text>
            </TouchableOpacity>
          </View> */}
      </KeyboardAwareScrollView>
      {/* </View> */}
    </SafeAreaView>
  );
};

export default SignIn;
