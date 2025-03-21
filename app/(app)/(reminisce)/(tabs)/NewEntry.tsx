import {
    View,
    Text,
    Image,
    Modal,
    TouchableWithoutFeedback,
    StyleSheet,
    Keyboard,
    TouchableOpacity, Platform, SafeAreaView
} from 'react-native';
import {useEffect, useState} from 'react';
import {useColorScheme} from 'nativewind';
import {Patient, Picture} from '@/services/api/types';
import {Alert} from "@/components/Alert";
import {useReminisce} from "@/hooks/useReminisce";
import {usePatients} from "@/hooks/patients/usePatients";
import {Dropdown} from "@/components/forms/Dropdown";
import {BlurView} from "expo-blur";
import * as Haptics from "expo-haptics";
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from "react-native-reanimated";
import InputGroup from "@/components/forms/InputGroup";
import {MaterialIcons} from "@expo/vector-icons";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {useRouter} from "expo-router";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "tailwindcss/colors";

const NewEntry = () => {

    const {getPictures, newEntry} = useReminisce();
    const {getPatients} = usePatients();
    const { colorScheme } = useColorScheme();
    const image = require('@/assets/images/undraw_dreamer_gb41.png');
    const loading = require('@/assets/images/loading.gif');
    const router = useRouter();

    const [pictures, setPictures] = useState<Picture[] | null>([] as Picture[]);
    const [patients, setPatients] = useState<Patient[] | null>([] as Patient[]);
    const [pictureOptions, setPictureOptions] = useState([] as { value: string, display: string }[]);
    const [patientOptions, setPatientOptions] = useState([] as { value: string, display: string }[]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedPicture, setSelectedPicture] = useState<Picture | null>(null);
    const [fullImageVisible, setFullImageVisible] = useState(false);
    const [tipsVisible, setTipsVisible] = useState(false);
    const [notes, setNotes] = useState("");

    // Alert Configurations
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<"error" | "success">("success");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        if (alertVisible) {
            setTimeout(() => {
                setAlertVisible(false);
            }, 3000);
        }
    }, [alertVisible]);

    // Date Picker Configurations
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setShow(Platform.OS === "ios");
    }

    // Error Configurations
    const [notesError, setNotesError] = useState(false);
    const [dateError, setDateError] = useState(false);

    // Shared value for the long press animation
    const scale = useSharedValue(1);
    const shadow = useSharedValue(0);
    const shadowOpacity = useSharedValue(0);
    const shadowRadius = useSharedValue(0);

    // Fetch pictures and patients on component mount
    useEffect(() => {
        const fetchPictures = async () => {
            const fetchedPictures = await getPictures();
            if (fetchedPictures) {
                setPictures(fetchedPictures);
            }
        }
        const fetchPatients = async () => {
            const fetchedPatients = await getPatients();
            if (fetchedPatients) {
                setPatients(fetchedPatients);
                setPatientOptions(fetchedPatients.map(patient => ({
                    value: patient.uuid,
                    display: patient.first_name + " " + patient.last_name
                })));
            }
        }
        fetchPatients();
        fetchPictures();
    }, []);

    useEffect(() => {
        if (pictures && patients) {
            const filteredPictures = pictures.filter(picture => picture.patient === selectedPatient?.uuid);
            const options = filteredPictures.map(picture => ({value: picture.uuid, display: picture.title}));
            setPictureOptions(options);
        }
    }, [selectedPatient]);

    const handleLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setFullImageVisible(true);
    }

    const handlePressIn = () => {
        scale.value = withTiming(1.04, {duration: 400});
        shadow.value = withTiming(3, {duration: 400});
        shadowOpacity.value = withTiming(0.1, {duration: 400});
        shadowRadius.value = withTiming(3, {duration: 400});
    }

    const handlePressOut = () => {
        scale.value = withTiming(1, {duration: 300});
        shadow.value = withTiming(0, {duration: 300});
        shadowOpacity.value = withTiming(0, {duration: 300});
        shadowRadius.value = withTiming(0, {duration: 300});
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
            shadowOpacity: shadowOpacity.value,
            shadowRadius: shadowRadius.value,
            shadowOffset: {
                width: shadow.value,
                height: shadow.value
            },
            shadowColor: "#000",
            borderRadius: 10
        }
    });

    /**
     * Submit the entry to the server
     * @desc This function validates input from the entry form and submits it to the server.
     * @returns {Promise<void>}
     */
    const submit = async (): Promise<void> => {
        if (!selectedPicture || !selectedPatient) {
            setAlertType("error");
            setAlertMessage("Please select a patient and an image to continue.");
            setAlertVisible(true);
            return;
        }

        // Date is not required, but if it is set, it should not be in the future
        if (date > new Date()) {
            setDateError(true);
            setAlertType("error");
            setAlertMessage("Please select a date that is not in the future.");
            setAlertVisible(true);
            return;
        }

        // Format the date (2025-01-31)
        const formattedDate = date.toISOString().split("T")[0];

        // Submit the entry to the server
        newEntry({
            patient: selectedPatient.uuid,
            picture: selectedPicture.uuid,
            notes: notes,
            date_taken: formattedDate
        });

        setSelectedPatient(null);
        setSelectedPicture(null);
        // Redirect to the entries page
        router.push("/(app)/(reminisce)/(tabs)/Entries");
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={{alignItems: "center"}} className={"flex dark:bg-neutral-800"}>
            <View className={"w-full p-6"}>
                <Alert type={alertType} message={alertMessage} onPress={() => setAlertVisible(false)} visible={alertVisible}/>
                <View className={"flex flex-row items-center gap-4"} style={{
                    shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}
                >
                    <Image source={image} className={"rounded-lg flex"} resizeMode={"cover"} style={{width: 100, height: 100}}/>
                    <View className={"p-2 flex-1"}>
                        <Text className={"dark:text-white md:text-xl lg:text-2xl font-bold text-black"}>
                            Create a new entry
                        </Text>
                        <Text className={"mt-2 text-neutral-600 dark:text-neutral-300 md:text-sm lg:text-base"}>
                            Pick an image and reminisce on the event!
                        </Text>
                    </View>
                </View>
                <View className={"flex flex-row justify-between gap-2"}>
                    <TouchableOpacity
                        onPress={() => {
                            // Submit the entry
                            submit();
                        }}
                        className={`flex-1 flex-row items-center mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900`}>
                        <MaterialIcons name={"download-done"} size={24} color="white" className={"mr-1"}/>
                        <Text className={"text-white"}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedPicture(null);
                            setSelectedPatient(null);
                            setNotes("");
                            setDate(new Date());
                            setNotesError(false);
                            setDateError(false);
                        }}
                        className={`flex-1 flex-row items-center mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900`}>
                        <MaterialIcons name={"restart-alt"} size={24} color="white" className={"mr-1"}/>
                        <Text className="text-white">
                            Restart
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Separator */}
                <View
                    className={"flex border-b dark:border-b-neutral-600 border-b-neutral-300 mt-3"}
                />
            </View>

            <View className={"w-full px-6 p-4"}>
                {/* While there is no image selected, show the patient and image dropdowns */}
                {!selectedPicture && (
                    <View>
                        <View className={"flex xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 rounded-lg mb-6"}
                                          style={{
                                              shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                            <View className={"flex-1"}>
                                <Text className={"dark:text-white xs-text-base sm:text-base md:text-base lg:text-xl font-bold"}>
                                    What is Reminiscence Therapy?
                                </Text>
                                <Text className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                    Reminiscence therapy is about using stimuli like photos, music, and other items to help
                                    people remember events, people, and places from their past lives.
                                </Text>
                                <Text className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                    It can help create social skills, improve mood, and even cognitive function in some cases!
                                </Text>
                            </View>
                        </View>

                        <Text className={"text-lg dark:text-white font-semibold my-2"}>
                            Which family member would you like to help reminisce?
                        </Text>
                        <Dropdown options={patientOptions} onSelect={(value) => {
                            const patient = patients?.find(patient => patient.uuid === value);
                            if (!patient) {
                                return;
                            }
                            setSelectedPatient(patient);
                        }}/>
                        <Text className={"text-lg dark:text-white font-semibold mt-6 mb-2"}>
                            Which image would they like to reminisce about?
                        </Text>
                        <Dropdown options={pictureOptions} onSelect={(value) => {
                            const picture = pictures?.find(picture => picture.uuid === value);
                            if (!picture) {
                                return;
                            }
                            setSelectedPicture(picture);
                        }}/>
                    </View>
                )}

                {/* When an image selected, show the image and the entry form with a back button */}
                {selectedPicture && (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View>
                            <View className={"flex flex-row gap-10 items-center rounded-lg"}>
                                <Animated.View className={"rounded-lg flex"} style={[animatedStyle]}>
                                    <TouchableWithoutFeedback onLongPress={() => handleLongPress()}
                                                              onPressIn={handlePressIn} onPressOut={handlePressOut}>
                                        <Image
                                            source={{uri: selectedPicture.image_url}}
                                            style={[{aspectRatio: 1, height: 150}]}
                                            resizeMode={"cover"}
                                            className={"rounded-lg"}
                                            loadingIndicatorSource={loading}
                                        />
                                    </TouchableWithoutFeedback>
                                </Animated.View>
                                <View className={"flex-1"}>
                                    {/* Picture details */}
                                    <View className={"w-full items-start"}>
                                        <SafeAreaView className={"my-2 max-w-full"}>
                                            <Text
                                                className={"font-bold dark:text-white text-xl mb-2"}>
                                                Image Name
                                            </Text>
                                            <Text className={"dark:text-white break-words whitespace-normal"}>
                                                {selectedPicture.title}
                                            </Text>
                                        </SafeAreaView>

                                        <View className={"my-2"}>
                                            <Text
                                                className={"font-bold dark:text-white text-xl mb-2"}>Album</Text>
                                            <Text className={"dark:text-white"}>
                                                {selectedPicture.albumActual?.title}
                                            </Text>
                                        </View>

                                        <View className={"my-2"}>
                                            <Text
                                                className={"font-bold dark:text-white text-xl mb-2"}>By</Text>
                                            <Text className={"dark:text-white"}>
                                                {selectedPicture.patientActual?.first_name + " " + selectedPicture.patientActual?.last_name}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className={"mt-4"}>
                                {/* When was the picture taken? */}
                                <Text className={"font-bold dark:text-white text-lg"}>
                                    When was the picture taken?
                                </Text>
                                <Text className={"text-sm font-normal dark:text-neutral-300 text-neutral-600"}>
                                    It's okay if you don't remember the exact date.
                                </Text>

                                {Platform.OS === "android" && (
                                    <View className={"w-full my-4"}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setDate(new Date());
                                                setShow(true);
                                            }}
                                            className={`flex-row justify-between items-center p-2 bg-blue-500 dark:bg-neutral-900 rounded-lg`}>
                                            <Text className={"text-white"}>
                                                {date.toDateString()}
                                            </Text>
                                            <MaterialIcons name={"date-range"} size={24} color={"white"}/>
                                        </TouchableOpacity>

                                        {show && (
                                            <RNDateTimePicker
                                                value={date}
                                                mode={"date"}
                                                display={"default"}
                                                onChange={onChange}
                                                style={{width: "100%"}}
                                            />)}
                                    </View>
                                )}

                                {Platform.OS === "ios" && (
                                    <View className={"w-full my-4"}>
                                        <DateTimePicker
                                            value={date}
                                            mode={"date"}
                                            display={"default"}
                                            onChange={onChange}
                                            style={{width: "100%"}}
                                        />
                                    </View>
                                )}
                                {dateError && (
                                    <Text className={"text-red-500"}>
                                        Please select a date that is not in the future (today or before).
                                    </Text>
                                )}

                                {/* Describing the picture */}
                                <InputGroup
                                    label={"Write about the picture"}
                                    placeholder={"This is ... it was very ..., This is me and my ... in the picture."}
                                    error={notesError}
                                    errorMessage={"Please only use alphanumeric characters, spaces, and dashes."}
                                    multiline={true}
                                    value={notes}
                                    onChangeText={(text) => setNotes(text)}
                                />
                                <TouchableWithoutFeedback className={"mt-4"} hitSlop={20}
                                                          onPress={() => setTipsVisible(!tipsVisible)}>
                                    <View className={"flex-row justify-between"}>
                                        <Text className={"dark:text-white text-xl font-bold"}>
                                            Helpful Questions and Answers
                                        </Text>
                                        <MaterialIcons name={tipsVisible ? "arrow-drop-up" : "arrow-drop-down"}
                                                       size={24} color={colorScheme === "dark" ? "white" : "#000"}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View className={`${tipsVisible ? "" : "hidden"}`}>
                                    <View className={"bg-white rounded-lg p-3 my-2 dark:bg-neutral-900"} style={{
                                        shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                                        <View>
                                            <Text className={"font-bold dark:text-white mb-1"}>
                                                Q: What should I write about?
                                            </Text>
                                        </View>
                                        <Text className={"dark:text-white"}>
                                            Write about the event, the people in the picture, the location, the date,
                                            and any other details you can remember.
                                        </Text>
                                    </View>

                                    <View className={"bg-white rounded-lg p-3 my-2 dark:bg-neutral-900"} style={{
                                        shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                                        <Text className={"font-bold dark:text-white mb-1"}>
                                            Q: What if I don't remember?
                                        </Text>
                                        <Text className={"dark:text-white"}>
                                            It's okay if you don't remember everything. Write down what you can and
                                            leave the rest.
                                        </Text>
                                    </View>

                                    <View className={"bg-white rounded-lg p-3 my-2 dark:bg-neutral-900"} style={{
                                        shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                                        <Text className={"font-bold dark:text-white mb-1"}>
                                            Q: What if I remember something later?
                                        </Text>
                                        <Text className={"dark:text-white"}>
                                            You can always come back and edit your entry later.
                                        </Text>
                                    </View>

                                    <View className={"bg-white rounded-lg p-3 my-2 dark:bg-neutral-900"} style={{
                                        shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                                        <Text className={"font-bold dark:text-white mb-1"}>
                                            Q: What if I need help?
                                        </Text>
                                        <Text className={"dark:text-white"}>
                                            You can always ask a caregiver or family member for help, the application is
                                            here to help you, not stress you out.
                                        </Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
            <View className={"w-full absolute"}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={fullImageVisible}
                    onRequestClose={() => {
                        setFullImageVisible(false);
                    }}>

                    {/* Full Image */}
                    <BlurView intensity={75} style={[StyleSheet.absoluteFill, {
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: 5,
                    }]}/>
                    <View
                        className={"my-safe mx-safe-or-4 dark:bg-neutral-900 bg-white border dark:border-neutral-800 border-gray-400 rounded-lg  p-4"}>
                        <TouchableWithoutFeedback onPress={() => setFullImageVisible(false)}>
                            <Image
                                source={{uri: selectedPicture?.image_url}}
                                style={{width: "100%", height: "100%"}}
                                resizeMode={"contain"}
                                className={"rounded-lg"}

                            />
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
            </View>
        </KeyboardAwareScrollView>
    );
}

export default NewEntry;
