
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState, useRef } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text, TextInput } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getGeoAddressFromLatlng,
  getGeoLocationFromAddress,
} from '../../APIs/commonAPI';
import MarkerLocation from '../../component/common/MarkerLocation';
import VectorIcon from '../../component/common/VectorIcon';
import LayoutAuthView from '../../layout/layout';
import { GOOGLE_PLACES_KEY } from '../../config/constants';
import { Global } from '../../config/global';
import { showMainAlert, showResultAlert } from '../../redux/actions/alertAction';
import {
  actionChangeUserInfo,
  setApiLoading,
} from '../../redux/actions/globalAction';
import ColorInfo from '../../theme/colorInfo';
import CommonStyles from '../../theme/commonStyles';
import {
  getDeltaLatLng,
  getResponsiveSize,
  showToastError,
  showToastSuccess,
} from '../../utility/appUtility';
import axios from 'axios';

const MapPage = props => {
  const {
    showResultAlert,
    setApiLoading,
  } = props;

  const [locationInfo, setLocationInfo] = useState({
    address: '',
    tempAddress: '',
    lat: 0,
    lng: 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [isAddLocationModalVisible, setAddLocationModalVisible] = useState(false);
  const [locationLabel, setLocationLabel] = useState('');
  const mapViewRef = useRef(null);
  const panDragTimeoutRef = useRef(null);
  const lastPanDragTimestampRef = useRef(0);
  const panTimeoutRef = useRef(null);

  const onGetAddressFromLatlng = (lat, lng) => {
    setApiLoading(true);
    getGeoAddressFromLatlng(lat, lng, (code, result) => {
      setApiLoading(false);
      if (code !== 200) {
        showResultAlert(result);
        return;
      }

      setLocationInfo({
        ...locationInfo,
        lat,
        lng,
        tempAddress: result.content,
        address: result.content,
      });
    });
  };

  const onGetCurrentLocationInfo = () => {
    setApiLoading(true);
    Geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setApiLoading(false);
        onGetAddressFromLatlng(latitude, longitude);
      },(error) => {
        console.error('Error getting location: ', error);
        showToastError(message);
      },
      {
      enableHighAccuracy: true,
      timeout: 15000,
      } 
    )
  };

  useEffect(() => {
    onGetCurrentLocationInfo();
  }, []);

 
  const onSaveLocationInfo = async () => {
    try {

      setApiLoading(true);
      await axios
        .post('http://192.168.130.84:8080/location', {
          username: Global.loginInfo.email,
          password: Global.loginInfo.password,
          label: locationLabel, // Use the location label state
          lat: locationInfo.lat,
          lng: locationInfo.lng,
        })
        .then(async (result) => {
          setApiLoading(false);
          showToastSuccess('Location Added Successfully!');
        })
        .catch((err) => {
          setApiLoading(false);
          showToastError('Location Added Failed!');
        });
    } catch (error) {
      setApiLoading(false);
      showToastError('An error occurred while Location Added.');
    }
  };

  const onGetLocationFromAddress = address => {
    setApiLoading(true);
    getGeoLocationFromAddress(address, (code, result) => {
      if (code !== 200) {
        showResultAlert(result);
        return;
      }

      setLocationInfo({
        ...locationInfo,
        address,
        tempAddress: address,
        ...result.content,
      });
    });
  };

  const onRegionChange = (region) => {
    const significantChange =
      Math.abs(region.latitudeDelta - 0.0922) > 0.005 || Math.abs(region.longitudeDelta - 0.0421) > 0.005;
    if (significantChange) {
      isPanningRef.current = true;
    }
  };

  const onRegionChangeComplete = (region) => {
    // if (isPanningRef.current) {
      setLocationInfo((prevLocationInfo) => ({
        ...prevLocationInfo,
        lat: region.latitude,
        lng: region.longitude,
      }));
      // isPanningRef.current = false;
    } 

  const onMarkerPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // const onUserLocationChange = (event) => {
  //   event.persist()
  //   console.log('user location', event.nativeEvent.coordinate);
    
  //   clearTimeout(panDragTimeoutRef.current);
  //   panDragTimeoutRef.current = setTimeout(() => {
  //     setLocationInfo((prevLocationInfo) => ({
  //       ...prevLocationInfo,
  //       lat: event.nativeEvent.coordinate.latitude,
  //       lng: event.nativeEvent.coordinate.longitude,
  //     }));
  //   }, 300); 
  // };

  const openAddLocationModal = () => {
    setAddLocationModalVisible(true);
  };

  

  return (
    <LayoutAuthView isAvoid={true}>
      <View style={{ flex: 1 }}>
        <View style={[styles.searchWrapper]}>
          <View style={[styles.searchInput, CommonStyles.flex_row_start]}>
            <View
              style={[
                {
                  paddingVertical: getResponsiveSize(12),
                  paddingRight: getResponsiveSize(6),
                },
              ]}>
              <VectorIcon.Ionicons
                name="search"
                size={getResponsiveSize(20)}
                color={ColorInfo.grey}
              />
            </View>
            <GooglePlacesAutocomplete
              placeholder="Enter address or zip code..."
              query={{
                key: GOOGLE_PLACES_KEY,
                language: 'en'
              }}
              fetchDetails={true}
              listViewDisplayed="auto"
              onPress={(data, details = null) => {
                if (details) {
                  setLocationInfo({
                    address: data.description,
                    tempAddress: data.description,
                    lat: details.geometry.location.lat,
                    lng: details.geometry.location.lng,
                  });
                } else {
                  onGetLocationFromAddress(data.description);
                }
              }}
              styles={{
                row: {
                  paddingLeft: 0,
                  backgroundColor: ColorInfo.white,
                },
                listView: {
                  flex: 1,
                  zIndex: 100000,
                  paddingVertical: 0,
                  paddingRight: getResponsiveSize(30),
                },
                textInputContainer: {
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                },
                textInput: {
                  marginTop: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  color: '#5d5d5d',
                  fontFamily: 'Segoeui-Bold',
                  fontSize: getResponsiveSize(16),
                  paddingBottom: 0,
                  paddingTop: 0,
                  paddingLeft: 0,
                  marginBottom: 0,
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
            />
          </View>
        </View>

        {/* <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={{
            latitude: locationInfo.lat,
            longitude: locationInfo.lng,
            ...getDeltaLatLng(50),
          }}>
            <Marker
              coordinate={{
                latitude: locationInfo.lat,
                longitude: locationInfo.lng,
              }}
              onPress={() => onPressSaveLocation()}
              >
              <MarkerLocation />
            </Marker>
        </MapView> */}
        <MapView
          ref={mapViewRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
           onRegionChangeComplete={onRegionChangeComplete}
          //  onRegionChange={onRegionChange}
          // onPanDrag ={onUserLocationChange}
          region={{
            latitude: locationInfo.lat ,
            longitude: locationInfo.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zoomEnabled={true}
          zoomControlEnabled={true}
          minZoomLevel={0}
          maxZoomLevel={20}
          zoomTapEnabled={true}
        >
          <Marker
            coordinate={{
              latitude: locationInfo.lat,
              longitude: locationInfo.lng,
            }}
            onPress={onMarkerPress}
          />
        </MapView>

        <TouchableOpacity
          style={styles.addLocationButton}
          onPress={openAddLocationModal}
        >
          <Text style={styles.addLocationButtonText}>Add Location</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
              onPressOut={closeModal}
            >
              <Text>Latitude: {locationInfo.lat}</Text>
              <Text>Longitude: {locationInfo.lng}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </Modal>

        {isAddLocationModalVisible && (
        <TouchableOpacity
          style={styles.addLocationButton}
          onPress={openAddLocationModal}
        >
          <Text style={styles.addLocationButtonText}>Add Location</Text>
        </TouchableOpacity>
      )}

        <Modal
        animationType="slide"
        transparent={true}
        visible={isAddLocationModalVisible}
        onRequestClose={() => setAddLocationModalVisible(false)}
      >
        {/* <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPressOut={() => setAddLocationModalVisible(false)}
          >
            <Text style={styles.modalTitle}>Add Location</Text>
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                // Perform your logic here
                // For example, send a request to the backend
                onSaveLocationInfo(); // Assuming onSaveLocationInfo handles the logic
                setAddLocationModalVisible(false); // Close the modal after adding location
              }}
            >
              <Text style={styles.addButtonLabel}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAddLocationModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View> */}

        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPressOut={() => setAddLocationModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAddLocationModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {/* Modal Content: Title, TextInput, Add Button, Close Button */}
            <Text style={styles.modalTitle}>Add Location</Text>

            {/* Input Field */}
            <TextInput
              style={styles.inputField}
              placeholder="Enter location name"
              onChangeText={(text) => setLocationLabel(text)}
            />

            {/* ... Other modal content ... */}

            {/* Add Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                // Perform your logic here
                // For example, send a request to the backend
                onSaveLocationInfo(); // Assuming onSaveLocationInfo handles the logic
                setAddLocationModalVisible(false); // Close the modal after adding location
              }}
            >
              <Text style={styles.addButtonLabel}>Add</Text>
            </TouchableOpacity>

            {/* Close Button (X Symbol) */}
            
          </TouchableOpacity>
        </View>

        </Modal>

      </View>
    </LayoutAuthView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnSocial: {
    width: '100%',
    borderRadius: getResponsiveSize(10),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveSize(10),
  },
  btnSocialTitle: {
    color: ColorInfo.white,
    fontSize: getResponsiveSize(18),
  },
  searchWrapper: {
    paddingHorizontal: getResponsiveSize(30),
    position: 'absolute',
    top: getResponsiveSize(10),
    width: '100%',
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: ColorInfo.white,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: getResponsiveSize(10),
    paddingHorizontal: getResponsiveSize(10),
    paddingVertical: getResponsiveSize(5),
    marginTop:0,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%', // Adjust this percentage as needed
  },

  closeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },

  closeButtonText: {
    color: 'black',
    fontWeight:'bold',
    fontSize:20
  },
  zoomButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },

  zoomButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginVertical: 1,
    alignItems: 'center',
    
  },
  zoomText : {
    fontSize: 20,
    fontWeight: 'bold',
    color:'black'
  },
  addLocationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },

  addLocationButtonText: {
    color: 'white',
    fontSize: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  // Style for Add Button
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },

  addButtonLabel: {
    color: 'white',
    fontSize: 20,
    textAlign:'center'
  },
  inputField: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
});

const mapStateToProps = state => ({
  apiLoading: state.global.apiLoading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setApiLoading, showResultAlert, actionChangeUserInfo, showMainAlert },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MapPage);
