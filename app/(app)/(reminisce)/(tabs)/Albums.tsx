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
import {Alert} from "@/components/Alert";
import {useCallback, useEffect, useState} from "react";
import colors from "tailwindcss/colors";
import {useReminisce} from "@/hooks/useReminisce";
import {UserAlbum} from "@/services/api/types";
import * as Haptics from "expo-haptics";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {BlurView} from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Albums = () => {

    const mode = useColorScheme();
    const image = require('@/assets/images/undraw_photo-album_9d6r.png');
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<UserAlbum[]>([] as UserAlbum[]);
    const [albums, setAlbums] = useState([] as UserAlbum[]);
    const [message, setMessage] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [canSelect, setCanSelect] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [alertType, setAlertType] = useState<"success" | "error">("error");

    const onSelectPress = () => {
        if (!canSelect) {
            setCanSelect(true);
        } else {
            setCanSelect(false);
            setSelected([]);
        }
        console.debug("Selected albums: ", selected.map(album => album.title));
    }

    const {getAlbums, deleteItem, loading } = useReminisce()

    const albumCover = require('@/assets/images/yes.png');

    useEffect(() => {
        const fetchAlbums = async () => {
            const fetchedAlbums = await getAlbums();
            if (fetchedAlbums) {
                setAlbums(fetchedAlbums);
                console.debug("Albums fetched, found: ", fetchedAlbums.length);
            } else {
                setMessage("No albums found");
                setVisible(true);
            }
        }

        fetchAlbums();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        getAlbums().then((valid) => {
            if (!valid) return;
            setRefreshing(false);
            console.debug("Albums refreshed, found: ", valid.length);
            setAlbums(valid);
        });
    }, [getAlbums]);

    const deleteAlbum = useCallback(() => {
        if (selected.length === 0) {
            setMessage("No albums selected");
            setVisible(true);
            return;
        }
        if (confirmVisible) {
            // Delete albums
            console.debug("Deleting albums: ", selected.map(album => album.title));
            setConfirmVisible(false);

            // For each selected album, delete it
            selected.forEach(async (album) => {
                await deleteItem({type: "user-albums", id: album.uuid});

                getAlbums().then((valid) => {
                    if (!valid) return;
                    console.debug("Albums updated, found: ", valid.length);
                    setAlbums(valid);
                });
            })

            setSelected([]);
            setMessage("Albums deleted");
            setAlertType("success");
            setVisible(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setCanSelect(false);
            return;
        } else {
            setConfirmVisible(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    }, [confirmVisible, selected]);

    // Timer to automatically close the alert after 3 seconds
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setVisible(false);
            }, 3000);
        }
    }, [visible]);

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
            <View className={"flex-1 items-center dark:bg-neutral-800 pb-4"}>
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
                                Albums
                            </Text>
                            <Text className={"mt-2 text-neutral-100 text-base"}>
                                See all of your pictures by their respective albums.
                            </Text>
                        </View>
                    </View>
                    <View className={"flex-row items-center justify-center gap-5 w-full"}>
                        <TouchableOpacity
                            className="flex-row items-center mt-3 w-1/2 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50">
                            <MaterialIcons name="add" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Create Album
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                onSelectPress();
                            }}
                            className={`flex-row items-center mt-3 w-1/2 rounded-lg p-2 ${canSelect ? 'bg-amber-500' : 'bg-blue-600'} dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50`}>
                            <MaterialIcons name={canSelect ? 'cancel' : 'edit'} size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                {canSelect ? "Cancel" : "Select Albums"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Selected album dropdown choices (Delete, etc) */}
                <Animated.View style={[styles.selectedContainer, animatedStyle]}>
                    {canSelect && selected.length > 0 &&
                      <View className={"w-full px-4 pt-4 flex-row items-center justify-between"}>
                        <Text className={"dark:text-white text-lg font-bold"}>
                          Selected Albums
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
                                deleteAlbum();
                            }}
                            className="flex-row items-center mt-3 w-full rounded-lg p-2 bg-red-600 dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50">
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
                        {albums.map((album, index) => (
                            <TouchableOpacity
                                key={album.uuid}
                                activeOpacity={0.8}
                                onPress={() => {
                                    if (!canSelect) return;
                                    if (selected.includes(album)) {
                                        setSelected(selected.filter(selectedAlbum => selectedAlbum !== album));
                                    } else {
                                        setSelected([...selected, album]);
                                    }
                                }}
                                className={"w-1/2 p-2"}>
                                <View className={"w-full relative"}>
                                    {canSelect && <View
                                      className={`absolute top-2 right-2 w-6 h-6 rounded-full border-1 border-gray-300 justify-center items-center ${
                                          selected.includes(album) ? "bg-blue-500 border-blue-500" : ""
                                      }`}
                                    >
                                        {selected.includes(album) ? (
                                                <MaterialIcons name={"check"} size={20} color={"white"} />
                                            ) :
                                            <MaterialIcons name={"add"} size={20} color={"blue"} />
                                        }
                                    </View>
                                    }
                                </View>
                                <View className={`w-full ${canSelect && selected.includes(album) ? "opacity-50" : null}`}>
                                    <View className={"justify-center items-center"}>
                                        {/* Album Cover */}
                                        <Image
                                            className={"rounded-t-lg"}
                                            source={albumCover}
                                            style={{width: "100%", height: 175}}
                                        />
                                    </View>
                                    <View className={"rounded-b-lg bg-neutral-100 dark:bg-neutral-900 p-4"}>
                                        <View className={"flex-row items-center justify-between"}>
                                            <Text className={"dark:text-white text-lg font-bold"}>
                                                {album.title}
                                            </Text>
                                            <Text className={"text-blue-500 text-sm"}>
                                                {album.picture_count} Pictures
                                            </Text>
                                        </View>
                                        <Text className={"text-sm text-blue-500"}>
                                            {album.patientActual?.first_name} {album.patientActual?.last_name}
                                        </Text>

                                        <Text className={"text-xs text-neutral-500"}>
                                            Created: {new Date(album.created_at).toDateString()}
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
                        <Text className={"text-lg ml-4 dark:text-white font-bold w-full"}>Delete Albums</Text>
                    </View>
                    <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: "white", marginVertical: 5}}/>
                    <Text className={"dark:text-gray-400 mt-2"}>
                        Are you sure you want to delete the selected albums?
                    </Text>
                    <Text className={"text-red-500 mt-2"}>
                        This action is irreversible, any pictures in the album will not be affected.
                    </Text>
                    {selected.map((album, index) => (
                        <View className={"p-2 dark:bg-black bg-neutral-100 mt-2 rounded-lg"} key={"selected" + album.uuid}>
                            <Text className={"dark:text-white"}>
                                {index + 1}. {album.title}
                            </Text>
                        </View>
                    ))}
                    <View className={"flex flex-row justify-center gap-2"}>
                        <TouchableOpacity
                            onPress={() => deleteAlbum()}
                            className={"flex-row items-center w-1/2 mt-3 rounded-lg p-2 bg-red-600 dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50"}>
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
                            className={"flex-row items-center w-1/2 mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50"}>
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

export default Albums;
