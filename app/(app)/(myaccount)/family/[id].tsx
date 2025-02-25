import {ActivityIndicator, Image, Platform, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {usePatients} from "@/hooks/patients/usePatients";
import {Patient} from "@/services/api/types";
import InputGroup, { InputGroupRef } from "@/components/forms/InputGroup";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Dropdown} from "@/components/forms/Dropdown";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useLocalSearchParams} from "expo-router";
import {Alert} from "@/components/Alert";
import {useAppSelector} from "@/hooks/store/hooks";
import ConfRemoveFam from "@/components/myaccount/ConfRemoveFam";

const familyMember = () => {
    const { id } = useLocalSearchParams();

    const colorScheme = useColorScheme();
    const { getPatient, loading, updatePatient } = usePatients();
    const user = useAppSelector(state => state.user.user);
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
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

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

    const getFamilyMember = async () => {
        console.debug(`Fetching family member with UUID: ${id}`);

        if (!id) {
            setError({error: false, message: "No UUID provided!"});
            return;
        }

        // Fetch family member with UUID: id
        // @ts-ignore
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

    useEffect(() => {
        getFamilyMember().then(() => {console.log("Family member fetched!")}).catch(console.error);
    }, [id]);

    const submitForm = async () => {
        // Validate the form
        let errors = {
            first_name: "",
            last_name: "",
            dob: "",
            relationship: "",
            care_notes: "",
            gender: ""
        }

        if (form.first_name === "") {
            errors.first_name = "First name is required!";
            firstNameRef.current?.shake();
            // Change the border color to red
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

        // Submit the form
        console.log("Submitting form...");

        let formattedDate = new Date(form.dob);  // YYYY-MM-DD
        let day = formattedDate.getDate();
        let month: any = formattedDate.getMonth() + 1;
        let year = formattedDate.getFullYear();

        // If month is less than 10, add a 0 before it
        if (month < 10) {
            month = `0${month}`;
        }

        let formattedDOB = `${year}-${month}-${day}`;

        // Build the data object
        const data: Patient = {
            uuid: familyMember.uuid,
            first_name: form.first_name,
            middle_name: familyMember.middle_name,
            age: familyMember.age,
            last_name: form.last_name,
            date_of_birth: formattedDOB,
            relationship: form.relationship,
            care_notes: form.care_notes,
            gender: form.gender,
            created_at: familyMember.created_at,
        }

        // Update the family member
        updatePatient(familyMember.uuid, data).then((success) => {
            if (success) {
                console.log("Family member updated successfully!");
                setAlert({message: "Family member updated successfully!", type: "success", visible: true});
                getFamilyMember().then(() => {console.log("Family member fetched!")}).catch(console.error);
            } else {
                console.error("An error occurred while updating the family member!");
                setAlert({message: "An error occurred while updating the family member!", type: "error", visible: true});
            }
        }).catch(console.error);
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
                {familyMember.profile_picture ?
                    <Image
                        source={{uri: familyMember.profile_picture}}
                        className={"rounded-full xs:w-16 sm:w-24 md:w-32 lg:w-40 xl:w-40 xs:h-16 sm:h-24 md:h-32 lg:h-40 xl:h-40 "}
                    />
                    :
                    <Image
                        source={require("@/assets/images/undraw_pic-profile_nr49.png")}
                        className={"rounded-full xs:w-16 sm:w-24 md:w-32 lg:w-40 xl:w-40 xs:h-16 sm:h-24 md:h-32 lg:h-40 xl:h-40 "}
                    />
                }
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
                            Relation: {familyMember?.relationship} | Age: {familyMember?.age} years | Gender: {familyMember?.gender}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Family Member Details */}
            <View className={"flex-row items-center mt-4 gap-2 justify-center"}>
                <InputGroup label={"First Name"} size={"1/2"} onChangeText={(text) => {
                    setForm({...form, first_name: text});
                }} value={form.first_name} editable={enableEdit} ref={firstNameRef} errorMessage={errors.first_name} error={false}/>

                <InputGroup label={"Last Name"} size={"1/2"} onChangeText={(text) => {
                    setForm({...form, last_name: text});
                }} value={form.last_name} editable={enableEdit} ref={lastNameRef} errorMessage={errors.last_name} error={false}/>
            </View>

            <View className={"mt-4 gap-2 justify-center"}>
                <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                    Date of Birth
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        if (!enableEdit) return;
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
                            disabled={!enableEdit}
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
            <View className={"flex-row items-center mt-4 gap-2 justify-center"}>
                <InputGroup label={"Relationship"} onChangeText={(text) => {
                    setForm({...form, relationship: text});
                }} value={form.relationship} editable={enableEdit} ref={relationshipRef} errorMessage={""} error={false}/>
            </View>

            {/* Gender */}
            <View className={"mt-4 gap-2 justify-center"}>
                <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>
                    Gender
                </Text>
                <Dropdown options={GENDER_CHOICES} onSelect={(value) => {setForm({...form, gender: value})}}/>
            </View>

            <View className={"mt-4 gap-2 justify-center"}>
                <InputGroup label={"Care Notes"} placeholder={"It can help to add medication times, appointments, etc."} editable={enableEdit} multiline={true} onChangeText={(text) => {setForm({...form, care_notes: text})}} value={form.care_notes} errorMessage={""} error={false}/>
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
                                submitForm()
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
                                // Set the form back to the original values
                                setForm({
                                    first_name: familyMember.first_name,
                                    last_name: familyMember.last_name,
                                    dob: familyMember.date_of_birth,
                                    gender: familyMember.gender,
                                    relationship: familyMember.relationship,
                                    care_notes: familyMember.care_notes,
                                });
                                setEnableEdit(false);
                            }}
                            className={"bg-red-500 rounded-lg p-4 w-1/2"}>
                            <Text className={"text-white text-center"}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            }

            <TouchableOpacity onPress={() => {setConfirmDeleteVisible(!confirmDeleteVisible)}}>
                <Text className={"text-red-500 text-center pb-10 underline underline-offset-8"}>
                    Remove this family member
                </Text>
            </TouchableOpacity>

            <ConfRemoveFam visible={confirmDeleteVisible} onClose={() => {setConfirmDeleteVisible(false)}} familyMember={familyMember}/>
        </KeyboardAwareScrollView>
    )
}

export default familyMember;
