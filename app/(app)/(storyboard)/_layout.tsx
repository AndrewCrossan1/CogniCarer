import {Stack} from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
            <Stack.Screen name="newResponse" options={{ headerShown: false }}/>
            <Stack.Screen name="(responses)" options={{ headerShown: false }}/>
        </Stack>
    )
}
