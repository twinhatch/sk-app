/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */

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
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Dimensions,
} from 'react-native';
import React, { createRef, useState, useContext, useRef, useEffect } from 'react';
import Constants from '../../Helpers/constant';
import Styles from './Styles';
import { ActivityIndicator, Avatar, RadioButton } from 'react-native-paper';
import {
  checkForEmptyKeys,
  checkNumber,
  checkEmail,
} from '../../Helpers/InputsNullChecker';
import { ApiFormData, GetApi, Post, checkOtpStatus, commonPost } from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import Spinner from '../../Component/Spinner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Context, UserContext } from '../../../App';
import CustomToaster from '../../Component/CustomToaster';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { PassIcon, UserInputIcon } from '../../Component/icons';
import Icon from 'react-native-vector-icons/FontAwesome';
// import LocationDropdown from '../../Component/LocationDropdown';
import { Checkbox } from 'react-native-paper';
import PhoneInput, { isValidNumber } from 'react-native-phone-number-input';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import styles from '../Provider/StyleProvider';
import ActionSheet from 'react-native-actions-sheet';
import CameraGalleryPeacker from '../../Component/CameraGalleryPeacker';
import { useNetInfo } from '@react-native-community/netinfo';
import DeviceCountry, {
  TYPE_TELEPHONY,
  TYPE_CONFIGURATION,
  TYPE_ANY,
} from 'react-native-device-country';


// import { FormProvider, useForm } from 'react-hook-form';


import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Dropdown } from 'react-native-element-dropdown';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import axios, { Axios } from 'axios';
import { Coachmark } from 'react-native-coachmark';

// import CameraComponent from '../../Component/Camera';

const idProoofs = ['Aadhaar', 'Passport', 'Driving License'];

const dList = [
  { name: 'UK', id: 'uk' },
  { name: 'Germony', id: 'Dgr' },
];

const EditProfile = props => {
  // const { type, isConnected } = useNetInfo();
  // console.log(useNetInfo().details);

  const { width, height } = Dimensions.get('window');
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const [user, setUser] = useContext(UserContext);
  const [showPass, setShowPass] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idproof, setidproof] = useState(false);
  const [profile, setprofile] = useState(false);
  const [filedCheck, setfiledCheck] = useState([]);
  const [type, setType] = useState('');
  const [otp, setotp] = useState('');
  const [otpRequire, setOtpRequire] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: '',
    fullName: '',
    phone: '',
    profile: '',
    idproof: '',
  });
  const creditCardRef = useRef();
  const [upi, setUpi] = useState({
    id: '',
    verified: false,
  });

  const [IdVerify, setIdVerify] = useState({
    id: 'Aadhaar',
    varified: false,
    no: '',
    client_id: '',
    otp: '',
    otpRequired: false,
    placeholder: 'Adhar No',
  });
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  );
  const [selectedate, setSelectedDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 18)));
  const [open, setOpen] = useState(false);

  const [bankDetail, setBankDetail] = useState({
    account_no: '',
    account_name: '',
    account_Type: '',
    ifsc_code: '',
    bank_name: '',
    branch_name: '',
    branch_address: '',
  });
  const [profiledata, setProfileData] = useState({});
  const [formatedNumber, setFormattedNumber] = useState('');
  const phoneRef = useRef(undefined);
  // const [countryPickerVisible, setCountryPickerVisible] = useState();
  const actionRef = createRef();
  const cameraRef = createRef();
  const [account, setAccount] = useState(false);
  const [country, setCountry] = useState('');

  // const formMethods = useForm({
  //   // to trigger the validation on the blur event
  //   mode: 'onBlur',
  //   defaultValues: {
  //     holderName: '',
  //     cardNumber: '',
  //     expiration: '',
  //     cvv: '',
  //   },
  // });

  const aadhar = useRef();
  const passport = useRef();
  const dl = useRef();

  useEffect(() => {
    getProfile();

  }, []);

  // const handleSubmit = React.useCallback(() => {
  //   if (creditCardRef.current) {
  //     const { error, data } = creditCardRef.current.submit();
  //     console.log('ERROR: ', error);
  //     console.log('CARD DATA: ', data);
  //   }
  // }, []);

  // const { handleSubmit, formState, setValue } = formMethods;

  // function onSubmit(model) {
  //   console.log(model)
  //   Alert.alert('Success: ' + JSON.stringify(model, null, 2))
  // }

  const getImageValue = async img => {
    console.log(img);

    ApiFormData(img.assets[0]).then(
      res => {
        console.log(res);

        if (res.status) {
          setidproof(false);
          setprofile(false);
          setUserDetail({
            ...userDetail,
            profile: res.data.file,
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

  const cancel = () => {
    setidproof(false); setprofile(false);
  };

  const getProfile = () => {
    setLoading(true);
    GetApi('getProfile', { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log(res.data.code);
        if (res) {
          setUser(res.data);
          if (!res?.data?.verified && Platform.OS === 'android') {
            await aadhar.current.show()
          }
          setUserDetail({
            email: res.data.email,
            fullName: res.data.fullName,
            phone: res.data.phone,
            profile: res.data.profile,
            // idproof: res.data.idproof,
          });
          if (res?.data?.idproofType) {
            setIdVerify({
              id: res?.data?.idproofType || 'Adhaar',
              varified: res.data.varified,
              no: res?.data?.idproofType ? res.data.idproof : '',
              placeholder: res?.data?.idproofType === 'Aadhaar' ? 'Aadhaar Number' : res?.data?.idproofType === 'Passport' ? 'File Number' : 'ID Number',

            });
          }
          if (res.data.dob) {
            setSelectedDate(new Date(res.data.dob));
          }
          setProfileData(res.data);
          setFormattedNumber(res.data.code.formated.formattedNumber);
          console.log('bankdetail--------------------->', res.data.bank_details);
          if (res.data.bank_details !== undefined) {
            setBankDetail(res.data.bank_details);
            if (res.data.bank_details.upi) {
              setUpi({ id: res.data.bank_details.upi, verified: res.data.bank_details.upiverified });
            }
          }
          console.log('device country ]]]]]]]]]]]]]]]]]]]]]]]]', 'start');
          DeviceCountry.getCountryCode(TYPE_ANY)
            .then((result) => {
              setCountry((result.code.toLowerCase()));
              console.log('device country ]]]]]]]]]]]]]]]]]]]]]]]]', result);
              // {"code": "BY", "type": "telephony"}
            })
            .catch((e) => {
              console.log(e);
            });

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

  const updateBanckDeatail = () => {
    let { errorString, anyEmptyInputs } = checkForEmptyKeys(bankDetail);
    setfiledCheck(anyEmptyInputs);
    setSubmitted(true);
    console.log(anyEmptyInputs);
    if (anyEmptyInputs.length > 0) {
      return;
    }
    setLoading(true);
    Post(
      'updateProfile?for=bankdetail',
      { bank_details: bankDetail },
      { ...props, setInitial },
    ).then(
      async res => {
        setLoading(false);
        console.log('res------------->', res);
        if (res.status) {
          setToast('Your bank details updated successfully');
          getProfile();
        } else {
          console.log('error------>', res);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const checkstatus = () => {
    setLoading(true);
    Post(
      '/user/checkplanstatus',
      '',
      { ...props, setInitial },
    ).then(
      async res => {
        setLoading(false);
        console.log('res------------->', res);
        if (res.success) {
          setToast(res.message);
          await AsyncStorage.removeItem('userDetail');
          props.navigation.replace('Signup');
        } else {
          setToast(res.message);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const submit = async () => {
    // props.navigation.navigate('Signin');
    console.log('------------->', userDetail);
    let u = userDetail
    let url = userDetail.profile
    delete u.profile
    let { errorString, anyEmptyInputs } = checkForEmptyKeys(u);
    setfiledCheck(anyEmptyInputs);
    setSubmitted(true);
    console.log(anyEmptyInputs);
    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      const emailcheck = checkEmail(userDetail.email);
      if (!emailcheck) {
        setToast('Your email id is invalid');
        return;
      }

      if (!isValidNumber(formatedNumber)) {
        setToast('Your phone number is invalid');
        return;
      }
      let isValid = true;
      if (profiledata.phone !== formatedNumber) {
        isValid = await checkOtpStatus(true, formatedNumber, 3).then(res => res);
      }
      if (!isValid) {
        setToast('OTP limit exceeded for 24 hours. Please wait or contact support for assistance.');
        return false;
      }
      console.log('====>', userDetail);

      userDetail.phone = formatedNumber;
      userDetail.code = {
        country: phoneRef.current?.getCountryCode(),
        code: phoneRef.current?.getCallingCode(),
        formated: phoneRef.current?.getNumberAfterPossiblyEliminatingZero(),
      };
      if (url) {
        userDetail.profile = url
      }
      let data = userDetail;

      if (otpRequire) {
        if (otp === '') {
          setToast('OTP is required');
          return;
        }
        data.otp = otp;
      }

      setLoading(true);

      if (userDetail?.email) {
        userDetail.email = userDetail?.email.toLowerCase();
      }
      console.log('myData===========>', data)

      Post('updateProfile', data, { ...props, setInitial }).then(
        async res => {
          setLoading(false);
          console.log('res------------->', res);
          if (res.status) {
            setOtpRequire(res.data.otp);
            if (!res.data.otp) {
              setotp('');
              setTimeout(() => {
                setToast('Profile updated successfully')
              }, 500);
              getProfile();
              if (profiledata.phone !== formatedNumber) {
                checkOtpStatus(false, formatedNumber, 3);
              }
            } else {
              setToast(res.data.message);
            }
            // getProfile();
          } else {
            setToast(res.data.message);
            console.log('error------>', res);
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    }
  };


  const updateProfile = (data, message) => {
    setLoading(true);

    Post('updateProfile', data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('res------------->', res);
        if (res.status) {
          setOtpRequire(res.data.otp);
          setTimeout(() => {
            setToast(message);
          }, 500);
          getProfile();
        } else {
          setToast(res.data.message);
          console.log('error------>', res);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const selectImage = async type => {
    console.log('camera');
    const options = {
      includeBase64: true,
      quality: 0.5,
    };
    let result; // data:image/png;base64,
    if (type === 'camera') {
      result = await launchCamera(options);
    } else {
      result = await launchImageLibrary(options);
    }
    console.log('=========>', result);
    if (result.didCancel) {
      return;
    }
    const url = `data:${result.assets[0].type};base64,${result.assets[0].base64}`;
    console.log('==========>url', url);
    setUserDetail({ ...userDetail, profile: url });
  };

  const checkIFSCCode = async () => {
    try {
      let ifsc = bankDetail.ifsc_code.toUpperCase();
      let url = `https://ifsc.razorpay.com/${ifsc}`;
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      console.log('data--------', data);
      if (data?.BANK) {
        setBankDetail({
          ...bankDetail,
          branch_address: data.ADDRESS,
          branch_name: data.BRANCH,
          bank_name: data.BANK,
        });
      } else {
        setBankDetail({
          ...bankDetail,
          branch_address: '',
          branch_name: '',
          bank_name: '',
          ifsc_code: '',
        });
        setToast('Invalid IFSC code');
      }
    } catch (err) {
      console.log('errrrr-->', err);
    }
  };

  const verifyUpiId = async () => {
    let data = {};
    if (upi.id === '') {
      setTimeout(() => {
        setToast('Enter valid UPI ID to process payouts')
      }, 500);
      return;
    }
    let isvalid = true;
    await checkOtpStatus(true, 'UpiId', 3).then(res => {
      console.log(res, typeof res);
      isvalid = res;
      if (!res) {
        setTimeout(() => {
          setToast('You have reached the maximum attempts. Try again tomorrow')
        }, 500);

        return;
      }
    });

    if (!isvalid) {
      return;
    }
    data.upi_id = upi.id;
    let url = 'https://kyc-api.aadhaarkyc.io/api/v1/bank-verification/upi-verification';
    commonPost(url, data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('res------------->', res.data);
        if (res.success) {
          checkOtpStatus(false, 'UpiId', 3);
          // setToast('UPI ID verified');
          let d = {
            bank_details: {
              upi: upi.id,
              upiverified: true,
            },
          };
          updateProfile(d, 'UPI ID verified');
        } else {
          checkOtpStatus(false, 'UpiId', 3);
          setToast('Invalid UPI ID.');
          console.log('error------>', res);
        }
      },
      err => {
        checkOtpStatus(false, 'UpiId', 3);
        setToast('Invalid UPI ID.');
        setLoading(false);
        console.log(err);
      },
    );
  };

  const verifyId = async () => {
    let data = {};
    if (IdVerify.no === '') {
      setToast('Selected proof id number required');
      return;
    }
    let isvalid = true;
    await checkOtpStatus(true, 'idproof', 3).then(res => {
      console.log(res, typeof res);
      isvalid = res;
      if (!res) {
        setToast(' You have reached the maximum attempts. Try again tomorrow');
        return;
      }
      return !res;
    });

    if (!isvalid) {
      return;
    }

    let url = '';
    if (IdVerify.id === 'Aadhaar') {
      if (IdVerify.client_id) {
        if (IdVerify.otp === '') {
          setToast('fill otp and then try again');
          return;
        }
        data.client_id = IdVerify.client_id;
        data.otp = IdVerify.otp;
        url = 'https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/submit-otp';
      } else {
        data.id_number = IdVerify.no;
        url = 'https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/generate-otp';
      }

    } else if (IdVerify.id === 'Passport') {
      data.id_number = IdVerify.no;
      data.dob = moment(selectedate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      url = 'https://kyc-api.aadhaarkyc.io/api/v1/passport/passport/passport-details';
    } else if (IdVerify.id === 'Driving License') {
      data.id_number = IdVerify.no;
      data.dob = moment(selectedate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      url = 'https://kyc-api.aadhaarkyc.io/api/v1/driving-license/driving-license';
    } else {
      setToast('Please select your id proof type');
      return;
    }
    commonPost(url, data, { ...props, setInitial }).then(
      async res => {
        setLoading(false);
        console.log('res------------->', res);
        if (res.success) {
          checkOtpStatus(false, 'idproof', 3);
          if (IdVerify.id === 'Aadhaar' && res.data.otp_sent) {
            setIdVerify({
              ...IdVerify,
              client_id: res.data.client_id,
              otpRequired: true,
            });
            return;
          }
          // setToast('ID number is verified');
          let d = {
            idproof: IdVerify.no,
            idproofType: IdVerify.id,
            verified: true,
            status: 'Verified',
            updateType: 'verify',
          };
          if (IdVerify.id === 'Driving License' || IdVerify.id === 'Passport') {
            d.dob = selectedate;
          }
          updateProfile(d, 'ID number is verified');
        } else {
          checkOtpStatus(false, 'idproof', 3);
          if (IdVerify.id === 'Aadhaar') {
            if (!res?.data?.valid_aadhaar) {
              setToast('The Aadhaar ID number is not valid');
              return;
            }
            if (!res?.data?.if_number) {
              setToast('Phone number not added with this Aadhaar');
              return;
            }

          }
          // else {
          //   setToast(`The ${IdVerify.id} ID number is not valid`);
          // }
          // setToast(res?.message);
          setToast(`The ${IdVerify.id} ID number is not valid`);
          console.log('error------>', res);
        }
      },
      err => {
        checkOtpStatus(false, 'idproof', 3);
        setLoading(false);
        console.log(err);
      },
    );
  };

  const TourContent = (tourProps) => (
    <View style={{ flex: 1, backgroundColor: Constants.white, marginHorizontal: 10, padding: 10, borderRadius: 10, }}>
      <Image source={coachMarkImage()} style={{ width: width - 40, height: 200, objectFit: 'fill', marginBottom: 10 }} />
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ color: Constants.black, fontWeight: '700', fontFamily: 'Helvetica', flex: 3 }}>{tourProps?.message}</Text>
        {!tourProps?.isLast && <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={{ color: Constants.white, fontWeight: '700', fontSize: 14, textAlign: 'center', fontFamily: 'Helvetica', backgroundColor: Constants.red, minWidth: 60, padding: 3, borderRadius: 5, maxHeight: 25 }}
            onPress={async () => {
              await tourProps.current.current.hide();
            }}
          >Ok</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );

  const coachMarkMessage = () => {
    if (IdVerify.id === 'Aadhaar') {
      return 'Enter your Aadhaar number here';
    } else if (IdVerify.id === 'Passport') {
      return 'Enter your passport file number here';
    } else {
      return 'Enter your Driving license number here';
    }
  };

  const coachMarkImage = () => {
    if (IdVerify.id === 'Aadhaar') {
      return require('../../Assets/newImgs/aadhar.png');
    } else if (IdVerify.id === 'Passport') {
      return require('../../Assets/newImgs/passport.png');
    } else {
      return require('../../Assets/newImgs/dl.png');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <CameraComponent /> */}
      <View style={Styles.container}>
        <Spinner color={'#fff'} visible={loading} />
        <CustomToaster
          color={Constants.black}
          backgroundColor={Constants[initial]}
          timeout={5000}
          toast={toast}
          setToast={setToast}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 5,
          }}>
          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Ionicons
              name="arrow-back"
              size={25}
              color={Constants.black}
              onPress={() => {
                props.navigation.goBack();
              }}
            />
          </View>
          <View style={{ flex: 4, marginBottom: 10 }}>
            <Text
              style={{ color: Constants.black, fontSize: 24, fontWeight: '700', fontFamily: 'Helvetica' }}>
              Edit Profile
            </Text>
          </View>
        </View>
        <KeyboardAwareScrollView
          style={Styles.keyboard}
          behavior={'height'}
          enabled
          keyboardVerticalOffset={20}
          keyboardShouldPersistTaps="always">
          <View style={{ marginTop: 10 }}>
            <View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 8,
                }}>
                <View
                  style={{
                    borderRadius: 50,
                    position: 'relative',
                  }}>
                  {userDetail?.profile ? (
                    <Avatar.Image
                      size={80}
                      source={{ uri: `${userDetail?.profile}` }}
                    />
                  ) : (
                    <Avatar.Image
                      size={80}
                      source={{ uri: Constants.dummyProfile }}
                    />
                  )}

                  <View
                    style={{
                      backgroundColor: Constants[initial],
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      borderRadius: 50,
                      padding: 5,
                      zIndex: 9,
                    }}>
                    {profile && (
                      <ActivityIndicator
                        animating={true}
                        color={Constants.white}
                      />
                    )}
                    {!profile && (
                      <Icon
                        name="camera"
                        size={15}
                        color={
                          initial === 'provider'
                            ? Constants.white
                            : Constants.black
                        }
                        onPress={() => {
                          setType('profile');
                          setprofile(true);
                          cameraRef.current.show();
                        }}
                      />
                    )}
                  </View>
                </View>
              </View>
              <View
                style={[
                  Styles.fieldView,
                  { marginTop: 20, borderColor: Constants[initial] },
                ]}>
                <Text style={[Styles.label, { minWidth: 75 }]}>Full Name</Text>
                <TextInput
                  style={Styles.input}
                  editable={!profiledata.verified}
                  placeholder="Full Name"
                  placeholderTextColor={Constants.lightgrey}
                  value={userDetail.fullName}
                  onChangeText={fullName =>
                    setUserDetail({ ...userDetail, fullName })
                  }
                />
              </View>
              {filedCheck.includes('FIRSTNAME') && (
                <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> Full name is required</Text>
              )}
            </View>

            <View style={[Styles.fieldView, { borderColor: Constants[initial] }]}>
              <Text style={[Styles.label, { minWidth: 105 }]}>Email Address</Text>
              <TextInput

                style={Styles.input}
                placeholder={'Email Address'}
                placeholderTextColor={Constants.lightgrey}
                value={userDetail.email}
                onChangeText={email => setUserDetail({ ...userDetail, email })}
              />
            </View>
            {filedCheck.includes('EMAIL') && (
              <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> Email address is required</Text>
            )}

            <View style={[Styles.fieldView, { borderColor: Constants[initial] }]}>
              <Text style={[Styles.label, { minWidth: 105, zIndex: 9 }]}>Phone Number</Text>

              {profiledata?.code?.country && (
                <PhoneInput
                  ref={phoneRef}
                  disabled={profiledata.verified}
                  layout="first"
                  value={
                    profiledata?.code?.formated?.number || userDetail.phone
                  }
                  flagButtonStyle={{
                    display: 'none',
                  }}
                  defaultCode={profiledata?.code?.country || 'IN'}
                  onChangeText={text => {
                    // console.log(text);
                    setUserDetail({
                      ...userDetail,
                      phone: text,
                    });
                  }}
                  onChangeFormattedText={text => {
                    setFormattedNumber(text);
                    // console.log(text);
                  }}
                  countryPickerButtonStyle={{
                    display: 'none',
                  }}
                  containerStyle={{
                    height: 40,
                    backgroundColor: Constants.white,
                    fontFamily: 'Helvetica',
                    zIndex: 8,
                  }}
                  textContainerStyle={{
                    height: 40,
                    fontFamily: 'Helvetica',
                    backgroundColor: Constants.white,
                  }}
                  textInputStyle={{ height: 40, fontFamily: 'Helvetica' }}
                  codeTextStyle={{ height: 25, fontFamily: 'Helvetica' }}
                />
              )}
            </View>
            {filedCheck.includes('PHONE') && (
              <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> phone Number is required</Text>
            )}

            {/* <View style={{ flex: 1 }}>
              <View
                style={[Styles.fieldView, { borderColor: Constants[initial] }]}>
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
                      if (profiledata.verified) {
                        setToast(
                          "You can't change your ID proof, because that's verified by admin",
                        );
                      } else {
                        setType('idproof');
                        setidproof(true);
                        cameraRef.current.show();
                      }
                    }}
                    style={[
                      Styles.iconView,
                      {
                        flex: 1,
                        backgroundColor: Constants[initial],
                        borderRadius: 10,
                      },
                    ]}>
                    {profile && (
                      <ActivityIndicator
                        animating={true}
                        color={Constants.white}
                      />
                    )}
                    {!profile && (
                      <Text
                        style={{
                          color:
                            initial === 'provider'
                              ? Constants.white
                              : Constants.black,
                          fontWeight: '500',
                        }}>
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

            {otpRequire && (
              <View style={{ flex: 1 }}>
                <View
                  style={[Styles.fieldView, { borderColor: Constants[initial] }]}>
                  <Text style={[Styles.label, { minWidth: 40 }]}>OTP</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TextInput
                      style={[Styles.input2, { flex: 3 }]}
                      placeholder={'0000'}
                      placeholderTextColor={Constants.lightgrey}
                      value={otp}
                      onChangeText={idproof => setotp(idproof)}
                    />
                  </View>
                </View>
                {otp === '' && (
                  <Text style={{ color: 'red', fontFamily: 'Helvetica' }}> OTP is required</Text>
                )}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[Styles.applyBtn, { flex: 1, backgroundColor: Constants[initial] }]}
            onPress={() => {
              submit();
            }}>

            <Text
              style={[
                Styles.applyBtnTxt,
                {
                  fontSize: 16,
                  lineHeight: 25,
                  color:
                    initial === 'provider'
                      ? Constants.white
                      : Constants.black,
                },
              ]}>
              Update
            </Text>
          </TouchableOpacity>


          <View>
            <View style={{ flex: 4, marginTop: 10 }}>
              <Text
                style={{
                  color: Constants.black,
                  fontSize: 24,
                  fontWeight: '700',
                  textAlign: 'center',
                  flex: 1,
                  fontFamily: 'Helvetica',
                }}>
                ID Verification
              </Text>
            </View>

            <View
              style={[
                styles.normalField,
                { marginTop: 10, paddingHorizontal: 10 },
              ]}>
              <SelectDropdown
                // disabled={profiledata.verified}
                data={idProoofs}
                defaultButtonText="ID PROOF TYPE"
                defaultValue={IdVerify.id}

                rowStyle={{ textAlign: 'left' }}
                buttonTextStyle={{
                  color: Constants.black,
                  fontSize: 13,
                }}
                // textAlign: 'left',
                buttonStyle={{
                  backgroundColor: Constants.white,
                  width: '100%',
                  borderRadius: 25,
                }}
                onSelect={async (selectedItem, index) => {
                  console.log(selectedItem, index);
                  // ['Aadhaar', 'Passport', 'Driving License']
                  setIdVerify({
                    ...IdVerify,
                    id: selectedItem,
                    otpRequired: false,
                    placeholder: selectedItem === 'Aadhaar' ? 'Aadhaar Number' : selectedItem === 'Passport' ? 'File Number' : 'DL Number',
                  });
                  // setTimeout(() => {
                  if (selectedItem === 'Aadhaar') {
                    setTimeout(async () => {
                      await aadhar.current.show();
                    }, 500);
                  } else if (selectedItem === 'Passport') {
                    setTimeout(async () => {
                      await passport.current.show();
                    }, 500);
                  } else {
                    setTimeout(async () => {
                      await dl.current.show();
                    }, 500);

                  }
                  // }, 1000);

                  // setRideDetail({
                  //   ...rideDetail,
                  //   mot: selectedItem,
                  // });
                }}
              />
            </View>
            {IdVerify.id !== '' && <View style={{ flex: 1 }}>
              <Coachmark
                renderContent={() => (
                  <TourContent message={coachMarkMessage()} current={IdVerify.id === 'Aadhaar' ? aadhar : IdVerify.id === 'Passport' ? passport : dl} />
                )}
                ref={IdVerify.id === 'Aadhaar' ? aadhar : IdVerify.id === 'Passport' ? passport : dl}
              >
                <View
                  style={[Styles.fieldView, { borderColor: Constants[initial] }]}>
                  <Text style={[Styles.label, { minWidth: 110, borderRadius: 5 }]}>Enter {IdVerify.placeholder}.</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TextInput
                      editable={!profiledata.verified && !IdVerify.otpRequired}
                      style={[Styles.input2, { flex: 3 }]}
                      placeholder={IdVerify.placeholder}
                      placeholderTextColor={Constants.lightgrey}
                      value={IdVerify.no}
                      onChangeText={no =>
                        setIdVerify({ ...IdVerify, no })
                      }
                    />
                  </View>
                </View>
              </Coachmark>
            </View>}

            {(IdVerify.id === 'Driving License' || IdVerify.id === 'Passport') && <TouchableOpacity disabled={profiledata.verified} style={[Styles.fieldView, { borderColor: Constants[initial] }]} onPress={() => setOpen(true)}>
              <Text style={[Styles.label, { minWidth: 90 }]}>Date Of Birth</Text>
              <View>
                <Text style={{ color: Constants.black, fontFamily: 'Helvetica' }}>{moment(selectedate).format('DD/MM/YYYY')}</Text>
              </View>
            </TouchableOpacity>}

            {IdVerify.otpRequired && (
              <View style={{ flex: 1 }}>
                <View
                  style={[Styles.fieldView, { borderColor: Constants[initial] }]}>
                  <Text style={[Styles.label, { minWidth: 40 }]}>OTP </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TextInput
                      style={[Styles.input2, { flex: 3 }]}
                      placeholder={''}
                      placeholderTextColor={Constants.lightgrey}
                      value={IdVerify.otp}
                      onChangeText={otp => setIdVerify({ ...IdVerify, otp })}
                    />
                  </View>
                </View>

              </View>
            )}


            <TouchableOpacity
              style={[Styles.applyBtn, { flex: 1, backgroundColor: Constants[initial] }]}
              disabled={profiledata?.verified}
              onPress={() => {
                verifyId();
              }}
            >

              <Text
                style={[
                  Styles.applyBtnTxt,
                  {
                    fontSize: 16,
                    lineHeight: 25,

                    color:
                      initial === 'provider'
                        ? Constants.white
                        : Constants.black,
                  },
                ]}>
                Verify ID
              </Text>
            </TouchableOpacity>
          </View>


          {country === 'in' &&
            <View>
              <View style={{ flex: 4, marginTop: 10 }}>
                <Text
                  style={{
                    color: Constants.black,
                    fontSize: 24,
                    fontWeight: '700',
                    textAlign: 'center',
                    flex: 1,
                  }}>
                  Bank Details
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={[Styles.fieldView, { borderColor: Constants[initial] }]}>
                  <Text style={[Styles.label, { minWidth: 50 }]}>UPI ID</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TextInput
                      style={[Styles.input2, { flex: 3 }]}
                      placeholder={'UPI ID'}
                      editable={!upi.verified}
                      placeholderTextColor={Constants.lightgrey}
                      value={upi.id}
                      onChangeText={id =>
                        setUpi({ ...upi, id })
                      }
                    />
                    {upi.verified && <View

                      style={[
                        Styles.iconView,
                        {
                          flex: 1,
                          backgroundColor: Constants.green,
                          borderRadius: 10,
                        },
                        // {position: 'absolute', right: 0, borderRightWidth: 0},
                      ]}>
                      <Text
                        style={{
                          color: Constants.white,

                          fontWeight: '500',
                        }}>
                        Verified
                      </Text>

                    </View>}
                  </View>
                </View>

              </View>

              <TouchableOpacity
                style={[Styles.applyBtn, { flex: 1, backgroundColor: Constants[initial] }]}
                disabled={upi?.verified}
                onPress={() => { verifyUpiId(); }}
              >

                <Text
                  style={[
                    Styles.applyBtnTxt,
                    {
                      fontSize: 16,
                      lineHeight: 25,
                      color:
                        initial === 'provider'
                          ? Constants.white
                          : Constants.black,
                    },
                  ]}>
                  Verify UPI ID
                </Text>
              </TouchableOpacity>
            </View>
          }


          {/*    <View>
            <View style={{ flex: 4, marginTop: 10 }}>
              <Text
                style={{
                  color: Constants.black,
                  fontSize: 24,
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                Bank Details
              </Text>
            </View>
            <View
              style={[
                Styles.fieldView,
                { marginTop: 20, borderColor: Constants[initial] },
              ]}>
              <Text style={Styles.label}>Account Name</Text>
              <TextInput
                style={Styles.input}
                placeholder="Account Name"
                placeholderTextColor={Constants.lightgrey}
                value={bankDetail?.account_name}
                onChangeText={account_name =>
                  setBankDetail({ ...bankDetail, account_name })
                }
              />
            </View>
            {filedCheck.includes('ACCOUNT_NAME') && (
              <Text style={{ color: 'red' }}> Account name is required</Text>
            )}
            <View
              style={[
                Styles.fieldView,
                { marginTop: 20, borderColor: Constants[initial] },
              ]}>
              <Text style={Styles.label}>Account Number</Text>
              <TextInput
                style={Styles.input}
                keyboardType="numeric"
                inputMode="numeric"
                placeholder="Account Number"
                placeholderTextColor={Constants.lightgrey}
                value={bankDetail?.account_no}
                onChangeText={account_no =>
                  setBankDetail({ ...bankDetail, account_no })
                }
              />
            </View>
            {filedCheck.includes('ACCOUNT_NO') && (
              <Text style={{ color: 'red' }}> Account Number is required</Text>
            )}
            <View style={{
              marginTop: 15,
              padding: 7,
              borderColor: Constants.red,
              borderWidth: 1,
              borderRadius: 20,
              position: 'relative',

            }}>
              <Text style={[Styles.label, { top: -13, zIndex: 9 }]}>
                Account Type
              </Text>
              <Dropdown
                itemTextStyle={{ color: Constants.black }}
                style={Styles.dropdown}
                // activeColor={Constants.pink}
                containerStyle={{
                  borderRadius: 25,
                  overflow: 'hidden',
                  width: Dimensions.get('window').width - 40,
                }}
                placeholderStyle={Styles.placeholderStyle}
                selectedTextStyle={Styles.selectedTextStyle}
                inputSearchStyle={Styles.inputSearchStyle}
                iconStyle={Styles.iconStyle}
                data={[
                  { value: 'saving', name: 'Saving' },
                  { valu: 'current', name: 'Current' },
                ]}
                search={false}
                maxHeight={500}
                labelField="name"
                valueField="value"
                placeholder="Account Type"
                value={bankDetail?.account_Type}
                onChange={item => {
                  console.log(item);
                  setBankDetail({ ...bankDetail, account_Type: item.value });
                }}
              />
            </View>
            {filedCheck.includes('ACCOUNT_TYPE') && (
              <Text style={{ color: 'red' }}> Account Type is required</Text>
            )}
            <View
              style={[
                Styles.fieldView,
                { marginTop: 20, borderColor: Constants[initial] },
              ]}>
              <Text style={Styles.label}>IFSC Code</Text>
              <TextInput
                style={Styles.input}
                placeholder="IFSC Code"
                onBlur={checkIFSCCode}
                onEndEditing={checkIFSCCode}
                placeholderTextColor={Constants.lightgrey}
                value={bankDetail?.ifsc_code}
                onChangeText={ifsc_code =>
                  setBankDetail({ ...bankDetail, ifsc_code })
                }
              />
            </View>
            {filedCheck.includes('IFSC_CODE') && (
              <Text style={{ color: 'red' }}> IFSC code is required</Text>
            )}
            <View
              style={[
                Styles.fieldView,
                { marginTop: 20, borderColor: Constants[initial] },
              ]}>
              <Text style={Styles.label}>Bank Name</Text>
              <TextInput
                style={Styles.input}
                placeholder="Bank Name"
                editable={false}
                placeholderTextColor={Constants.lightgrey}
                value={bankDetail?.bank_name}
                onChangeText={bank_name =>
                  setBankDetail({ ...bankDetail, bank_name })
                }
              />
            </View>
            {filedCheck.includes('BANK_NAME') && (
              <Text style={{ color: 'red' }}> Bamk name is required</Text>
            )}
            <View
              style={[
                Styles.fieldView,
                { marginTop: 20, borderColor: Constants[initial] },
              ]}>
              <Text style={Styles.label}>Branch Name</Text>
              <TextInput
                style={Styles.input}
                editable={false}
                placeholder="Branch Name"
                placeholderTextColor={Constants.lightgrey}
                value={bankDetail?.branch_name}
                onChangeText={branch_name =>
                  setBankDetail({ ...bankDetail, branch_name })
                }
              />
            </View>
            {filedCheck.includes('BRANCH_NAME') && (
              <Text style={{ color: 'red' }}> Branch name is required</Text>
            )}
            <View
              style={[
                Styles.fieldView,
                { marginTop: 20, borderColor: Constants[initial] },
              ]}>
              <Text style={Styles.label}>Branch Address</Text>
              <TextInput
                style={Styles.input}
                editable={false}
                placeholder="Branch Address"
                placeholderTextColor={Constants.lightgrey}
                value={bankDetail?.branch_address}
                onChangeText={branch_address =>
                  setBankDetail({ ...bankDetail, branch_address })
                }
              />
            </View>
            {filedCheck.includes('BRANCH_ADDRESS') && (
              <Text style={{ color: 'red' }}> Branch address is required</Text>
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
            <TouchableOpacity
              disabled={!formState?.isValid}
              onPress={handleSubmit(updateBanckDeatail)}>
              <LinearGradient
                colors={[Constants[initial], Constants[initial]]}
                start={{ x: 0, y: 1.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[Styles.applyBtn, { marginTop: 0 }]}>
                <Text
                  style={[
                    Styles.applyBtnTxt,
                    {
                      fontSize: 16,
                      lineHeight: 25,
                      color:
                        initial === 'provider'
                          ? Constants.white
                          : Constants.black,
                    },
                  ]}>
                  Update Bank Details
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View> */}


          <TouchableOpacity
            style={[
              Styles.applyBtn,
              { width: 200, height: 35, backgroundColor: Constants.red, alignSelf: 'center' },
            ]}
            onPress={() => {
              setAccount(true);
            }}>

            <Text
              style={[
                Styles.applyBtnTxt,
                { fontSize: 16, lineHeight: 25, color: Constants.white, fontFamily: 'Helvetica', minWidth: 200, textAlign: 'center' },
              ]}>
              Delete Your Account
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={account}
        onRequestClose={() => {
          setAccount(!account);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={[styles.textStyle, { fontSize: 20, marginBottom: 10, color: 'red' }]}>Delete My Account</Text>
              <Text style={styles.textStyle}>
                Deleting your account will delete your access and all your
                information on this app. Are you sure you want to
                continue?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setAccount(!account)}
                  style={styles.cancelButtonStyle}>
                  <Text style={styles.modalText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setAccount(!account);
                    checkstatus();

                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <DatePicker
        style={{ zIndex: '50' }}
        modal
        mode="date"
        open={open}
        maximumDate={maxDate}
        date={selectedate}
        onConfirm={date => {
          setSelectedDate((date));
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <ActionSheet ref={actionRef}>
        <ImageBackground source={require('../../Assets/newImgs/BG.png')}>
          <Text
            style={{
              color: Constants.blue,
              textAlign: 'center',
              fontSize: 12,
              marginTop: 10,
            }}></Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={[
                styles.plusBtn,
                { marginRight: 10, backgroundColor: Constants[initial] },
              ]}
              onPress={() => {
                actionRef.current.hide();
              }}>
              <Ionicons name="close" size={30} color={Constants.white} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 50,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                selectImage('camera');
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: Constants[initial],
                    borderRadius: 50,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="camera"
                    size={30}
                    color={Constants.white}
                    onPress={() => actionRef.current.show()}
                  />
                </View>
                <Text style={{ fontSize: 15, color: Constants.white }}>
                  Camera
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                selectImage('gallery');
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: Constants[initial],
                    borderRadius: 50,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="image"
                    size={30}
                    color={Constants.white}
                    onPress={() => actionRef.current.show()}
                  />
                </View>
                <Text style={{ fontSize: 15, color: Constants.white, fontFamily: 'Helvetica' }}>
                  GAllery
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ActionSheet>
      <CameraGalleryPeacker
        refs={cameraRef}
        getImageValue={getImageValue}
        base64={false}
        cancel={cancel}
      />

      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={() => {
          setOpen(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
              <Text style={{ textAlign: 'left', fontSize: 20, color: Constants.black }}> Select Date</Text>
              <DatePicker
                maximumDate={maxDate}
                mode='date'
                date={selectedate}
                theme="light"
                androidVariant="nativeAndroid"
                onDateChange={d => {
                  setSelectedDate(d);
                  // if (new Date(minDate) > new Date(d)) {
                  //   setSelectedDate(new Date());
                  // } else {
                  //   setSelectedDate(d);
                  // }
                  // console.log(d);
                }
                }
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 20, width: width - 100, marginTop: 10 }}>
              <TouchableOpacity style={{ height: 30, width: 50 }}
                onPress={() => {
                  setOpen(false);
                }}
              >
                <Text style={{ color: Constants.blue, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 30, width: 80 }}
                onPress={() => {
                  setOpen(false);
                }}
              >
                <Text style={{ color: Constants.blue, fontSize: 16 }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
    </SafeAreaView>
  );
};

export default EditProfile;
