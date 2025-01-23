import { Stack } from 'expo-router';
import "../global.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthHandler from "@/app/AuthHandler";
import { configureReanimatedLogger, ReanimatedLogLevel} from "react-native-reanimated";
import {Provider} from "react-redux";
import {store} from "@/services/store/store";
import {BackHandler} from "react-native";

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
})

BackHandler.addEventListener("hardwareBackPress", () => {
    return true;
});

export default function RootLayout() {
    return (
        <Provider store={store}>
        <AuthProvider>
            <AuthHandler/>
                <Stack
                    screenOptions={{
                        headerShown: false
                    }}>
                    <Stack.Screen name="(app)"
                                  options={{
                                      gestureEnabled: false,
                                  }}
                    />
                    <Stack.Screen name="(auth)"
                                    options={{
                                        gestureEnabled: false,
                                    }}
                    />
                </Stack>
        </AuthProvider>
        </Provider>
    )
}
