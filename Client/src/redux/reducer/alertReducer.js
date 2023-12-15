import { alertType } from '../types/alertType';

const initState = {
  mainAlert: {
    isOpen: false,
    title: '',
    image: null,
    message: '',
    isConfirm: false,
    comments: [],
    confirmTitle: 'Confirm',
    cancelTitle: 'Cancel',
    confirmAction: () => { },
    cancelAction: () => { },
  },
  resultAlert: {
    isOpen: false,
    title: '',
    message: '',
    confirmTitle: 'Confirm',
    confirmAction: () => { },
  },
};

const alertReducer = (state = initState, action = {}) => {
  const payload = action.payload;
  switch (action.type) {
    case alertType.SHOW_MAIN_ALERT:
      return {
        ...state,
        mainAlert: {
          ...state.mainAlert,
          isOpen: true,
          title: payload.title ?? '',
          message: payload.message ?? '',
          comments: payload.comments ?? [],
          isConfirm: payload.isConfirm ?? false,
          confirmTitle: payload.confirmTitle ?? 'Confirm',
          cancelTitle: payload.cancelTitle ?? 'Cancel',
          confirmAction: payload.confirmAction
            ? payload.confirmAction
            : () => { },
          cancelAction: payload.cancelAction ? payload.cancelAction : () => { },
          image: payload.image ?? null,
        },
      };
    case alertType.HIDE_MAIN_ALERT:
      return {
        ...state,
        mainAlert: {
          ...state.mainAlert,
          isOpen: false,
        },
      };
    case alertType.SHOW_RESULT_ALERT:
      return {
        ...state,
        resultAlert: {
          ...state.resultAlert,
          isOpen: true,
          title: 'Api Result Error!',
          message:
            payload.message ??
            "Can't connect to server. Check Internet connection!",
          confirmTitle: 'Confirm',
          confirmAction: payload.confirmAction
            ? payload.confirmAction
            : () => { },
        },
      };
    case alertType.HIDE_RESULT_ALERT:
      return {
        ...state,
        resultAlert: {
          ...state.resultAlert,
          isOpen: false,
        },
      };
    default:
      return {
        ...state,
      };
  }
};

export default alertReducer;
