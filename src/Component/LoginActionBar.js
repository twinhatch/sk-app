/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from '../Screens/Provider/StyleProvider';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../Helpers/constant';

const LoginActionBar = props => {
  // return (
  //   <View containerStyle={{backgroundColor: '#fff'}}>
  //     <View
  //       style={{
  //         flexDirection: 'column',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //       }}>
  //       {/* <View
  //         style={{
  //           backgroundColor: Constants.yellow,
  //           width: 50,
  //           height: 5,
  //           borderRadius: 25,
  //           marginVertical: 20,
  //         }}></View> */}

  //       <Text style={{color: Constants.yellow, fontSize: 16}}>
  //         Please login
  //       </Text>
  //       <TouchableOpacity
  //         onPress={() => {
  //           // props.navigation.navigate('Signin');
  //           props.actionSheetRef.current?.hide();
  //         }}>
  //         <LinearGradient
  //           colors={['#D8B075', '#B27F54']}
  //           start={{x: 0, y: 1.5}}
  //           end={{x: 1, y: 0.5}}
  //           style={[
  //             styles.applyBtn,
  //             {width: 120, paddingHorizontal: 10, height: 45},
  //           ]}>
  //           <Text
  //             style={[
  //               styles.applyBtnTxt,
  //               {fontSize: 16, lineHeight: 25, fontWeight: '700'},
  //             ]}>
  //             Login
  //           </Text>
  //         </LinearGradient>
  //       </TouchableOpacity>
  //       {/* <TouchableOpacity
  //         style={{marginTop: 30}}
  //         onPress={() => {
  //           props.navigation.navigate('Signin');
  //           props.actionSheetRef.current?.hide();
  //         }}>
  //         <Text style={styles.actionBtn}>Login</Text>
  //       </TouchableOpacity> */}
  //     </View>
  //   </View>
  // );

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={{backgroundColor: 'white', alignItems: 'center'}}>
          <Text style={styles.textStyle}>Please login to proceed ahead!</Text>
          <View style={styles.cancelAndLogoutButtonWrapStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => props.setLoginModal(false)}
              style={styles.cancelButtonStyle}>
              <Text style={styles.modalText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={async () => {
                props.setLoginModal(false);
                props.setInitial('Signin');
                // setTimeout(() => {
                props.navigation.navigate('Signin');
                // }, 1000);
              }}
              style={styles.logOutButtonStyle}>
              <Text style={styles.modalText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginActionBar;
