/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, { useEffect } from 'react';

import ActionSheet from 'react-native-actions-sheet';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
} from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Constants from '../Helpers/constant';

const CameraGalleryPeacker = props => {
  const options2 = {
    mediaType: 'photo',
    maxWidth: props?.width || 300,
    maxHeight: props?.height || 300,
    quality: props?.quality || 1,
    includeBase64: props.base64,
    saveToPhotos: true,
  };

  const options = {
    width: props?.width || 300,
    height: props?.height || 300,
    cropping: props?.crop || false,
    compressImageQuality: props?.quality || 1,
    includeBase64: props.base64,
    useFrontCamera: props?.useFrontCamera ? props?.useFrontCamera : false,
  };

  const launchCameras = async () => {
    // props.refs.current?.hide()
    try {
      launchCamera(options2, response => {
        if (response.didCancel) {
          onCancel();
          console.log('User cancelled image picker');
        } else if (response.error) {
          onCancel();
          console.log('ImagePicker Error:', response.error);
          // setErrorMessage('Error selecting image. Please try again.');
        } else if (response.customButton) {
          onCancel();
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
          props.refs.current?.hide()
          props.getImageValue(response);
          // setSelectedImage(source);
        }
      });
    } catch (e) {
      console.log(e)
    }

    // }, 2000);
  };

  const launchImageLibrarys = async () => {
    // props.refs.current?.hide();
    launchImageLibrary(options2, response => {
      if (response.didCancel) {
        onCancel();
        console.log('User cancelled image picker');
      } else if (response.error) {
        onCancel();
        console.log('ImagePicker Error:', response.error);
        // setErrorMessage('Error selecting image. Please try again.');
      } else if (response.customButton) {
        onCancel();
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        props.refs.current?.hide();
        props.getImageValue(response);
        // setSelectedImage(source);
      }
    });

  };



  const onCancel = () => {
    if (props?.cancel !== undefined) {
      props?.cancel();
      props.refs.current?.hide();
    }
  };

  const requestMediaPermission = async (type, permission) => {
    // props.refs.current?.hide();
    try {
      const result = await check(permission);

      if (result === RESULTS.GRANTED) {

        setTimeout(() => {
          type();
        }, 500);

        console.log('Permission already granted');
        return;
      }

      if (result === RESULTS.DENIED || result === RESULTS.UNAVAILABLE) {
        const permissionResult = await request(permission);
        console.log(permissionResult)
        if (permissionResult === RESULTS.GRANTED) {
          console.log('Permission granted');
          type();

        } else {
          console.log('Permission denied');

        }
      }
    } catch (error) {
      console.error('Error checking or requesting permission:', error);
    }
  };

  return (
    <ActionSheet
      ref={props.refs}
      closeOnTouchBackdrop={false}
      closeOnPressBack={false}
      containerStyle={{ backgroundColor: props.backgroundColor }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 30 }}>
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              color: props?.headerColor || Constants.black,
              fontSize: 20,
              fontWeight: '700',
              marginBottom: 20,
            }}>
            Choose your photo
          </Text>
        </View>
        <TouchableOpacity
          style={{ flexDirection: 'row', width: '100%' }}
          onPress={() => {
            // const permission =
            //   Platform.OS === 'ios'
            //     ? PERMISSIONS.IOS.CAMERA
            //     : PERMISSIONS.ANDROID.CAMERA;
            // requestMediaPermission(launchCameras, permission);
            Platform.OS === 'ios' ? requestMediaPermission(launchCameras, PERMISSIONS.IOS.CAMERA) : launchCameras()


          }}>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                color: props?.titleColor || Constants.black,
                fontSize: 18,
                fontWeight: '500',
                opacity: 0.7,
              }}>
              Take a Picture
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: 'row', marginTop: 10 }}
          onPress={() => {
            // const permission =
            //   Platform.OS === 'ios'
            //     ? PERMISSIONS.IOS.PHOTO_LIBRARY
            //     : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
            // requestMediaPermission(launchImageLibrarys, permission);
            Platform.OS === 'ios' ? requestMediaPermission(launchImageLibrarys, PERMISSIONS.IOS.PHOTO_LIBRARY) : launchImageLibrarys()
            // launchImageLibrarys();

          }}>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                color: props?.titleColor || Constants.black,
                fontSize: 18,
                fontWeight: '500',
                opacity: 0.7,
              }}>
              Choose from gallery
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'flex-end',
          }}
          onPress={() => {
            onCancel();
            props.refs.current?.hide();
          }}>
          <View style={{ marginLeft: 10, width: '100%' }}>
            <Text
              style={{
                color: props?.cancelButtonColor || Constants.black,
                fontSize: 18,
                fontWeight: '500',
                textAlign: 'right',
                marginRight: 20,
              }}>
              CANCEL
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
};

export default CameraGalleryPeacker;
