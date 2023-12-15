import React from "react";
import {ActivityIndicator, StyleSheet, View} from "react-native";
import {connect} from "react-redux";

const Loading = props => {
    const {apiLoading} = props;

    if (apiLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={"#808080"} />
            </View>
        );
    } else {
        return null;
    }
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00000000",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

const mapStateToProps = state => {
    return {
        apiLoading: state.global.apiLoading,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
