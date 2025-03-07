import { Tabs } from 'expo-router';
import {useThemeColor} from "@/hooks/useThemeColor";
import {StyleSheet} from "react-native";
import colors from "tailwindcss/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const TabLayout = () => {
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
            <Tabs.Screen name="index"
                          options={{
                                title: "Home",
                                tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
                          }}
            />
        </Tabs>

    )
}

export default TabLayout;
