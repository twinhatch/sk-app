/* eslint-disable prettier/prettier */
// import SocketIOClient from 'socket.io-client';
import { io } from 'socket.io-client';

import Constants from '../src/Helpers/constant';
const connectionConfig = {
  // jsonp: false,
  // reconnection: true,
  // reconnectionDelay: 100,
  // reconnectionAttempts: 100000,
  transports: ['websocket'],
  // forceNew: true,

  //optional
  // query: {
  //   source: 'auction:mobile',
  //   platform: Platform.OS === 'ios' ? IOS : ANDROID,
  // },
};
// export const socket = SocketIOClient(Constants.server, connectionConfig);
const url = Constants.server;
// const url = 'http://192.168.0.101:3000';
export const socket = io(url, connectionConfig);
