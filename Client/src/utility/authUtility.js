import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_LOGIN_INFO, STORAGE_TOKEN, STORAGE_EXPRIETIME} from '../config/constants';
import {Global} from '../config/global';

export const setTokenLoginInfo = async (token, loginInfo, expireTime) => {
  await AsyncStorage.multiSet([
    [STORAGE_LOGIN_INFO, JSON.stringify(loginInfo)],
    [STORAGE_TOKEN, token],
    [STORAGE_EXPRIETIME, expireTime],
    // [STORAGE_CLIENTID, clientId]
  ]);

  Global.token = token;
  Global.loginInfo = {
    email: loginInfo.email ?? '',
    password: loginInfo.password ?? '',
  };
  Global.expireTime = expireTime;
  // Global.clientId = clientId
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(STORAGE_TOKEN);
};
export const removeExpireTime = async () => {
  await AsyncStorage.removeItem(STORAGE_EXPRIETIME);
};
