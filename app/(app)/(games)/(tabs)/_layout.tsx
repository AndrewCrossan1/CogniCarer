import { Tabs } from 'expo-router';
import {useThemeColor} from "@/hooks/useThemeColor";
import {StyleSheet} from "react-native";
import colors from "tailwindcss/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {MaterialIcons} from "@expo/vector-icons";

const TabLayout = () => {
    const theme  = useThemeColor();

    const styles = StyleSheet.create({
        tabBar: {
            backgroundColor: theme.TabBackgroundColor,
            borderTopColor: colors.neutral[600],
        },
    });

    return (
        <Tabs
            screenOptions={{
                headerShown: false, tabBarStyle: styles.tabBar, tabBarActiveTintColor: theme.primary
            }}
            initialRouteName={'index'}
        >
            <Tabs.Screen name="play/[id]"
                            options={{
                                href: null,
                            }}
            />
            <Tabs.Screen name="play/play"
                            options={{
                                href: null
                            }}
            />
            <Tabs.Screen name="gameHistory"
                            options={{
                                title: "Statistics",
                                tabBarIcon: ({ color }) => <MaterialIcons name="analytics" size={24} color={color} />,
                            }}
            />
            <Tabs.Screen name="index"
                         options={{
                             title: "Home",
                             tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
                         }}
            />
            <Tabs.Screen name="gameList"
                            options={{
                                title: "Games",
                                tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
                            }}
            />
            <Tabs.Screen name="createGame"
                            options={{
                                href: null
                            }}
            />
        </Tabs>

    )
}

export default TabLayout;
