import { Platform } from "react-native";

const ColorInfo = {
    mainColor: "#0C8F96",
    lightGray: "#DFDFDF",
    black: "#000000",
    white: "#FFFFFF",
    moreLightGrey: "#F2F6FA",

    lightGreen: "#4BD964",
    green: "green",
    colorSwitchProvider: "#F9F9F9",

    fontDarkColor: "#1c1911",

    dark: "#1c1921",
    white2: "#f2f2f2",
    grey: "#808080",
    headerGreenColor: "#21BFAE",
    headerItemContainerBGColor: "#6BD2C7",
    buttonBgColor: "#30CFBE",

    warmGrey: "#707070",
    warmGrey3: "#999999",
    whiteGrey: "#f7f7f7",
    whiteGrey2: "#fafafa",
    coolGrey: "#9497a2",
    charcoalGrey: "#3a3d48",
    pinkishGrey: "#cccccc",
    pinkishRed: "#e81027",
    seafoamBlue: "#6fd2c7",
    disableBackground: "#ddd",
    paleGrey: "#EBFBF9",
    veryLightPurple: "#f8d7ef",
    duckEggBlue: "#d7e9f8",
    salmon: "#ff7f7f",
    orangeyRed: "#ff3a3a",
    slateGrey: "#656567",
    navy: "#041736",
    tomato: "#eb4d3d",
    softGreen: "#65c466",
    macaroniAndCheese: "#e9a831",

    CYAN8: "#00838f",
    GREEN_DARK: "#2da346",

    BLUE7: "#1976d2",
    YELLOW8: "#ff8f00",

    RED7: "#d32f2f",
    RED8: "#c62828",

    COMPLETED: "#4CAF50",
    OPENED: "#2196F3",
    HOLDED: "#999999",
    // HOLDED: '#DD9800',
    ESCALATED: "#FF8800",
    TIMEOUT: "#F44336",
    CANCELED: "#858585",
    SCHEDULED: "#673AB7",
    PENDING: "#34df12",
    UNASSIGNED: "#EE82EE",

    REASSIGN: "#673AB7",
    START: "#33b5e5",
    EXTEND: "#3F51B5",
    CANCEL: "#9c9c9c",
    CLEANING: "#68aee6",
    thumbColorOn: Platform.OS === "android" ? "#0cd1e8" : "#f3f3f3",
    thumbColorOff: Platform.OS === "android" ? "#f04141" : "#f3f3f3",
    trackColorOn: Platform.OS === "android" ? "#98e7f0" : "#0cd1e8",
    trackColorOff: Platform.OS === "android" ? "#f3adad" : "#f04141",
    confirmButtonBgColor: "#21BFAE",
    confirmButtonFontColor: "#FFFFFF",

    cancelButtonBgColor: "#fa9421",
    cancelButtonFontColor: "#FFFFFF",
};

export default ColorInfo;
