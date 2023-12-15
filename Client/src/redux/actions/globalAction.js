import {globalType} from "../types/globalTypes";

export const setApiLoading = isLoading => {
    return {
        type: globalType.API_LOADING,
        payload: isLoading,
    };
};

export const actionChangeUserInfo = userInfo => {
    return {
        type: globalType.CHANGE_USER_INFO,
        payload: userInfo,
    };
};
