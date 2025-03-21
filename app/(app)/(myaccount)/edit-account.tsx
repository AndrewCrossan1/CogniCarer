import {ActivityIndicator, Image, Platform, Text, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import {useAppSelector} from "@/hooks/store/hooks";
import {useRouter} from "expo-router";
import {useColorScheme} from "nativewind";
import InputGroup, {InputGroupRef} from "@/components/forms/InputGroup";
import React, {useEffect, useRef, useState} from "react";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Alert} from "@/components/Alert";
import {useAuth} from "@/context/AuthContext";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import NewProfilePicture from "@/components/myaccount/NewProfilePicture";

const editAccount = () => {

    const user = useAppSelector(state => state.user.user);
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { update, loading } = useAuth();

    // Error Handling
    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        email: "",
    });
    const [show, setShow] = useState(false)

    // Form State
    const [form, setForm] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        date_of_birth: user?.date_of_birth,
        email: user?.email || "",
    });

    // Refs for input fields
    const firstNameRef = useRef<InputGroupRef>(null);
    const lastNameRef = useRef<InputGroupRef>(null);
    const emailRef = useRef<InputGroupRef>(null);

    // Enabling State
    const [enableEdit, setEnableEdit] = useState(false);

    // Date changing logic
    const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();

        // Build a new date string (MM-DD-YYYY)
        let date: any = currentDate.getDate();
        let month: any = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        if (date < 10) {
            date = "0" + date;
        }
        if (month < 10) {
            month = "0" + month;
        }

        date = year + "-" + month + "-" + date;

        setForm({...form, date_of_birth: date});
        setShow(Platform.OS === "ios");
    }

    // Alert State
    const [alert, setAlert] = useState({
        message: "",
        type: "success" as "success" | "error",
        visible: false,
    });

    useEffect(() => {
        if (alert.visible) {
            setTimeout(() => {
                setAlert({...alert, visible: false});
            }, 5000);
        }
    }, [alert.visible]);

    // New Profile Picture
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    const onNewProfilePictureSubmit = () => {
        setAlert({
            message: "Profile picture updated successfully.",
            type: "success",
            visible: true,
        });
        setProfileModalVisible(false);
    }

    const onErrors = (error: string) => {
        setAlert({
            message: error,
            type: "error",
            visible: true,
        });
        setProfileModalVisible(false);
    }

    // Form Validation
    const validateForm = () => {
        let errors = {
            first_name: "",
            last_name: "",
            date_of_birth: "",
            email: "",
        };

        if (form.first_name === "") {
            errors.first_name = "First name is required.";
            firstNameRef.current?.shake();
        }

        if (form.last_name === "") {
            errors.last_name = "Last name is required.";
            lastNameRef.current?.shake();
        }

        if (form.email === "") {
            errors.email = "Email is required.";
            emailRef.current?.shake();
        }

        if (form.date_of_birth === "") {
            errors.date_of_birth = "Date of birth is required.";
        }

        setErrors(errors);
        return Object.values(errors).every((value) => value === "");
    }

    const submit = (): void => {
        setErrors({
            first_name: "",
            last_name: "",
            date_of_birth: "",
            email: "",
        });

        if (validateForm()) {
            // Save the form
            console.debug("[EditAccount] Saving form: ", form);
        }

        // @ts-ignore - we ensured that date_of_birth is not empty in validateForm
        update(form.email, form.first_name, form.date_of_birth, form.last_name).then(
            () => {
                setAlert({
                    message: "Account updated successfully.",
                    type: "success",
                    visible: true,
                });
            }
        ).catch(
            () => {
                setAlert({
                    message: "An error occurred while updating your account. Please try again.",
                    type: "error",
                    visible: true,
                });
            }
        )
        // Update the user in the store
        // Set editing to false
        setEnableEdit(false);
    }

    return (
        <KeyboardAwareScrollView className={"dark:bg-neutral-800 bg-neutral-100 flex-1 sm:px-2 md:px-4 lg:px-6 "}>
            <Alert message={alert.message} type={alert.type} visible={alert.visible} onPress={() => setAlert({...alert, visible: !alert.visible})} />
            <View className={"pb-10"}>
                {/* Profile Edit Quick Action */}
                <View className={"flex-col items-center justify-center xs:mt-2 sm:mt-3 md:mt-3 lg:mt-3 xl:mt-3"}>
                    {/* @ts-ignore */}
                    {user?.profile_image && (
                        <Image source={{uri: user.profile_image}} className={"rounded-full xs:w-16 sm:w-24 md:w-32 lg:w-40 xl:w-40 xs:h-16 sm:h-24 md:h-32 lg:h-40 xl:h-40 "}/>
                    )}
                    <View className={"items-center"}>
                        <TouchableOpacity>
                            <Text className={"dark:text-white xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-blue-500 underline underline-offset-1"} onPress={() => {setProfileModalVisible(true)}}>
                                Change Picture
                            </Text>
                        </TouchableOpacity>
                        <View className={"flex-col items-center mt-2"}>
                            <Text className={"dark:text-white xs:text-base sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-bold"}>
                                {user?.first_name} {user?.last_name}
                            </Text>
                            <Text className={"dark:text-white xs:text-xs sm:text-xs md:text-sm lg:text-base xl:text-base"}>
                                {user?.email}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Edit Account Form */}
                <InputGroup label={"First Name"} onChangeText={(text) => {
                    setForm({...form, first_name: text});
                }} value={form.first_name} ref={firstNameRef} textContentType={"givenName"} autoComplete={"given-name"} editable={enableEdit} errorMessage={errors.first_name} error={errors.first_name !== ""}/>

                <InputGroup label={"Last Name"} onChangeText={(text) => {
                    setForm({...form, last_name: text});
                }} value={form.last_name} ref={lastNameRef} textContentType={"familyName"} autoComplete={"family-name"} editable={enableEdit} errorMessage={errors.last_name} error={errors.last_name !== ""}/>

                <View className={"w-full my-2"}>
                    <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                        Date of Birth
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (!enableEdit) return;
                            setShow(!show);
                        }}
                        className={`flex-row items-center gap-2 justify-between rounded-lg p-4 border dark:text-white ${errors.date_of_birth ? "border-red-500" : "dark:border-gray-500 border-gray-400"} focus:border-blue-500 my-1`}>
                        <View className={"flex-row items-center gap-2"}>
                            <MaterialIcons name={"date-range"} size={20} color={colorScheme === "dark" ? colors.white : colors.black}/>
                            <Text className={"dark:text-white"}>
                                {form.date_of_birth}
                            </Text>
                        </View>
                        {Platform.OS === "ios" && (
                            <MaterialIcons name={show ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color={colorScheme === "dark" ? colors.white : colors.black}/>
                        )}
                    </TouchableOpacity>

                    {show && (
                        <View className={`${Platform.OS === "ios" ? "w-full items-center border dark:border-gray-500 border-gray-400 rounded-lg" : ""}`}>

                            <RNDateTimePicker
                                value={form.date_of_birth ? new Date(form.date_of_birth) : new Date()}
                                mode={"date"}
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                maximumDate={new Date()}
                                disabled={!enableEdit}
                                onChange={onChange}
                                style={{width: "100%"}}
                            />
                        </View>)}
                </View>

                {errors.date_of_birth !== "" && (
                    <Text className={"text-red-500"}>
                        Please select a date that is not in the future (today or before).
                    </Text>
                )}

                <InputGroup label={"Email"} onChangeText={(text) => {
                    setForm({...form, email: text});
                }} value={form.email} ref={emailRef} textContentType={"emailAddress"} keyboardType={"email-address"} autoComplete={"email"} editable={enableEdit} errorMessage={errors.email} error={errors.email !== ""}/>
                <Text className={"text-neutral-500 text-sm"}>
                    Changing this to an email you do not have access to will lock you out of your account.
                </Text>
            </View>

            {/* Edit/Save and Cancel Button */}
            {loading ? (
                <ActivityIndicator size={"large"} color={colorScheme === "dark" ? colors.white : colors.black}/>
            ) :

            <View className={"flex-row gap-2 pb-10"}>
                <TouchableOpacity
                    onPress={() => {
                        setEnableEdit(!enableEdit);
                        if (enableEdit) {
                            // Save the form
                            submit();
                        }
                    }}
                    className={`bg-blue-500 rounded-lg p-4 ${enableEdit ? "w-1/2" : "w-full"}`}>
                    <Text className={"text-white text-center"}>
                        {enableEdit ? "Save" : "Edit"}
                    </Text>
                </TouchableOpacity>
                {enableEdit && (
                <TouchableOpacity
                    onPress={() => {
                        router.push("/(app)/(myaccount)");
                    }}
                    className={"bg-red-500 rounded-lg p-4 w-1/2"}>
                    <Text className={"text-white text-center"}>
                        Cancel
                    </Text>
                </TouchableOpacity>
                )}
            </View>
            }
            <View className={"w-full"}>
                <NewProfilePicture visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} onSubmitted={onNewProfilePictureSubmit} form={form} onErrors={onErrors}/>
            </View>
        </KeyboardAwareScrollView>
    );
}

export default editAccount;