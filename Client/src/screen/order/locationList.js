import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import axios from 'axios';
import {showToastError, showToastSuccess} from '../../utility/appUtility';
import {
  actionChangeUserInfo,
  setApiLoading,
} from '../../redux/actions/globalAction';
import {Global} from '../../config/global';
import ColorInfo from '../../theme/colorInfo';

const LocationList = ({ onStartStatusChange }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const getSelectedLocationData = () => {
    return selectedLocations.map(locationId => {
      const selectedLocation = locationData.find(
        location => location.id === locationId,
      );
      return {
        id: locationId,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      };
    });
  };

  const startTracking = async () => {
    if (Global.riderStatus == false) {
      showToastError('Please Check Status');
      return;
    }
    if (selectedLocations.length === 0) {
      showToastError('Please select a position');
      return;
    }
    setIsTracking(true);
    Global.startStatus = true;
    onStartStatusChange(true);
    try {
      setApiLoading(true);
      const selectedLocationData = getSelectedLocationData();
      const tokenToUse = Global.token;
      const expireTimeToUse = Global.expireTime;
      const response = await axios.post(
        'http://192.168.130.84:8080/startpositioning',
        {
          email: Global.loginInfo.email,
          password: Global.loginInfo.password,
          selectedLocations: selectedLocationData,
          expireTime: expireTimeToUse,
          access_Token: tokenToUse,
        },
      );
      setApiLoading(false);
      if (response.status == 200) {
        showToastSuccess('MultiPositioning started successfully');
      }
    } catch (error) {
      showToastError('Error Starting MultiPositioning');
      console.error('Error Starting MultiPositioning:', error);
    }
  };

  useEffect(() => {
    async function runOnce() {
      if (isTracking == true && Global.token) {
        if (Global.riderStatus == true && Global.startStatus ==  true) {
            const selectedLocationData = getSelectedLocationData();
            const requestData = {
              email: Global.loginInfo.email,
              password: Global.loginInfo.password,
              selectedLocations: selectedLocationData,
              expireTime: Global.expireTime,
              access_Token: Global.token,
            };
    
            await axios
              .post('http://192.168.130.84:8080/startpositioning', requestData)
              .then(response => {
              })
              .catch(error => {
                console.error('Error updating token and expire time:', error);
              });
          // }
        } else if ((Global.riderStatus == true && Global.startStatus ==  false) || (Global.riderStatus == false && Global.startStatus ==  true)) {
          try {
            setApiLoading(true);
            const response = await axios.post(
              'http://192.168.130.84:8080/stoppositioning',
              {},
            );
            if (response.status == 200) {
              showToastSuccess('MultiPositioning Stopped');
            }
            setApiLoading(false);
          } catch (err) {
            console.log("Stop Positioning Error", err.message)
            // showToastError('Error Stopping MultiPositioning1');
          }
        } 
      }
      
    }
    runOnce();
  }, [Global.token, Global.startStatus, Global.riderStatus, isTracking]);

  const stopTracking = async () => {
    if (selectedLocations.length === 0) {
      showToastError('Please select a position');
      return;
    }
    try {
      setApiLoading(true);
      const response = await axios.post(
        'http://192.168.130.84:8080/stoppositioning',
        {},
      );
      if (response.status == 200) {
        showToastSuccess('MultiPositioning Stopped');
      }
      setApiLoading(false);
    } catch (err) {
      showToastError('Error Stopping MultiPositioning');
    }
  };

  const handleLocationPress = location => {
    const updatedSelectedLocations = selectedLocations.includes(location.id)
      ? selectedLocations.filter(
          selectedLocation => selectedLocation !== location.id,
        )
      : [...selectedLocations, location.id];

    setSelectedLocations(updatedSelectedLocations);
  };

  const renderLocationItem = ({item}) => (
    <TouchableOpacity
      style={
        selectedLocations.includes(item.id)
          ? styles.selectedButton
          : styles.defaultButton
      }
      onPress={() => handleLocationPress(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  const getLocationList = async () => {
    try {
      const response = await axios.post(
        'http://192.168.130.84:8080/locationlist',
        {
          username: Global.loginInfo.email,
          password: Global.loginInfo.password,
        },
      );
      setLocationData(response.data.locationData);
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  useEffect(() => {
    getLocationList();
  }, []);

  if (locationData.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Start Tracking" onPress={() => startTracking()} />
        <Button title="Stop Tracking" onPress={() => stopTracking()} />
      </View>

      <FlatList
        data={locationData}
        keyExtractor={item => item.id}
        renderItem={renderLocationItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0,
    borderBottomColor: '#ccc',
  },
  defaultButton: {
    backgroundColor: '#ececec',
    padding: 15,
    borderRadius: 5,
    margin: 1,
  },
  selectedButton: {
    backgroundColor: '#cfcdd0',
    padding: 15,
    borderRadius: 5,
    margin: 1,
  },
});

export default LocationList;
