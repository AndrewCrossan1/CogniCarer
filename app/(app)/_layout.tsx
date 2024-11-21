import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import {useThemeColor} from "@/hooks/useThemeColor";
import {useAuth} from "@/context/AuthContext";

export default function Layout() {
    const theme = useThemeColor();

    const { user } = useAuth();

    const styles = StyleSheet.create({
        profileContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20
        },
        profilePicture: {
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 15,
        },
        profileInfo: {
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        profileName: {
            color: theme.text,
            fontSize: 18,
            fontWeight: 'bold',
        },
        profileLink: {
            color: theme.text,
            marginTop: 0,
        },
    });

    function CustomDrawerContent(props: DrawerContentComponentProps) {
        return (
            <DrawerContentScrollView {...props}>
                <View style={styles.profileContainer}>
                    {/* Profile Picture */}
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/men/41.jpg' }}
                        style={styles.profilePicture}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName} className={"dark:text-white"}>{user?.first_name + " " + user?.last_name}</Text>
                        <Text style={styles.profileLink} className={"dark:text-white"}>
                            {user?.staff_role}
                        </Text>
                    </View>
                </View>
                {/* Separator */}
                <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: theme.drawerBottomBorderColor, marginBottom: 5, marginHorizontal: 12 }}/>
                {/* Drawer Items */}
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerShown: true,
                    drawerActiveTintColor: theme.primary,
                    headerTintColor: theme.text,
                    drawerInactiveTintColor: theme.text,
                    headerStyle: { backgroundColor: theme.light, shadowColor: theme.drawerBottomBorderColor },
                    drawerStyle: { backgroundColor: theme.TabBackgroundColor, borderBottomColor: theme.drawerBottomBorderColor }
                }}
                drawerContent={CustomDrawerContent}>
                <Drawer.Screen name="index"
                               options={{
                                   drawerIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
                                   title: 'Home',
                               }}/>
                <Drawer.Screen name="myaccount"
                               options={{
                                   drawerIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
                                   title: 'My Account',
                               }}/>
                <Drawer.Screen name="(storyboard)"
                               options={{
                                   drawerIcon: ({ color }) => <FontAwesome name="book" size={24} color={color} />,
                                   title: 'Storyboard',
                               }}/>
            </Drawer>
        </GestureHandlerRootView>
    )
}
