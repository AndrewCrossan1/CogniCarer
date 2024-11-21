import {Stack, Tabs} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        </Stack>

    )
}