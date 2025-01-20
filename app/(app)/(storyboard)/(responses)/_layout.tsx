import {Stack} from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="new" options={{ headerShown: false }}/>
        </Stack>
    )
}
