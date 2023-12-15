import {alertType} from "../types/alertType";

export const showMainAlert = payload => {
    return {
        type: alertType.SHOW_MAIN_ALERT,
        payload,
    };
};

export const hideMainAlert = payload => {
    return {
        type: alertType.HIDE_MAIN_ALERT,
        payload,
    };
};

export const showResultAlert = payload => {
    return {
        type: alertType.SHOW_RESULT_ALERT,
        payload,
    };
};

export const hideResultAlert = payload => {
    return {
        type: alertType.HIDE_RESULT_ALERT,
        payload,
    };
};
