import { combineReducers } from 'redux';
import { createStore } from 'redux';
import chat from '../global/Slices/chatSlice.js';
import globalBanner from '../global/Slices/globalBannerSlice.js';

const combinedReducer = combineReducers({
    chat,
    globalBanner
});

const store = createStore(combinedReducer);

export default store;