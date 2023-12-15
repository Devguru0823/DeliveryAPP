/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  //   const notification = new firebase.notifications.Notification()
  //   .setNotificationId(remoteMessage.messageId)
  //   .setTitle(remoteMessage.data.title)
  //   .setBody(remoteMessage.data.body);

  // firebase.notifications().displayNotification(notification);
  });
AppRegistry.registerComponent(appName, () => App);
