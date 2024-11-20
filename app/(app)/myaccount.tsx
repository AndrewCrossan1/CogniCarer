import {useAuth} from "@/context/AuthContext";
import {Text, View, ScrollView, Image, Dimensions} from "react-native";
import {ActivityIndicator, TouchableOpacity} from "react-native";
import {TextInput, Animated, StyleSheet} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import {Alert} from "@/components/Alert";
import {ErrorCodes, ErrorMessages} from "@/constants/Errors";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "expo-router";
import {ErrorResponse} from "@/services/api/types";
import {useThemeColor} from "@/hooks/useThemeColor";

export default function MyAccount() {
    const { user } = useAuth();

    const [editing, setEditing] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [hasErrors, setHasErrors] = useState(false);
    const [serverVisible, setServerVisible] = useState(false);
    const [localVisible, setLocalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ErrorResponse | null>(null);
    const router = useRouter();
    const [buttonText, setButtonText] = useState("Edit");
    const [successVisible, setSuccessVisible] = useState(false);

    // Refs
    const emailShakeAnim = useRef(new Animated.Value(0)).current;
    const firstNameShakeAnim = useRef(new Animated.Value(0)).current;
    const lastNameShakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setFirstName(user.first_name);
            setLastName(user.last_name);
        }
    }, [user]);

    const theme = useThemeColor();

    const styles = StyleSheet.create({
        profilePicture: {
            width: 100,
            height: 100,
            borderRadius: 50,
        },
    });

    const shake = (animation: Animated.Value | Animated.ValueXY) => {
        Animated.sequence([
            Animated.timing(animation, {toValue: 10, duration: 50, useNativeDriver: true}),
            Animated.timing(animation, {toValue: -10, duration: 50, useNativeDriver: true}),
            Animated.timing(animation, {toValue: 10, duration: 50, useNativeDriver: true}),
            Animated.timing(animation, {toValue: 0, duration: 50, useNativeDriver: true})
        ]).start();
    }

    const {updateUser} = useAuth();

    const validateForm = () => {
        let errors = false;

        if (email.length === 0) {
            errors = true;
        }

        if (firstName.length === 0) {
            errors = true;
        }
        if (lastName.length === 0) {
            errors = true;
        }
        setHasErrors(errors);
    };

    useEffect(() => {
        validateForm();
    }, [email, firstName, lastName]);

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
    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [successVisible]);

    const handleUpdate = async () => {
        try {
            if (hasErrors) {
                if (email.length === 0) {
                    shake(emailShakeAnim);
                    setLocalVisible(true);
                }
                if (firstName.length === 0) {
                    shake(firstNameShakeAnim);
                    setLocalVisible(true);
                }
                if (lastName.length === 0) {
                    shake(lastNameShakeAnim);
                    setLocalVisible(true);
                }
                return;
            }

            // Call the update function
            setLoading(true);
            const valid = await updateUser(email, firstName, lastName);
            if (!valid) {
                shake(emailShakeAnim);
                shake(firstNameShakeAnim);
                shake(lastNameShakeAnim);
                setServerVisible(true);
                setLoading(false);
                setEditing(true);
                setButtonText("Save");
            } else {
                setHasErrors(false);
                setLoading(false);
                setEditing(false);
                setButtonText("Edit");
                setSuccessVisible(true);

                // Redirect to the account page
                router.push("/(app)/myaccount");
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
            setError({errorCode: err, errorMessage: ErrorMessages[err]});
        }
    };

    const handlePress = async () => {
        if (!editing) {
            setEditing(!editing);
            setButtonText("Save");
        }

        // Call the update function
        if (editing) {
            await handleUpdate();
        }
    }

    const height = Dimensions.get('window').height;

    return (
        user ? (
            <View className={"flex-1 dark:bg-neutral-800"} style={{zIndex: 0, height: height}}>

                <ScrollView>
                    <View className={"android:mt-safe ios:mt-2"} style={{zIndex: 1000}}>
                        {/* Alert for login errors */}
                        {error ? <Alert message={error?.errorMessage} visible={serverVisible}
                                        onPress={() => setServerVisible(false)} type={"error"}/> : null}
                        {/* Alert for form errors */}
                        {hasErrors ? <Alert message={"Please fill in all required fields"} visible={localVisible}
                                            onPress={() => {
                                                setLocalVisible(false)
                                            }} type={"error"}/> : null}
                        {/* Alert for success */}
                        {successVisible ?
                            <Alert message={"Account information updated!"} visible={successVisible} onPress={() => {
                                setSuccessVisible(false)
                            }} type={"success"}/> : null}
                    </View>

                    <View className={"android:mt-safe ios:mt-2"} style={{zIndex: 0}}>
                        <View className={"items-center"}>
                            <Image
                                source={{uri: 'https://randomuser.me/api/portraits/men/13.jpg'}} // This is a placeholder image
                                style={styles.profilePicture}
                            />
                            <Text
                                className={"font-bold text-4xl dark:text-white mt-5"}>{user?.first_name + " " + user?.last_name}</Text>
                            <Text className={"text-lg dark:text-white mt-1"}>{user?.staff_role}</Text>
                        </View>

                        {/* Other account details */}
                        <View className={"mt-5 p-4"}>
                            <Text className={"font-bold dark:text-white"}>User ID</Text>
                            <TextInput
                                className={`w-full p-2.5 border border-gray-300 rounded-md my-2 focus:border-blue-500 transition ease-linear dark:text-white`}
                                spellCheck={false}
                                autoCorrect={false}
                                editable={false}
                                placeholder={"User ID"}
                                value={user.pk}
                                placeholderTextColor={"gray"}>
                            </TextInput>

                            <View className={"flex flex-row items-center mt-2"}>
                                <Text className={"font-bold dark:text-white mr-2"}>Email Address</Text>
                                <FontAwesome name={editing ? "unlock" : "lock"} size={18} color={theme.text}/>
                            </View>
                            <Animated.View style={{transform: [{translateX: emailShakeAnim}]}}>
                                <TextInput
                                    className={`w-full p-2.5 border border-gray-300 rounded-md my-2 focus:border-blue-500 transition ease-linear dark:text-white`}
                                    spellCheck={false}
                                    autoCorrect={false}
                                    onChangeText={(e) => setEmail(e)}
                                    value={email}
                                    editable={editing}
                                    placeholder={"Email Address"}
                                    placeholderTextColor={"gray"}>
                                </TextInput>
                            </Animated.View>

                            <View className={"flex flex-row items-center mt-2"}>
                                <Text className={"font-bold dark:text-white mr-2"}>First name</Text>
                                <FontAwesome name={editing ? "unlock" : "lock"} size={18} color={theme.text}/>
                            </View>
                            <Animated.View style={{transform: [{translateX: firstNameShakeAnim}]}}>
                                <TextInput
                                    className={`w-full p-2.5 border border-gray-300 rounded-md my-2 focus:border-blue-500 transition ease-linear dark:text-white`}
                                    spellCheck={false}
                                    onChangeText={(fn) => setFirstName(fn)}
                                    autoCorrect={false}
                                    value={firstName}
                                    editable={editing}
                                    placeholder={"First name"}
                                    placeholderTextColor={"gray"}>
                                </TextInput>
                            </Animated.View>

                            <View className={"flex flex-row items-center mt-2"}>
                                <Text className={"font-bold dark:text-white mr-2"}>Last name</Text>
                                <FontAwesome name={editing ? "unlock" : "lock"} size={18} color={theme.text}/>
                            </View>
                            <Animated.View style={{transform: [{translateX: lastNameShakeAnim}]}}>
                                <TextInput
                                    className={`w-full p-2.5 border border-gray-300 rounded-md my-2 focus:border-blue-500 transition ease-linear dark:text-white`}
                                    spellCheck={false}
                                    onChangeText={(ln) => setLastName(ln)}
                                    autoCorrect={false}
                                    editable={editing}
                                    value={lastName}
                                    placeholder={"Last name"}
                                    placeholderTextColor={"gray"}>
                                </TextInput>
                            </Animated.View>

                            <Text className={"font-bold dark:text-white mt-4"}>Date Joined</Text>
                            <TextInput
                                className={`w-full p-2.5 border border-gray-300 rounded-md my-2 focus:border-blue-500 transition ease-linear dark:text-white`}
                                spellCheck={false}
                                autoCorrect={false}
                                editable={false}
                                placeholder={"Date Joined"}
                                placeholderTextColor={"gray"}>
                                value={new Date(user.date_joined).toLocaleDateString()}
                            </TextInput>
                        </View>
                        <View className={"p-4"}>
                            {loading ? <ActivityIndicator size={"large"} className={"dark:text-white text-blue-500"}/> :
                                <TouchableOpacity onPress={handlePress}
                                                  className={"w-full bg-blue-500 text-white p-2.5 rounded-md"}>
                                    <Text className={"text-center text-white text-lg"}>
                                        {buttonText}
                                    </Text>
                                </TouchableOpacity>}
                        </View>
                    </View>
                </ScrollView>
            </View>
        ) : (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    );
}