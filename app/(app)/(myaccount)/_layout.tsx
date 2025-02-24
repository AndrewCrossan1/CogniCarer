import {Tabs} from "expo-router";
import {useThemeColor} from "@/hooks/useThemeColor";
import {StyleSheet} from "react-native";
import colors from "tailwindcss/colors";
import {MaterialIcons} from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

/**
 * Layout for the My Account module
 * Contains the main layout for the MyAccount module
 *
 * Contains the following slots:
 * - index
 * - edit-account
 * - family
 * - family/[id]
 * @constructor
 * @return JSX.Element
 */
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
            initialRouteName={'index'}
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
            }}>
            <Tabs.Screen name="index"
                            options={{
                                title: 'Home',
                                headerShown: false,
                                tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
                            }}
            />
            <Tabs.Screen name="edit-account"
                            options={{
                                title: 'Edit',
                                headerShown: false,
                                tabBarIcon: ({ color }) => <MaterialIcons name="edit" size={24} color={color} />,
                            }}
            />
            <Tabs.Screen name="family"
                            options={{
                                title: 'Family',
                                headerShown: false,
                                tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
                            }}
            />
            <Tabs.Screen name="family/[id]"
                            options={{
                                headerShown: false,
                                href: null,
                            }}
            />
            <Tabs.Screen name="data-protection"
                            options={{
                                title: 'Data Protection',
                                headerShown: false,
                                tabBarIcon: ({ color }) => <FontAwesome name="shield" size={24} color={color} />,
                            }}
            />
        </Tabs>
    )
}