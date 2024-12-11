import {Image, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Animated} from "react-native";
import { Checkbox } from "react-native-paper";
import {useRef, useState} from "react";
import {useRouter} from "expo-router";
import colors from "tailwindcss/colors";
import {useAuth} from "@/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
    const [checked, setChecked] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [passwordErrVisible, setPasswordErrVisible] = useState(false);
    const [emailErrVisible, setEmailErrVisible] = useState(false);
    const refPasswordInput = useRef(null);

    const { login, error, loading } = useAuth();

    const focusOnPassword = () => {
        if (refPasswordInput && refPasswordInput.current) {
            // @ts-ignore
            refPasswordInput.current.focus();
        }
    };

    const handleLogin = async () => {
        // Reset the error messages
        setEmailErrVisible(false);
        setPasswordErrVisible(false);
        // Validate the email and password
        if (email.length === 0) {
            setEmailErrVisible(true);
            shake(emailShakeAnim);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        if (password.length === 0) {
            setPasswordErrVisible(true);
            shake(passwordShakeAnim);
            // Give a gentle vibration to the user
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        // If there are no errors call the login function
        if (email.length > 0 && password.length > 0) {
            const response = await login(email, password, checked);
            if (!response) {
                setShowAlert(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                return;
            }
            router.push("/(app)");
        }
    };

    const styles = StyleSheet.create({
        alertError: {
            color: colors.red[800]
        },
        error: {
            color: colors.red[500]
        }
    });

    const emailShakeAnim = useRef(new Animated.Value(0)).current;
    const passwordShakeAnim = useRef(new Animated.Value(0)).current;

    const shake = (animation: Animated.Value | Animated.ValueXY) => {
        Animated.sequence([
            Animated.timing(animation, {toValue: 10, duration: 50, useNativeDriver: true}),
            Animated.timing(animation, {toValue: -10, duration: 50, useNativeDriver: true}),
            Animated.timing(animation, {toValue: 10, duration: 50, useNativeDriver: true}),
            Animated.timing(animation, {toValue: 0, duration: 50, useNativeDriver: true})
        ]).start();
    };

    return (
        <View className={"flex-1 w-full dark:bg-neutral-900 bg-neutral-100"}>
            <Image source={require("@/assets/images/layered-waves-haikei.png")} className={"h-40 android:h-20"} />
            <Image source={require("@/assets/images/logo.png")} className={"mx-auto mt-8"} style={{resizeMode: "contain"}}/>
            {/* Header */}
            <View className={"mt-5"}>
                <Text className={"text-4xl dark:text-white font-bold text-center"}>Welcome Back</Text>
                <Text className={"text-lg dark:text-white text-center"}>Log in to your account</Text>
            </View>
            <View className={`mx-4 mt-2 rounded-md bg-red-200 p-3 flex-row justify-between items-center ${showAlert ? 'visible' : 'invisible'}`}>
                <View className={"flex-row justify-center items-center"}>
                    <FontAwesome name={"exclamation-circle"} size={20} className={"mr-2"} color={colors.red[500]}/>
                    <Text style={styles.alertError} className={`text-center text-lg`}>
                        Your email or password is incorrect
                    </Text>
                </View>
                <FontAwesome name={"close"} size={20} className={"ml-4"} color={colors.red[500]} onPress={() => setShowAlert(!showAlert)}/>
            </View>
            {/* Form */}
            <View className={"pb-8 px-8 pt-4 android:pb-2 android:px-8 android:pt-1"}>
                <Animated.View style={{transform: [{translateX: emailShakeAnim}]}}>
                    <Text className={"mb-2 text-lg dark:text-white font-bold"}>Email Address</Text>
                    <TextInput key={"email"} onSubmitEditing={focusOnPassword} value={email} onChangeText={(e) => setEmail(e)} placeholder={"joebloggs@bloggs.com"} placeholderTextColor={"#AAAAA5"} className={"rounded-md p-4 border-b-4 dark:text-white border-b-gray-300 focus:border-b-blue-500 transition-all ease-linear"}/>
                    <Text style={styles.error} className={`mt-2 ${emailErrVisible ? 'visible' : 'invisible'}`}>
                        This field is required
                    </Text>
                </Animated.View>
                <Animated.View className={"mt-10 android:mt-1"} style={{transform: [{translateX: passwordShakeAnim}]}}>
                    <Text className={"mb-2 text-lg dark:text-white font-bold"}>Password</Text>
                    <TextInput ref={refPasswordInput} key={"password"} placeholder={"Password"} value={password} onChangeText={(p) => setPassword(p)} secureTextEntry={true} placeholderTextColor={"#AAAAA5"} className={"rounded-md p-4 dark:text-white border-b-4 border-b-gray-300 focus:border-b-blue-500 transition-all ease-linear"}/>
                    <Text style={styles.error} className={`mt-2 ${passwordErrVisible ? 'visible' : 'invisible'}`}>
                        This field is required
                    </Text>
                </Animated.View>
                <Text className={"underline underline-offset-4 dark:text-white mt-2 ml-2"}>Forgot your password?</Text>
                <View className={"flex flex-row items-center mt-10"}>
                    <Checkbox.Android status={checked ? 'checked' : 'unchecked'} onPress={() => setChecked(!checked)} color={"#3B82F6"} className={"dark:text-white"}/>
                    <Text className={"dark:text-white ml-2"}>Remember me</Text>
                </View>

                {/* Login Button */}
                {loading ?
                    <ActivityIndicator size={"large"} className={"dark:text-white text-blue-500 mt-10"}/> :
                    <TouchableOpacity onPress={handleLogin}
                                      className={"w-full bg-blue-500 text-white p-2.5 rounded-md mt-10"}>
                        <Text className={"text-center text-white text-lg"}>
                            Login
                        </Text>
                    </TouchableOpacity>
                }

                <Text className={"text-center mt-10 text-xl dark:text-white"}>
                    Not a member? <Text className={"underline"}>Register now</Text>
                </Text>
            </View>
        </View>
    )
}
