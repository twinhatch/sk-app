/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
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
import React, {useState, useEffect, useContext} from 'react';
import Constants from '../../Helpers/constant';
import Styles from './Styles';
import {checkForEmptyKeys} from '../../Helpers/InputsNullChecker';
import {Post} from '../../Helpers/Service';
import Spinner from '../../Component/Spinner';
import {Context} from '../../../App';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomToaster from '../../Component/CustomToaster';
import LinearGradient from 'react-native-linear-gradient';
import {PassIcon, UserInputIcon} from '../../Component/icons';

const ChangePassword = props => {
  const [toast, setToast] = useState('');
  const [initial, setInitial] = useContext(Context);
  const {email, token} = props?.route?.params;
  const [showPass, setShowPass] = useState(true);
  const [showConfirmPass, setShowConfirmPass] = useState(true);

  const [loading, setLoading] = useState(false);
  const [filedCheck, setfiledCheck] = useState([]);
  const [userDetail, setUserDetail] = useState({
    newpassword: '',
    confirmpassword: '',
  });

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => null,
    });
  }, []);

  const submit = () => {
    let {errorString, anyEmptyInputs} = checkForEmptyKeys(userDetail);
    setfiledCheck(anyEmptyInputs);

    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      if (userDetail.newpassword !== userDetail.confirmpassword) {
        setToast('Your password does not match with Confirm password');
        return;
      }

      const data = {
        password: userDetail.newpassword,
        token,
      };
      console.log('data==========>', data);
      setLoading(true);
      Post('changePassword', data, {...props, setInitial}).then(
        async res => {
          setLoading(false);
          console.log(res);
          if (res.status) {
            setToast(res.data.message);
            props.navigation.navigate('Signin');
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
            <Text style={Styles.title}>Set New Password</Text>
            {/* <Text style={Styles.subtitle}>
          Please Enter Your Details Below to start Using the app
        </Text> */}

            <View style={[Styles.fieldView, {position: 'relative'}]}>
              <View style={Styles.iconView}>
                {PassIcon(Constants.grey, 25, 25)}
              </View>
              <TextInput
                style={Styles.input}
                placeholder="New Password"
                secureTextEntry={showPass}
                placeholderTextColor={Constants.lightgrey}
                value={userDetail.newpassword}
                onChangeText={newpassword =>
                  setUserDetail({...userDetail, newpassword})
                }
              />
              <TouchableOpacity
                onPress={() => {
                  setShowPass(!showPass);
                }}
                style={[
                  Styles.iconView,
                  {position: 'absolute', right: 0, borderRightWidth: 0},
                ]}>
                <Ionicons
                  name={showPass ? 'eye-off' : 'eye'}
                  size={25}
                  color={Constants.grey}
                />
              </TouchableOpacity>
            </View>

            <View style={[Styles.fieldView, {position: 'relative'}]}>
              <View style={Styles.iconView}>
                {PassIcon(Constants.grey, 25, 25)}
              </View>
              <TextInput
                style={Styles.input}
                placeholder="Confirm Password"
                secureTextEntry={showConfirmPass}
                placeholderTextColor={Constants.lightgrey}
                value={userDetail.confirmpassword}
                onChangeText={confirmpassword =>
                  setUserDetail({...userDetail, confirmpassword})
                }
              />
              <TouchableOpacity
                onPress={() => {
                  setShowConfirmPass(!showConfirmPass);
                }}
                style={[
                  Styles.iconView,
                  {position: 'absolute', right: 0, borderRightWidth: 0},
                ]}>
                <Ionicons
                  name={showConfirmPass ? 'eye-off' : 'eye'}
                  size={25}
                  color={Constants.grey}
                />
              </TouchableOpacity>
            </View>
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
                  SUBMIT
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Signin')}>
              <Text style={[Styles.forgot]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ChangePassword;
