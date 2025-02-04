import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView
} from "react-native";
import {useRef, useState} from "react";
import {useRouter} from "expo-router";
import colors from "tailwindcss/colors";
import {useAuth} from "@/context/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";
import InputGroup, {InputGroupRef} from "@/components/forms/InputGroup";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [passwordErrVisible, setPasswordErrVisible] = useState(false);
    const [emailErrVisible, setEmailErrVisible] = useState(false);

    const refEmailInput = useRef<InputGroupRef>(null);
    const refPasswordInput = useRef<InputGroupRef>(null);

    const {login, loading} = useAuth();

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

    return (
        <ScrollView className={"flex-1 w-full dark:bg-neutral-900 bg-neutral-100"}>
            {/* Header */}
            <View className={"xs:mt-1 sm:mt-2 md:mt-4 lg:mt-6"}>
                <Text
                    className={"dark:text-white font-bold text-center xs:text-base sm:text-xl md:text-2xl lg:text-4xl"}>Welcome
                    Back</Text>
                <Text className={"text-lg dark:text-white text-center"}>Log in to your account</Text>
            </View>
            {/* Form */}
            <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8"}>
                <View
                    className={`rounded-md bg-red-200 flex-row justify-between p-2 items-center ${showAlert ? 'visible' : 'invisible'} xs:mb-1 sm:mb-2 md:mb-4 lg:mb-6 xs:mt-1 sm:mt-1 md:mt-4 lg:mt-6`}>
                    <View className={"flex-row justify-center items-center"}>
                        <FontAwesome name={"exclamation-circle"} size={20} className={"mr-2"} color={colors.red[500]}/>
                        <Text style={styles.alertError}
                              className={`text-center xs:text-sm sm:text-base md:text-lg lg:text-xl`}>
                            Your email or password is incorrect
                        </Text>
                    </View>
                    <FontAwesome name={"close"} size={20} className={"ml-4"} color={colors.red[500]}
                                 onPress={() => setShowAlert(!showAlert)}/>
                </View>

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
    )
}
