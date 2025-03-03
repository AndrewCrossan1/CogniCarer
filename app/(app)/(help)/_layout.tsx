import {Stack} from "expo-router";

export default function Layout() {
    return (
        <Stack
            initialRouteName={'index'}
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="index"
                          options={{
                              title: 'Home',
                              headerShown: false,
                          }}
            />
            <Stack.Screen name="article/[id]"
                          options={{
                              title: 'About',
                              headerShown: false,
                          }}
            />
        </Stack>
    )
}