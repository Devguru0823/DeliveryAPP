// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import md5 from 'md5';
// import {
//   SERVER_API_PREFIX,
//   SERVER_URL,
//   STORAGE_TOKEN,
// } from '../config/constants';
// import { Global } from '../config/Global';
// import { getNumberVal } from '../utils/AppUtils';
// import { fetchOne, insertOrUpdate } from '../utils/DbUtils';

// export const postPositionRequest = async (subUrl, params, onCompleted) => {
//     // let url = SERVER_URL + SERVER_API_PREFIX + subUrl;
//     // let code = 0;
//     // let result = {};
  
//     // const request = {
//     //   url: subUrl,
//     //   ...params,
//     // };
//     // let request_cmd = '';
//     // let request_hash_key = '';
//     // let request_result_key = '';
  
//     // if (Global.localDB) {
//     //   request_cmd = md5(JSON.stringify(request));
//     //   request_hash_key = 'request_hash_' + request_cmd;
//     //   request_result_key = 'request_result_' + request_cmd;
//     //   let hash_value = await AsyncStorage.getItem(request_hash_key);
//     //   request.hash = hash_value ?? '';
//     // }
  
//     // try {
//     //   let res = await axios.post(url, request);
//     //   let { data } = res;
  
//     //   let sync = getNumberVal(data.sync);
//     //   if (sync === 1 && Global.localDB) {
//     //     const last_result = await fetchOne(request_result_key);
  
//     //     if (!last_result) {
//     //       onCompleted(code, result);
//     //       return;
//     //     }
  
//     //     data = last_result.value;
//     //   } else {
//     //     const result_hash = res.headers.result_hash;
//     //     if (result_hash) {
//     //       await AsyncStorage.setItem(request_hash_key, result_hash);
//     //       await insertOrUpdate(request_result_key, data);
//     //     }
//     //   }
  
//     //   code = getNumberVal(data.code);
//     //   result = data;
//     // } catch (error) {
//     //   console.log('error = ', error);
//     // }
  
//     // onCompleted(code, result);

//   };