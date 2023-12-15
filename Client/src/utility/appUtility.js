import {Dimensions, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const defaultDeviceWidth = 430;
export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export function showToastError(message,title, duration = 2000) {
  const toastConfig = {
    type: 'error',
    text1: message,
    text2: title,
    visibilityTime: 2000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
    onPress: () => {
    },
    onHide: () => {
    },
    onShow: () => {
    },
    props: {}
  };

  const styles = StyleSheet.create({
    text1: {
      fontSize: 50,
    },
  });

  Toast.show(toastConfig);
}

export function showToastSuccess(message,title, duration = 2000) {
  const toastConfig = {
    type: 'success',
    text1: message,
    text2: title,
    visibilityTime: 2000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
    options: {
      textStyle: {fontSize: 50},
    },
    onPress: () => {
    },
    onHide: () => {
    },
    onShow: () => {
    },
    props: {}
  };

  const styles = StyleSheet.create({
    text1: {
      fontSize: 50,
    },
  });

  Toast.show(toastConfig);
}

export const getDeltaLatLng = (mile, delta = 0) => {
    // 1 degree of longitude = 55.051
    // l degree of latitude = 69
  
    let latitudeDelta = mile / 69 + delta;
    let longitudeDelta = mile / 55.051 + delta;
  
    return {
      latitudeDelta,
      longitudeDelta,
    };
  };

  export const getResponsiveSize = (val, direct = 1) => {
    let res;
  
    let diff = Math.abs(defaultDeviceWidth - SCREEN_WIDTH);
  
    let sign = 1;
    if (SCREEN_WIDTH < defaultDeviceWidth) {
      sign = -1;
    }
  
    let fee = 0;
  
    if (diff > 300) {
      fee = 0.33;
    } else if (diff > 200 && diff <= 300) {
      fee = 0.25;
    } else if (diff > 100 && diff <= 200) {
      fee = 0.14;
    } else if (diff > 50 && diff <= 100) {
      fee = 0.06;
    }
  
    res = val * (1 + sign * direct * fee);
  
    return res;
  };

