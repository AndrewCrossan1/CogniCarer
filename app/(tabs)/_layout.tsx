import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';

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
                    <Text style={styles.profileName}>John Doe</Text>
                    <Text style={styles.profileLink}>
                        Senior Carer
                    </Text>
                </View>
            </View>

            {/* Drawer Items */}
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{ headerShown: true, drawerActiveTintColor: 'indigo', headerTintColor: 'indigo' }}
                drawerContent={CustomDrawerContent}
                >
                <Drawer.Screen name="index" 
                options={{
                    drawerIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
                    title: 'Home',
                }}/>
            </Drawer>
        </GestureHandlerRootView>
    )
}

// Styles
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileLink: {
        color: 'indigo',
        marginTop: 0,
    },
});