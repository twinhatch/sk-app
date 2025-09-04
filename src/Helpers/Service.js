/* eslint-disable prettier/prettier */
import axios from 'axios';
import Constants from './constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConnectionCheck from '../Component/ConnectionCheck';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import { Alert, Platform } from 'react-native';



const locationAlert = (connect, reject) => {
  // (connect.type === 'wifi' && connect.details.linkSpeed < 0.25) ||
  // if (Platform.OS === 'android') {
  // Alert.alert(JSON.stringify(connect))
  // return

  if (!connect.isInternetReachable || (connect.isInternetReachable && ((connect.type === 'wifi' && connect.details.linkSpeed < 0.25) || (connect.type === 'cellular' && connect.details.cellularGeneration === '2g')))) {
    // setTimeout(() => {
    Alert.alert('Poor connection.', 'Please check your internet connection and retry again', [
      {
        text: 'Dismiss',
        onPress: () => {
        },
      },
    ]);
    // }, 1000);

    if (reject) {
      reject('Poor connection')

    }
  }

  // }
};

const GetApi = async (url, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        // console.log('connected=====>', connected);
        if (connected.isInternetReachable) {
          locationAlert(connected, reject, url);
          const user = await AsyncStorage.getItem('userDetail');
          let userDetail = JSON.parse(user);
          console.log(Constants.baseUrl + url);
          // console.log(`jwt ${userDetail?.token}`);
          axios
            .get(Constants.baseUrl + url, {
              headers: {
                Authorization: `jwt ${userDetail?.token}`,
                // Authorization: `jwt ${t}`,
              },
            })
            .then(res => {
              // console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                console.log(err.response.status);
                if (err?.response?.status === 401) {
                  // props?.setInitial('Signin');
                  // await AsyncStorage.removeItem('userDetail');
                  // props?.navigation?.navigate('Signin');
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          locationAlert(connected);
          reject('Poor connection')
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const Post = async (url, data, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        // console.log('connected=====>', connected);
        if (connected.isInternetReachable) {
          locationAlert(connected, reject);
          const user = await AsyncStorage.getItem('userDetail');
          let userDetail = JSON.parse(user);
          console.log('url===>', Constants.baseUrl + url);
          // console.log('token===>', `jwt ${userDetail?.token}`);
          // console.log('data=====>', data);
          axios
            .post(Constants.baseUrl + url, data, {
              headers: {
                Authorization: `jwt ${userDetail?.token}`,
              },
            })
            .then(res => {
              // console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              console.log(err);
              if (err.response) {
                console.log(err.response.status);
                if (err?.response?.status === 401) {
                  props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  props?.navigation?.navigate('Signin');
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          locationAlert(connected);
          reject('Poor connection')
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const Put = async (url, data, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        // console.log(connected);
        if (connected.isInternetReachable) {
          locationAlert(connected, reject);
          const user = await AsyncStorage.getItem('userDetail');
          let userDetail = JSON.parse(user);
          console.log(Constants.baseUrl + url);
          console.log(`jwt ${userDetail?.token}`);
          axios
            .put(Constants.baseUrl + url, data, {
              headers: {
                Authorization: `jwt ${userDetail?.token}`,
              },
            })
            .then(res => {
              // console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                if (err?.response?.status === 401) {
                  props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  props?.navigation?.navigate('Signin');
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          locationAlert(connected);
          reject('Poor connection')
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const Delete = async (url, data, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        // console.log(connected);
        if (connected.isInternetReachable) {
          locationAlert(connected, reject);
          const user = await AsyncStorage.getItem('userDetail');
          let userDetail = JSON.parse(user);
          console.log(Constants.baseUrl + url);
          console.log(`jwt ${userDetail?.token}`);
          axios
            .delete(Constants.baseUrl + url, {
              headers: {
                Authorization: `jwt ${userDetail?.token}`,
              },
            })
            .then(res => {
              // console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              if (err.response) {
                if (err?.response?.status === 401) {
                  props?.setInitial('Signin');
                  await AsyncStorage.removeItem('userDetail');
                  props?.navigation?.navigate('Signin');
                }
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          locationAlert(connected);
          reject('Poor connection')
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const ApiFormData = async img => {
  console.log('from =========>', img);
  const user = await AsyncStorage.getItem('userDetail');
  let userDetail = JSON.parse(user);
  return new Promise((resolve, reject) => {
    ConnectionCheck.isConnected().then(
      async connected => {
        // let cleanUri = string_.ltrim(img.uri, "file:///");
        let data = {
          // name: 'file',
          // filename: img.path.toString(),
          // type: img.mime,
          // data: RNFetchBlob.wrap(img.path),
          name: 'file',
          filename: img.fileName,
          type: img.type,
          data: RNFetchBlob.wrap(Platform.OS === 'ios' ? img.uri.replace('file:///', '') : img.uri),
        }
        console.log(data)
        if (connected.isInternetReachable) {
          locationAlert(connected, reject);
          try {
            RNFetchBlob.fetch(
              'POST',
              `${Constants.baseUrl}user/fileupload`,
              {
                'Content-Type': 'multipart/form-data',
                // Authorization: `jwt ${userDetail.token}`,
              },
              [
                data
              ],
            )
              .then(resp => {
                // console.log('res============>', resp);
                resolve(JSON.parse(resp.data));
              })
              .catch(err => {
                console.log(err);
                reject(err);
              });
          } catch (err) {
            console.log(err);
            reject(err);
          }
        } else {
          locationAlert(connected);
          reject('Poor connection')
        }
      });
  });
};

const checkOtpStatus = async (check, key, max) => {
  // let isvalid = false;
  return new Promise(async (resolve, reject) => {
    ConnectionCheck.isConnected().then(
      async connected => {

        if (connected.isInternetReachable) {
          locationAlert(connected);
          const o = await AsyncStorage.getItem(key);
          if (o) {
            const newOtp = JSON.parse(o);
            if (newOtp.try >= max) {
              console.log(newOtp);
              const hours = moment().diff(new Date(Number(newOtp.date)), 'hours');
              if (hours > 24) {
                if (!check) {
                  await AsyncStorage.setItem(key, JSON.stringify({
                    date: new Date().getTime(),
                    try: 1,
                  }));
                }
                resolve(true);
              } else {
                resolve(false);

              }
            } else {
              console.log(newOtp);
              if (!check) {
                newOtp.try = newOtp.try + 1;
                await AsyncStorage.setItem(key, JSON.stringify(newOtp));
              }
              resolve(true);
            }
          } else {
            if (!check) {
              await AsyncStorage.setItem(key, JSON.stringify({
                date: new Date().getTime(),
                try: 1,
              }));
            }
            resolve(true);
            // sendOTP(userDetail);
          }
        } else {
          locationAlert(connected);
          reject('Poor connection')
        }
      });
  });
};

const commonPost = async (url, data, props) => {
  return new Promise(function (resolve, reject) {
    ConnectionCheck.isConnected().then(
      async connected => {
        console.log(url);
        console.log(data);
        if (connected.isInternetReachable) {
          locationAlert(connected, reject); locationAlert(connected);
          axios
            .post(url, data, {
              headers: {
                Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwOTcxMTI1NCwianRpIjoiNzkzMjI5MjQtNTU2Yy00ZTZlLWEyNzctNzY0NGNjMmJlOTk1IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnR3aW5oYXRjaEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcwOTcxMTI1NCwiZXhwIjoyMDI1MDcxMjU0LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.8gAdmCIkTjLrLSOYXgj9TCg1K821KPxOEhz1KUPdVL8',
              },
            })
            .then(res => {
              console.log(res.data);
              resolve(res.data);
            })
            .catch(async err => {
              console.log(err);
              if (err.response) {
                console.log(err.response.status);
                resolve(err.response.data);
              } else {
                reject(err);
              }
            });
        } else {
          locationAlert(connected);
          reject('Poor connection')
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

const checkago = (date) => {
  const days = moment().diff(new Date(date), 'days');
  if (days > 0) {
    return days + ' days ago';
  }
  const hours = moment().diff(new Date(date), 'hours');
  if (hours > 0) {
    return hours + ' hours ago';
  }
  const minutes = moment().diff(new Date(date), 'minutes');
  if (minutes > 0) {
    return minutes + ' minutes ago';
  }
  return 'now';
};



export { Post, Put, GetApi, Delete, ApiFormData, checkOtpStatus, commonPost, checkago };
