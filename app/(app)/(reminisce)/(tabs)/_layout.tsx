import {Tabs} from "expo-router";
import {StyleSheet} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useThemeColor} from "@/hooks/useThemeColor";
import colors from "tailwindcss/colors";

export default function Layout() {

    const theme  = useThemeColor();

    const styles = StyleSheet.create({
        tabBar: {
            backgroundColor: theme.TabBackgroundColor,
            borderTopColor: colors.neutral[600],
        }
    });

    return (
        <Tabs
            screenOptions={{
                headerShown: false, tabBarStyle: styles.tabBar, tabBarActiveTintColor: theme.primary
            }}
            initialRouteName={'index'}
        >
            <Tabs.Screen name="Albums"
                         options={{
                             title: 'Albums',
                             tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
                         }}

            />
            <Tabs.Screen name="Entries"
                         options={{
                             title: 'Entries',
                             tabBarIcon: ({ color }) => <FontAwesome name="reply" size={24} color={color} />,
                         }}
            />
            <Tabs.Screen name="index"
                         options={{
                             title: 'Home',
                             tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
                         }}
            />
            <Tabs.Screen name="Pictures"
                         options={{
                             title: 'Pictures',
                             tabBarIcon: ({ color }) => <FontAwesome name="image" size={24} color={color} />,
                         }}
            />
            <Tabs.Screen name="NewEntry"
                            options={{
                                title: 'New Entry',
                                tabBarIcon: ({ color }) => <FontAwesome name="plus" size={24} color={color} />,
                            }}
            />
        </Tabs>
    )
}
