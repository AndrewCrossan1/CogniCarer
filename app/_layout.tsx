import { Stack } from 'expo-router';
import "../global.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthHandler from "@/app/AuthHandler";
import { configureReanimatedLogger, ReanimatedLogLevel} from "react-native-reanimated";

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
})

export default function RootLayout() {
    return (
        <AuthProvider>
            <AuthHandler/>
            <Stack
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen name="(app)"
                              options={{
                                  gestureEnabled: false
                              }}
                />
                <Stack.Screen name="(auth)/login"
                              options={{
                                  gestureEnabled: false
                              }}
                />
            </Stack>
        </AuthProvider>
    )
}
