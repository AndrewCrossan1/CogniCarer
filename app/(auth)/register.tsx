import {Text, View, TextInput, TouchableOpacity, ScrollView, Platform} from "react-native";
import {useState} from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Checkbox} from "react-native-paper";
import {useRouter} from "expo-router";
import InputField from "@/components/InputField";

export default function Index() {
    const [activeForm, setActiveForm] = useState("personal");
    const router = useRouter();

    {/* Personal Details */}
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState(new Date());
    const [email, setEmail] = useState("");

    {/* Password */}
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [tenChars, setTenChars] = useState(false);
    const [upperCase, setUpperCase] = useState(false);
    const [lowerCase, setLowerCase] = useState(false);
    const [number, setNumber] = useState(false);
    const [specialChar, setSpecialChar] = useState(false);

    {/* Occupation Details */}
    const [profCarer, setProfCarer] = useState(false);
    const [familyCarer, setFamilyCarer] = useState(false);
    const [patientCount, setPatientCount] = useState("");
    const [struggle, setStruggle] = useState(false);
    const [preferNot, setPreferNot] = useState(false);

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

    // TODO: Separate each form into a separate component (For reusability and readability)

    return (
        <ScrollView className={"flex-1 w-full dark:bg-neutral-900 bg-neutral-100"}>
            {/* Header */}
            <View className={"xs:mt-1 sm:mt-2 md:mt-4 lg:mt-6"}>
                <Text className={"dark:text-white font-bold text-center xs:text-base sm:text-xl md:text-2xl lg:text-4xl"}>Create an account</Text>
                {activeForm === "personal" ? <Text className={"dark:text-white text-center xs:text-xs sm:text-sm md:text-base lg:text-lg"}>Personal Details</Text> : null}
                {activeForm === "occupation" ? <Text className={"dark:text-white text-center xs:text-xs sm:text-sm md:text-base lg:text-lg"}>Occupation Details</Text> : null}
                {activeForm === "password" ? <Text className={"dark:text-white text-center xs:text-xs sm:text-sm md:text-base lg:text-lg"}>Setting your password</Text> : null}
            </View>
            {/* Progress Icons */}
            <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8 xs:mt-2 sm:mt-3 md:mt-4 lg:mt-5"}>
                <View className={"flex-row justify-between items-center"}>
                    <TouchableOpacity onPress={() => setActiveForm("personal")} className={"justify-center items-center"}>
                        <FontAwesome name={"user-circle"} size={24} color={activeForm === "personal" ? "#3B82F6" : "#AAAAA5"}/>
                        <Text className={"dark:text-white mt-1"}>Personal</Text>
                    </TouchableOpacity>
                    <FontAwesome name={"chevron-right"} size={24} color={"#AAAAA5"}/>
                    <TouchableOpacity onPress={() => setActiveForm("occupation")} className={"justify-center items-center"}>
                        <FontAwesome name={"check-circle"} size={24} color={activeForm === "occupation" ? "#3B82F6" : "#AAAAA5"}/>
                        <Text className={"dark:text-white mt-1"}>Occupation</Text>
                    </TouchableOpacity>
                    <FontAwesome name={"chevron-right"} size={24} color={"#AAAAA5"}/>
                    <TouchableOpacity onPress={() => setActiveForm("password")} className={"justify-center items-center"}>
                        <FontAwesome name={"lock"} size={24} color={activeForm === "password" ? "#3B82F6" : "#AAAAA5"}/>
                        <Text className={"dark:text-white mt-1"}>Password</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Personal Details */}
            {activeForm === "personal" ?
                <View>
                    <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8 xs:mt-0 sm:mt-1 md:mt-2 lg:mt-3 xl:mt-4"}>
                        <InputField value={email} password={false} onChangeText={(e) => setEmail(e)} placeholder={"joebloggs@bloggs.com"} placeholderTextColor={"#AAAAA5"} label={"Email Address"} key={"email"}/>
                    </View>
                    {/* First and last name */}
                    <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8 flex-row justify-between"}>
                        <InputField value={firstName} password={false} width={"w-5/12"} onChangeText={(s) => setFirstName(s)} placeholder={"Joe"} placeholderTextColor={"#AAAAA5"} label={"First Name"} key={"first_name"}/>
                        <InputField value={lastName} password={false} width={"w-5/12"} onChangeText={(s) => setLastName(s)} placeholder={"Bloggs"} placeholderTextColor={"#AAAAA5"} label={"Last Name"} key={"last_name"}/>
                    </View>
                    {/* Date of Birth */}
                    {Platform.OS === "android" ? null :
                    <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Date of Birth</Text>
                        {/* Month Dropdown */}
                        <View className={"rounded-md border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 transition-all ease-linear"}>
                            {/* @ts-ignore */}
                            <DateTimePicker  style={{marginHorizontal: "auto"}} value={dob} mode={"date"} collapsable={true} display={"spinner"} onChange={(e, date) => setDob(date)}/>
                        </View>
                    </View>}
                    <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8 flex-row items-center"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                            <Text className={"dark:text-blue-500 sm:text-sm md:text-base lg:text-lg ml-4"}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                : null}
            {/* Password */}
            {activeForm === "password" ?
                <View>
                    <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8 xs:mt-0 sm:mt-1 md:mt-2 lg:mt-3 xl:mt-4"}>
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
                        <InputField value={password} onChangeText={(s) => validatePassword(s)} placeholder={"********"} placeholderTextColor={"#AAAAA5"} label={"Enter Password"} password={true}/>
                        <View className={"my-2"}/>
                        <InputField value={confirmPassword} password={true} label={"Confirm Password"} onChangeText={(s) => matchPasswords(s)} placeholder={"********"} placeholderTextColor={"#AAAAAA5"}/>
                        <TouchableOpacity className={"w-full bg-blue-500 text-white p-2.5 rounded-md xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6"}>
                            <Text className={"text-center text-white text-lg"}>
                                Register
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* Already have an account? */}
                    <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8 flex-row items-center"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                            <Text className={"dark:text-blue-500 sm:text-sm md:text-base lg:text-lg ml-4"}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                : null}
            {/* Occupation */}
            {activeForm === "occupation" ?
                <View>
                    <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8 xs:mt-0 sm:mt-1 md:mt-2 lg:mt-3 xl:mt-4"}>
                        <View className={"flex-row justify-between"}>
                            <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Are you a professional carer?</Text>
                            <TouchableOpacity>
                                <FontAwesome name={"info-circle"} size={24} color={"#AAAAA5"}/>
                            </TouchableOpacity>
                        </View>
                        <View className={"flex-row items-center"}>
                            {/* Radio Group for Yes/No */}
                            <Checkbox.Android status={profCarer ? "checked" : "unchecked"} color={"#3B82F6"} onPress={() => {
                                setProfCarer(true);
                            }}/>
                            <Text className={"dark:text-white mr-10"}>Yes</Text>

                            <Checkbox.Android status={!profCarer ? "checked" : "unchecked"} color={"#3B82F6"} className={"dark:text-white"} onPress={
                                () => {
                                    setProfCarer(false);
                                }
                            }/>
                            <Text className={"dark:text-white"}>No</Text>
                        </View>
                        {!profCarer ? <View className={"xs:mt-0 sm:mt-2 md:mt-3 lg:mt-4 xl:mt-5"}>
                            <View className={"flex-row justify-between"}>
                                <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Are you caring for a family member?</Text>
                                <TouchableOpacity>
                                    <FontAwesome name={"info-circle"} size={24} color={"#AAAAA5"}/>
                                </TouchableOpacity>
                            </View>
                            <View className={"flex-row items-center"}>
                                {/* Radio Group for Yes/No */}
                                <Checkbox.Android status={familyCarer ? "checked" : "unchecked"} color={"#3B82F6"} onPress={() => {
                                    setFamilyCarer(true);
                                }}/>
                                <Text className={"dark:text-white mr-10"}>Yes</Text>

                                <Checkbox.Android status={!familyCarer ? "checked" : "unchecked"} color={"#3B82F6"} className={"dark:text-white"} onPress={
                                    () => {
                                        setFamilyCarer(false);
                                    }
                                }/>
                                <Text className={"dark:text-white"}>No</Text>
                            </View>
                        </View> : null}
                        <View className={"xs:mt-0 sm:mt-2 md:mt-3 lg:mt-4 xl:mt-5"}>
                            <Text className={"mb-2 dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>How many people do you care for?</Text>
                            <TextInput key={"patient_count"} returnKeyType={"done"} keyboardType={"number-pad"} value={patientCount} onChangeText={(e) => setPatientCount(e)} placeholder={"1"} placeholderTextColor={"#AAAAA5"} className={"rounded-md p-4 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 transition-all ease-linear input"}/>
                        </View>
                        <View className={"xs:mt-0 sm:mt-2 md:mt-3 lg:mt-4 xl:mt-5"}>
                            <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Has caring ever caused you to suffer from mental health issues?</Text>
                            <Text className={"dark:text-gray-400 mb-2"}>*This information is not saved, we only ask to tailor the support given.</Text>
                            <View className={"flex-row items-center justify-between"}>
                                {/* Radio Group for Yes/No */}
                                <View className={"flex-row items-center"}>
                                    <Checkbox.Android status={struggle && !preferNot ? "checked" : "unchecked"} color={"#3B82F6"} onPress={() => {
                                        setStruggle(true);
                                        setPreferNot(false);
                                    }}/>
                                    <Text className={"dark:text-white"}>Yes</Text>
                                </View>
                                <View className={"flex-row items-center"}>
                                    <Checkbox.Android status={!struggle && !preferNot ? "checked" : "unchecked"} color={"#3B82F6"} className={"dark:text-white"} onPress={
                                        () => {
                                            setStruggle(false);
                                            setPreferNot(false);
                                        }
                                    }/>
                                    <Text className={"dark:text-white"}>No</Text>
                                </View>
                                <View className={"flex-row items-center"}>
                                    <Checkbox.Android status={preferNot ? "checked" : "unchecked"} color={"#3B82F6"} onPress={() => {
                                        setPreferNot(!preferNot);
                                        if (preferNot) {
                                            setStruggle(false);
                                        }
                                    }}/>
                                    <Text className={"dark:text-white"}>Prefer not to say</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Already have an account? */}
                    <View className={"xs:pb-2 sm:pb-3 md:pb-4 lg:pb-5 px-8 flex-row items-center"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                            <Text className={"dark:text-blue-500 sm:text-sm md:text-base lg:text-lg ml-4"}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View> : null}
        </ScrollView>
    );
}