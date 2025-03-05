import { Stack } from 'expo-router';
import "../global.css";
import { AuthProvider } from "@/context/AuthContext";
import { configureReanimatedLogger, ReanimatedLogLevel} from "react-native-reanimated";
import {Provider} from "react-redux";
import {persistor, store} from "@/services/store/store";
import {BackHandler} from "react-native";
import {PersistGate} from "redux-persist/integration/react";

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
            <PersistGate persistor={persistor} loading={null}>
                <AuthProvider>
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
                        <Stack.Screen name="index"
                                        options={{
                                            gestureEnabled: false,
                                        }}
                        />
                    </Stack>
                </AuthProvider>
            </PersistGate>
        </Provider>
    )
}
