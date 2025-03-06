import {
    Image, Modal, Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import {Alert} from "@/components/Alert";
import {useCallback, useEffect, useState} from "react";
import {ReminisceEntry} from "@/services/api/types";
import * as Haptics from "expo-haptics";
import {useColorScheme} from "nativewind"
import {useReminisce} from "@/hooks/useReminisce";
import {BlurView} from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useRouter} from "expo-router";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Selector from "@/components/forms/Selector";

const Entries = () => {

    const image = require('@/assets/images/undraw_dreamer_gb41.png');
    const router = useRouter();
    const {colorScheme} = useColorScheme();

    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<ReminisceEntry[]>([] as ReminisceEntry[]);
    const [canSelect, setCanSelect] = useState(false);
    const [message, setMessage] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [entries, setEntries] = useState<ReminisceEntry[]>([] as ReminisceEntry[]);
    const { getEntries, loading, deleteItem } = useReminisce()
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [alertType, setAlertType] = useState<"success" | "error">("error");

    const onSelectPress = () => {
        if (!canSelect) {
            setCanSelect(true);
        } else {
            setCanSelect(false);
            setSelected([]);
        }
        console.debug("Selected entries: ", selected.map(entry => entry.title));
    }

    useEffect(() => {
        const fetchEntries = async () => {
            const fetchedEntries = await getEntries();
            if (fetchedEntries) {
                setEntries(fetchedEntries);
                console.debug("Entries fetched, found: ", fetchedEntries.length);
            } else {
                setMessage("No albums found");
                setVisible(true);
            }
        }

        fetchEntries();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        getEntries().then((valid) => {
            if (!valid) return;
            setRefreshing(false);
            console.debug("Albums refreshed, found: ", valid.length);
            setEntries(valid);
        });
    }, [getEntries]);

    // Timer to automatically close the alert after 3 seconds
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setVisible(false);
            }, 3000);
        }
    }, [visible]);

    const deleteEntry = useCallback(() => {
        if (selected.length === 0) {
            setMessage("No albums selected");
            setVisible(true);
            return;
        }
        if (confirmVisible) {
            // Delete albums
            console.debug("Deleting entries: ", selected.map(entry => entry.title));
            setConfirmVisible(false);

            // For each selected album, delete it
            selected.forEach(async (entry) => {
                await deleteItem({type: "entry", id: entry.uuid});

                getEntries().then((valid) => {
                    if (!valid) return;
                    console.debug("Entries updated, found: ", valid.length);
                    setEntries(valid);
                });
            })

            setSelected([]);
            setMessage("Entries deleted");
            setAlertType("success");
            setVisible(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setCanSelect(false);
            return;
        } else {
            setConfirmVisible(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    }, [confirmVisible, selected, deleteItem, getEntries]);

    return (
        <KeyboardAwareScrollView className={"dark:bg-neutral-800 bg-neutral-100"} contentContainerStyle={{flexGrow: 1}}
                                 refreshControl={
                                     <View>
                                         <RefreshControl title={"Refreshing..."} titleColor={colors.neutral[400]}
                                                         tintColor={colors.neutral[400]} refreshing={refreshing}
                                                         onRefresh={onRefresh}/>
                                     </View>
                                 }>
            <View className={"w-full p-6"}>
                <Alert message={message} type={alertType} onPress={() => {
                    setVisible(false);
                }} visible={visible} />
                <View className={"flex flex-row items-center gap-4"} style={{
                    shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}
                >
                    <Image source={image} style={{width: 100, height: 100}} className={"rounded-lg flex"}/>
                    <View className={"p-2 flex-1"}>
                        <Text className={"dark:text-white md:text-xl lg:text-2xl font-bold text-black"}>
                            Reminiscence Entries
                        </Text>
                        <Text className={"mt-2 text-neutral-600 dark:text-neutral-300 md:text-sm lg:text-base"}>
                            See past entries and reminisce on previous memories.
                        </Text>
                    </View>
                </View>
                <View className={"flex flex-row items-center gap-2 justify-between w-full"}>
                    <TouchableOpacity
                        onPress={
                            () => {
                                router.push("/(app)/(reminisce)/(tabs)/NewEntry");
                            }
                        }
                        className="flex-1 flex-row items-center mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900">
                        <MaterialIcons name="add" size={24} color="white" className={"mr-1"} />
                        <Text className="text-white">
                            Create Entry
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            onSelectPress();
                        }}
                        className={`flex-1 flex-row items-center mt-3 rounded-lg p-2 ${canSelect ? 'bg-amber-500' : 'bg-blue-600'} dark:bg-neutral-900`}>
                        <MaterialIcons name={canSelect ? 'cancel' : 'edit'} size={24} color="white" className={"mr-1"} />
                        <Text className="text-white">
                            {canSelect ? "Cancel" : "Select Entries"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Separator */}
                <View
                    className={"flex border-b dark:border-b-neutral-600 border-b-neutral-300 mt-3"}
                />
            </View>

            <View className={"w-full p-4"}>
                {/* Selected entries dropdown choices (Delete, etc.) */}
                <View className={"mb-2"}>
                    <Selector canSelect={canSelect} selected={selected} onSelect={onSelectPress} setConfirmVisible={setConfirmVisible} confirmVisible={confirmVisible} label={"Entries"}/>
                </View>

                {!loading && entries.length === 0 &&
                  <View className={"w-full flex-col items-center justify-center mt-2"}>
                    <Text className={"dark:text-white text-base font-bold"}>
                      It's very quiet here!
                    </Text>
                    <Text className={"dark:text-neutral-200 text-neutral-500 text-sm"}>
                      Add a new entry to get started.
                    </Text>
                  </View>
                }

                {/* Every 2 albums (Columns) create a new row */}
                {!loading && (
                    <View className={"flex-row flex-wrap justify-start"}>
                        {entries.map((entry) => (
                            <TouchableOpacity
                                key={entry.uuid}
                                activeOpacity={0.8}
                                onPress={() => {
                                    if (!canSelect) router.push(`/(app)/(reminisce)/entry/${entry.uuid}`);
                                    if (selected.includes(entry)) {
                                        setSelected(selected.filter(selectedEntry => selectedEntry !== entry));
                                    } else {
                                        setSelected([...selected, entry]);
                                    }
                                }}
                                className={"w-1/2 p-2"} >
                                <View className={"w-full relative"}>
                                    {canSelect && <View
                                      className={`absolute top-2 right-2 w-6 h-6 rounded-full border-1 border-gray-300 justify-center items-center ${
                                          selected.includes(entry) ? "bg-blue-500 border-blue-500" : ""
                                      }`}
                                    >
                                        {selected.includes(entry) ? (
                                                <MaterialIcons name={"check"} size={20} color={"white"} />
                                            ) :
                                            <MaterialIcons name={"add"} size={20} color={"blue"} />
                                        }
                                    </View>
                                    }
                                </View>
                                <View className={`w-full ${canSelect && selected.includes(entry) ? "opacity-50" : ""}`}>
                                    <View className={"rounded-lg bg-white dark:bg-neutral-900"}
                                          style={{
                                              shadowColor: colors.black,
                                              shadowOffset: {width: 0, height: 2},
                                              shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                              shadowRadius: 3.84,
                                              elevation: 2,
                                          }}>
                                        <Image
                                            className={"rounded-t-lg"}
                                            source={{uri: entry.pictureActual?.image_url}}
                                            loadingIndicatorSource={require('@/assets/images/undraw_loading_65y2.png')}
                                            style={{
                                                width: "100%", height: 125,
                                            }}
                                        />
                                        <View className={"p-4"}>
                                            <Text numberOfLines={1} className={"dark:text-white md:text-base lg:text-lg font-bold"}>
                                                {entry.pictureActual?.title}
                                            </Text>
                                            <Text className={"md:text-xs lg:text-base text-blue-500"}>
                                                {entry.patientActual?.first_name} {entry.patientActual?.last_name}
                                            </Text>
                                            <Text className={"text-xs text-neutral-500"}>
                                                {new Date(entry.date_taken).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <View className={`w-full`}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={confirmVisible}
                    onRequestClose={() => {
                        setConfirmVisible(!confirmVisible);
                    }}>
                    <BlurView intensity={Platform.OS === "ios" ? 75 : 100} style={[StyleSheet.absoluteFill, {
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: 5,
                    }]} />
                    <View className={"mt-safe-or-10 mx-4 dark:bg-neutral-900 border dark:border-neutral-900 border-gray-200 bg-white rounded-lg p-4 android:elevation-md"}>
                        <View className={"flex-row justify-start items-center"}>
                            <FontAwesome name={"close"} size={30} color={"red"}
                                         onPress={() => setConfirmVisible(!confirmVisible)}/>
                            <Text className={"text-lg ml-4 dark:text-white font-bold w-full"}>Delete Entries</Text>
                        </View>
                        <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: "white", marginVertical: 5}}/>
                        <Text className={"dark:text-gray-400 mt-2"}>
                            Are you sure you want to delete the selected entries?
                        </Text>
                        <Text className={"dark:text-red-500 mt-2"}>
                            This action is irreversible, all selected entries will be deleted.
                        </Text>
                        {selected.map((entry, index) => (
                            <View className={"p-2 dark:bg-black bg-neutral-100 mt-2 rounded-lg"} key={"selected"+entry.uuid}>
                                <Text className={"dark:text-gray-400"}>
                                    {index + 1}. {entry.pictureActual?.title} - {entry.patientActual?.first_name} {entry.patientActual?.last_name}
                                </Text>
                            </View>
                        ))}
                        <View className={"flex flex-row justify-center gap-2"}>
                            <TouchableOpacity
                                onPress={() => {
                                    deleteEntry();
                                }}
                                className={"flex-1 flex-row items-center mt-3 rounded-lg p-2 bg-red-600"}>
                                <MaterialIcons name="delete" size={24} color="white" className={"mr-1"} />
                                <Text className="text-white">
                                    Delete
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setConfirmVisible(!confirmVisible)
                                    // Deselect all albums
                                    setSelected([]);
                                    setCanSelect(false);
                                }}
                                className={"flex-1 flex-row items-center mt-3 rounded-lg p-2 bg-blue-600"}>
                                <MaterialIcons name="cancel" size={24} color="white" className={"mr-1"} />
                                <Text className="text-white">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default Entries;
