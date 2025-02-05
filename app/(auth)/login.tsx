import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView
} from "react-native";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "expo-router";
import colors from "tailwindcss/colors";
import {useAuth} from "@/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";
import InputGroup, {InputGroupRef} from "@/components/forms/InputGroup";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import {MaterialIcons} from "@expo/vector-icons";
import {Alert} from "@/components/Alert";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [passwordErrVisible, setPasswordErrVisible] = useState(false);
    const [emailErrVisible, setEmailErrVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [alertType, setAlertType] = useState<"error" | "success">("error");

    const refEmailInput = useRef<InputGroupRef>(null);
    const refPasswordInput = useRef<InputGroupRef>(null);

    const [checked, setChecked] = useState(false);

    const {login, loading} = useAuth();

    // Timer to automatically close the alert after 3 seconds
    useEffect(() => {
        if (showAlert) {
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
    }, [showAlert]);

    const focusOnPassword = () => {
        if (refPasswordInput && refPasswordInput.current) {
            // @ts-ignore
            refPasswordInput.current.focus();
        }
    };

    // Check if the user has biometric authentication enabled
    const hasBiometrics = async () => {
        // Check if the device has biometric hardware
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            console.debug("Device does not have biometric hardware");
            return false;
        }

        // Check if the user has biometric records
        const hasRecords = await LocalAuthentication.isEnrolledAsync();
        if (!hasRecords) {
            console.debug("User does not have biometric records");
            return false;
        }
        return true;
    }

    const useLocalAuth = async () => {
        // Check if the user has biometric authentication enabled
        if (!await hasBiometrics()) {
            console.debug("Biometric authentication is not enabled, defaulting to login screen");
            return;
        }

        // Check SecureStore for stored credentials
        const email = await SecureStore.getItemAsync("email");
        const password = await SecureStore.getItemAsync("password");

        if (!email || !password) {
            setShowAlert(true);
            setMessage("No stored credentials found");
            setAlertType("error");
            console.debug("No stored credentials found, defaulting to login screen");
            return;
        }

        // Prompt the user to authenticate with biometrics
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Please authenticate to continue",
            cancelLabel: "Cancel"
        });

        // If the user cancels the biometric prompt, return
        if (!result.success) {
            console.debug("Biometric prompt cancelled, defaulting to login screen");
            return;
        }

        // Attempt to log in with the stored credentials
        const response = await login(email, password);
        if (!response) {
            setShowAlert(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setMessage("Invalid email or password");
            setAlertType("error");
            console.debug("Stored credentials are invalid, defaulting to login screen");
            return;
        }

        // If the login is successful, navigate to the app
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push("/(app)");
    }

    const handleLogin = async () => {
        // Reset the error messages
        setEmailErrVisible(false);
        setPasswordErrVisible(false);
        // Validate the email and password
        if (email.length === 0) {
            setEmailErrVisible(true);
            refEmailInput.current?.shake();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        if (password.length === 0) {
            setPasswordErrVisible(true);
            refPasswordInput.current?.shake();
            // Give a gentle vibration to the user
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        // If there are no errors call the login function
        if (email.length > 0 && password.length > 0) {
            const response = await login(email, password);
            if (!response) {
                setShowAlert(true);
                setMessage("Invalid email or password");
                setAlertType("error");
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                return;
            }

            // If the user has checked the remember me box, store the credentials
            if (checked) {
                await SecureStore.setItemAsync("email", email);
                await SecureStore.setItemAsync("password", password);
            }

            router.push("/(app)");
        }
    };

    return (
        <ScrollView className={"flex-1 w-full dark:bg-neutral-900 bg-neutral-100"}>
            <Alert
                message={message}
                type={alertType}
                visible={showAlert}
                onPress={() => setShowAlert(false)}
            />
            {/* Header */}
            <View className={"xs:mt-1 sm:mt-2 md:mt-4 lg:mt-6"}>
                <Text
                    className={"dark:text-white font-bold text-center xs:text-base sm:text-xl md:text-2xl lg:text-4xl"}>Welcome
                    Back</Text>
                <Text className={"text-lg dark:text-white text-center"}>Log in to your account</Text>
            </View>
            {/* Form */}
            <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8"}>
                <InputGroup ref={refEmailInput} onSubmitEditing={focusOnPassword} error={emailErrVisible}
                            errorMessage={"This field is required!"} label={"Email Address"} value={email}
                            onChangeText={(e) => setEmail(e)} placeholder={"joe.bloggs@cognicarer.com"}
                            textContentType={"emailAddress"}
                            autoComplete={"email"} keyboardType={"email-address"}
                />
                <InputGroup ref={refPasswordInput} error={passwordErrVisible} errorMessage={"This field is required!"}
                            label={"Password"} value={password} onChangeText={(e) => setPassword(e)}
                            autoComplete={"password"}
                            textContentType={"password"}
                            placeholder={"Password"} secureTextEntry={true}/>
                <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
                    <Text className={"underline dark:text-white ml-2"}>Forgot your password?</Text>
                </TouchableOpacity>

                {/* Remember Me */}
                <View className={"flex-row items-center ml-2"} style={{marginTop: 20}}>
                    <TouchableOpacity onPress={() => setChecked(!checked)} className={"flex-row items-center"}>
                        <View
                            className={`w-6 h-6 border-2 mr-2 rounded-md border-blue-500 flex-row justify-center items-center ${checked ? 'bg-blue-500' : 'bg-transparent'}`}>

                            {checked &&
                                <FontAwesome name={"check"} size={16} color={colors.white}/>
                            }
                        </View>
                        <Text className={"dark:text-white"}>Remember me</Text>
                    </TouchableOpacity>
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

                {/* Biometric Authentication */}
                <TouchableOpacity onPress={useLocalAuth}
                                  className={"w-full bg-blue-500 flex-row justify-center text-white p-2.5 rounded-md xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6"}>
                    <MaterialIcons name={"fingerprint"} size={24} color={colors.white}/>
                    <Text className={"text-center text-white text-lg"}>
                        Use Biometrics
                    </Text>
                </TouchableOpacity>

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
    )
}
