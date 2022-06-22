import {Platform, Alert} from 'react-native';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';

export default function usePhotoLibraryPermission() {
  const getAvailability = async () => {
    const {UNAVAILABLE, BLOCKED, DENIED, LIMITED} = RESULTS;

    if (Platform.OS === 'ios') {
      const permission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (permission === UNAVAILABLE) {
        return false;
      }
      if (permission === BLOCKED) {
        Alert.alert(
          'Alim',
          'Access to the gallery is denied Are you sure you want to change the gallery permissions?',
          [
            {
              text: 'cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'confirm',
              onPress: openSettings,
            },
          ],
        );
        return false;
      }
      if (permission === DENIED) {
        const requestPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (requestPermission === BLOCKED) return false;
      }
    }

    if (Platform.OS === 'android') {
      const permission = await check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );

      if (permission === UNAVAILABLE) {
        return false;
      }
      if (permission === BLOCKED) {
        Alert.alert(
          'Alim',
          'Access to the gallery is denied Are you sure you want to change the gallery permissions?',
          [
            {
              text: 'cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'confirm',
              onPress: openSettings,
            },
          ],
        );
        return false;
      }
      if (permission === DENIED) {
        const requestPermission = await request(
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        );
        if (requestPermission === BLOCKED || requestPermission === DENIED)
          return false;
      }
    }

    return true;
  };

  return {
    getAvailability,
  };
}
