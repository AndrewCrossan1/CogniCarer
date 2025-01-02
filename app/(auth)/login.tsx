import {
    Image,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Platform,
    Animated,
    ScrollView
} from "react-native";
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

    const { login, loading } = useAuth();

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
        Platform.OS === "android" ?
            <ScrollView className={"flex-1 w-full dark:bg-neutral-900 bg-neutral-100"}>
                <Image source={require("@/assets/images/layered-waves-haikei.png")} className={"xs:h-8 sm:h-16 md:h-32 lg:h-40"} />
                <Image source={require("@/assets/images/logo.png")} className={"mx-auto xs:mt-2 sm:mt-4 md:mt-6 lg:mt-8"}/>
                {/* Header */}
                <View className={"xs:mt-1 sm:mt-2 md:mt-4 lg:mt-6"}>
                    <Text className={"dark:text-white font-bold text-center xs:text-base sm:text-xl md:text-2xl lg:text-4xl"}>Welcome Back</Text>
                    <Text className={"text-lg dark:text-white text-center"}>Log in to your account</Text>
                </View>
                <View className={`mx-4 rounded-md bg-red-200 flex-row justify-between p-2 items-center ${showAlert ? 'visible' : 'invisible'} xs:mb-1 sm:mb-2 md:mb-4 lg:mb-6 xs:mt-1 sm:mt-1 md:mt-4 lg:mt-6`}>
                    <View className={"flex-row justify-center items-center"}>
                        <FontAwesome name={"exclamation-circle"} size={20} className={"mr-2"} color={colors.red[500]}/>
                        <Text style={styles.alertError} className={`text-center xs:text-sm sm:text-base md:text-lg lg:text-xl`}>
                            Your email or password is incorrect
                        </Text>
                    </View>
                    <FontAwesome name={"close"} size={20} className={"ml-4"} color={colors.red[500]} onPress={() => setShowAlert(!showAlert)}/>
                </View>
                {/* Form */}
                <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8"}>
                    <Animated.View style={{transform: [{translateX: emailShakeAnim}]}}>
                        <Text className={"mb-2 dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg"}>Email Address</Text>
                        <TextInput key={"email"} value={email} onSubmitEditing={focusOnPassword} onChangeText={(e) => setEmail(e)} placeholder={"joebloggs@bloggs.com"} placeholderTextColor={"#AAAAA5"} className={"rounded-md p-4 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 transition-all ease-linear input"}/>
                        <Text style={styles.error} className={`mt-2 ${emailErrVisible ? 'visible' : 'invisible'}`}>
                            This field is required
                        </Text>
                    </Animated.View>
                    <Animated.View style={{transform: [{translateX: passwordShakeAnim}]}}>
                        <Text className={"mb-2 dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg"}>Password</Text>
                        <TextInput ref={refPasswordInput} key={"password"} placeholder={"Password"} value={password} onChangeText={(p) => setPassword(p)} secureTextEntry={true} placeholderTextColor={"#AAAAA5"} className={"rounded-md p-4 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 transition-all ease-linear input"}/>
                        <Text style={styles.error} className={`mt-2 ${passwordErrVisible ? 'visible' : 'invisible'}`}>
                            This field is required
                        </Text>
                    </Animated.View>
                    <Text className={"underline dark:text-white ml-2"}>Forgot your password?</Text>
                    <View className={"flex flex-row items-center xs:mt-0 sm:mt-1 md:mt-2 lg:mt-6"}>
                        <Checkbox.Android status={checked ? 'checked' : 'unchecked'} onPress={() => setChecked(!checked)} color={"#3B82F6"} className={"dark:text-white"}/>
                        <Text className={"dark:text-white ml-2"}>Remember me</Text>
                    </View>

                    {/* Login Button */}
                    {loading ?
                        <ActivityIndicator size={"large"} className={"dark:text-white text-blue-500 mt-10"}/> :
                        <TouchableOpacity onPress={handleLogin}
                                          className={"w-full bg-blue-500 text-white p-2.5 rounded-md xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6"}>
                            <Text className={"text-center text-white text-lg"}>
                                Login
                            </Text>
                        </TouchableOpacity>
                    }

                    <View className={"xs:mt-1 sm:mt-3 md:mt-5 lg:mt-7 flex-row items-center"}>
                        <Text className={"text-xl dark:text-white font-bold"}>
                            Not a member?
                        </Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                            <Text className={"dark:text-blue-500 sm:text-sm md:text-base lg:text-lg ml-4"}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            :
            <View className={"flex-1 w-full dark:bg-neutral-900 bg-neutral-100"}>
                <Image source={require("@/assets/images/layered-waves-haikei.png")} className={"xs:h-8 sm:h-16 md:h-32 lg:h-40"} />
                <Image source={require("@/assets/images/logo.png")} className={"mx-auto xs:mt-2 sm:mt-4 md:mt-6 lg:mt-8"}/>
                {/* Header */}
                <View className={"xs:mt-1 sm:mt-2 md:mt-4 lg:mt-6"}>
                    <Text className={"dark:text-white font-bold text-center xs:text-base sm:text-xl md:text-2xl lg:text-4xl"}>Welcome Back</Text>
                    <Text className={"text-lg dark:text-white text-center"}>Log in to your account</Text>
                </View>
                <View className={`mx-4 rounded-md bg-red-200 flex-row justify-between p-2 items-center ${showAlert ? 'visible' : 'invisible'} xs:mb-1 sm:mb-2 md:mb-4 lg:mb-6 xs:mt-1 sm:mt-1 md:mt-4 lg:mt-6`}>
                    <View className={"flex-row justify-center items-center"}>
                        <FontAwesome name={"exclamation-circle"} size={20} className={"mr-2"} color={colors.red[500]}/>
                        <Text style={styles.alertError} className={`text-center xs:text-sm sm:text-base md:text-lg lg:text-xl`}>
                            Your email or password is incorrect
                        </Text>
                    </View>
                    <FontAwesome name={"close"} size={20} className={"ml-4"} color={colors.red[500]} onPress={() => setShowAlert(!showAlert)}/>
                </View>
                {/* Form */}
                <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8"}>
                    <Animated.View style={{transform: [{translateX: emailShakeAnim}]}}>
                        <Text className={"mb-2 dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg"}>Email Address</Text>
                        <TextInput key={"email"} value={email} onSubmitEditing={focusOnPassword} onChangeText={(e) => setEmail(e)} placeholder={"joebloggs@bloggs.com"} placeholderTextColor={"#AAAAA5"} className={"rounded-md p-4 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 transition-all ease-linear input"}/>
                        <Text style={styles.error} className={`mt-2 ${emailErrVisible ? 'visible' : 'invisible'}`}>
                            This field is required
                        </Text>
                    </Animated.View>
                    <Animated.View style={{transform: [{translateX: passwordShakeAnim}]}}>
                        <Text className={"mb-2 dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg"}>Password</Text>
                        <TextInput ref={refPasswordInput} key={"password"} placeholder={"Password"} value={password} onChangeText={(p) => setPassword(p)} secureTextEntry={true} placeholderTextColor={"#AAAAA5"} className={"rounded-md p-4 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 transition-all ease-linear input"}/>
                        <Text style={styles.error} className={`mt-2 ${passwordErrVisible ? 'visible' : 'invisible'}`}>
                            This field is required
                        </Text>
                    </Animated.View>
                    <Text className={"underline dark:text-white ml-2"}>Forgot your password?</Text>

                    {/* Login Button */}
                    {loading ?
                        <ActivityIndicator size={"large"} className={"dark:text-white text-blue-500 mt-10"}/> :
                        <TouchableOpacity onPress={handleLogin}
                                          className={"w-full bg-blue-500 text-white p-2.5 rounded-md xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6"}>
                            <Text className={"text-center text-white text-lg"}>
                                Login
                            </Text>
                        </TouchableOpacity>
                    }
                    <View className={"xs:mt-1 sm:mt-3 md:mt-5 lg:mt-7 flex-row items-center"}>
                        <Text className={"text-xl dark:text-white font-bold"}>
                            Not a member?
                        </Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                            <Text className={"dark:text-blue-500 sm:text-sm md:text-base lg:text-lg ml-4"}>Register</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
    )
}
