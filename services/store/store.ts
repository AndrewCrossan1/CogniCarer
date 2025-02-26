import {combineReducers, configureStore} from '@reduxjs/toolkit';
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import tokenReducer from "@/services/store/slices/tokenSlice";
import userReducer from "@/services/store/slices/userSlice";
import quoteReducer from "@/services/store/slices/quoteSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer, persistStore} from "redux-persist";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['quote'],
    blacklist: ['token', 'user']
}

const rootReducer = combineReducers({
    token: tokenReducer,
    user: userReducer,
    quote: quoteReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: false,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST']
        },
    }),
    enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer())
});

export const persistor = persistStore(store);

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {User: userState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store