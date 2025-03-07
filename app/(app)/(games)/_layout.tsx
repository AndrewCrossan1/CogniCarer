import {Stack} from "expo-router";

const GameLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="(tabs)"
                          options={{
                                title: "Games",
                                headerShown: false
                          }}
            />
        </Stack>
    )
}

export default GameLayout;
