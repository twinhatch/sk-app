/* eslint-disable prettier/prettier */


import { launchCamera } from 'react-native-image-picker';


const CameraPeacker = props => {

  const options2 = {
    mediaType: 'photo',
    maxWidth: props?.width || 300,
    maxHeight: props?.height || 300,
    quality: props?.quality || 1,
    // includeBase64: props.base64,
    saveToPhotos: true,
    // cameraType: props?.useFrontCamera ? 'front' : 'back',
  };

  const launchCameras = async () => {
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
        if (props && props?.getImageValue) {
          props.getImageValue(response);
        }
      }
    });

  };

  const onCancel = () => {
    if (props?.cancel !== undefined) {
      props?.cancel();
    }
  };


  launchCameras();

};

export default CameraPeacker;

