import {applyMiddleware, createStore} from "redux";
import rootReducer from "../reducer";

const middlewares = [];

const store = createStore(rootReducer, applyMiddleware(...middlewares));
export default store;
