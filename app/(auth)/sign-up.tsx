import {Link} from "expo-router";
import {Button} from "react-native-paper";
import {View, Text, StyleSheet} from "react-native";

export default function SignUpScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return (
        <View style={styles.container}>
            <Text>Sign Up</Text>
            <Text>Enter your email and password</Text>
            <Text>Email Address</Text>
            <Text>Password</Text>
            <Button>Sign Up</Button>
            <Button>Already have an account? <Link href={"/(auth)/login"}>Login.</Link></Button>
        </View>
    )
}
