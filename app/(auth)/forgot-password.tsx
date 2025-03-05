import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
    ActivityIndicator
} from "react-native";
import {useRef, useState} from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useRouter} from "expo-router";
import {useAuth} from "@/context/AuthContext";
import Input from "@/components/forms/Input";
import InputGroup, {InputGroupRef} from "@/components/forms/InputGroup";

export default function ResetPasswordScreen() {
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [code, setCode] = useState<string[]>(Array(6).fill("")); // Six-digit code
    const [codeSent, setCodeSent] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const emailRef = useRef<InputGroupRef>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [tenChars, setTenChars] = useState(false);
    const [upperCase, setUpperCase] = useState(false);
    const [lowerCase, setLowerCase] = useState(false);
    const [number, setNumber] = useState(false);
    const [specialChar, setSpecialChar] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [codeError, setCodeError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const router = useRouter();

    const {sendResetEmail, validateResetCode, resetPassword, loading, error: authError} = useAuth();

    /**
     * Handle text change event
     * @param text  Text input
     * @param index Index of the input
     */
    const handleChangeText = (text: string, index: number) => {
        if (text.length > 1) return; // Ensure single character input
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Move to the next input if not the last input
        if (text && index < code.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    /**
     * Handle key press event
     * @param e   Key press event
     * @param index  Index of the input
     */
    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        // Handle backspace to focus on previous input
        if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    /** Handle the reset password action
     *  If the code is not valid, focus on the first input
     *  If the code is valid, set the error to false and set sent to true
     */
    const handleReset = () => {
        if (!emailSent) {
            // Validate email
            const isValid = email !== "";

            // If the email is valid, utilise the backend functionality
            if (isValid) {
                sendResetEmail(email).then((success) => {
                    if (!success) {
                        // Handle error
                        setEmailError(true);
                        return;
                    }
                });
                setEmailSent(true);
                return;
            }
            setEmailError(true);
            emailRef.current?.shake();
            return;
        }

        if (!codeSent) {
            // Validate code
            const isValid = code.every((c) => c !== "");

            if (isValid) {
                setCodeError(false);
                validateResetCode(email, code.join("")).then((success) => {
                    if (!success) {
                        // Handle error
                        setCodeError(true);
                        return;
                    }
                    setCodeSent(true);
                });
                return;
            }
            setCodeError(true);

            // If the code is not valid, focus on the first input
            inputRefs.current[0]?.focus();
            return;
        }

        // Validate password
        const isValid = tenChars && upperCase && lowerCase && number && specialChar && password === confirmPassword;

        if (isValid) {
            resetPassword(email, code.join(""), password, confirmPassword).then((success) => {
                if (!success) {
                    // Handle error
                    setPasswordError(true);
                    return;
                }
                router.push("/(auth)/login");
                return;
            });
            return;
        }
        setPasswordError(true);
        return;
    }

    const validatePassword = (p: string) => {
        // Check if password is at least 10 characters
        if (password.length >= 10) {
            setTenChars(true);
        } else {
            setTenChars(false);
        }

        // Check if password has an uppercase letter
        if (p.match(/[A-Z]/)) {
            setUpperCase(true);
        } else {
            setUpperCase(false);
        }

        // Check if password has a lowercase letter
        if (p.match(/[a-z]/)) {
            setLowerCase(true);
        } else {
            setLowerCase(false);
        }

        // Check if password has a number
        if (p.match(/[0-9]/)) {
            setNumber(true);
        } else {
            setNumber(false);
        }

        // Check if password has a special character
        if (p.match(/[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/)) {
            setSpecialChar(true);
        } else {
            setSpecialChar(false);
        }
        setPassword(p);
    }

    const matchPasswords = (p: string) => {
        setConfirmPassword(p);
        return confirmPassword === password;
    }

    return (
        <View className={"flex-1 dark:bg-neutral-800 bg-neutral-100"}>
            <View className={"xs:mt-1 sm:mt-2 md:mt-4 lg:mt-6"}>
                <Text className={"dark:text-white font-bold text-center xs:text-base sm:text-xl md:text-2xl lg:text-4xl"}>Reset Password</Text>
                <Text className={"text-lg dark:text-white text-center px-12"}>
                    {/* If the email has been sent*/}
                    {!emailSent ? "Please enter your email address to receive a six-digit code" : null}
                    {/* If the code has been sent */}
                    {emailSent && !codeSent ? "Please enter the six-digit code sent to your email" : null}
                    {/* If the code has been sent, imply that email has also been sent */}
                    {emailSent && codeSent ? "Please enter a new password" : null}
                </Text>
            </View>
            {/* Form */}
            <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8"}>
                {!emailSent &&
                  <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 xs:mt-0 sm:mt-1 md:mt-2 lg:mt-3 xl:mt-4"}>
                    <InputGroup ref={emailRef} label={"Email Address"} errorMessage={"Please enter a valid email address"} error={emailError} value={email} onChangeText={(e) => setEmail(e)} placeholder={"joe.bloggs@cognicarer.com"} keyboardType={"email-address"} key={"email"}/>
                  </View>}

                {emailSent && !codeSent &&
                  <View className={"mt-4"}>
                    <View className={"flex-row items-center justify-center"}>
                        {code.map((_, i) => (
                            <View key={i} className={"p-2 mx-auto"}>
                                <TextInput ref={(el) => inputRefs.current[i] = el}
                                           textAlign={"center"}
                                           key={i}
                                           value={code[i]}
                                           onChangeText={(text) => handleChangeText(text, i)}
                                           onKeyPress={(e) => handleKeyPress(e, i)}
                                           returnKeyType={"done"}
                                           keyboardType={"numeric"}
                                           maxLength={1}
                                           className={`rounded-md w-12 p-4 border dark:text-white focus:border-blue-500 transition-all ease-linear ${codeError && !code[i] ? "border-red-500" : "border-gray-400 dark:border-gray-500"}`}/>
                            </View>
                        ))}
                    </View>
                      {codeError &&
                        <Text className={"text-center text-red-500 mt-2"}>
                          Please enter the six-digit code
                        </Text>}
                  </View>
                }

                {emailSent && codeSent &&
                  <View className={"xs:mt-4 sm:mt-5 md:mt-6 lg:mt-7"}>
                    <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Your password must meet the following requirements:</Text>
                    <View className={"flex-row items-center"}>
                      <FontAwesome name={tenChars ? "check" : "close"} size={24} color={tenChars ? "#3B82F6" : "#EF5350"}/>
                      <Text className={"ml-2 dark:text-white"}>At least 10 characters</Text>
                    </View>
                    <View className={"flex-row items-center"}>
                      <FontAwesome name={upperCase ? "check" : "close"} size={24} color={upperCase ? "#3B82F6" : "#EF5350"}/>
                      <Text className={"ml-2 dark:text-white"}>At least one uppercase letter</Text>
                    </View>
                    <View className={"flex-row items-center"}>
                      <FontAwesome name={lowerCase ? "check" : "close"} size={24} color={lowerCase ? "#3B82F6" : "#EF5350"}/>
                      <Text className={"ml-2 dark:text-white"}>At least one lowercase letter</Text>
                    </View>
                    <View className={"flex-row items-center"}>
                      <FontAwesome name={number ? "check" : "close"} size={24} color={number ? "#3B82F6" : "#EF5350"}/>
                      <Text className={"ml-2 dark:text-white"}>At least one number</Text>
                    </View>
                    <View className={"flex-row items-center"}>
                      <FontAwesome name={specialChar ? "check" : "close"} size={24} color={specialChar ? "#3B82F6" : "#EF5350"}/>
                      <Text className={"ml-2 dark:text-white"}>At least one special character</Text>
                    </View>
                    <View className={"flex-row items-center mb-5"}>
                      <FontAwesome name={password === confirmPassword ? "check" : "close"} size={24} color={password === confirmPassword ? "#3B82F6" : "#EF5350"}/>
                      <Text className={"ml-2 dark:text-white"}>Passwords match</Text>
                    </View>

                    <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Password</Text>
                    <Input value={password} secureTextEntry={true} onChangeText={validatePassword} placeholder={"Password"} placeholderTextColor={"#AAAAA5"} key={"password"}/>

                    <View className={"my-2"}/>

                    <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Confirm Password</Text>
                    <Input value={confirmPassword} secureTextEntry={true} onChangeText={matchPasswords} placeholder={"Confirm Password"} placeholderTextColor={"#AAAAA5"} key={"confirmPassword"}/>

                    {passwordError &&
                      <Text className={"text-center text-red-500 mt-2"}>
                        Please ensure that your password meets the requirements
                      </Text>}
                  </View>
                }

                {/* Reset Button */}
                {loading ?
                    <ActivityIndicator size={"large"} className={"dark:text-white text-blue-500 mt-10"}/>
                    :
                    <TouchableOpacity className={"w-full bg-blue-500 text-white p-2.5 rounded-md xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6"} onPress={handleReset}>
                        <Text className={"text-center text-white text-lg"}>
                            {!emailSent && "Send Email"}
                            {emailSent && codeSent && "Reset Password"}
                            {emailSent && !codeSent && "Send Code"}
                        </Text>
                    </TouchableOpacity>
                }

                {!loading &&
                  <TouchableOpacity className={"w-full bg-red-500 text-white p-2.5 rounded-md xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6"} onPress={() => router.push("/(auth)/login")}>
                    <Text className={"text-center text-white text-lg"}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                }
            </View>
        </View>
    );
}
