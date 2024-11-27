import {Tabs} from "expo-router";
import {StyleSheet} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useThemeColor} from "@/hooks/useThemeColor";

export default function Layout() {

    const theme  = useThemeColor();

    const styles = StyleSheet.create({
        tabBar: {
            backgroundColor: theme.TabBackgroundColor,
            borderTopColor: theme.drawerBottomBorderColor,
        }
    });

    return (
        <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarActiveTintColor: theme.primary }}>
            <Tabs.Screen name="index"
                         options={{
                             title: 'Home',
                             tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
                         }}
            />
            <Tabs.Screen name="templateList"
                         options={{
                             title: 'Templates',
                             tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
                         }}
            />
            <Tabs.Screen name="responseList"
                         options={{
                             title: 'Responses',
                             tabBarIcon: ({ color }) => <FontAwesome name="reply" size={24} color={color} />,
                         }}
            />
        </Tabs>
    )
}
