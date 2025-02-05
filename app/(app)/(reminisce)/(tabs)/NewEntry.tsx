import {
    View,
    Text,
    Image,
    Modal,
    TouchableWithoutFeedback,
    StyleSheet,
    Keyboard,
    ScrollView, TouchableOpacity, useColorScheme, Platform
} from 'react-native';
import {useEffect, useState} from 'react';
import {Patient, Picture} from '@/services/api/types';
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

const NewEntry = () => {

    const {getPictures} = useReminisce();
    const {getPatients} = usePatients();
    const theme = useColorScheme();
    const image = require('@/assets/images/undraw_dreamer_gb41.png');

    const [pictures, setPictures] = useState<Picture[] | null>([] as Picture[]);
    const [patients, setPatients] = useState<Patient[] | null>([] as Patient[]);
    const [pictureOptions, setPictureOptions] = useState([] as { value: string, display: string }[]);
    const [patientOptions, setPatientOptions] = useState([] as { value: string, display: string }[]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedPicture, setSelectedPicture] = useState<Picture | null>(null);
    const [fullImageVisible, setFullImageVisible] = useState(false);
    const [tipsVisible, setTipsVisible] = useState(false);

    // Date Picker Configurations
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setShow(Platform.OS === "ios");
    }

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

    }


    return (
        <ScrollView contentContainerStyle={{alignItems: "center"}} className={"flex-1 dark:bg-neutral-800"}>
            <View className={"w-full bg-blue-500 dark:bg-neutral-800 p-6"}>
                <View className={"flex-row items-center"}>
                    <Image
                        source={image}
                        style={{width: 100, height: 100}}
                        className={"mr-4 rounded-lg"}
                    />
                    <View className={"p-2 w-3/4"}>
                        <Text className={"dark:text-white text-2xl font-bold text-white"}>
                            Create a new entry
                        </Text>
                        <Text className={"mt-2 text-neutral-100 text-base"}>
                            Pick an image and reminisce on the event!
                        </Text>
                    </View>
                </View>
                <View className={"flex-row justify-between gap-2"}>
                    <TouchableOpacity
                        onPress={() => {
                            // Submit the entry
                        }}
                        style={{padding: 10, borderRadius: 10, marginTop: 10}}
                        className={`flex-row items-center mt-3 w-1/2 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900`}>
                        <MaterialIcons name={"download-done"} size={24} color="white" className={"mr-1"}/>
                        <Text className={"text-white"}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedPicture(null);
                            setSelectedPatient(null);
                        }}
                        style={{padding: 10, borderRadius: 10, marginTop: 10}}
                        className={`flex-row items-center mt-3 w-1/2 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900`}>
                        <MaterialIcons name={"restart-alt"} size={24} color="white" className={"mr-1"}/>
                        <Text className="text-white">
                            Restart
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className={"w-full p-4"}>
                {/* While there is no image selected, show the patient and image dropdowns */}
                {!selectedPicture && (
                    <View>
                        <Text className={"text-lg dark:text-white font-bold"}>
                            Select a Patient
                        </Text>
                        <Dropdown options={patientOptions} onSelect={(value) => {
                            const patient = patients?.find(patient => patient.uuid === value);
                            if (!patient) {
                                return;
                            }
                            setSelectedPatient(patient);
                        }}/>
                        <View className={"mt-4"}/>
                        <Text className={"text-lg dark:text-white font-bold"}>
                            Select an Image
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
                            <View className={"flex-row gap-10 items-center rounded-lg"}>
                                <Animated.View className={"w-1/2 rounded-lg"} style={[animatedStyle]}>
                                    <TouchableWithoutFeedback onLongPress={() => handleLongPress()}
                                                              onPressIn={handlePressIn} onPressOut={handlePressOut}>
                                        <Image
                                            source={{uri: selectedPicture.image_url}}
                                            style={[{aspectRatio: 1, height: 200}]}
                                            resizeMode={"cover"}
                                            className={"rounded-lg"}
                                        />
                                    </TouchableWithoutFeedback>
                                </Animated.View>
                                <View className={"1/2"}>
                                    {/* Picture details */}
                                    <View className={"items-start"}>
                                        <View className={"my-2"}>
                                            <Text
                                                className={"font-bold dark:text-white text-xl mb-2 underline underline-offset-2"}>Image
                                                Name</Text>
                                            <Text className={"dark:text-white"}>
                                                {selectedPicture.title}
                                            </Text>
                                        </View>

                                        <View className={"my-2"}>
                                            <Text
                                                className={"font-bold dark:text-white text-xl mb-2 underline underline-offset-2"}>Album</Text>
                                            <Text className={"dark:text-white"}>
                                                {selectedPicture.albumActual?.title}
                                            </Text>
                                        </View>

                                        <View className={"my-2"}>
                                            <Text
                                                className={"font-bold dark:text-white text-xl mb-2 underline underline-offset-2"}>By</Text>
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

                                {/* Describing the picture */}
                                <InputGroup
                                    label={"Write about the picture"}
                                    placeholder={"This is ... it was very ..., This is me and my ... in the picture."}
                                    error={false}
                                    errorMessage={"False"}
                                    multiline={true}
                                />
                                <TouchableWithoutFeedback className={"mt-4"} hitSlop={20}
                                                          onPress={() => setTipsVisible(!tipsVisible)}>
                                    <View className={"flex-row justify-between"}>
                                        <Text className={"dark:text-white text-xl font-bold"}>
                                            Helpful Questions and Answers
                                        </Text>
                                        <MaterialIcons name={tipsVisible ? "arrow-drop-up" : "arrow-drop-down"}
                                                       size={24} color={theme === "dark" ? "white" : "#000"}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View className={`${tipsVisible ? "" : "hidden"}`}>
                                    <View className={"bg-white rounded-lg p-3 my-2 dark:bg-neutral-900"}>
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

                                    <View className={"bg-white rounded-lg p-3 my-2 dark:bg-neutral-900"}>
                                        <Text className={"font-bold dark:text-white mb-1"}>
                                            Q: What if I don't remember?
                                        </Text>
                                        <Text className={"dark:text-white"}>
                                            It's okay if you don't remember everything. Write down what you can and
                                            leave the rest.
                                        </Text>
                                    </View>

                                    <View className={"bg-white rounded-lg p-3 my-2 dark:bg-neutral-900"}>
                                        <Text className={"font-bold dark:text-white mb-1"}>
                                            Q: What if I remember something later?
                                        </Text>
                                        <Text className={"dark:text-white"}>
                                            You can always come back and edit your entry later.
                                        </Text>
                                    </View>

                                    <View className={"bg-white rounded-lg p-3 my-2 dark:bg-neutral-900"}>
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={fullImageVisible}
                onRequestClose={() => {
                    setFullImageVisible(false);
                }}>

                {/* Full Image */}
                <BlurView intensity={75} style={[StyleSheet.absoluteFill, styles.modalView]}/>
                <View
                    className={"my-safe mx-safe-or-4 dark:bg-neutral-900 bg-white border dark:border-neutral-800 border-gray-400 rounded-lg elevation-md p-4"}>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    modalView: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
});


export default NewEntry;