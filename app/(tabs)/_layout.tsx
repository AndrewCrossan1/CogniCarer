import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import {useThemeColor} from "@/hooks/useThemeColor";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Layout() {
    const theme = useThemeColor();

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

    // API Hook (For Staff name and role
    const [staffName, setStaffName] = useState('John Doe');
    const [staffRole, setStaffRole] = useState('Senior Carer');

    useEffect(() => {
        const fetchStaffInfo = async () => {
            try {
                const {data: response} = await axios.get('http://10.12.120.22:8000/api/staff/')
                // Get the first staff member
                console.log(response);
                const first_member = response[0];
                setStaffName(first_member.full_name);
                setStaffRole(first_member.role);
            } catch (e) {
                console.error(e);
            }
        }
        fetchStaffInfo();
    }, []);

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
                        <Text style={styles.profileName}>{staffName}</Text>
                        <Text style={styles.profileLink}>
                            {staffRole}
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
                    drawerStyle: { backgroundColor: theme.light },
                }}
                drawerContent={CustomDrawerContent}>
                <Drawer.Screen name="index"
                               options={{
                                   drawerIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
                                   title: 'Home',
                               }}/>
                <Drawer.Screen name="(mealtime)"
                               options={{
                                   drawerIcon: ({ color }) => <FontAwesome name="cutlery" size={24} color={color} />,
                                   title: 'Meals',
                               }}/>
            </Drawer>
        </GestureHandlerRootView>
    )
}
