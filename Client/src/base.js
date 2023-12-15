import React from "react";
import { View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Loading from "./component/loadings/loading";
import ScreenNameInfo from "./config/screenNameInfo";
import AuthStackNavigator from "./navigation/authNavigation";

const MainStack = createNativeStackNavigator();

const Base = props => {
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar
                animated={true}
                barStyle="dark-content"
            />
            <SafeAreaProvider>
                <NavigationContainer>
                    <MainStack.Navigator
                        screenOptions={{
                            headerShown: false,
                        }}>
                        <MainStack.Screen
                            name={ScreenNameInfo.Main.Auth}
                            component={AuthStackNavigator}
                        />
                    </MainStack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
            <Loading />
        </View>
    );
};

export default Base;
