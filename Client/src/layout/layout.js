import React from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableHighlight,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import ColorInfo from "../theme/colorInfo";
const LayoutAuthView = ({children, isAvoid, style}) => {
    if (isAvoid) {
        return (
            <TouchableHighlight
                style={[styles.container, style]}
                activeOpacity={1}
                underlayColor={"#00000000"}
                onPress={() => Keyboard.dismiss()}>
                <SafeAreaView
                    style={[styles.container, style]}
                    edges={["top", "left", "right", "bottom"]}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={[{flex: 1}, style]}>
                        {children}
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </TouchableHighlight>
        );
    }

    return (
        <SafeAreaView
            style={[styles.container, style]}
            edges={["top", "left", "right", "bottom"]}>
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: ColorInfo.white,
        flex: 1,
    },
});

export default LayoutAuthView;
