import {ActivityIndicator, Image, Platform, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {usePatients} from "@/hooks/patients/usePatients";
import InputGroup, { InputGroupRef } from "@/components/forms/InputGroup";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Dropdown} from "@/components/forms/Dropdown";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Alert} from "@/components/Alert";
import {useRouter} from "expo-router";
import CreateProfilePicture from "@/components/myaccount/CreateProfilePicture";
import * as ImagePicker from "expo-image-picker";

const NewMember = () => {
    const colorScheme = useColorScheme();

    const { createPatient, loading } = usePatients();
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const onPicture = (picture: ImagePicker.ImagePickerResult | undefined) => {
        setModalVisible(false);
        if (picture) {
            console.log(picture);
            setForm({...form, profile_picture: picture});
        }
    }


    const [form, setForm] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        dob: new Date().toDateString(),
        relationship: "",
        care_notes: "",
        profile_picture: null as any,
        gender: ""
    })
    const [errors, setErrors] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        dob: "",
        relationship: "",
        care_notes: "",
        gender: ""
    });
    const [show, setShow] = useState(false);

    const firstNameRef = useRef<InputGroupRef>(null);
    const lastNameRef = useRef<InputGroupRef>(null);
    const dobRef = useRef<InputGroupRef>(null);
    const relationshipRef = useRef<InputGroupRef>(null);

    // Alert State
    const [alert, setAlert] = useState({
        message: "",
        type: "success" as "success" | "error",
        visible: false,
    });

    const GENDER_CHOICES = [
        {value: 'Male', display: "Male"},
        {value: 'Female', display: "Female"},
        {value: 'Other', display: "Other"}
    ]

    // Date changing logic
    const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();
        setForm({...form, dob: currentDate.toDateString()});
        setShow(Platform.OS === "ios");
    }

    const submitForm = async () => {
        // Validate the form
        let errors = {
            first_name: "",
            middle_name: "",
            last_name: "",
            dob: "",
            relationship: "",
            care_notes: "",
            gender: ""
        }

        if (form.first_name === "") {
            errors.first_name = "First name is required!";
            firstNameRef.current?.shake();
        }
        if (form.last_name === "") {
            errors.last_name = "Last name is required!";
            lastNameRef.current?.shake();
        }
        if (form.dob === "") {
            errors.dob = "Date of birth is required!";
            dobRef.current?.shake();
        }
        if (form.relationship === "") {
            errors.relationship = "Relationship is required!";
            relationshipRef.current?.shake();
        }
        if (form.gender === "") {
            errors.gender = "Gender is required!";
        }
        setErrors(errors);

        if (errors.first_name !== "" || errors.last_name !== "" || errors.dob !== "" || errors.relationship !== "" || errors.gender !== "") {
            setAlert({message: "Please fill in all required fields!", type: "error", visible: true});
            return;
        }

        // Format the date yyyy-mm-dd (2021-12-31)
        const date = new Date(form.dob);
        let formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        // if the month is one digit, add a 0 before it
        if (date.getMonth() + 1 < 10) {
            formattedDate = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
        }

        // Submit the form
        console.log("Submitting form...");

        // Build the data
        const data = {
            first_name: form.first_name,
            middle_name: form.middle_name,
            last_name: form.last_name,
            date_of_birth: formattedDate,
            relationship: form.relationship,
            care_notes: form.care_notes,
            gender: form.gender,
        }

        createPatient(data, form.profile_picture).then((response) => {
            if (response) {
                setAlert({message: "Family member added successfully!", type: "success", visible: true});
                setForm({
                    first_name: "",
                    middle_name: "",
                    last_name: "",
                    dob: new Date().toDateString(),
                    gender: "",
                    relationship: "",
                    profile_picture: null,
                    care_notes: "",
                });

                // Direct to the family members page
                router.push("/(app)/(myaccount)/family");
            }
        }).catch((error) => {
            console.log(error);
            setAlert({message: "An error occurred while adding family member!", type: "error", visible: true});
        });
    }

    useEffect(() => {
        if (alert.visible) {
            setTimeout(() => {
                setAlert({...alert, visible: false});
            }, 5000);
        }
    }, [alert.visible]);

    return (
        <KeyboardAwareScrollView className={"flex-1 bg-neutral-100 dark:bg-neutral-800 w-full sm:px-2 md:px-4 lg:px-6 py-2"}>
            <Alert message={alert.message} type={alert.type} visible={alert.visible} onPress={() => setAlert({...alert, visible: !alert.visible})} />
            {/* Profile Edit Quick Action */}
            <View className={"flex-col items-center justify-between xs:mt-2 sm:mt-3 md:mt-3 lg:mt-3 xl:mt-3"}>
                {/* @ts-ignore */}
                {form.profile_picture ?
                    <Image source={{uri: form.profile_picture.uri}} className={"rounded-full xs:w-16 sm:w-24 md:w-32 lg:w-40 xl:w-40 xs:h-16 sm:h-24 md:h-32 lg:h-40 xl:h-40 "}/>
                    :
                    <Image source={require("@/assets/images/undraw_pic-profile_nr49.png")} className={"rounded-full xs:w-16 sm:w-24 md:w-32 lg:w-40 xl:w-40 xs:h-16 sm:h-24 md:h-32 lg:h-40 xl:h-40 "}/>
                }
                <View className={"items-center"}>
                    <TouchableOpacity>
                        <Text className={"dark:text-white xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-blue-500 underline underline-offset-1"} onPress={() => {setModalVisible(true)}}>
                            Select a Profile Picture
                        </Text>
                    </TouchableOpacity>
                    <View className={"flex-col items-center mt-2"}>
                        <Text className={"dark:text-white xs:text-base sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-bold"}>
                            Add a Family Member
                        </Text>
                    </View>
                </View>
            </View>

            {/* Family Member Details */}
            <View className={"flex-row items-center mt-4 gap-2 justify-center"}>
                <InputGroup label={"First Name*"} size={"1/2"} onChangeText={(text) => {
                    setForm({...form, first_name: text});
                }} value={form.first_name} placeholder={"John"} ref={firstNameRef} errorMessage={errors.first_name} error={false}/>

                <InputGroup label={"Last Name*"} size={"1/2"} onChangeText={(text) => {
                    setForm({...form, last_name: text});
                }} value={form.last_name} ref={lastNameRef} placeholder={"Doe"} errorMessage={errors.last_name} error={false}/>
            </View>

            {/* Relationship */}
            <View className={"flex-row items-center mt-4 gap-2 justify-center"}>
                <InputGroup label={"Middle Name"} size={"1/2"} onChangeText={(text) => {
                    setForm({...form, middle_name: text});
                }} value={form.middle_name} placeholder={"Frank"} errorMessage={errors.middle_name} error={false}/>

                <InputGroup label={"Relationship*"} size={"1/2"} onChangeText={(text) => {
                    setForm({...form, relationship: text});
                }} value={form.relationship} placeholder={"Mother, father..."} ref={relationshipRef} errorMessage={""} error={false}/>
            </View>

            <View className={"mt-4 gap-2 justify-center"}>
                <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                    Date of Birth*
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        setShow(!show);
                    }}
                    className={`flex-row items-center gap-2 justify-between rounded-lg p-4 border dark:text-white ${errors.dob ? "border-red-500" : "dark:border-gray-500 border-gray-400"} focus:border-blue-500`}>
                    <View className={"flex-row items-center gap-2"}>
                        <MaterialIcons name={"date-range"} size={20} color={colorScheme === "dark" ? colors.white : colors.black}/>
                        <Text className={"dark:text-white"}>
                            {form.dob}
                        </Text>
                    </View>
                    {Platform.OS === "ios" && (
                        <MaterialIcons name={show ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color={colorScheme === "dark" ? colors.white : colors.black}/>
                    )}
                </TouchableOpacity>

                {show && (
                    <View className={`${Platform.OS === "ios" ? "w-full items-center border dark:border-gray-500 border-gray-400 rounded-lg" : ""}`}>
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

            {errors.dob !== "" && (
                <Text className={"text-red-500"}>
                    Please select a date that is not in the future (today or before).
                </Text>
            )}

            {/* Gender */}
            <View className={"mt-4 gap-2 justify-center"}>
                <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                    Gender*
                </Text>
                <Dropdown options={GENDER_CHOICES} onSelect={(value) => {setForm({...form, gender: value})}}/>
            </View>

            <View className={"mt-4 gap-2 justify-center"}>
                <InputGroup label={"Care Notes"} placeholder={"It can help to add medication times, appointments, etc."} multiline={true} onChangeText={(text) => {setForm({...form, care_notes: text})}} value={form.care_notes} errorMessage={""} error={false}/>
            </View>


            {/* Edit/Save and Cancel Button */}
            {loading ?
                <ActivityIndicator size={"large"} color={"blue"}/>
                :
                <View className={"flex-row gap-2 pb-10"}>
                    <TouchableOpacity
                        onPress={() => {
                            submitForm();
                        }}
                        className={`bg-blue-500 rounded-lg p-4 w-full`}>
                        <Text className={"text-white text-center"}>
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            }

            <CreateProfilePicture visible={modalVisible} onClose={() => setModalVisible(!modalVisible)} onErrors={() => {}} onPicture={(result) => onPicture(result)}/>
        </KeyboardAwareScrollView>
    )
}

export default NewMember;
