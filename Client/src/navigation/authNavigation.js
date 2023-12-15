import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";

import ScreenNameInfo from "../config/screenNameInfo";
import LoginPage from "../screen/login/login";
import OrderScreen from "../screen/order/order";
// import MapPage from "../screen/order/map";

const AuthStack = createNativeStackNavigator();

const AuthStackNavigator = ({navigation}) => {
    return (
        <AuthStack.Navigator
            initialRouteName={ScreenNameInfo.Auth.LoginScreen}
            screenOptions={{
                headerShown: false,
            }}>
            <AuthStack.Screen
                name={ScreenNameInfo.Auth.LoginScreen}
                component={LoginPage}
            />
            <AuthStack.Screen
                name={ScreenNameInfo.Auth.Order}
                component={OrderScreen}
            />
        </AuthStack.Navigator>
    );
};

export default AuthStackNavigator;
