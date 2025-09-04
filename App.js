/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { StatusBar, AppState, Alert, Platform, View } from 'react-native';
import React, { useState, useEffect, createRef, useRef, StrictMode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from './src/Component/Spinner';
import CustomToaster from './src/Component/CustomToaster';
import Constants from './src/Helpers/constant';
import SplashScreen from 'react-native-splash-screen';
import MainRoutes from './src/Routes/MainRoutes';
import { PaperProvider } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import { Post } from './src/Helpers/Service';
import CustomCurrentLocation from './src/Component/CustomCurrentLocation';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { socket } from './utils';
import CuurentLocation from './src/Component/CuurentLocation';
import analytics from '@react-native-firebase/analytics';
import { Button, Snackbar } from 'react-native-paper';
import ConnectionCheck from './src/Component/ConnectionCheck';
import { Provider, useSelector } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { persistor, store } from './src/redux/store/configureStore';
// import RnSpeedTestProvider, { useRnSpeedTest, RnSpeedTestConfig, } from 'rn-speed-test';
// import Toast from 'react-native-toast-message';
// import firebase from '@react-native-firebase/app';

// import configureStore from './src/redux/store/configureStore';
// import { Provider } from 'react-redux';
// import { setData } from './dataReducer';


// import BgCuurentLocation from './src/Component/BgLocation';

export const Context = React.createContext();
export const UserContext = React.createContext();
export const locContext = React.createContext();
export const toastContext = React.createContext();
export const snakeContext = React.createContext();
const APP_ID = '15064e28-b929-4aaf-bf83-056fba7eeee0';



const App = () => {
  // const { networkSpeed, networkSpeedText } = useRnSpeedTest();

  const [initial, setInitial] = useState('');
  const [user, setUser] = useState({});
  const [currLoc, setCurLoc] = useState({
    // location: [77.391029, 77.391029],
    // add: 'Katargam,Surat,Gujarat'
    // location: {
    //   coords: {
    //     latitude: 28.535517,
    //     longitude: 77.391029,
    //   },
    // },
    // add: [
    //   {
    //     formatted_address: 'Katargam, Surat, Gujarat',
    //   },
    // ],
  });
  const [toast, setToast] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interval, setinter] = useState();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [newInt, setNewInt] = useState();
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  // const data = useSelector((state) => state.data.data);
  // const dispatch = useDispatch();
  const [error, setError] = useState('');
  const config = {
    token: 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm',
    timeout: 10000,
    https: true,
    urlCount: 5,
    bufferSize: 8,
    unit: 'MBps',
  };

  // console.log(networkSpeed)


  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {

      } else {

      }
      if (nextAppState === 'active') {
        checkLocation()
        userOnline('online')
      }

      if (nextAppState === 'background') {
        userOnline('offline')
      }
      loggedUse();
      clearInterval(newInt);
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      // console.log('AppState====================================================================>', appState.current);

    });


    socket.on('connect', () => {
      console.log('soket id from appjs ->', socket.id);
    });

    // fb()
    return () => {
      subscription.remove();
      clearInterval(newInt);
      socket.off('connect');
      socket.off('onsupport');
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    };
  }, []);


  // const fb = async () => {
  //   await firebase.initializeApp({
  //     apiKey: "AIzaSyDJGVOV8SDx01PefzSFSU5LiR6YFTmSMa0",
  //     projectId: "sk-app-e3c9c",
  //     storageBucket: "sk-app-e3c9c.appspot.com",
  //     messagingSenderId: "405687256118",
  //     appId: "1:405687256118:ios:b3583009a07ffed5d9c49",
  //   })
  // }

  useEffect(() => {
    let int;
    ConnectionCheck.isConnected().then(
      async connected => {
        if (connected.isInternetReachable || ((connected.type === 'wifi' && connected.details.linkSpeed > 0.25) || (connected.type === 'cellular' && connected.details.cellularGeneration !== '2g'))) {
          if (user?.type) {
            int = setInterval(() => {
              updateTrackLocation(int);
            }, 10000);
            setinter(int);
            updateTrackLocation(int);
          }
        } else {
          clearInterval(int);
        }
      });

    return () => {
      clearInterval(int);
    };
  }, [user]);

  useEffect(() => {
    clearInterval(interval);
    let int;
    ConnectionCheck.isConnected().then(
      async connected => {
        if (connected.isInternetReachable || ((connected.type === 'wifi' && connected.details.linkSpeed > 0.25) || (connected.type === 'cellular' && connected.details.cellularGeneration !== '2g'))) {

          if (user?.type === 'TRAVELLER') {
            int = setInterval(() => {
              updateLoc(int);
            }, 30000);
            setinter(int);
          } else {
            clearInterval(int);
          }
        } else {
          clearInterval(int);
        }

      });

    return () => {
      clearInterval(int);
    };
  }, [user]);

  const loggedUse = async () => {
    const deviceToken = await DeviceInfo.getAndroidId();
    // const deviceToken = await DeviceInfo.getDeviceToken();
    // console.log('deviceToken=================>', deviceToken);
    await analytics().setUserId(deviceToken);
  };


  useEffect(() => {

    setInitialRoute();
    checkLocation()


  }, [initial]);

  const checkLocation = () => {
    // if (Platform.OS === 'android') {
    ConnectionCheck.isConnected().then(
      async connected => {
        // 
        if (connected.isInternetReachable || ((connected.type === 'wifi' && connected.details.linkSpeed > 0.25) || (connected.type === 'cellular' && connected.details.cellularGeneration !== '2g'))) {
          setTimeout(async () => {
            if (currLoc.add === undefined) {
              CustomCurrentLocation(getLocation);
            }
          }, 2000);
          if (initial === 'traveller') {
            onlineNotifyUser();
          }
        } else {
          if (!visible) {
            SplashScreen.hide();
            // setCurLoc(userLocation.data)
            // const r = await AsyncStorage.getItem('persist:root');
            const r = await AsyncStorage.getItem('userLcation');
            if (r) {
              const rs = JSON.parse(r);
              setCurLoc(rs);
            }
            setVisible(true);
            setTimeout(() => {


              Alert.alert('Poor connection.', 'Please check your internet connection and retry again', [
                {
                  text: 'Dismiss',
                  onPress: () => {
                    SplashScreen.hide();
                    setVisible(false);
                    // if (r) {
                    //   const rs = JSON.parse(r);
                    //   setCurLoc(rs);
                    // }
                  },
                },
              ]);
            }, 500);
          }
        }
      });
    // } else {
    //   setTimeout(async () => {
    //     if (currLoc.add === undefined) {
    //       CustomCurrentLocation(getLocation);
    //     }
    //   }, 2000);
    //   if (initial === 'traveller') {
    //     onlineNotifyUser();
    //   }
    // }

  }

  const checkPermisssion = async () => {
    const permission = PERMISSIONS.POST_NOTIFICATIONS;
    const result = await check(PERMISSIONS.POST_NOTIFICATIONS);

    if (result === RESULTS.GRANTED) {
      OneSignal.initialize(APP_ID);
      OneSignal.Notifications.requestPermission(true);
      console.log('Permission already granted');
      return;
    }

    // If permission is denied or undetermined, request permission
    if (result === RESULTS.DENIED || result === RESULTS.UNAVAILABLE) {
      const permissionResult = await request(permission);

      // Handle the permission result
      if (permissionResult === RESULTS.GRANTED) {
        console.log('Permission granted');
        OneSignal.initialize(APP_ID);
        OneSignal.Notifications.requestPermission(true);
        // You can now access the media
      } else {
        console.log('Permission denied');
        // Handle the denial of permission
      }
    }
  };

  const getLocation = (location, add) => {
    SplashScreen.hide();

    try {
      const data = {
        location,
        add,
      }
      setCurLoc(data);
      AsyncStorage.setItem('userLcation', JSON.stringify(data))

      // setVisible(true)
      // console.log('applocation=================>', location);
      // setLoading(false);
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  };

  const onlineNotifyUser = () => {
    CuurentLocation(async (location) => {
      const data = {
        deviceToken: await DeviceInfo.getAndroidId(),
        track: [location.coords.longitude, location.coords.latitude],
        content: 'Sadanam Kayyilundu. Package is with me',
        // address: add[0].formatted_address,
      };
      Post('isonline', data, { setInitial }).then(
        async res => {
          // console.log(res.data);
          if (res.status) {
            // console.log(res);
          } else {
          }
        },
        err => {
          setLoading(false);
          console.log(err);
        },
      );
    });
  };

  useEffect(() => {
    setupOnesignal();
  }, [OneSignal]);

  const setupOnesignal = async () => {
    // OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(APP_ID);
    // OneSignal.login(await DeviceInfo.getAndroidId());
    OneSignal.Notifications.requestPermission(true);
    // checkPermisssion()
    OneSignal.InAppMessages.addEventListener('willDisplay', (event) => {
      console.log('OneSignal: notification clicked:', event);
    });
    OneSignal.Notifications.addEventListener('click', async event => {
      console.log('OneSignal: notification clicked:', event);
      const users = await AsyncStorage.getItem('userDetail');
      const userDetail = JSON.parse(users);
      if (userDetail.type === 'USER') {
        setInitial('provider');
        setUser(userDetail);
      } else {
        setInitial('traveller');
        setUser(userDetail);
      }
    });
  };

  const setInitialRoute = async () => {
    // setLoading(true);
    const users = await AsyncStorage.getItem('userDetail');
    const userDetail = JSON.parse(users);
    // const userDetail = null;
    if (userDetail === null) {
      setInitial('Signin');
      // setInitial('provider');
    } else {
      if (userDetail.type === 'USER') {
        setInitial('provider');
        setUser(userDetail);
      } else {
        setInitial('traveller');
        setUser(userDetail);
      }
    }

    // checkPermisssion()
    // setLoading(false);

    // else if (userDetail.type === 'USER') {
    //   setInitial('user');
    // } else if (userDetail.type === 'CLEANER') {
    // setInitial('Signin');
    // }
  };

  const userOnline = (online) => {
    const data = {
      online,
    };
    Post('updateProfile', data, { setInitial }).then(
      async res => {
        setLoading(false);
        if (res.status) {
          socket.emit('onsupport', `${user?._id}admin`);
        } else {
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  const updateTrackLocation = (inter) => {
    // console.log(socket.connected);
    // if (!socket.connected) {
    //   socket.on('connect', () => {
    //     console.log('soket id from appjs ->', socket.id)
    //   });
    // }
    // console.log('speedTest========>', networkSpeedText)
    CuurentLocation(res => {
      const data = {
        track: {
          type: 'Point',
          coordinates: [res.coords.longitude, res.coords.latitude],
        },

      };
      Post('updateUserLocation', data, { setInitial }).then(
        async res => {
          setLoading(false);
          if (res.status) {
            // setUser(res.data);
            // await AsyncStorage.setItem('userDetail', JSON.stringify(res.data));
          } else {
            clearInterval(inter);
            // console.log(res);
            // setToast(res.data.message);
          }
        },
        err => {
          clearInterval(inter);
          setLoading(false);
          console.log(err);
        },
      );
    });
  };
  const updateLoc = async (ini) => {
    // const data = await AsyncStorage.getItem(plan_id);
    // console.log('notification--->', data, new Date(), new Date(Number(data)));
    // const hours = moment().diff(new Date(Number(data)), 'hours');


    CuurentLocation(async (location) => {
      const data = {
        deviceToken: await DeviceInfo.getAndroidId(),
        // track: [72.8239915, 21.2257127]
        track: [location.coords.longitude, location.coords.latitude],
        // address: add[0].formatted_address,
      };
      Post('updatetrack', data, { setInitial }).then(
        async res => {
          if (res.status) {
          } else {
            clearInterval(ini);
          }
        },
        err => {
          clearInterval(ini);
          setLoading(false);
          console.log(err);
        },
      );
    });
  };
  // useEffect(() => {
  //   if (!!toast) {
  //     Toast.show({
  //       type: 'success',
  //       text1: toast,
  //       // text2: 'This is some something 👋'
  //     });
  //   }
  //   console.log(toast)
  // }, [toast]);
  return (

    // <Provider store={store}>
    //   <PersistGate loading={null} persistor={persistor}>
    <PaperProvider>

      {/* {currLoc.location !== undefined && ( */}

      <Context.Provider value={[initial, setInitial]}>
        <toastContext.Provider value={[toast, setToast]}>

          {/* <Toast  /> */}
          <View style={{ zIndex: 9 }}>
            <CustomToaster
              color={initial === 'traveller' ? Constants.black : Constants.white}
              backgroundColor={Constants[initial]}
              timeout={3000}
              toast={toast}
              setToast={setToast}
            />
          </View>
          {/* <View> */}
          <UserContext.Provider value={[user, setUser]}>
            <locContext.Provider value={[currLoc, setCurLoc]}>

              <Spinner color={'#fff'} visible={false} />
              {initial !== '' && (
                <NavigationContainer ref={navigationRef}
                  onReady={() => {
                    loggedUse();
                    routeNameRef.current = navigationRef.current.getCurrentRoute().name;
                  }}
                  onStateChange={async () => {
                    const currentRouteName = navigationRef.current.getCurrentRoute().name;
                    // console.log('currentroutename================>', currentRouteName);
                    if (currentRouteName === 'Signup' || currentRouteName === 'payment') {
                      await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                      });
                    }
                  }}
                >


                  <StatusBar
                    backgroundColor={Constants[initial]}
                    barStyle={
                      initial === 'traveller' ? 'dark-content' : Platform.OS === 'android' ? 'light-content' : "default"
                    }
                    translucent={false}
                  />
                  {/* <RnSpeedTestProvider initialConfig={config} onError={setError}> */}

                  {initial !== '' && (
                    <MainRoutes
                      initial={initial}
                      setToast={setToast}
                      setLoading={setLoading}
                    />
                  )}
                  {/* </RnSpeedTestProvider> */}

                </NavigationContainer>
              )}

            </locContext.Provider>
          </UserContext.Provider>
          {/* </View> */}


        </toastContext.Provider >

      </Context.Provider>
      {/* )} */}
    </PaperProvider>
    //   </PersistGate>
    // </Provider>
  );
};

export default App;
