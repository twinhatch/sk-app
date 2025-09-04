/* eslint-disable prettier/prettier */
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
} from 'react-native';
import React, { useState, useContext, useRef, useEffect } from 'react';
import Constants from '../../Helpers/constant';
import Styles from './Styles';
import { checkForEmptyKeys, checkEmail } from '../../Helpers/InputsNullChecker';
import { GetApi, Post, checkOtpStatus } from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import { Context, toastContext } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput, { isValidNumber } from 'react-native-phone-number-input';

const ForgotPassword = props => {
  const [toast, setToast] = useContext(toastContext);
  const [initial, setInitial] = useContext(Context);
  const [showPass, setShowPass] = useState(true);
  const [isOTP, setIsOTP] = useState(false);
  const [isError, setIsError] = useState(false);
  const [otp, setotp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [filedCheck, setfiledCheck] = useState([]);
  const [userDetail, setUserDetail] = useState({
    number: '',
  });
  const [formatedNumber, setFormattedNumber] = useState('');
  const phoneRef = useRef(undefined);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  const sendOTP = async () => {
    if (!isValidNumber(formatedNumber)) {
      setToast('Your phone number is invalid');
      return;
    }
    console.log('phone number ', userDetail.number.toString());
    if (!userDetail.number) {
      return;
    }

    const isvalid = await checkOtpStatus(true, formatedNumber, 3).then(res => res);
    if (!isvalid) {
      setToast('OTP limit exceeded for 24 hours. Please wait or contact support for assistance.');
      return;
    }

    setLoading(true);
    Post('sendotp', { phone: formatedNumber }, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.success) {
          setIsOTP(true);
          checkOtpStatus(false, formatedNumber, 3);
        } else {
          console.log('error------>', res);

          setToast(res.message);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  useEffect(() => {
    // getProfile();
  }, []);

  const getProfile = () => {
    setLoading(true);
    GetApi('getProfile', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.success) {
        } else {
          console.log('error------>', res);
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
    if (!(otp && newPassword && confirmPassword === newPassword)) {
      setIsError(true);
      console.log(newPassword, confirmPassword, otp);
      return;
    }
    console.log(newPassword, confirmPassword, otp);
    setLoading(true);
    Post(
      'auth/forgottpassword',
      {
        password: newPassword,
        phone: formatedNumber,
        otp: otp,
      },
      { ...props, setInitial },
    ).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.success) {
          setToast(res.message);
          console.log('done', res);
          props.navigation.navigate('Signin');
        } else {
          setToast(res.message);
        }
      },
      err => {
        setToast(err.message);
      },
    );
    return;
  };

  const toggleCountryPicker = () => {
    setCountryPickerVisible(!countryPickerVisible);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={Styles.container}
        colors={['#000', '#000', '#14110B', '#D8B075']}>
        <Spinner color={'#fff'} visible={loading} />
        {/* <CustomToaster
          color={Constants.white}
          backgroundColor={Constants.red}
          timeout={5000}
          toast={toast}
          setToast={setToast}
        /> */}

        <KeyboardAwareScrollView
          style={Styles.keyboard}
          behavior={'height'}
          enabled
          keyboardVerticalOffset={10}
          keyboardShouldPersistTaps="always">
          <View>
            <Text style={Styles.title}>Forgot Password</Text>
            <View
              style={[Styles.fieldView, { marginTop: 80, position: 'relative' }]}>
              <Text style={[Styles.label, { minWidth: 105, zIndex: 9 }]}>Phone Number</Text>
              <PhoneInput
                value={userDetail.number}
                disabled={isOTP}
                layout="first"
                onChangeText={text => {
                  console.log(text);
                  setUserDetail({
                    ...userDetail,
                    number: text,
                  });
                }}
                onChangeFormattedText={text => {
                  setFormattedNumber(text);
                  console.log(text);
                }}
                ref={phoneRef}
                containerStyle={{ height: 40, backgroundColor: Constants.white, zIndex: 8 }}
                textContainerStyle={{
                  height: 40,
                  backgroundColor: Constants.white,
                  fontFamily: 'Helvetica',
                }}
                textInputStyle={{ height: 40, fontFamily: 'Helvetica' }}
                codeTextStyle={{ height: 25, fontFamily: 'Helvetica' }}
              />
            </View>
            {filedCheck.includes('EMAIL') && (
              <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> Number is required</Text>
            )}
            {isOTP && (
              <>
                <View
                  style={[
                    Styles.fieldView,
                    { marginTop: 20, position: 'relative' },
                  ]}>
                  <Text style={[Styles.label, { minWidth: 40 }]}>OTP</Text>
                  <TextInput
                    style={Styles.input}
                    // placeholder="UserID or Email"
                    placeholder="OTP"
                    placeholderTextColor={Constants.lightgrey}
                    value={otp}
                    onChangeText={text => setotp(text)}
                  />
                </View>
                {!otp && isError && (
                  <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> OTP is required</Text>
                )}

                <View style={[Styles.fieldView, { position: 'relative' }]}>
                  <Text style={[Styles.label, { minWidth: 105 }]}>New Password</Text>
                  <TextInput
                    style={Styles.input}
                    placeholder="Password"
                    secureTextEntry={showPass}
                    placeholderTextColor={Constants.lightgrey}
                    value={newPassword}
                    onChangeText={password => setNewPassword(password)}
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
                {!newPassword && isError && (
                  <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> Password is required</Text>
                )}

                <View style={[Styles.fieldView, { position: 'relative' }]}>
                  <Text style={[Styles.label, { minWidth: 125 }]}>Confirm Password</Text>
                  <TextInput
                    style={Styles.input}
                    placeholder="Password"
                    secureTextEntry={showPass}
                    placeholderTextColor={Constants.lightgrey}
                    value={confirmPassword}
                    onChangeText={password => setConfirmPassword(password)}
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
                {!(newPassword === confirmPassword) && isError && (
                  <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> Password not matching</Text>
                )}
              </>
            )}
          </View>


          <TouchableOpacity
            style={[Styles.applyBtn, { flex: 1 }]}
            onPress={() => {
              if (isOTP) {
                submit();
              } else {
                sendOTP();
              }
            }}>

            <Text
              style={[
                Styles.applyBtnTxt,
                { fontSize: 16, lineHeight: 25 },
              ]}>
              {isOTP ? 'Submit' : 'Get OTP'}
            </Text>
          </TouchableOpacity>


          <View style={{ flexDirection: 'column', marginTop: 20 }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Signin')}>
                <Text style={[Styles.forgot]}>
                  Dont’s have an account?{' '}
                  <Text style={{ color: Constants.red }}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};
export default ForgotPassword;
