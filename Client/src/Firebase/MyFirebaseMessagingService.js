// MyFirebaseMessagingService.js
// import messaging from '@react-native-firebase/messaging';
// import PushNotification from 'react-native-push-notification';

// class MyFirebaseMessagingService {
//   // Initialize the Firebase Messaging service
//   static init = () => {
//     // Add any initialization code here, such as subscribing to background messages
//     messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//       console.log('Background message received:', remoteMessage);
//       MyFirebaseMessagingService.handleFCMMessage(remoteMessage);
//     });
//   };

//   // Handle FCM messages
//   static handleFCMMessage = async (remoteMessage) => {
//     console.log('Handling FCM message:', remoteMessage);

//     // Process the background message and display a local notification
//     if (remoteMessage.data) {
//       const { title, body } = remoteMessage.data;
//       PushNotification.localNotification({
//         title: title || 'Default Title',
//         message: body || 'Default Body',
//       });
//     }
//   };
// }

// export default MyFirebaseMessagingService;
