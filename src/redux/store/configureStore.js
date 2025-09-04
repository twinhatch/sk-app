/* eslint-disable prettier/prettier */
import { combineReducers, configureStore, applyMiddleware, } from '@reduxjs/toolkit';

import thunk from 'redux-thunk';
import { reducer as network } from 'react-native-offline';
import {
    persistStore, persistReducer, FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dataReducer from './dataReduser';
import getuserLocationReducer from './getuserLocation';

const rootReducer = combineReducers({
    network,
    data: dataReducer,
    UserLocation: getuserLocationReducer, // Add the data reducer
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['network', 'UserLocation'], // Persist the data reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer, middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
}, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };
