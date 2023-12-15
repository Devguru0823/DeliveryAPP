import {globalType} from "../types/globalTypes";

const initState = {
    apiLoading: false,
    selectPhotoType: {
        isOpen: false,
        item: null,
        onConfirm: (val, item) => null,
        onCancel: () => null,
    },
    userInfo: {},
};

const globalReducer = (state = initState, action = {}) => {
    let payload = action.payload;

    switch (action.type) {
    case globalType.API_LOADING:
        return {
            ...state,
            apiLoading: payload,
        };
    case globalType.PICKER_PHOTO_TYPE:
        return {
            ...state,
            selectPhotoType: {...payload},
        };
    case globalType.CHANGE_USER_INFO:
        return {
            ...state,
            userInfo: payload ? {...payload} : payload,
        };
    default:
        return state;
    }
};

export default globalReducer;
