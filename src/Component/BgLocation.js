/* eslint-disable prettier/prettier */
import { PermissionsAndroid } from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import Geolocation from 'react-native-geolocation-service';



//request the permission before starting the service.


const update = (getLocation) => {
    Geolocation.getCurrentPosition(location => {
        getLocation(location);
    });
};

const BgCuurentLocation = async getLocation => {
    try {
        const backgroundgranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
                title: 'Background Location Permission',
                message:
                    'We need access to your location ' +
                    'so you can get live quality updates.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
            ReactNativeForegroundService.add_task(() => update(getLocation), {
                delay: 1000,
                onLoop: true,
                taskId: 'taskid',
                onError: (e) => console.log('Error logging:', e),
            });
        }
        // return location;
    } catch (error) {
        const { code, message } = error;
        console.warn(code, message);
    }
};

export default BgCuurentLocation;


