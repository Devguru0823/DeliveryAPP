// // loginpage.js
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import axios from 'axios';
import messaging from "@react-native-firebase/messaging";
import {emailValidator} from '../../validate/emailValidator';
import {passwordValidator} from '../../validate/passwordValidator';
import { showToastError, showToastSuccess } from '../../utility/appUtility';
import ScreenNameInfo from '../../config/screenNameInfo';
import { actionChangeUserInfo, setApiLoading,} from '../../redux/actions/globalAction';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTokenLoginInfo } from "../../utility/authUtility";
const {getHeaders} = require('../../utility/header');
const GLOVO_API_BASE_URL = "https://api.glovoapp.com";

const LoginPage = props => {
  const { navigation, setApiLoading } =
        props;
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const hello = async () => {
    return await axios.get('http://192.168.130.84:8080', {}).catch((err) =>{
      alert('what error' + err);
      return err;
    })
  }
  
  useEffect(() => {
    hello();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
    return enabled;
  }

  async function loginAuth(loginInfo) {

    const permission = await requestUserPermission();
    if (permission) {
      try {
        const fcmToken = await messaging().getToken();
        console.log("FCM Token",fcmToken )
        if (fcmToken) {
          const loginFCMRequest = await axios.post('http://192.168.130.84:8080/login', {
            email : loginInfo.email,
            password : loginInfo.password,
            fcmToken : fcmToken
          })

          if (loginFCMRequest !==200) {
            showToastError("Error!");
            return;
          }
          setApiLoading(false);
          showToastSuccess('Login Successfully!');
          navigation.navigate(ScreenNameInfo.Auth.Order);
        }
      } catch (e) {
        console.log('rrrrrrrrrrrrr', e)
      }
    }
    
      
  }

  

  const handleLogin = async () => {
    try {
      setApiLoading(true);
      const emailError = emailValidator(email.value);
      const passwordError = passwordValidator(password.value);
      if (emailError || passwordError) {
        setApiLoading(false);
        setEmail({...email, error: emailError});
        setPassword({...password, error: passwordError});
        return;
      }

      // Send a POST request to your server
      const axiosInstance = axios.create({baseURL: GLOVO_API_BASE_URL});

      await axiosInstance.post(
        '/oauth/token',
        {
          grantType: "password",
          password: password.value,
          termsAndConditionsChecked: false,
          userType: "courier",
          username: email.value,
        },
        {
          headers: {
            ...getHeaders(),
          },
        }
      ).then( async (response) => {
        let token = response.data.accessToken;
        let loginInfo = {
            email: email.value,
            password: password.value,
        };
        let expireTime = (Date.now() + response.data.expiresIn*1000).toString();
        // let clientId = response.data.clientId;
        await setTokenLoginInfo(token,loginInfo,expireTime);
        await loginAuth (loginInfo);
        setApiLoading(false);
        showToastSuccess('Login Successfully!');
        navigation.navigate(ScreenNameInfo.Auth.Order);
      }).catch((err) => {
        console.log("error message",err.message)
        setApiLoading(false);
        showToastError("Email or password is invalid!");
      });
    } catch (error) {
      setApiLoading(false);
      console.log(error);
      showToastError('An error occurred while logging in.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={email.error !== '' ? styles.errorInput : styles.input}
        placeholder="Email"
        value={email.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      {email.error !== '' && (
        <Text style={{color: 'red', marginBottom: 20, marginTop: -25}}>
          {email.error}
        </Text>
      )}
      <TextInput
        style={password.error !== '' ? styles.errorInput : styles.input}
        placeholder="Password"
        value={password.value}
        secureTextEntry
        onChangeText={text => setPassword({value: text, error: ''})}
      />
      {password.error !== '' && (
        <Text style={{color: 'red', marginBottom: 20, marginTop: -25}}>
          {password.error}
        </Text>
      )}
      <View style={styles.button}>
        <Button
          style={styles.buttonstyle}
          color="grey"
          title="Login"
          onPress={handleLogin}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    marginTop: 150,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 25,
    paddingLeft: 10,
  },
  errorInput: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
    marginBottom: 25,
    paddingLeft: 10,
  },
  button: {
    width: 150,
    borderRadius: 20,
    marginTop: 50,
  },
  buttonstyle: {},
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        { setApiLoading },
        dispatch,
    );

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
