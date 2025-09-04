/* eslint-disable prettier/prettier */
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import axios from 'axios';


const ConnectionCheck = {
  isConnected: function () {
    const timeout = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    return new Promise(async (resolve, reject) => {
      // const { netInfo, refresh } = useNetInfo();
      const fileUrl = 'https://paulbarber-bucket.s3.eu-north-1.amazonaws.com/defaultProfile.png'; // Use a URL of a small file (Google's pixel gif)
      const startTime = new Date().getTime();
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000; // in seconds
      const fileSize = response.headers['content-length'] || response.data.byteLength; // in bytes
      let speed = (fileSize / duration / 1024 / 1024).toFixed(2); // in KBps
      console.log('new speed 44444444444444444>', speed)


      let state = await NetInfo.fetch();
      console.log('new speed 44444444444444444>', state)
      if (!state || state.isInternetReachable === null) {
        await timeout(1000);
        // return isConnected()
        state = await NetInfo.fetch();
      }
      const d = {
        ...state,
        details: {
          ...state.details,
          linkSpeed: speed
          // Platform.OS === 'android' ? state?.details?.linkSpeed : 1
        }
      };
      if (state.details !== undefined) {
        resolve(d);
      }

      // console.log('state======>', d);
      // if (state) {
      //   resolve(d);
      // } else {
      //   resolve({ details: { linkSpeed: 1 } });
      // }
    });
  },
};






export default ConnectionCheck;



