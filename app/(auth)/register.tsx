import {Text, View, TouchableOpacity, Platform} from "react-native";
import {useEffect, useState} from "react";
import {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useRouter} from "expo-router";
import InputGroup from "@/components/forms/InputGroup";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {useColorScheme} from "nativewind";
import {Alert} from "@/components/Alert";
import * as ImagePicker from "expo-image-picker";
import CreateProfilePicture from "@/components/myaccount/CreateProfilePicture";

export default function Index() {
    const [activeForm, setActiveForm] = useState("personal");
    const {colorScheme} = useColorScheme();
    const [show, setShow] = useState(false)
    const router = useRouter();

    {/* Form Fields */}
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        profilePicture: undefined as string | ImagePicker.ImagePickerResult | undefined,
        password: "",
        confirmPassword: "",
        professionalCarer: false,
        familyCarer: false,
        mentalHealthStruggles: false,
    });

    {/* Form Errors */}
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        password: "",
        confirmPassword: "",
    });

    const [tosAccepted, setTosAccepted] = useState(false);
    const [emailUpdates, setEmailUpdates] = useState(false);

    // Alert State
    const [alert, setAlert] = useState({
        message: "",
        type: "success" as "success" | "error",
        visible: false,
    });

    // Profile Picture Modal
    const [profilePictureVisible, setProfilePictureVisible] = useState(false);

    const onPicture = (picture: ImagePicker.ImagePickerResult | undefined) => {
        setProfilePictureVisible(false);
        if (picture) {
            setForm({...form, profilePicture: picture});
        }
    }


    /**
     * onChange
     * @desc This function is called when the date picker is changed
     */
    const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();
        setForm({...form, dob: currentDate.toDateString()});
        setShow(Platform.OS === "ios");
    }

    useEffect(() => {
        if (alert.visible) {
            setTimeout(() => {
                setAlert({...alert, visible: false});  // Hide the alert after 5 seconds
            }, 5000);
        }
    }, [alert.visible]);

    /**
     * validateForm
     * @desc This function validates the form fields and returns a boolean
     * @returns {Promise<boolean>} - True if the form is valid, false otherwise
     */
    const validateForm = async () : Promise<boolean> => {
        // Reset the errors
        setErrors({
            firstName: "",
            lastName: "",
            email: "",
            dob: "",
            password: "",
            confirmPassword: "",
        });

        let tempErrors = {
            firstName: "",
            lastName: "",
            email: "",
            dob: "",
            password: "",
            confirmPassword: "",
        }

        // Validate the first name
        if (form.firstName === "") {
            tempErrors = {...tempErrors, firstName: "First name is required"};
        }

        // Validate the last name
        if (form.lastName === "") {
            tempErrors = {...tempErrors, lastName: "Last name is required"};
        }

        // Validate the email for empty
        if (form.email === "") {
            tempErrors = {...tempErrors, email: "Email is required"};
        }
        // Validate the email for a valid email address
        if (!form.email.includes("@") || !form.email.includes(".")) {
            tempErrors = {...tempErrors, email: "Email is invalid"};
        }

        // Validate the date of birth (Before Today and at least 18 years old)
        if (form.dob === "") {
            tempErrors = {...tempErrors, dob: "Date of birth is required"};
        }
        const dob = new Date(form.dob);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18) {
            tempErrors = {...tempErrors, dob: "You must be at least 18 years old"};
        }

        // Validate the passwords
        if (form.password === "") {
            tempErrors = {...tempErrors, password: "Password is required"};
        }
        if (form.password.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$")) {
            tempErrors = {...tempErrors, password: "Password must be at least 8 characters long, contain a number, a special character, an uppercase and a lowercase letter"};
        }

        // Validate the confirm password
        if (form.confirmPassword === "") {
            tempErrors = {...tempErrors, confirmPassword: "Confirm Password is required"};
        }
        if (form.password !== form.confirmPassword) {
            tempErrors = {...tempErrors, confirmPassword: "Passwords do not match"};
        }

        // Validate the terms of service
        if (!tosAccepted) {
            setAlert({
                message: "You must accept the terms of service to continue",
                type: "error",
                visible: true,
            });
        }

        // Set the errors
        setErrors(tempErrors);

        // Check if the form is valid
        return Object.values(tempErrors).every((error) => error === "");
    }

    /**
     * submitForm
     * @desc This function submits the form to the server
     * @returns {Promise<void>}
     */
    const submitForm = async () : Promise<void> => {
        // Validate the form
        const isValid = await validateForm();
        if (!isValid) {
            return;
        }

        // Submit the form
        try {

        } catch (error) {
            // Show an error message
            setAlert({
                message: "An error occurred while creating your account",
                type: "error",
                visible: true,
            });
        }
    }

    return (
        <KeyboardAwareScrollView className={"flex-1 w-full dark:bg-neutral-800 bg-neutral-100"}>
            {/* Header */}
            <View className={"md:my-2 lg:my-3 xl:my-4"}>
                <Text
                    className={"dark:text-white font-bold text-center xs:text-base sm:text-xl md:text-2xl lg:text-4xl"}>Create
                    an account</Text>
                {activeForm === "personal" ?
                    <Text className={"dark:text-white text-center xs:text-xs sm:text-sm md:text-base lg:text-lg"}>Personal
                        Details</Text> : null}
                {activeForm === "occupation" ?
                    <Text className={"dark:text-white text-center xs:text-xs sm:text-sm md:text-base lg:text-lg"}>Occupation
                        Details</Text> : null}
                {activeForm === "password" ?
                    <Text className={"dark:text-white text-center xs:text-xs sm:text-sm md:text-base lg:text-lg"}>Setting
                        your password</Text> : null}
            </View>

            <Alert message={alert.message} type={alert.type} visible={alert.visible} onPress={
                () => {
                    setAlert({...alert, visible: false});
                }
            }/>

            {/* Progress Icons */}
            <View className={"md:my-2 lg:my-3 xl:my-4"}>
                <View className={"flex-row justify-evenly items-center"}>
                    <TouchableOpacity onPress={() => setActiveForm("personal")}
                                      className={"flex-1 justify-center items-center"}>
                        <FontAwesome name={"user-circle"} size={24}
                                     color={activeForm === "personal" ? "#3B82F6" : "#AAAAA5"}/>
                        <Text className={"dark:text-white mt-1"}>Personal</Text>
                    </TouchableOpacity>
                    <FontAwesome name={"chevron-right"} size={24} color={"#AAAAA5"}/>
                    <TouchableOpacity onPress={() => setActiveForm("occupation")}
                                      className={"flex-1 justify-center items-center"}>
                        <FontAwesome name={"check-circle"} size={24}
                                     color={activeForm === "occupation" ? "#3B82F6" : "#AAAAA5"}/>
                        <Text className={"dark:text-white mt-1"}>Occupation</Text>
                    </TouchableOpacity>
                    <FontAwesome name={"chevron-right"} size={24} color={"#AAAAA5"}/>
                    <TouchableOpacity onPress={() => setActiveForm("password")}
                                      className={"flex-1 justify-center items-center"}>
                        <FontAwesome name={"lock"} size={24} color={activeForm === "password" ? "#3B82F6" : "#AAAAA5"}/>
                        <Text className={"dark:text-white mt-1"}>Password</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {activeForm === "personal" && (
                <View className={"md:px-4 lg:px-6 xl:px-8"}>
                    {/* First and Last Name */}
                    <View className={"flex gap-4 flex-row justify-center items-center"}>
                        <View className={"flex-1"}>
                            <InputGroup label={"First name"} onChangeText={
                                (text: string) => {
                                    setForm({...form, firstName: text});
                                }
                            } placeholder={"John"} errorMessage={errors.firstName} error={errors.firstName !== ""}/>
                        </View>
                        <View className={"flex-1"}>
                            <InputGroup label={"Last name"} onChangeText={
                                (text: string) => {
                                    setForm({...form, lastName: text});
                                }
                            } placeholder={"Doe"} errorMessage={errors.lastName} error={errors.lastName !== ""}/>
                        </View>
                    </View>

                    {/* Email */}
                    <View>
                        <InputGroup label={"Email"} onChangeText={
                            (text: string) => {
                                setForm({...form, email: text});
                            }
                        } placeholder={"john.doe@example.com"} errorMessage={errors.email} error={errors.email !== ""}/>
                    </View>

                    {/* Date of Birth */}
                    <View className={"my-2"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                            Date of Birth
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setShow(!show);
                            }}
                            className={`flex-row items-center gap-2 justify-between rounded-lg p-4 border dark:text-white ${errors.dob ? "border-red-500" : "dark:border-gray-500 border-gray-400"} focus:border-blue-500 my-1`}>
                            <View className={"flex-row items-center gap-2"}>
                                <MaterialIcons name={"date-range"} size={20}
                                               color={colorScheme === "dark" ? colors.white : colors.black}/>
                                <Text className={"dark:text-white"}>
                                    {form.dob ? new Date(form.dob).toLocaleDateString() : "Select Date of Birth"}
                                </Text>
                            </View>
                            {Platform.OS === "ios" && (
                                <MaterialIcons name={show ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20}
                                               color={colorScheme === "dark" ? colors.white : colors.black}/>
                            )}
                        </TouchableOpacity>

                        {show && (
                            <View
                                className={`${Platform.OS === "ios" ? "w-full items-center border dark:border-gray-500 border-gray-400 rounded-lg" : ""}`}>
                                <RNDateTimePicker
                                    value={form.dob ? new Date(form.dob) : new Date()}
                                    mode={"date"}
                                    display={Platform.OS === "ios" ? "spinner" : "default"}
                                    maximumDate={new Date()}
                                    onChange={onChange}
                                    style={{width: "100%"}}
                                />
                            </View>)}
                    </View>

                    {/* Profile Picture */}
                    <View className={"my-2"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                            Profile Picture
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setProfilePictureVisible(true);
                            }}
                            className={"flex-row items-center gap-2 justify-between rounded-lg p-4 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 my-1"}>
                            <View className={"flex-row items-center gap-2"}>
                                <MaterialIcons name={"photo-camera"} size={20}
                                               color={colorScheme === "dark" ? colors.white : colors.black}/>
                                <Text className={"dark:text-white"}>
                                    {form.profilePicture ? "Picture Selected" : "Choose Picture"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Next Button */}
                    <View className={"my-2"}>
                        <TouchableOpacity onPress={() => setActiveForm("occupation")}
                                          className={"flex-row justify-center items-center bg-blue-500 p-4 rounded-lg"}>
                            <Text className={"text-white text-center font-semibold text-lg"}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {activeForm === "occupation" && (
                <View className={"md:px-4 lg:px-6 xl:px-8 pb-10"}>
                    <View
                        className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 my-2 rounded-lg flex-row items-center justify-between"}
                        style={{
                            shadowColor: colors.black,
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                            shadowRadius: 3.84,
                            elevation: 2
                        }}>
                        <View className={"flex-col"}>
                            <Text
                                className={"dark:text-white xs-text-base sm:text-base md:text-base lg:text-xl font-bold text-center"}>
                                Why do we ask these questions?
                            </Text>
                            <Text
                                className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2 text-center"}>
                                We only ask these questions to provide you with the best possible experience on our platform.
                            </Text>
                            <Text
                                className={"dark:text-neutral-200 text-neutral-900 font-semibold mt-1 xs:text-sm sm:text-sm md:text-sm lg:text-base text-center"}>
                                This is both optional and confidential.
                            </Text>
                        </View>
                    </View>


                    {/* Professional Carer */}
                    <View className={"my-2"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                            Are you a professional carer?
                        </Text>
                        <TouchableOpacity onPress={() => setForm({...form, professionalCarer: !form.professionalCarer})}
                                          className={`flex-row items-center gap-2 justify-between rounded-lg p-3 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 my-1`}>
                            <Text className={"dark:text-white"}>
                                {form.professionalCarer ? "Yes" : "No"}
                            </Text>
                            <MaterialIcons name={form.professionalCarer ? "check-box" : "check-box-outline-blank"} size={24}
                                           color={colorScheme === "dark" ? colors.white : colors.black}/>
                        </TouchableOpacity>
                    </View>

                    {/* Family Carer */}
                    <View className={"my-2"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                            Are you a family carer?
                        </Text>
                        <TouchableOpacity onPress={() => setForm({...form, familyCarer: !form.familyCarer})}
                                          className={`flex-row items-center gap-2 justify-between rounded-lg p-3 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 my-1`}>
                            <Text className={"dark:text-white"}>
                                {form.familyCarer ? "Yes" : "No"}
                            </Text>
                            <MaterialIcons name={form.familyCarer ? "check-box" : "check-box-outline-blank"} size={24}
                                           color={colorScheme === "dark" ? colors.white : colors.black}/>
                        </TouchableOpacity>
                    </View>

                    {/* Mental Health Struggles */}
                    <View className={"my-2"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                            Have you ever struggled with mental health?
                        </Text>

                        <TouchableOpacity
                            onPress={() => setForm({...form, mentalHealthStruggles: !form.mentalHealthStruggles})}
                            className={`flex-row items-center gap-2 justify-between rounded-lg p-3 border dark:border-gray-500 border-gray-400 dark:text-white focus:border-blue-500 my-1`}>
                            <Text className={"dark:text-white"}>
                                {form.mentalHealthStruggles ? "Yes" : "No"}
                            </Text>
                            <MaterialIcons name={form.mentalHealthStruggles ? "check-box" : "check-box-outline-blank"} size={24}
                                           color={colorScheme === "dark" ? colors.white : colors.black}/>
                        </TouchableOpacity>
                    </View>

                    {/* Next Button */}
                    <TouchableOpacity onPress={() => setActiveForm("password")}
                                        className={"flex-row justify-center items-center bg-blue-500 p-3 rounded-lg"}>
                            <Text className={"text-white text-center font-semibold text-lg"}>Next</Text>
                    </TouchableOpacity>
                </View>
            )}

            {activeForm === "password" && (
                <View className={"md:px-4 lg:px-6 xl:px-8"}>
                    {/* Password */}
                    <InputGroup label={"Password"} onChangeText={
                        (text: string) => {
                            setForm({...form, password: text});
                        }
                    } secureTextEntry={true} placeholder={"VerySecurePassword34563!"} errorMessage={errors.password} error={errors.password !== ""}/>

                    {/* Confirm Password */}
                    <InputGroup label={"Confirm Password"} onChangeText={
                        (text: string) => {
                            setForm({...form, confirmPassword: text});
                        }
                    } secureTextEntry={true} placeholder={"VerySecurePassword34563!"} errorMessage={errors.confirmPassword} error={errors.confirmPassword !== ""}/>

                    {/* Terms of Service */}
                    <View className={"flex-row items-center justify-start my-2"}>
                        <TouchableOpacity onPress={() => setTosAccepted(!tosAccepted)} className={"flex-row items-center gap-2"}>
                            <MaterialIcons name={tosAccepted ? "check-box" : "check-box-outline-blank"} size={24}
                                           color={colorScheme === "dark" ? colors.white : colors.black}/>
                            <Text className={"dark:text-white"}>
                                I accept the <Text onPress={() => {
                                // Navigate to the terms of service page
                            }} className={"text-blue-500 underline"}>Terms of Service</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Email Updates */}
                    <View className={"flex-row items-center justify-start my-2"}>
                        <TouchableOpacity onPress={() => setEmailUpdates(!emailUpdates)} className={"flex-row items-center gap-2"}>
                            <MaterialIcons name={emailUpdates ? "check-box" : "check-box-outline-blank"} size={24}
                                           color={colorScheme === "dark" ? colors.white : colors.black}/>
                            <Text className={"dark:text-white"}>
                                I would like to receive email updates
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Submit Button */}
                    <View className={"my-2"}>
                        <TouchableOpacity onPress={() => {
                            // Validate the form
                            submitForm();
                        }} className={"flex-row justify-center items-center bg-blue-500 p-3 rounded-lg"}>
                            <Text className={"text-white text-center font-semibold text-lg"}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <CreateProfilePicture visible={profilePictureVisible} onClose={() => {
                setProfilePictureVisible(false);
            }} onPicture={(image) => {onPicture(image)}} onErrors={() => {}}/>
        </KeyboardAwareScrollView>
    );
}