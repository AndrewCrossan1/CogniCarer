import {Image, Platform, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import {useSearchParams} from "expo-router/build/hooks";
import React, {useEffect, useState} from "react";
import {usePatients} from "@/hooks/patients/usePatients";
import {Patient} from "@/services/api/types";
import InputGroup from "@/components/forms/InputGroup";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Dropdown} from "@/components/forms/Dropdown";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const familyMember = () => {
    const params = useSearchParams();
    const colorScheme = useColorScheme();
    const id = params.get("id");
    const { getPatient, loading } = usePatients();
    const [error, setError] = useState({
        error: false,
        message: ""
    });
    const [familyMember, setFamilyMember] = useState<Patient>({} as Patient);
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        relationship: "",
        care_notes: "",
        gender: ""
    })
    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        relationship: "",
        care_notes: "",
        gender: ""
    });
    const [show, setShow] = useState(false);
    const [enableEdit, setEnableEdit] = useState(false);

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

    useEffect(() => {
        const getFamilyMember = async () => {
            console.debug(`Fetching family member with UUID: ${id}`);

            if (!id) {
                setError({error: false, message: "No UUID provided!"});
                return;
            }

            // Fetch family member with UUID: id
            const familyMember = await getPatient(id);

            if (familyMember) {
                setFamilyMember(familyMember);
                setForm({
                    first_name: familyMember.first_name,
                    last_name: familyMember.last_name,
                    dob: familyMember.date_of_birth,
                    relationship: familyMember.relationship,
                    care_notes: familyMember.care_notes,
                    gender: familyMember.gender
                });
            }
        }

        getFamilyMember().then(() => {console.log("Family member fetched!")}).catch(console.error);
    }, []);

    return (
        <KeyboardAwareScrollView className={"flex bg-neutral-100 dark:bg-neutral-800"}>
            {/* Profile Edit Quick Action */}
            <View className={"flex-col items-center justify-between xs:mt-2 sm:mt-3 md:mt-3 lg:mt-3 xl:mt-3"}>
                {/* @ts-ignore */}
                <Image source={{uri: familyMember.profile_picture}} className={"rounded-full xs:w-16 sm:w-24 md:w-32 lg:w-40 xl:w-40 xs:h-16 sm:h-24 md:h-32 lg:h-40 xl:h-40 "}/>
                <View className={"items-center"}>
                    <TouchableOpacity>
                        <Text className={"dark:text-white xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base text-blue-500 underline underline-offset-1"} onPress={() => {}}>
                            Change Picture
                        </Text>
                    </TouchableOpacity>
                    <View className={"flex-col items-center mt-2"}>
                        <Text className={"dark:text-white xs:text-base sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-bold"}>
                            {familyMember?.first_name} {familyMember?.last_name}
                        </Text>
                        <Text className={"dark:text-white xs:text-xs sm:text-xs md:text-sm lg:text-base xl:text-base"}>
                            {familyMember?.relationship}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Family Member Details */}
            <View className={"flex-row items-center mt-4 gap-2 justify-center sm:px-2 md:px-4 lg:px-6"}>
                <InputGroup label={"First Name"} size={"1/2"} onChangeText={(text) => {
                    setForm({...form, first_name: text});
                }} value={form.first_name} errorMessage={errors.first_name} error={errors.first_name !== ""}/>

                <InputGroup label={"Last Name"} size={"1/2"} onChangeText={(text) => {
                    setForm({...form, last_name: text});
                }} value={form.last_name} errorMessage={errors.last_name} error={errors.last_name !== ""}/>
            </View>

            <View className={"mt-4 gap-2 justify-center sm:px-2 md:px-4 lg:px-6"}>
                <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                    Date of Birth
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

            {/* Relationship */}
            <View className={"flex-row items-center mt-4 gap-2 justify-center sm:px-2 md:px-4 lg:px-6"}>
                <InputGroup label={"Relationship"} onChangeText={(text) => {
                    setForm({...form, relationship: text});
                }} value={form.relationship} errorMessage={errors.relationship} error={errors.relationship !== ""}/>
            </View>

            {/* Gender */}
            <View className={"mt-4 gap-2 justify-center sm:px-2 md:px-4 lg:px-6"}>
                <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                    Gender
                </Text>
                <Dropdown options={GENDER_CHOICES} onSelect={(value) => {setForm({...form, gender: value})}}/>
            </View>

            <View className={"mt-4 gap-2 justify-center sm:px-2 md:px-4 lg:px-6"}>
                <InputGroup label={"Care Notes"} multiline={true} onChangeText={(text) => {setForm({...form, care_notes: text})}} value={form.care_notes} errorMessage={""} error={false}/>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default familyMember;
