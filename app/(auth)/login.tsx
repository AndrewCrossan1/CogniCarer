import {useAuth} from "@/context/AuthContext";
import {TouchableOpacity, BackHandler, Animated, ActivityIndicator, SafeAreaView} from "react-native";
import {View, Text, TextInput} from "react-native";
import {Link, useRouter} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useEffect, useRef, useState} from "react";
import { ErrorCodes, ErrorMessages } from "@/constants/Errors";
import {ErrorResponse} from "@/services/api/types";
import {Alert} from "@/components/Alert";

export default function LoginScreen() {
    // State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hasErrors, setHasErrors] = useState(false);
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [serverVisible, setServerVisible] = useState(false);
    const [localVisible, setLocalVisible] = useState(false);
    const router = useRouter();

    // Refs
    const emailShakeAnim = useRef(new Animated.Value(0)).current;
    const passwordShakeAnim = useRef(new Animated.Value(0)).current;

    // useEffects
    useEffect(() => {
        const backAction = () => {
            return true;  // Prevent the default back button action
        };

        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction);
        };
    }, []);
    useEffect(() => {
        validateForm();
    }, [email, password]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setServerVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [serverVisible]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLocalVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [localVisible]);

    const { loginUser } = useAuth();

    // Functions
    const shake = (animation: Animated.Value | Animated.ValueXY) => {
        Animated.sequence([
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    };
    const handleLogin = async () => {
        try {
            if (hasErrors) {
                if (email.length === 0) {
                    shake(emailShakeAnim);
                    setLocalVisible(true);
                }
                if (password.length === 0) {
                    shake(passwordShakeAnim);
                    setLocalVisible(true);
                }
                return;
            }

            // Call the login function
            setLoading(true);
            const valid = await loginUser(email, password);
            if (!valid) {
                shake(emailShakeAnim);
                shake(passwordShakeAnim);
            } else {
                // Reset the error
                setError(null);
                setHasErrors(false);
                setLoading(false);

                // Redirect to the home page
                router.push("/(app)");
            }
        } catch (error) {
            let err;
            // Handle the error using the Error function
            // @ts-ignore
            switch (error.code) {
                case 401:
                    err = ErrorCodes.Unauthorized;
                    break;
                case 400:
                    err = ErrorCodes.BadRequest;
                    break;
                case 500:
                    err = ErrorCodes.ServerError;
                    break;
                default:
                    err = ErrorCodes.Unknown;
                    break;
            }
            setLoading(false);
            setServerVisible(true);
            setError({ errorCode: err, errorMessage: ErrorMessages[err] });
        }
    };
    const validateForm = () => {
        let errors = false;

        if (email.length === 0) {
            errors = true;
        }

        if (password.length === 0) {
            errors = true;
        }

        setHasErrors(errors);
    };

    // Render
    return (
        <SafeAreaView className={"flex-1 inset-x-0 top-0 z-50 bg-neutral-200 dark:bg-neutral-800"}>
            {/* Alert for login errors */}
            <View className={"android:mt-safe"}>
                {error ? <Alert message={error?.errorMessage} visible={serverVisible} onPress={() => setServerVisible(false)} type={"error"}/> : null}
            </View>
            {/* Alert for form errors */}
            <View className={"android:mt-safe"}>
                {hasErrors ? <Alert message={"Please fill in all fields"} visible={localVisible} onPress={() => {setLocalVisible(false)}} type={"error"}/> : null}
            </View>
            <View className={"flex-1 mt-safe-or-24"}>
                <View className={"flex-1 p-8 justify-start"}>
                    {/* Title and subtitle */}
                    <View className={"w-full flex flex-row items-center justify-start p-1"}>
                        <FontAwesome name={"user"} size={75} color={"#3B82F6"} className={"mr-5 text-blue-500"}/>
                        {/* Text on the right */}
                        <View className="flex flex-col justify-center">
                            <Text className="text-4xl font-bold leading-none tracking-tight dark:text-white">
                                Login
                            </Text>
                            <Text className="text-md mt-2 leading-none tracking-tight dark:text-white">
                                Please enter your email and password
                            </Text>
                        </View>
                    </View>
                    {/* Form */}
                    <View className={"w-full mt-16"}>
                        <Text className={"font-bold dark:text-white"}>Email Address</Text>
                        <Animated.View style={{ transform: [{ translateX: emailShakeAnim }] }}>
                            <TextInput key={"emailInput"}
                                       onChangeText={setEmail}
                                       className={`w-full p-2.5 border border-gray-300 rounded-md my-2 focus:border-blue-500 transition ease-linear dark:text-white`}
                                       spellCheck={false}
                                       editable={!loading}
                                       autoCorrect={false}
                                       placeholder={"Email Address"}
                                       placeholderTextColor={"gray"}/>
                        </Animated.View>
                        <Text className={"font-bold mt-4 dark:text-white"}>Password</Text>
                        <Animated.View style={{ transform: [{ translateX: passwordShakeAnim }] }}>
                            <TextInput key={"passwordInput"}
                                       onChangeText={setPassword}
                                       secureTextEntry={true}
                                       editable={!loading}
                                       className={`w-full p-2.5 border border-gray-300 rounded-md my-2 focus:border-blue-500 transition ease-linear dark:text-white`}
                                       placeholder={"Password"}
                                       placeholderTextColor={"gray"}/>
                        </Animated.View>
                        <Text className={"dark:text-white"}>Forgot your password? <Link href={"/(auth)/forgot-password"} className={"underline underline-offset-2"}>Reset it here</Link></Text>
                        {loading ? <ActivityIndicator size={"large"} className={"dark:text-white text-blue-500 mt-10"}/> : <TouchableOpacity onPress={handleLogin} className={"w-full bg-blue-500 text-white p-2.5 rounded-md mt-10"}>
                            <Text className={"text-center text-white text-lg"}>
                                Login
                            </Text>
                        </TouchableOpacity>}
                    </View>
                    {/* Footer (Forgot Password and Sign up */}
                    <View className={`w-full mt-4 ${loading ? "invisible" : "visible"}`}>
                        <Text className={"text-lg leading-none tracking-tight dark:text-white"}>
                            First time? <Link className={"underline underline-offset-2"} href={"/(auth)/sign-up"}>Sign up</Link>
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}