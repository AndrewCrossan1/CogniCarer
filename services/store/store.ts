import { configureStore } from '@reduxjs/toolkit';
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import tokenReducer from "@/services/store/slices/tokenSlice";
import userReducer from "@/services/store/slices/userSlice";

export const store = configureStore({
    reducer: {
        token: tokenReducer,
        user: userReducer,
    },
    devTools: false,
    enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer())
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {User: userState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store