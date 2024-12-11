import { configureStore } from '@reduxjs/toolkit';
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import tokenReducer from "@/services/store/slices/tokenSlice";

export const store = configureStore({
    reducer: {
        token: tokenReducer,
    },
    devTools: false,
    enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer())
});