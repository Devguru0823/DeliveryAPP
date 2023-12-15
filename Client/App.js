// App.js
import React, { useState, useEffect } from 'react';
import { View, Alert, AppState } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import Base from './src/base';
import store from './src/redux/store';
import messaging from '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications';
// import MyFirebaseMessagingService from '../Client/src/Firebase/MyFirebaseMessagingService';

const App = () => {
  // const [initialNotification, setInitialNotification] = useState(null);

  useEffect(() => {
    // Listen for incoming FCM notifications
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    // Handle the incoming notification here
    console.log('FCM Message Data:', remoteMessage.data);
  });

  return unsubscribe; // Cleanup when the component unmounts
  }, []);

  return (
    <Provider store={store}>
      <MenuProvider>
        <Base />
        <View style={{ position: 'absolute', top: -2, width: '100%' }}>
          <Toast />
        </View>
      </MenuProvider>
    </Provider>
  );
};

export default App;
