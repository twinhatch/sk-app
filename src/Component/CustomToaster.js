/* eslint-disable prettier/prettier */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { View, Text, StyleSheet, Modal, AlertIOS, Platform, Alert } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { Context } from '../../App';
import Constants from '../Helpers/constant';
// import Toast from 'react-native-toast-message';

const CustomToaster = props => {
  const [initial, setInitial] = useContext(Context);
  let textColor = {
    Signin: props.color,
    provider: Constants.white,
    traveller: Constants.black,
  };

  useEffect(() => {
    if (props.toast !== '') {
      // Toast.hide()
      // Toast.show({
      //   type: 'success',
      //   text1: props.toast,
      //   // text2: 'This is some something 👋'
      // });
      // if (Platform.OS === 'ios') {
      //   // Alert.alert(props.toast)
      //   Toast.show({
      //     type: 'success',
      //     text1: props.toast,
      //     position: 'bottom'

      //     // text2: 'This is some something 👋'
      //   });
      // } else {
      setTimeout(() => {
        props.setToast('');
        // props.timeout
      }, 3000);
      // }

    }

  }, [props.toast]);

  return (

    <Modal
      transparent={true}
      animationType={'none'}
      visible={props.toast !== ''}
      style={{ zIndex: 9 }}
      onRequestClose={() => { }}>
      <View style={Styles.modalBackground}>
        <View style={Styles.activityIndicatorWrapper}>
          <Text
            style={{
              backgroundColor:
                initial !== 'Signin'
                  ? initial === 'traveller' ? Constants.lightTraveller : Constants.pink
                  : props.backgroundColor,
              padding: 15,
              borderRadius: 25,
              color: initial === 'Signin' ? textColor[initial] : 'black',
              textAlign: 'center',
              position: 'absolute',
              bottom: 50,
              fontFamily: 'Helvetica',
              fontWeight: '500',
              borderWidth: 3,
              overflow: 'hidden',
              // borderColor: '#e0bc00'
              borderColor:
                initial !== 'Signin'
                  ? initial === 'traveller' ? '#e0bc00' : '#ae3127'
                  : props.color,
            }}>
            {props.toast}
          </Text>
        </View>
      </View>
    </Modal>


  );
};

const Styles = StyleSheet.create({
  modalBackground: {
    // flex: 1,
    flexDirection: 'column',
    zIndex: 9,
    position: 'relative',
    height: '100%'

  },
  activityIndicatorWrapper: {
    flex: 1,

    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default CustomToaster;
