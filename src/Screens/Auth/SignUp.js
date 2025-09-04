/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Dimensions,
} from 'react-native';
import React, { useState, useContext, useRef, createRef } from 'react';
import Constants from '../../Helpers/constant';
import Styles from './Styles';
import { RadioButton } from 'react-native-paper';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import { ApiFormData, Post, checkOtpStatus } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { PassIcon, UserInputIcon } from '../../Component/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import LocationDropdown from '../../Component/LocationDropdown';
import { Checkbox, ActivityIndicator } from 'react-native-paper';
import PhoneInput, { isValidNumber } from 'react-native-phone-number-input';
import CameraGalleryPeacker from '../../Component/CameraGalleryPeacker';
// import { Form, TextValidator } from 'react-native-validator-form';
import moment from 'moment';


const dList = [
  { name: 'UK', id: 'uk' },
  { name: 'Germony', id: 'Dgr' },
];
const width = Dimensions.get('window').width;
const SignUp = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [showPass, setShowPass] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filedCheck, setfiledCheck] = useState([]);
  const [otp, setOtp] = useState('');
  const [isOTP, setIsOTP] = useState(false);
  const [type, setType] = useState('');
  const [idproof, setidproof] = useState(false);
  const [profile, setprofile] = useState(false);
  const [code, setCode] = useState('');
  const [country, setCountry] = useState('');
  const [userDetail, setUserDetail] = useState({
    email: '',
    password: '',
    type: 'USER',
    fullName: '',
    phone: '',
    profile: '',
    // idproof: '',
    otp: '',
    status: true,
  });
  const [formatedNumber, setFormattedNumber] = useState('');
  const phoneRef = useRef(undefined);
  const [countryPickerVisible, setCountryPickerVisible] = useState();
  const cameraRef = createRef();

  const getLocationVaue = (lat, add) => {
    let locArray = add.split(',');
    delete userDetail.address;
    delete userDetail.city;
    delete userDetail.country;
    let user = {};
    user.address = add;
    if (locArray.length >= 1) {
      user.country = locArray[locArray.length - 1]?.trim();
    }
    if (locArray.length >= 3) {
      user.city = locArray[locArray.length - 3]?.trim();
    }
    console.log(user);
    setUserDetail({
      ...userDetail,
      ...user,
      // latitude: lat.lat.toString(),
      // longitude: lat.lng.toString(),
    });
  };

  const getImageValue = async (img, loder) => {
    console.log(img);
    ApiFormData(img.assets[0]).then(
      res => {
        setidproof(false);
        setprofile(false);
        console.log(res);
        if (res.status) {
          setUserDetail({
            ...userDetail,
            [type]: res.data.file,
          });
        }
      },
      err => {
        setidproof(false);
        setprofile(false);
        console.log(err);
      },
    );
  };
  const sendOTP = async userDetail => {
    setLoading(true);
    Post(
      'sendotp',
      { phone: formatedNumber, type: 'signup', email: userDetail.email },
      { ...props, setInitial },
    ).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.success) {
          setIsOTP(true);
          checkOtpStatus(false, formatedNumber, 3);
        } else {
          console.log('error------>', res);
          if (res?.data?.message !== undefined) {
            setToast(res.data.message);
          }
          if (res?.message !== undefined) {
            setToast(res.message);
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const SignUp = () => {
    console.log(userDetail);
    setLoading(true);
    userDetail.phone = formatedNumber;
    userDetail.code = {
      country: phoneRef.current?.getCountryCode(),
      code: phoneRef.current?.getCallingCode(),
      formated: phoneRef.current?.getNumberAfterPossiblyEliminatingZero(),
    };
    console.log(userDetail);
    Post('signUp', userDetail, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.success) {
          setUserDetail({
            email: '',
            password: '',
            type: 'USER',
            fullName: '',
            lastname: '',
            country: '',
          });
          setToast('You regesterd successfully');
          props.navigation.navigate('Signin');
        } else {
          console.log('error-----dgfdfgd->', res);
          // if (res?.data?.message !== undefined) {
          //   setToast(res.data.message);
          // }

          if (res?.message !== undefined) {
            setToast(res.message);
          }
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const cancel = () => {
    setidproof(false), setprofile(false);
  };



  const submit = async () => {
    // props.navigation.navigate('Signin');

    let { errorString, anyEmptyInputs } = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);
    setSubmitted(true);

    // console.log(anyEmptyInputs, (anyEmptyInputs.length > 0 && !anyEmptyInputs.includes('PROFILE')) || anyEmptyInputs.length > 0)
    if ((anyEmptyInputs.length > 0 && !anyEmptyInputs.includes('PROFILE')) || anyEmptyInputs.length > 1) {

      if (!userDetail.status) {
        setToast('Please review and agree to Terms&Conditions');
        return;
      }
      // Toaster(errorString);
      //   return
      // } else {
      console.log('called');
      const emailcheck = checkEmail(userDetail.email);
      if (!emailcheck) {
        setToast('Your email id is invalid');
        return;
      }


      if (!isValidNumber(formatedNumber)) {
        setToast('Your phone number is invalid');
        return;
      }


      if (userDetail?.lastname !== undefined) {
        // data.fullName = userDetail.fullName + ' ' + userDetail?.lastname;
      } else {
        if (
          userDetail.type === 'PROVIDER' &&
          (userDetail?.lastname === undefined || userDetail?.lastname === '')
        ) {
          return;
        }
      }

      checkOtpStatus(true, formatedNumber, 3).then(res => {
        console.log(res, typeof res);
        if (res) {
          sendOTP(userDetail);
        } else {
          setToast('OTP limit exceeded for 24 hours. Please wait or contact support for assistance.');
        }
      });

      // console.log(isValid)
      // if (isValid) {
      //   console.log('valid')
      //   // sendOTP(userDetail);
      // } else {
      //   console.log('notvalid')
      //   return;
      // }

    }
  };

  const toggleCountryPicker = () => {
    setCountryPickerVisible(!countryPickerVisible);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={Styles.container}>
        <Spinner color={'#fff'} visible={loading} />
        <CustomToaster
          color={Constants.white}
          backgroundColor={Constants.red}
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
          <View>
            <Text style={Styles.title}>Sign up</Text>
            <Text style={Styles.subtitle}>Create an account to continue!</Text>

            <View>
              <View style={[Styles.fieldView, { marginTop: 20 }]}>
                <Text style={[Styles.label, { minWidth: 75 }]}>Full Name</Text>
                <TextInput
                  style={Styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={Constants.lightgrey}
                  value={userDetail.fullName}
                  maxLength={30}
                  onChangeText={fullName =>
                    setUserDetail({ ...userDetail, fullName })
                  }
                />
              </View>
              {filedCheck.includes('FULLNAME') && userDetail.fullName === '' && (
                <Text style={{ color: 'red' }}> Full name is required</Text>
              )}
            </View>

            <View style={Styles.fieldView}>
              <Text style={[Styles.label, { minWidth: 105 }]}>Email Address</Text>
              <TextInput
                style={Styles.input}
                placeholder={'Email Address'}
                placeholderTextColor={Constants.lightgrey}
                value={userDetail.email}
                maxLength={30}
                onChangeText={email => setUserDetail({ ...userDetail, email })}
              />
            </View>
            {filedCheck.includes('EMAIL') && userDetail.email === '' && (
              <Text style={{ color: 'red' }}> Email address is required</Text>
            )}

            <View style={Styles.fieldView}>
              <Text style={[Styles.label, { minWidth: 105, fontFamily: 'Helvetica', zIndex: 9 }]}>Phone Number</Text>
              {/* <TextInput
                style={Styles.input}
                placeholder={'Phone Number'}
                placeholderTextColor={Constants.lightgrey}
                value={userDetail.phone}
                keyboardType="numeric"
                onChangeText={phone => setUserDetail({...userDetail, phone})}
              /> */}
              <PhoneInput
                ref={phoneRef}
                value={userDetail.phone}
                layout="first"
                disabled={isOTP}
                flagButtonStyle={{
                  display: 'none',
                }}
                onChangeText={text => {
                  console.log(text);
                  setUserDetail({
                    ...userDetail,
                    phone: text,
                  });
                }}
                onChangeFormattedText={text => {
                  setFormattedNumber(text);
                  console.log(text);
                  // setCode(phoneRef.current?.getCallingCode());
                  // setCountry(phoneRef.current?.getCountryCode());
                }}
                containerStyle={{ height: 40, backgroundColor: Constants.white, fontFamily: 'Helvetica', zIndex: 8, }}
                textContainerStyle={{
                  height: 40,
                  backgroundColor: Constants.white,
                  fontFamily: 'Helvetica',
                }}
                textInputStyle={{ height: 40, fontFamily: 'Helvetica' }}
                codeTextStyle={{ height: 25, fontFamily: 'Helvetica' }}
              />
            </View>
            {filedCheck.includes('PHONE') && userDetail.phone === '' && (
              <Text style={{ color: 'red' }}> phone Number is required</Text>
            )}

            {/* <View style={{flexDirection: 'row', flex: 1, gap: 5}}> */}
            {/* <View style={{ flex: 1 }}>
              <View style={Styles.fieldView2}>
                <Text style={Styles.label}>ID proof</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={[Styles.input2, { flex: 3 }]}
                    placeholder={'Url'}
                    editable={false}
                    placeholderTextColor={Constants.lightgrey}
                    value={userDetail.idproof}
                    onChangeText={idproof =>
                      setUserDetail({ ...userDetail, idproof })
                    }
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setType('idproof');
                      setidproof(true);
                      cameraRef.current.show();
                    }}
                    disabled={type === 'idproof' && idproof}
                    style={[
                      Styles.iconView,
                      {
                        flex: 1,
                        backgroundColor: Constants.red,
                        borderRadius: 10,
                      },

                    ]}>
                    {idproof && (
                      <ActivityIndicator
                        animating={true}
                        color={Constants.white}
                      />
                    )}
                    {!idproof && (
                      <Text style={{ color: Constants.white, fontWeight: '500' }}>
                        Upload
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {filedCheck.includes('IDPROOF') && (
                <Text style={{ color: 'red' }}> ID proof is required</Text>
              )}
            </View> */}
            <View style={{ flex: 1 }}>
              <View style={Styles.fieldView2}>
                <Text style={[Styles.label, { minWidth: 100 }]}>Profile Picture</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={[Styles.input2, { flex: 3 }]}
                    placeholder={'Url'}
                    editable={false}
                    placeholderTextColor={Constants.lightgrey}
                    value={userDetail.profile}
                    onChangeText={profile =>
                      setUserDetail({ ...userDetail, profile })
                    }
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setType('profile');
                      setprofile(true);
                      cameraRef.current.show();
                    }}
                    disabled={type === 'profile' && profile}
                    style={[
                      Styles.iconView,
                      {
                        flex: 1,
                        backgroundColor: Constants.red,
                        borderRadius: 10,
                      },
                      // {position: 'absolute', right: 0, borderRightWidth: 0},
                    ]}>
                    {profile && (
                      <ActivityIndicator
                        animating={true}
                        color={Constants.white}
                      />
                    )}
                    {!profile && (
                      <Text style={{ color: Constants.white, fontWeight: '500', fontFamily: 'Helvetica' }}>
                        Upload
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {/* {filedCheck.includes('PROFILE') &&  (
                <Text style={{ color: 'red' }}>Profile Picture is required</Text>
              )} */}
            </View>
            {/* </View> */}

            <View style={[Styles.fieldView, { position: 'relative' }]}>
              <Text style={[Styles.label, { minWidth: 75 }]}>Password</Text>
              <TextInput
                style={Styles.input}
                placeholder="Password"
                secureTextEntry={showPass}
                placeholderTextColor={Constants.lightgrey}
                value={userDetail.password}
                maxLength={10}
                onChangeText={password =>
                  setUserDetail({ ...userDetail, password })
                }
              />
              <TouchableOpacity
                onPress={() => {
                  setShowPass(!showPass);
                }}
                style={[
                  Styles.iconView,
                  { position: 'absolute', right: 0, borderRightWidth: 0 },
                ]}>
                <Ionicons
                  name={showPass ? 'eye-off' : 'eye'}
                  size={25}
                  color={Constants.grey}
                />
              </TouchableOpacity>
            </View>
            {filedCheck.includes('PASSWORD') && userDetail.password === '' && (
              <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> Password is required</Text>
            )}
          </View>
          {isOTP && (
            <>
              <View style={[Styles.fieldView, { position: 'relative' }]}>
                <Text style={[Styles.label, { minWidth: 40 }]}>OTP</Text>
                <TextInput
                  style={Styles.input}
                  placeholder="OTP"
                  placeholderTextColor={Constants.lightgrey}
                  value={userDetail.otp}
                  onChangeText={otp => setUserDetail({ ...userDetail, otp })}
                />
              </View>
              {filedCheck.includes('OTP') && (
                <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> OTP is required</Text>
              )}
            </>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Checkbox.Android
              label="item"
              uncheckedColor={Constants.blue}
              status={userDetail.status ? 'checked' : 'unchecked'}
              style={{ borderColor: Constants.blue, borderWidth: 1 }}
              onPress={() => {
                setUserDetail({
                  ...userDetail,
                  status: !userDetail.status,
                });
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 5,
                flex: 1,
              }}>
              <Text
                style={{
                  color: Constants.black,
                  flexWrap: 'wrap',
                  fontSize: 14,
                  margin: 0,
                  width: width - 70,
                  fontFamily: 'Helvetica',
                  flexShrink: 1,
                }}>
                I agree to the{' '}
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
                  style={{ color: Constants.red, fontSize: 14, fontFamily: 'Helvetica', flexWrap: 'wrap' }}
                  onPress={() =>
                    Linking.openURL(
                      'https://www.sadanamkayyilundo.in/privacy-policy',
                    )
                  }>
                  Privacy Policy {' '}
                </Text>
                {/* </TouchableOpacity> */}
              </Text>
            </View>
          </View>


          {/* <View
            style={[
              {
                flex: 1,
                alignItems: 'center',
                // marginTop: 20,
              },
            ]}> */}
          <TouchableOpacity
            style={[Styles.applyBtn, { flex: 1, marginTop: 20 }]}
            onPress={() => {
              if (isOTP) {
                SignUp();
              } else {
                submit();
              }
            }}>
            {/* <LinearGradient
                colors={[Constants.red, Constants.red]}
                start={{ x: 0, y: 1.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[Styles.applyBtn]}> */}
            <Text
              style={[Styles.applyBtnTxt, { fontSize: 16, lineHeight: 25 }]}>
              {isOTP ? ' SIGN UP' : 'GET OTP'}
            </Text>
            {/* </LinearGradient> */}
          </TouchableOpacity>
          {/* </View> */}

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Signin')}>
                <Text style={[Styles.forgot]}>
                  Already have an account ?{' '}
                  <Text style={{ color: Constants.red, fontFamily: 'Helvetica' }}>Signin</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <CameraGalleryPeacker
        refs={cameraRef}
        getImageValue={getImageValue}
        base64={false}
        cancel={cancel}
      />
    </SafeAreaView>
  );
};

export default SignUp;
