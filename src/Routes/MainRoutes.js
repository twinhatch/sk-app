/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../Screens/Auth/SignIn';
import SignUp from '../Screens/Auth/SignUp';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import ChangePassword from '../Screens/Auth/ChangePassword';
import OtpVerify from '../Screens/Auth/OtpVerify';
// import ProviderRoute from './ProviderRoutes';
import styles from './Style';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Context, UserContext } from '../../App';
import Constants from '../Helpers/constant';
import PackagerRoutes from './PackagerRoutes';
import ProfilrPro from '../Screens/Provider/ProfilrPro';
import TravellerRoute from './TravellerRoute';
import PaymentPro from '../Screens/Provider/PaymentPro';
import EditProfile from '../Screens/Auth/EditProfile';
import Chats from '../Screens/Traveller/Chat';
import Chat from '../Screens/Provider/Chat';
import Track from '../Screens/Provider/Track';
import Profile from '../Screens/Traveller/Profile';
import RouteMap from '../Screens/Traveller/RouteMap';
import Payment from '../Screens/Traveller/Payment';
import Report from '../Screens/Provider/Report';
import Support from '../Screens/Provider/Support';
import { OneSignal } from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Faq from '../Screens/Provider/Faq';

const Stack = createNativeStackNavigator();
const MainRoute = props => {
  const navigation = useNavigation();
  console.log(props);
  const [user, setUser] = useContext(UserContext);
  const [initial, setInitial] = useContext(Context);
  const [loginModal, setLoginModal] = useState(false);

  const Option = title => {
    const opt = {
      safeAreaInset: {
        bottom: 'always',
      },
      headerTintColor: Constants.white,
      headerStyle: { backgroundColor: '#000000', height: 60 },

      headerRight: () => (
        <View>
          <View style={styles.headerRightView}>
            <TouchableOpacity
              onPress={() => {
                console.log('clicked=>');
                if (user?.email !== undefined) {
                  navigation.navigate('provider', {
                    screen: 'Account',
                    params: { screen: 'ProfilePro' },
                  });
                } else {
                  setLoginModal(true);
                }
              }}>
              {/* <View style={styles.headerAvtarView}>
                <Avatar.Image size={40} source={profilePic} />
              </View> */}
            </TouchableOpacity>
          </View>
        </View>
      ),

      headerTitle: () => {
        return <Text style={styles.headerTitle}>{title}</Text>;
      },
    };
    return opt;
  };

  useEffect(() => {
    OneSignal.Notifications.addEventListener('click', async event => {
      console.log('OneSignal: notification clicked:', event);
      const users = await AsyncStorage.getItem('userDetail');
      const userDetail = JSON.parse(users);
      if (userDetail.type === 'USER') {
        navigation.navigate('provider', { screen: 'Notification' });
      } else {
        navigation.navigate('traveller', { screen: 'Notification' });
      }
    });
  }, [OneSignal]);

  return (
    <>
      {/* {!!props?.initial && ( */}
      <Stack.Navigator initialRouteName={props.initial}>
        {/* {props.initial === 'Signin' && ( */}
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Signin"
            component={SignIn}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Signup"
            component={SignUp}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ForgotPassword"
            component={ForgotPassword}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="EditProfile"
            component={EditProfile}
          />
          {/* <Stack.Screen
            options={{headerShown: false}}
            name="OtpVerify"
            component={OtpVerify}
          /> */}
          {/* <Stack.Screen
            options={{headerShown: false}}
            name="ChangePassword"
            component={ChangePassword}
          /> */}
        </>
        {/* )} */}
        <Stack.Screen options={{ headerShown: false }} name="provider">
          {() => (
            <PackagerRoutes
              setToast={props?.setToast}
              setLoading={props.setLoading}
            />
          )}
        </Stack.Screen>
        <Stack.Screen options={{ headerShown: false }} name="traveller">
          {() => (
            <TravellerRoute
              setToast={props?.setToast}
              setLoading={props.setLoading}
            />
          )}
        </Stack.Screen>
        {/* <Stack.Screen options={{headerShown: false}} name="user">
          {() => (
            <UserRoute
              setToast={props?.setToast}
              setLoading={props.setLoading}
            />
          )}

        </Stack.Screen> */}
        <Stack.Screen
          options={{ headerShown: false }}
          name="profile"
          component={ProfilrPro}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="profiletraveller"
          component={Profile}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="paymentpro"
          component={PaymentPro}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="payment"
          component={Payment}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Chats"
          component={Chats}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Chat"
          component={Chat}
        />
        <Stack.Screen
          options={{ headerShown: true }}
          name="Track"
          component={Track}
        />
        <Stack.Screen
          options={{ headerShown: true }}
          name="routemap"
          component={RouteMap}
        />
        <Stack.Screen
          options={{ headerShown: true }}
          name="Report"
          component={Report}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Support"
          component={Support}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Faq"
          component={Faq}
        />
      </Stack.Navigator>
      {/* )} */}
    </>
  );
};

export default MainRoute;
