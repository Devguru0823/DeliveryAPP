import {combineReducers} from "redux";
import globalReducer from "./globalReducer";
import alertReducer from "./alertReducer";

const rootReducer = combineReducers({
    global: globalReducer,
    alert: alertReducer,
});

export default rootReducer;
