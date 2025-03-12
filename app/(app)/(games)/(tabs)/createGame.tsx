import {ActivityIndicator, Image, RefreshControl, Switch, Text, TextInput, TouchableOpacity, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "tailwindcss/colors";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useAppSelector} from "@/hooks/store/hooks";
import InputGroup, {InputGroupRef} from "@/components/forms/InputGroup";
import {useColorScheme} from "nativewind";
import {Dropdown} from "@/components/forms/Dropdown";
import {MaterialIcons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {usePatients} from "@/hooks/patients/usePatients";
import {useFocusEffect} from "@react-navigation/native";
import {useGame} from "@/hooks/games/useGame";
import {ImagePickerResult} from "expo-image-picker";
import {Alert} from "@/components/Alert";
import * as ImagePicker from "expo-image-picker";

const createGame = () => {
    const [refreshing, setRefreshing] = useState(false);
    const user = useAppSelector(state => state.user.user);
    const { colorScheme } = useColorScheme();
    const { getPatients } = usePatients();
    const {createGame, loading} = useGame();
    const router = useRouter();
    const [patientOptions, setPatientOptions] = useState([] as { value: string, display: string }[]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
        throw new Error("Not implemented");
    }, []);

    const [errors, setErrors] = useState({
        title: {"error": false, "message": ""},
        person_with_dementia: {"error": false, "message": ""},
        description: {"error": false, "message": ""},
        round_1: {"error": false, "message": ""},
        round_2: {"error": false, "message": ""},
        round_3: {"error": false, "message": ""},
        matching_image: {"error": false, "message": ""},
        image_2: {"error": false, "message": ""},
        image_3: {"error": false, "message": ""},
    });

    const refs = {
        title: useRef<InputGroupRef>(null),
        person_with_dementia: useRef<InputGroupRef>(null),
        description: useRef<InputGroupRef>(null),
        round_1: useRef<InputGroupRef>(null),
        round_2: useRef<InputGroupRef>(null),
        round_3: useRef<InputGroupRef>(null),
        matching_image: useRef<InputGroupRef>(null),
        image_2: useRef<InputGroupRef>(null),
        image_3: useRef<InputGroupRef>(null),
    }

    const [formValues, setFormValues] = useState({
        title: "",
        person_with_dementia: "",
        description: "",
        round_1: "30",
        round_2: "20",
        round_3: "10",
        public: false,
    });

    const [imageValues, setImageValues] = useState<{matching_image: ImagePickerResult | null, image_2: ImagePickerResult | null, image_3: ImagePickerResult | null}>({
        matching_image: null,
        image_2: null,
        image_3 : null,
    });

    const [alert, setAlert] = useState({
        visible: false,
        message: "",
        type: "error" as "success" | "error",
    });

    useEffect(() => {
        if (alert.visible) {
            setTimeout(() => {
                setAlert({
                    ...alert,
                    visible: false
                });
            }, 5000);
        }
    }, [alert]);

    const validateForm = () => {
        let hasErrors = false;
        let errors = {
            title: {"error": false, "message": ""},
            person_with_dementia: {"error": false, "message": ""},
            description: {"error": false, "message": ""},
            round_1: {"error": false, "message": ""},
            round_2: {"error": false, "message": ""},
            round_3: {"error": false, "message": ""},
            matching_image: {"error": false, "message": ""},
            image_2: {"error": false, "message": ""},
            image_3: {"error": false, "message": ""},
        }

        if (!formValues.title) {
            errors.title = {error: true, message: "Please enter a title for your game"};
            hasErrors = true;
        }
        if (!formValues.person_with_dementia) {
            errors.person_with_dementia = {error: true, message: "Please select a person_with_dementia for the game"};
            hasErrors = true;
        }
        if (!formValues.description) {
            errors.description = {error: true, message: "Please enter a description for your game"};
            hasErrors = true;
        }
        if (parseInt(formValues.round_1) <= 0) {
            errors.round_1 = {error: true, message: "Please enter a valid time (> 0s)"};
            hasErrors = true;
        }
        if (parseInt(formValues.round_2) <= 0) {
            errors.round_2 = {error: true, message: "Please enter a valid time (> 0s)"};
            hasErrors = true;
        }
        if (parseInt(formValues.round_3) <= 0) {
            errors.round_3 = {error: true, message: "Please enter a valid time (> 0s)"};
            hasErrors = true;
        }
        if (!imageValues.matching_image) {
            errors.matching_image = {error: true, message: "Please select a matching image"};
            hasErrors = true;
        }
        if (!imageValues.image_2) {
            errors.image_2 = {error: true, message: "Please select a second image"};
            hasErrors = true;
        }
        if (!imageValues.image_3) {
            errors.image_3 = {error: true, message: "Please select a third image"};
            hasErrors = true;
        }
        setErrors(errors);
        return hasErrors;
    }

    const submitForm = () => {
        console.log(errors)
        if (validateForm()) {
            setAlert({
                visible: true,
                message: "There are errors in your submission. Please fix them and try again",
                type: "error"
            })
            return;
        }
        // @ts-ignore (Null check has been done. See validateForm:111-113)
        createGame(formValues, imageValues["matching_image"], imageValues["image_2"], imageValues["image_3"])
            .then((result) => {
                if (!result) {
                    setAlert({
                        visible: true,
                        message: "There are errors in your submission. Please fix them and try again",
                        type: "error"
                    });
                    return;
                }
                setAlert({
                    visible: true,
                    message: "Game created successfully!",
                    type: "success"
                });
                // Clear the form
                setFormValues({
                    title: "",
                    person_with_dementia: "",
                    description: "",
                    round_1: "30",
                    round_2: "20",
                    round_3: "10",
                    public: false,
                });
                setErrors({
                    title: {"error": false, "message": ""},
                    person_with_dementia: {"error": false, "message": ""},
                    description: {"error": false, "message": ""},
                    round_1: {"error": false, "message": ""},
                    round_2: {"error": false, "message": ""},
                    round_3: {"error": false, "message": ""},
                    matching_image: {"error": false, "message": ""},
                    image_2: {"error": false, "message": ""},
                    image_3: {"error": false, "message": ""},
                });
                setImageValues({
                    matching_image: null,
                    image_2: null,
                    image_3: null,
                });

                setTimeout(() => {
                    setAlert({
                        ...alert,
                        visible: false
                    });
                    router.push("/(app)/(games)/(tabs)");
                }, 3000);
            })
            .catch((error) => {
                console.error(error);
                setAlert({
                    visible: true,
                    message: "An error occurred while creating the game",
                    type: "error"
                });
            });
    }

    useFocusEffect(
        useCallback(() => {
            getPatients().then((patients) => {
                if (!patients || patients.length === 0) {
                    router.push("/(app)/(myaccount)/family/NewMember");
                } else {
                    setPatientOptions(patients.map((patient) => ({
                        value: patient.uuid,
                        display: `${patient.first_name} ${patient.last_name}`
                    })));
                }
            });
        }, [])
    );

    return (
        <KeyboardAwareScrollView stickyHeaderIndices={[2]} contentContainerStyle={{justifyContent: "flex-start"}} className={"flex-1 bg-neutral-100 dark:bg-neutral-800 w-full md:px-4 lg:px-6"}
                                 refreshControl={
                                     <View>
                                         <RefreshControl title={"Refreshing..."} titleColor={colors.neutral[400]}
                                                         tintColor={colors.neutral[400]} refreshing={refreshing}
                                                         onRefresh={onRefresh}/>
                                     </View>
                                 }>
            {/* Header */}
            <View className={"flex flex-row gap-5 items-center xs:mt-4 sm:mt-5 md:mt-6 lg:mt-6 xl:mt-6"}>
                <View className={"flex"}>
                    <Image source={{uri: user?.profile_image}}
                           className={"rounded-full xs:w-10 sm:w-20 md:w-25 lg:w-30 xl:w-35 xs:h-10 sm:h-20 md:h-25 lg:h-30 xl:h-35"}/>
                </View>

                <View className={"flex-1"}>
                    <Text
                        className={"dark:text-white xs:text-base sm:text-base md:text-2xl lg:text-2xl xl:text-2xl font-semibold"}>
                        Hello, {user?.first_name}!
                    </Text>
                    <Text
                        className={"dark:text-white xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"}>
                        Create a new game for a family member, or for the public!
                    </Text>
                </View>
            </View>

            {/* Separator */}
            <View className={"w-full flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:my-1 sm:my-1 md:my-3 lg:my-3 xl:my-4 md:px-2 lg:px-4 xl:px-4"}/>

            <Alert message={alert.message} type={alert.type} visible={alert.visible} onPress={() => {
                setAlert({...alert, visible: false});
            }}/>

            {/* Form */}
            <View className={"flex gap-2 justify-center my-2"}>

                <View
                    className="flex-1 flex-row p-4 bg-white dark:bg-neutral-900 rounded-lg items-center gap-x-4" style={{
                    shadowColor: colors.black,
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                    shadowRadius: 3.84,
                    elevation: 2
                }}>
                    <View className={"flex"}>
                        <Image source={require("@/assets/images/games/undraw_design-objectives_f9uv.png")} className={"w-28 h-28"}/>
                    </View>
                    <View className={"flex-1"}>
                        <Text className={"dark:text-white font-bold text-xl"}>Creating a new Game</Text>
                        <Text className={"dark:text-white"}>
                            Creating a new game is simple, fill in the details and play away!
                        </Text>
                        <Text className={"dark:text-white mt-1 text-sm text-neutral-700"}>
                            Practice caution when creating a <Text className={"text-red-500"}>public</Text> game.
                        </Text>
                        <Text className={"dark:text-white text-sm text-neutral-700"}>
                            Public games are visible to everyone.
                        </Text>
                    </View>
                </View>

                <Text className={"text-lg dark:text-white font-semibold mt-2"}>
                    Who is the creator of this game?
                </Text>
                <Dropdown options={patientOptions} onSelect={(value) => {
                    setFormValues({...formValues, person_with_dementia: value});
                }}/>
                {errors.person_with_dementia.error &&
                  <Text className={"text-red-500 mt-1"}>{errors.person_with_dementia.message}</Text>
                }

                <InputGroup label={"Title"} ref={refs.title} value={formValues.title} errorMessage={errors.title.message} error={errors.title.error} placeholder={"Enter a title for your game"} onChangeText={(value) => {
                    setFormValues({...formValues, title: value});
                }}/>

                <InputGroup label={"Description"} ref={refs.description} value={formValues.description} error={errors.title.error} errorMessage={errors.description.message} multiline={true} placeholder={"Enter a description for your game"} onChangeText={(value) => {
                    setFormValues({...formValues, description: value});
                }}/>

                <View className={"flex flex-row gap-3"}>
                    <View className={"flex-1"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Round 1 Time</Text>
                        <TextInput value={formValues.round_1} placeholder={"Time (seconds)"} onChangeText={
                            (value) => {
                                if (parseInt(value) <= 0) {
                                    setErrors({
                                        ...errors,
                                        round_1: {error: true, message: "Please enter a valid time (> 0s)"}
                                    });
                                }
                                setFormValues({...formValues, round_1: value});
                            }
                        } placeholderTextColor={"#AAAAA5"} className={`rounded-lg p-4 border dark:text-white ${errors.round_1.error ? "border-red-500" : "dark:border-gray-500 border-gray-400"} focus:border-blue-500 my-1`}/>
                        {errors.round_1.error &&
                          <Text className={"text-red-500 mt-1"}>Please enter a valid time ({'>'} 0s)</Text>
                        }
                    </View>
                    <View className={"flex-1"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Round 2 Time</Text>
                        <TextInput value={formValues.round_2} placeholder={"Time (seconds)"} onChangeText={
                            (value) => {
                                if (parseInt(value) <= 0) {
                                    setErrors({
                                        ...errors,
                                        round_2: {error: true, message: "Please enter a valid time (> 0s)"}
                                    });
                                }
                                setFormValues({...formValues, round_2: value});
                            }
                        } placeholderTextColor={"#AAAAA5"} className={`rounded-lg p-4 border dark:text-white ${errors.round_2.error ? "border-red-500" : "dark:border-gray-500 border-gray-400"} focus:border-blue-500 my-1`}/>
                        {errors.round_2.error &&
                          <Text className={"text-red-500 mt-1"}>Please enter a valid time ({'>'} 0s)</Text>
                        }
                    </View>
                    <View className={"flex-1"}>
                        <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>Round 3 Time</Text>
                        <TextInput value={formValues.round_3} placeholder={"Time (seconds)"} onChangeText={
                            (value) => {
                                if (parseInt(value) <= 0) {
                                    setErrors({
                                        ...errors,
                                        round_3: {error: true, message: "Please enter a valid time (> 0s)"}
                                    });
                                }
                                setFormValues({...formValues, round_3: value});
                            }
                        } placeholderTextColor={"#AAAAA5"} className={`rounded-lg p-4 border dark:text-white ${errors.round_3.error ? "border-red-500" : "dark:border-gray-500 border-gray-400"} focus:border-blue-500 my-1`}/>
                        {errors.round_3.error &&
                          <Text className={"text-red-500 mt-1"}>Please enter a valid time ({'>'} 0s)</Text>
                        }
                    </View>
                </View>

                <Text className={"text-lg dark:text-white font-semibold mt-2"}>
                    Image Selection
                </Text>
                <View className={"w-full flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300"}/>

                <TouchableOpacity onPress={async () => {
                    let result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ['images'],
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    });

                    setImageValues({...imageValues, matching_image: result});
                }}
                                  className={"flex flex-row justify-between items-center border border-gray-400 dark:border-gray-500 p-3 rounded-lg mt-4"}>
                    <View className={"flex justify-between"}>
                        <Text className={"text-lg dark:text-white"}>Select Matching Image</Text>
                        {errors.matching_image && (
                            <View className={"flex-row items-center gap-2"}>
                                <Text className={"text-sm text-red-500"}>
                                    {errors.matching_image.message}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text className={"text-sm text-neutral-700 dark:text-neutral-200"}>
                        {imageValues.matching_image ? "Selected" : "No selection"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={async () => {
                    let result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ['images'],
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    });

                    setImageValues({...imageValues, image_2: result});
                }}
                                  className={"flex flex-row justify-between items-center border border-gray-400 dark:border-gray-500 p-3 rounded-lg mt-4"}>
                    <View className={"flex justify-between"}>
                        <Text className={"text-lg dark:text-white"}>Select Other Image</Text>
                        {errors.image_2 && (
                            <View className={"flex-row items-center gap-2"}>
                                <Text className={"text-sm text-red-500"}>
                                    {errors.image_2.message}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text className={"text-sm text-neutral-700 dark:text-neutral-200"}>
                        {imageValues.image_2 ? "Selected" : "No selection"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={async () => {
                    let result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ['images'],
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    });

                    setImageValues({...imageValues, image_3: result});
                }}
                                  className={"flex flex-row justify-between items-center border border-gray-400 dark:border-gray-500 p-3 rounded-lg mt-4"}>
                    <View className={"flex justify-between"}>
                        <Text className={"text-lg dark:text-white"}>Select Other Image</Text>
                        <View className={"flex-row items-center gap-2"}>
                            {errors.image_3 && (
                                <View className={"flex-row items-center gap-2"}>
                                    <Text className={"text-sm text-red-500"}>
                                        {errors.image_3.message}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <Text className={"text-sm text-neutral-700 dark:text-neutral-200"}>
                        {imageValues.image_3 ? "Selected" : "No selection"}
                    </Text>
                </TouchableOpacity>

                <View className={"flex-row items-center justify-between mt-4"}>
                    <View className={"flex-row items-center"}>
                        <MaterialIcons name={"public"} size={24} color={colorScheme === "dark" ? colors.white : colors.black} />
                        <Text className={"xs:text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl ml-4 dark:text-white"}>
                            Public Game
                        </Text>
                    </View>

                    <Switch value={formValues.public} onValueChange={(val) => {
                        setFormValues({...formValues, public: val});
                    }} />
                </View>

                <View className={"flex-row items-center justify-center gap-2"}>
                    {!loading ? (
                        <>
                            <TouchableOpacity
                                onPress={submitForm}
                                className={"flex-1 basis-2/3 flex-row items-center justify-center bg-blue-500 dark:bg-blue-600 p-3 rounded-lg my-4"}>
                                <Text className={"text-white font-semibold text-lg"}>
                                    Create Game
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={
                                    () => {
                                        // Clear the form
                                        setFormValues({
                                            title: "",
                                            person_with_dementia: "",
                                            description: "",
                                            round_1: "30",
                                            round_2: "20",
                                            round_3: "10",
                                            public: false,
                                        });
                                        setErrors({
                                            title: {"error": false, "message": ""},
                                            person_with_dementia: {"error": false, "message": ""},
                                            description: {"error": false, "message": ""},
                                            round_1: {"error": false, "message": ""},
                                            round_2: {"error": false, "message": ""},
                                            round_3: {"error": false, "message": ""},
                                            matching_image: {"error": false, "message": ""},
                                            image_2: {"error": false, "message": ""},
                                            image_3: {"error": false, "message": ""},
                                        });
                                        setImageValues({
                                            matching_image: null,
                                            image_2: null,
                                            image_3: null,
                                        });
                                        router.push("/(app)/(games)/(tabs)");
                                    }
                                }
                                className={"flex-1 basis-1/3 flex-row items-center justify-center bg-red-500 dark:bg-red-600 p-3 rounded-lg my-4"}>
                                <Text className={"text-white font-semibold text-lg"}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View className={"flex-1 flex-row items-center justify-center"}>
                            <ActivityIndicator size={"large"} color={colors.blue[500]}/>
                        </View>
                    )}
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

export default createGame;
