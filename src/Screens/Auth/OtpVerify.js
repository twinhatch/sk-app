/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable handle-callback-err */
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Constants from '../../Helpers/constant';
import Styles from './Styles';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {checkForEmptyKeys} from '../../Helpers/InputsNullChecker';
import {Post} from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import {Context} from '../../../App';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomToaster from '../../Component/CustomToaster';
import LinearGradient from 'react-native-linear-gradient';

const CELL_COUNT = 4;
const OtpVerify = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const {email, token} = props?.route?.params?.data;
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [property, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [otptoken, setToken] = useState(token);

  const [filedCheck, setfiledCheck] = useState([]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => null,
    });
  }, []);

  const submit = () => {
    const data = {
      otp: value,
    };
    let {anyEmptyInputs} = checkForEmptyKeys(data);
    setfiledCheck(anyEmptyInputs);
    if (anyEmptyInputs.length > 0) {
    } else {
      data.token = otptoken;
      console.log('data==========>', data);
      setLoading(true);
      Post('verifyOTP', data, {...props, setInitial}).then(
        async res => {
          setLoading(false);
          console.log('err =======>', res);
          if (res.status) {
            setToast(res.data.message);
            props.navigation.navigate('ChangePassword', {
              email: props?.route?.params?.email,
              token: res.data.token,
            });
          } else {
            setToast(res.message);
          }
        },
        err => {
          setLoading(false);
          // console.log('err =======>', err);
        },
      );
    }
  };

  const resendOtp = () => {
    setLoading(true);
    Post('sendOTP', {email}, {...props}).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setToast(res.data.message);
          setToken(res.data.token);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient
        style={Styles.container}
        colors={['#000', '#000', '#14110B', '#D8B075']}>
        <Spinner color={'#fff'} visible={loading} />
        <CustomToaster
          color={Constants.black}
          backgroundColor={Constants.white}
          timeout={5000}
          toast={toast}
          setToast={setToast}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            height: 30,
            width: 30,
          }}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Ionicons
            name="arrow-back-outline"
            size={25}
            color={Constants.white}
          />
        </TouchableOpacity>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={Styles.logoView}>
            <Image
              source={require('../../Assets/Images/guruboxLogo.png')}
              style={Styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={Styles.title}>Enter Code</Text>

            <Text style={[Styles.subtitle, {fontSize: 18, color: '#FFFFFF'}]}>
              {props?.route?.params?.data?.email}
            </Text>
            <CodeField
              ref={ref}
              {...property}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={Styles.codeFieldRoot2}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[Styles.cell, isFocused && Styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol ||
                    (isFocused ? (
                      <Cursor />
                    ) : (
                      <Text style={{color: Constants.yellow}}>_</Text>
                    ))}
                </Text>
              )}
            />

            {filedCheck.includes('OTP') && (
              <Text style={{color: 'red'}}> OTP is required</Text>
            )}
          </View>
          <View
            style={[
              {
                flex: 1,
                alignItems: 'center',
                marginTop: 20,
              },
            ]}>
            <TouchableOpacity onPress={submit}>
              <LinearGradient
                colors={[Constants.red, Constants.red]}
                start={{x: 0, y: 1.5}}
                end={{x: 1, y: 0.5}}
                style={[Styles.applyBtn]}>
                <Text
                  style={[Styles.applyBtnTxt, {fontSize: 16, lineHeight: 25}]}>
                  VERIFY OTP
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={() => resendOtp()}>
                <Text style={[Styles.forgot]}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};
export default OtpVerify;
