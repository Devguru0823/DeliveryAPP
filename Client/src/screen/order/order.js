import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, BackHandler, Alert, NativeModules } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import SwitchSelector from 'react-native-switch-selector';
import ExitApp from 'react-native-exit-app';
import axios from 'axios';
import Sound from 'react-native-sound';
import MapPage from './map';
import LocationList from './locationList';
import ColorInfo from '../../theme/colorInfo';
import { actionChangeUserInfo, setApiLoading,} from '../../redux/actions/globalAction';
import { Global } from '../../config/global';
import io from 'socket.io-client';
import { showToastError, showToastSuccess } from '../../utility/appUtility';
import { getHeaders } from '../../utility/header';
import { setTokenLoginInfo } from "../../utility/authUtility";
import '../../asset/orderAlert.wav'
const socket = io('http://192.168.130.84:8080'); 
const GLOVO_API_BASE_URL = 'https://api.glovoapp.com';

const deliverySound = new Sound(require('../../asset/orderAlert.wav'), Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.error('Error loading sound', error);
  }
});


const OrderScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [isOnline, setIsOnline] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [newToken, setNewToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startStatus, setStartStatus] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);

  const options = [
    { label: 'Location List', value: 1, buttonColor: ColorInfo.warmGrey },
    { label: 'Map', value: 0, buttonColor: ColorInfo.warmGrey },
    
  ];
  const renderSelectedView = () => {
    switch (selectedIndex) {
      case 0:
        return <MapPage />;
      case 1:
        return <LocationList onStartStatusChange={handleStartStatusChange} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Close Application',
        'Do you want to close the application?',
        [
          {
            text: 'No',
            onPress: () => {
            },
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: handleYesButton,
          },
        ],
        { cancelable: false }
      );
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleYesButton = () => {
    if (Global.riderStatus) {
      Alert.alert('Message', 'Please check online button');
    } else {
      ExitApp.exitApp();
    }
    }

  const refreshGlovoToken = async () => {
    try {
      setApiLoading(true);

      const response = await axios.post(
        `${GLOVO_API_BASE_URL}/oauth/token`,
        {
          grantType: 'password',
          password: Global.loginInfo.password,
          termsAndConditionsChecked: false,
          userType: 'courier',
          username: Global.loginInfo.email,
        },
        {
          headers: {
            ...getHeaders(),
          },
        }
      );

      setApiLoading(false);
      return response.data
    } catch (error) {
      setApiLoading(false);
      console.log('Error refreshing Glovo token:', error.message);
      throw error;
    }
  };

  const handleTokenRefresh = async () => {
    try {
      Geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
      
          const data = await refreshGlovoToken();
          const refreshToken = data.accessToken;
          const refreshExpireDate = (Date.now() + (data.expiresIn)*1000).toString();
          let loginInfo = {
            email: Global.loginInfo.email,
            password: Global.loginInfo.password,
          };
          let email = Global.loginInfo.email;
          let password = Global.loginInfo.password;
          await setTokenLoginInfo(refreshToken,loginInfo,refreshExpireDate);
          setNewToken(refreshToken);

          socket.emit('newToken', { token: refreshToken, expireTime: refreshExpireDate, email: email, password: password, latitude:latitude, longitude:longitude});
        },(error) => {
          console.error('Error getting location: ', error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      )
    } catch (error) {
      console.log(error.message);
    }
    
  };

  
  const toggleOnlineAndPositionStatus = async () => {
    await toggleOnlineStatus();
    await startSinglePositionStatus();
  };

  const toggleOnlineStatus = async () => {
    setIsOnline((prevIsOnline) => !prevIsOnline);
    Global.riderStatus = !isOnline;
    try {
      
      const eventData = {
        isOnline: !isOnline,
        email: Global.loginInfo.email,
        password: Global.loginInfo.password,
        access_Token: Global.token,
        expireTime: Global.expireTime,
      };

      socket.emit('onlineStatusToggle', eventData);

    } catch (error) {
      console.log(error);
    }
  };

  const startSinglePositionStatus = async () => {
    try {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const eventData = {
            isOnline: !isOnline,
            email: Global.loginInfo.email,
            password: Global.loginInfo.password,
            access_Token: Global.token,
            expireTime: Global.expireTime,
            latitude,latitude,
            longitude,longitude
          };
  
          socket.emit('singlePositionStatus', eventData);
        },
        (error) => {
          console.error('Error getting location: ', error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartStatusChange = (newStatus) => {
    setStartStatus(newStatus);
    console.log('Received start status from child:', newStatus);
  };
  

  useEffect(() => {
    socket.on('socketId', (id) => {
      setSocketId(id);
    });

    socket.on('deliveryData', (data) => {

      setDeliveryData(data[0]);
      setLastUpdateTime(Date.now());
      setIsModalOpen(true);
      setModalVisible(true);

      deliverySound.play((success) => {
        if (!success) {
          console.error('Error playing sound');
        }
      });
    });

    socket.on('refreshToken', () => {
      handleTokenRefresh();
    });
    return () => {
      socket.off('socketId');
      socket.off('deliveryData');
      socket.off('refreshToken');
    };
  }, []);

  useEffect(() => {
    if (Global.riderStatus == true && startStatus == false) {
      Geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = {
            accessToken : Global.token,
            status : Global.startStatus,
            latitude: latitude,
            longitude: longitude,
            singlePosition: false
          }
          socket.emit('singlePositionStatusUpdate', data);
        },
        (error) => {
          console.error('Error getting location: ', error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
    } else if (Global.riderStatus == true && startStatus == true) {
      const data = {
        singlePosition : true
      }
      socket.emit('singlePositionStatusUpdate', data);
    } 
  }, [startStatus])

      
  const handleAccept = async () => {
    try {
      setApiLoading(true);
      Global.startStatus = true;
      const acceptData = {
        access_Token: Global.token,
        orderid : deliveryData.id,
        lat: deliveryData.points[0].latitude,
        lng: deliveryData.points[0].longitude,
      }

      socket.emit('orderAccepted', acceptData);
      socket.on('AcceptResponse', async (data) => {
        setApiLoading(false);
        if (data == 200) {
          setShowCancelButton(true);
          showToastSuccess("Order Sucessfull!")
        } else {
          setShowCancelButton(false);
          showToastSuccess("Order Failed!")
        }
      })
    } catch (error) {
      setShowCancelButton(false);
      showToastError("Order Failed!")
      setApiLoading(false);
      console.log(error);
    }
    setModalVisible(false);
  };

  const handleCancel = () => {
    try {
      setApiLoading(true);
      const cancelData = {
        access_Token: Global.token,
        orderid : deliveryData.id
      }
      socket.emit('orderCanceled', cancelData );

      setApiLoading(false);
      // if (response.status == 200) {
        showToastSuccess("Order Canceled!")
      // }
    } catch (error) {
      showToastSuccess("Order Cancel Failed!")
      setApiLoading(false);
      console.log(error.message);
    }
    setModalVisible(false);
    setShowCancelButton(false);
  };

  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order</Text>
        {/* <TouchableOpacity style={styles.orderCancelButton} onPress={handleCancel}>
          <Text style={styles.buttonOrderText}>Cancel</Text>
        </TouchableOpacity> */}
        {showCancelButton && (
          <TouchableOpacity style={styles.orderCancelButton} onPress={handleCancel}>
            <Text style={styles.buttonOrderText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SwitchSelector */}
      <SwitchSelector
        options={options}
        initial={0}
        onPress={(value) => setSelectedIndex(value)}
        fontSize={16}
        selectedColor="#ffffff"
        borderRadius={5}
        animationDuration={1}
      />

      {/* Render Selected View */}
      {renderSelectedView()}
      {deliveryData && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Display delivery details here */}
            <Text style={styles.orderText}>Total Compensation:</Text>
            <Text style={styles.orderValue}>{deliveryData.totalCompensation}</Text>
            <Text style={styles.orderText}>Total Distance: </Text>
              <Text style={styles.orderValue}>{deliveryData.totalDistance}</Text>
            <Text style={styles.orderText}>Direction Where You Should Go: </Text>
              <Text style={styles.orderValue}>{deliveryData.points[0].label}</Text>
            <Text style={styles.orderText}>Address Where You Should Deliver: </Text>
              <Text style={styles.orderValue}>{deliveryData.points[1].label}</Text>

            {/* Accept and Cancel buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      )}

      {/* Footer */}
      <View style={styles.footer}>
      <TouchableOpacity
          onPress={toggleOnlineAndPositionStatus} // Use the combined function
          style={[styles.onlineOfflineButton, { color: isOnline ? 'green' : 'black' }]}
        >
          <Text style={{ fontSize: 18, color: isOnline ? 'green' : 'black' }}>{isOnline ? 'Online' : 'Offline'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  onlineOfflineButton: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#00152d',
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.8,
    alignSelf: 'center', 
  },
  buttonText: {
    color: 'white', 
    fontSize: 20,
    fontWeight:'bold',
    textAlign:'center'

  },
  buttonOrderText: {
    color: 'white', 
    fontSize: 20,
    fontWeight:'bold',
    textAlign:'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    width:'30%'
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width:'30%',
  },
  orderText: {
    fontSize: 16,
    color: 'white', 
    marginBottom: 5,
  },
  orderValue: {
    fontSize: 20,
    marginBottom: 5, 
    color: 'white',
    fontWeight:'bold'
  },
  orderCancelButton: {
    backgroundColor: 'red',
    padding: 2,
    borderRadius: 5,
    marginTop: 2, // Adjust the margin as needed
    width: '30%',
    alignSelf: 'center', // Center the button
  }
});

export default OrderScreen;
