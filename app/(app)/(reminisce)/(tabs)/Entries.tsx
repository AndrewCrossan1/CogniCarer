import {
    Image, Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import {Alert} from "@/components/Alert";
import {useCallback, useEffect, useState} from "react";
import {ReminisceEntry} from "@/services/api/types";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import {useReminisce} from "@/hooks/useReminisce";
import {BlurView} from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Entries = () => {

    const image = require('@/assets/images/undraw_dreamer_gb41.png');

    const mode = useColorScheme();

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
                await deleteItem({type: "entries", id: entry.uuid});

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

    // Selected Animations
    const maxHeight = useSharedValue(0)

    useEffect(() => {
        if (selected.length > 0) {
            maxHeight.value = withTiming(200, {
                duration: 1500,
                easing: Easing.out(Easing.exp)
            })
        } else {
            maxHeight.value = withTiming(0, {
                duration: 1500,
                easing: Easing.out(Easing.exp)
            })
        }
    }, [selected.length]);

    const animatedStyle = useAnimatedStyle(() => ({
        maxHeight: maxHeight.value,
        opacity: maxHeight.value > 0 ? 1 : 0
    }))

    return (
        <ScrollView style={{backgroundColor: mode === 'dark' ? colors.neutral[800] : colors.white}} contentContainerStyle={{flexGrow: 1}}
                    refreshControl={
                        <View>
                            <RefreshControl title={"Refreshing..."} titleColor={colors.neutral[400]}
                                            tintColor={colors.neutral[400]} refreshing={refreshing}
                                            onRefresh={onRefresh}/>
                        </View>
                    }>
            <View className={"flex-1 items-center dark:bg-neutral-800 pb-10"}>
                <View className={"w-full bg-blue-500 dark:bg-neutral-800 p-6"}>
                    <Alert message={message} type={alertType} onPress={() => {
                        setVisible(false);
                    }} visible={visible} />
                    <View className={"flex-row items-center"}>
                        <Image
                            source={image}
                            style={{width: 100, height: 100}}
                            className={"mr-4 rounded-lg"}
                        />
                        <View className={"p-2 w-3/4"}>
                            <Text className={"dark:text-white text-2xl font-bold text-white"}>
                                Reminiscence Entries
                            </Text>
                            <Text className={"mt-2 text-neutral-100 text-base"}>
                                See past entries and reminisce on previous memories.
                            </Text>
                        </View>
                    </View>
                    <View className={"flex-row items-center gap-2 justify-between w-full"}>
                        <TouchableOpacity
                            className="flex-row items-center mt-3 w-1/2 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900">
                            <MaterialIcons name="add" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Create Entry
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                onSelectPress();
                            }}
                            className={`flex-row items-center mt-3 w-1/2 rounded-lg p-2 ${canSelect ? 'bg-amber-500' : 'bg-blue-600'} dark:bg-neutral-900`}>
                            <MaterialIcons name={canSelect ? 'cancel' : 'edit'} size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                {canSelect ? "Cancel" : "Select Entries"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Selected album dropdown choices (Delete, etc) */}
                <Animated.View style={[styles.selectedContainer, animatedStyle]}>
                    {canSelect && selected.length > 0 &&
                        <View className={"w-full px-4 pt-4 flex-row items-center justify-between"}>
                            <Text className={"dark:text-white text-lg font-bold"}>
                                Selected Entries
                            </Text>
                            <Text className={"text-blue-500 text-sm"}>
                                {selected.length} Selected
                            </Text>
                        </View>
                    }
                    {canSelect && selected.length > 0 &&
                        <View>
                            <View className={"flex-row items-center justify-center gap-5 px-4 w-full"}>
                                <TouchableOpacity
                                    onPress={() => {
                                        deleteEntry();
                                    }}
                                    className="flex-row items-center mt-3 w-full rounded-lg p-2 bg-red-600 dark:bg-neutral-900">
                                    <MaterialIcons name="delete" size={24} color="white" className={"mr-1"} />
                                    <Text className="text-white">
                                        Delete
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </Animated.View>

                {/* Every 2 albums (Columns) create a new row */}
                {!loading &&
                    <View className={"w-full p-4"}>
                        <View className={"flex-row flex-wrap justify-start"}>
                            {entries.map((entry) => (
                                <TouchableOpacity
                                    key={entry.uuid}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        if (!canSelect) return;
                                        if (selected.includes(entry)) {
                                            setSelected(selected.filter(selectedEntry => selectedEntry !== entry));
                                        } else {
                                            setSelected([...selected, entry]);
                                        }
                                    }}
                                    className={"w-1/2 p-2"}>
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
                                    <View className={`w-full ${canSelect && selected.includes(entry) ? "opacity-50" : null}`}>
                                        <View className={"justify-center items-center"}>
                                            {/* Image */}
                                            <Image
                                                className={"rounded-t-lg border-t-2 border-l-2 border-r-2 dark:border-neutral-900 border-gray-100"}
                                                source={{uri: entry.pictureActual?.image_url}}
                                                loadingIndicatorSource={require('@/assets/images/undraw_loading_65y2.png')}
                                                style={{width: "100%", height: 175}}
                                            />
                                        </View>
                                        <View className={"rounded-b-lg bg-neutral-100 dark:bg-neutral-900 p-4"}>
                                            <View className={"flex-row items-center justify-between"}>
                                                <Text numberOfLines={1} className={"dark:text-white text-lg font-bold"}>
                                                    {entry.pictureActual?.title}
                                                </Text>
                                            </View>
                                            <Text className={"text-sm dark:text-blue-500"}>
                                                By {entry.patientActual?.first_name} {entry.patientActual?.last_name}
                                            </Text>
                                            <Text className={"text-sm text-neutral-500"}>
                                                Taken at: {new Date(entry.date_taken).toDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                }
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={confirmVisible}
                onRequestClose={() => {
                    setConfirmVisible(!confirmVisible);
                }}>
                <BlurView intensity={75} style={[StyleSheet.absoluteFill, styles.modalView]}/>
                <View className={"mt-safe mx-safe-or-4 dark:bg-neutral-900 bg-white rounded-lg elevation-md p-4"}>
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
                                {index + 1}. {entry.title}
                            </Text>
                        </View>
                    ))}
                    <View className={"flex flex-row justify-center gap-2"}>
                        <TouchableOpacity
                            onPress={() => {
                                deleteEntry();
                            }}
                            className={"flex-row items-center w-1/2 mt-3 rounded-lg p-2 bg-red-600 dark:bg-neutral-900"}>
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
                            className={"flex-row items-center w-1/2 mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900"}>
                            <MaterialIcons name="cancel" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    selectedContainer: {
        flex: 1,
        overflow: 'hidden',
    },
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
})

export default Entries;
