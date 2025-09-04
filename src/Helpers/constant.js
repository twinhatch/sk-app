/* eslint-disable prettier/prettier */
// const prodUrl = 'https://traveller.paulbarberapp.com/api/';
const prodUrl = 'https://apis.sadanamkayyilundo.in/api/';
const devUrl = 'https://traveller-backend-yhji.onrender.com/api/';
// const prodUrl = 'http://192.168.0.105:3005/api/';
let apiUrl = prodUrl;
const Constants = {
  server: 'https://apis.sadanamkayyilundo.in',
  lightGreen: '#E6FDDE',
  darkRed: '#BC0505',
  pink: '#FFC4C4',
  baseUrl: apiUrl,
  lightgrey: '#757575',
  grey: '#999999',
  yellow: '#FC0',
  black: '#000000',
  green: '#07A404',
  white: '#FFFFFF',
  red: '#DF0707',
  blue: '#6741FF',
  parrot: '#CDF202',
  traveller: '#FFD41B',
  provider: '#DF0707',
  Signin: '#DF0707',
  lightTraveller: '#FFFAE5',
  bronze: '#cc8e34',
  silver: '#C3C5CD',
  gold: '#cc9900',
  dummyProfile: 'https://paulbarber-bucket.s3.eu-north-1.amazonaws.com/defaultProfile.png',

  constant_appLaunched: 'appLaunched',
  HAS_ACCOUNT: 'HASACCOUNT',
  LANGUAGE_SELECTED: 'LANGUAGE_SELECTED',
  header_back_middle_right: 'header_back_middle_right',
  header_back: 'header_back',
  keyUserToken: 'token',
  isOnboarded: 'isOnboarded',
  authToken: '',
  keysocailLoggedIn: 'isSocialLoggedIn',
  isProfileCreated: 'isProfileCreated',
  userInfoObj: 'userInfoObj',
  lastUserType: 'lastUserType',
  isDeviceRegistered: 'isDeviceRegistered',
  canResetPass: 'canResetPass',
  fcmToken: 'fcmToken',
  productionUrl: prodUrl,
  developmentUrl: devUrl,
  skyGreen: '#CDF202',

  emailValidationRegx:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  numberValidationRegx: /^\d+$/,
  passwordValidation: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
};

export default Constants;
