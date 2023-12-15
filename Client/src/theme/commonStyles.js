import { StyleSheet } from "react-native";
import { SCREEN_HOR_PADDING, SCREEN_VER_PADDING } from "../config/constants";
import { getResponsiveSize } from "../utility/appUtility";
import ColorInfo from "./colorInfo";

const CommonStyles = StyleSheet.create({
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
    textCenter: {
        textAlign: 'center',
        justifyContent: "center",
    },
    container: {
        backgroundColor: ColorInfo.white,
        flex: 1,
    },
    androidInputPaddingVertical: {
        paddingVertical: 2,
    },
    header_left: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        justifyContent: "center",
    },
    header_right: {
        position: "absolute",
        top: 0,
        right: 0,
        height: "100%",
        justifyContent: "center",
    },
    absolute_full: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    flex_row: {
        flexDirection: "row",
        alignItems: "center",
    },
    flex_row_start: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    flex_row_end: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    flex_row_bw: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    flex_row_reverse: {
        flexDirection: "row-reverse",
        alignItems: "center",
    },
    btnDisabled: {
        backgroundColor: ColorInfo.warmGrey3,
    },
    font_segoeui: {
        fontFamily: "Segoeui",
        fontSize: getResponsiveSize(16),
        color: ColorInfo.fontDarkColor,
    },
    font_accept_confrim: {
        fontFamily: "Segoeui",
        fontSize: getResponsiveSize(14),
        color: ColorInfo.fontDarkColor,
    },
    font_segoeui_bold: {
        fontFamily: "Segoeui-Bold",
        fontSize: getResponsiveSize(16),
        color: ColorInfo.fontDarkColor,
    },
    font_segoeui_semi_bold: {
        fontFamily: "Segoeui-Semibold",
        fontSize: getResponsiveSize(16),
        color: ColorInfo.fontDarkColor,
    },
    font_segoeui_bold_italic: {
        fontFamily: "Segoeui-Bolditalic",
        fontSize: getResponsiveSize(16),
        color: ColorInfo.fontDarkColor,
    },
    font_segoeui_italic: {
        fontFamily: "Segoeui-Italic",
        fontSize: getResponsiveSize(16),
        color: ColorInfo.fontDarkColor,
    },
    font_segoeui_light: {
        fontFamily: "Segoeui-Light",
        fontSize: getResponsiveSize(16),
        color: ColorInfo.fontDarkColor,
    },
    font_segoeui_semi_light: {
        fontFamily: "Segoeui-Semilight",
        fontSize: getResponsiveSize(16),
        color: ColorInfo.fontDarkColor,
    },

    font_segoeui_black: {
        fontFamily: "SegoeuiBlack",
        fontSize: getResponsiveSize(16),
        color: ColorInfo.fontDarkColor,
    },
    font_segoeui_black_italic: {
        fontFamily: "SegoeuiBlack-Italic",
        fontSize: getResponsiveSize(16),
        color: ColorInfo.fontDarkColor,
    },
    screenTitle: {
        fontFamily: "SegoeuiBlack",
        fontSize: getResponsiveSize(30),
        color: ColorInfo.titleColor,
    },
    underline: {
        textDecorationLine: "underline",
    },
    colPadding: {
        paddingVertical: getResponsiveSize(SCREEN_VER_PADDING),
    },
    rowPadding: {
        paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
    },
    searchWrapper: {
        paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
        position: "absolute",
        top: getResponsiveSize(10),
        width: "100%",
        zIndex: 1,
    },
    searchInput: {
        backgroundColor: ColorInfo.white,
        shadowColor: "#aaa",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: getResponsiveSize(10),
        paddingHorizontal: getResponsiveSize(10),
    },

    font_segoeui_body: {
        fontFamily: "Segoeui",
        fontSize: getResponsiveSize(18),
        color: ColorInfo.black,
    },
});

export default CommonStyles;
