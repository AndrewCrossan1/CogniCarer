import {
    Image, Keyboard,
    Modal, Platform,
    StyleSheet,
    Text, TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useReminisce} from "@/hooks/useReminisce";
import {useEffect, useState} from "react";
import {ReminisceEntry} from "@/services/api/types";
import {BlurView} from "expo-blur";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import {MaterialIcons} from "@expo/vector-icons";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputGroup from "@/components/forms/InputGroup";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const entry = () => {
    const {id} = useLocalSearchParams()
    const {getEntries, update} = useReminisce();
    const image = require('@/assets/images/undraw_dreamer_gb41.png');

    // Entry States
    const [entry, setEntry] = useState<ReminisceEntry>({} as ReminisceEntry);
    const [fullImageVisible, setFullImageVisible] = useState(false)
    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)
    const [dateError, setDateError] = useState(false)
    const [notes, setNotes] = useState("")
    const [notesError, setNotesError] = useState(false)
    const [editable, setEditable] = useState(false)

    // Date changing logic
    const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setShow(Platform.OS === "ios");
    }

    // Animations
    const scale = useSharedValue(1);
    const shadow = useSharedValue(0);
    const shadowOpacity = useSharedValue(0);
    const shadowRadius = useSharedValue(0);

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

    const getE = async () => {
        // Get the entry with ID
        getEntries().then((entries) => {
            const filtered = entries?.filter(entry => entry.uuid == id);
            if (filtered && filtered.length === 1) {
                setEntry(filtered[0])
                // Set the date and notes
                setDate(new Date(filtered[0].date_taken))
                setNotes(filtered[0].notes)
            }
        })
    }

    // API Tasks
    useEffect(() => {
        getE()
    }, [id]);

    const updateEntry = () => {
        if (date > new Date()) {
            setDateError(true)
            return
        } else {
            setDateError(false)
        }

        const data = {
            patient: entry.patient,
            picture: entry.picture,
            uuid: entry.uuid,
            notes: notes,
            date_taken: date.toISOString().split("T")[0],
            created_at: entry.created_at,
            updated_at: new Date().toISOString()
        }

        console.log(data)

        // Update the entry
        update("entry", entry.uuid, data).then(() => {
            setEditable(false)
            // Refresh the entry
            getE()
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={{alignItems: "center"}} className={"flex-1 dark:bg-neutral-800"}>
            <View className={"w-full bg-blue-500 dark:bg-neutral-800 p-6"}>
                <View className={"flex-row items-center"}>
                    <Image
                        source={image}
                        style={{width: 100, height: 100}}
                        className={"mr-4 rounded-lg"}
                    />
                    <View className={"p-2 w-3/4"}>
                        <Text className={"dark:text-white text-2xl font-bold text-white"}>
                            View an Entry
                        </Text>
                        <Text className={"mt-2 text-neutral-100 text-base"}>
                            View and edit details about an entry.
                        </Text>
                    </View>
                </View>
                <View className={"flex-row justify-between gap-2"}>
                    <TouchableOpacity
                        onPress={
                            () => {
                                if (editable) {
                                    setEditable(false)
                                    updateEntry()
                                } else {
                                    setEditable(true)
                                }
                            }
                        }
                        style={{padding: 10, borderRadius: 10, marginTop: 10}}
                        className={`flex-row items-center mt-3 w-1/2 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900`}>
                        <MaterialIcons name={editable ? "upload" : "edit"} size={24} color="white" className={"mr-1"}/>
                        <Text className={"text-white"}>
                            {editable ? "Save" : "Edit"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={
                            () => {
                                // When editable, cancel the edit
                                if (editable) {
                                    setEditable(false)
                                    setNotes(entry.notes)
                                    setDate(new Date(entry.date_taken))
                                } else {
                                    // Delete the entry
                                    // API Call
                                }
                            }
                        }
                        style={{padding: 10, borderRadius: 10, marginTop: 10}}
                        className={`flex-row items-center mt-3 w-1/2 rounded-lg p-2 bg-red-500`}>
                        <MaterialIcons name={"delete"} size={24} color="white" className={"mr-1"}/>
                        <Text className="text-white">
                            {editable ? "Cancel" : "Delete"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className={"w-full p-4"}>
                {/* When an image selected, show the image and the entry form with a back button */}
                {entry?.pictureActual && (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View>
                            <View className={"flex-row gap-10 items-center rounded-lg"}>
                                <Animated.View className={"w-1/2 rounded-lg"} style={[{
                                    shadowOffset: {
                                        width: shadow.value,
                                        height: shadow.value
                                    },
                                }, useAnimatedStyle(() => {
                                    return {
                                        shadowOpacity: shadowOpacity.value,
                                        shadowRadius: shadowRadius.value,
                                        shadowColor: "#000",
                                        borderRadius: 10
                                    }
                                })]}>
                                    <TouchableWithoutFeedback onLongPress={() => handleLongPress()}
                                                              onPressIn={handlePressIn} onPressOut={handlePressOut}>
                                        <Image
                                            source={{uri: entry.pictureActual.image_url}}
                                            style={[{aspectRatio: 1, height: 200}]}
                                            resizeMode={"cover"}
                                            className={"rounded-lg"}
                                        />
                                    </TouchableWithoutFeedback>
                                </Animated.View>
                                <View className={"w-1/2"}>
                                    {/* Picture details */}
                                    <View className={"items-start"}>
                                        <View className={"my-2"}>
                                            <Text
                                                className={"font-bold dark:text-white text-xl mb-2 underline underline-offset-2"}>Image
                                                Name</Text>
                                            <Text className={"dark:text-white"}>
                                                {entry.pictureActual.title}
                                            </Text>
                                        </View>

                                        <View className={"my-2"}>
                                            <Text
                                                className={"font-bold dark:text-white text-xl mb-2 underline underline-offset-2"}>By</Text>
                                            <Text className={"dark:text-white"}>
                                                {entry.patientActual?.first_name + " " + entry.patientActual?.last_name}
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
                                            disabled={!editable}
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
                                    label={"Entry Notes"}
                                    error={notesError}
                                    errorMessage={"Please only use alphanumeric characters, spaces, and dashes."}
                                    multiline={true}
                                    value={notes}
                                    editable={editable}
                                    onChangeText={(text) => setNotes(text)}
                                />
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
                <BlurView intensity={75} style={[StyleSheet.absoluteFill, {
                    shadowColor: '#000',
                    shadowOffset:
                        {
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
                            source={{uri: entry?.pictureActual?.image_url}}
                            style={{width: "100%", height: "100%"}}
                            resizeMode={"contain"}
                            className={"rounded-lg"}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
            </KeyboardAwareScrollView>
    );
}

export default entry;