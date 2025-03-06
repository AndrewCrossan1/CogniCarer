import {
    Image, Modal, Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {useColorScheme} from "nativewind";
import {MaterialIcons} from "@expo/vector-icons";
import {Alert} from "@/components/Alert";
import {useCallback, useEffect, useState} from "react";
import colors from "tailwindcss/colors";
import {useReminisce} from "@/hooks/useReminisce";
import {UserAlbum} from "@/services/api/types";
import * as Haptics from "expo-haptics";
import {Easing, useSharedValue, withTiming} from "react-native-reanimated";
import {BlurView} from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import NewAlbumForm from "@/components/reminisce/NewAlbumForm";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Selector from "@/components/forms/Selector";

const Albums = () => {

    const {colorScheme} = useColorScheme();
    const image = require('@/assets/images/undraw_photo-album_9d6r.png');
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<UserAlbum[]>([] as UserAlbum[]);
    const [albums, setAlbums] = useState([] as UserAlbum[]);
    const [message, setMessage] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [canSelect, setCanSelect] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [alertType, setAlertType] = useState<"success" | "error">("error");
    const [newAlbumVisible, setNewAlbumVisible] = useState(false);

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
                await deleteItem({type: "album", id: album.uuid});

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
    }, [confirmVisible, selected, deleteItem, getAlbums]);

    // Timer to automatically close the alert after 3 seconds
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setVisible(false);
            }, 3000);
        }
    }, [visible]);

    const onSubmitted = () => {
        // Fetch albums again
        getAlbums().then((valid) => {
            if (!valid) return;
            console.debug("Albums updated, found: ", valid.length);
            setAlbums(valid);
        });
        // Show success message
        setMessage("Album created successfully");
        setAlertType("success");
        setVisible(true);
        setNewAlbumVisible(false);
    };

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

    return (
        <KeyboardAwareScrollView className={"dark:bg-neutral-800 bg-neutral-100"} contentContainerStyle={{flexGrow: 1}}
                    refreshControl={
                        <View>
                            <RefreshControl title={"Refreshing..."} titleColor={colors.neutral[400]}
                                            tintColor={colors.neutral[400]} refreshing={refreshing}
                                            onRefresh={onRefresh}/>
                        </View>
                    }>
                <View className={`w-full p-6`}>
                    <Alert message={message} type={alertType} onPress={() => {
                        setVisible(false);
                    }} visible={visible} />
                    <View className={"flex flex-row items-center gap-4"} style={{
                        shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}
                    >
                        <Image
                            source={image}
                            style={{width: 100, height: 100}}
                            className={"rounded-lg flex"}
                        />
                        <View className={"flex-1 p-2"}>
                            <Text className={"dark:text-white md:text-xl lg:text-2xl font-bold text-black"}>
                                Albums
                            </Text>
                            <Text className={"mt-2 text-neutral-600 dark:text-neutral-300 md:text-sm lg:text-base"}>
                                See all of your pictures by their respective albums.
                            </Text>
                        </View>
                    </View>
                    <View className={"flex flex-row items-center gap-2 justify-between w-full"}>
                        <TouchableOpacity
                            className="flex-1 flex-row items-center mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900"
                            onPress={() => {
                                setNewAlbumVisible(true);
                            }}>
                            <MaterialIcons name="add" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Create Album
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                onSelectPress();
                            }}
                            className={`flex-1 flex-row items-center mt-3 rounded-lg p-2 ${canSelect ? 'bg-amber-500' : 'bg-blue-600'} dark:bg-neutral-900`}>
                            <MaterialIcons name={canSelect ? 'cancel' : 'edit'} size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                {canSelect ? "Cancel" : "Select Albums"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Separator */}
                    <View
                        className={"flex border-b dark:border-b-neutral-600 border-b-neutral-300 mt-3"}
                    />
                </View>

            <View className={"w-full p-4"}>
                <View className={"mb-2"}>
                    <Selector canSelect={canSelect} selected={selected} onSelect={onSelectPress} setConfirmVisible={setConfirmVisible} confirmVisible={confirmVisible} label={"Albums"}/>
                </View>

                {!loading && albums.length === 0 &&
                  <View className={"w-full flex-col items-center justify-center mt-2"}>
                    <Text className={"dark:text-white text-base font-bold"}>
                      It's very quiet here!
                    </Text>
                    <Text className={"dark:text-neutral-200 text-neutral-500 text-sm"}>
                      Add a new album to get started.
                    </Text>
                  </View>
                }

                {!loading && (
                    <View className={"flex-row flex-wrap justify-start"}>
                        {albums.map((album) => (
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
                                            style={{width: "100%", height: 125}}
                                        />
                                    </View>
                                    <View className={"rounded-b-lg bg-white dark:bg-neutral-900 p-4"} style={{
                                        shadowColor: colors.black,
                                        shadowOffset: {width: 0, height: 2},
                                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                        shadowRadius: 3.84,
                                        elevation: 2
                                    }}>
                                        <View className={"flex flex-row items-center justify-evenly gap-4"}>
                                            <Text className={"flex-1 dark:text-white md:text-base lg:text-lg font-bold"}>
                                                {album.title}
                                            </Text>
                                            <Text className={"text-blue-500 md:text-xs lg:text-sm"}>
                                                {album.picture_count} Pictures
                                            </Text>
                                        </View>

                                        <Text className={"md:text-xs lg:text-sm text-blue-500"}>
                                            {album.patientActual?.first_name} {album.patientActual?.last_name}
                                        </Text>

                                        <Text className={"text-xs text-neutral-500"}>
                                            Created: {new Date(album.created_at).toLocaleDateString()}
                                        </Text>
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
                        setConfirmVisible(false);
                    }}>
                        <BlurView intensity={Platform.OS === "ios" ? 75 : 100}
                              style={[StyleSheet.absoluteFill, {
                                  shadowColor: '#000',
                                  shadowOffset: {
                                      width: 0,
                                      height: 2,
                                  },
                                  shadowOpacity: 0.5,
                                  shadowRadius: 4,
                                  elevation: 5,
                              }]}
                        />
                    <View className={"mt-safe-or-10 mx-4 dark:bg-neutral-900 border dark:border-neutral-900 border-gray-200 bg-white rounded-lg p-4 android:elevation-md"}>
                        <View className={"flex-row justify-start items-center"}>
                            <FontAwesome name={"close"} size={30} color={"red"}
                                         onPress={() => setConfirmVisible(false)}/>
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
                                className={"flex-1 flex-row items-center mt-3 rounded-lg p-2 bg-red-600"}>
                                <MaterialIcons name="delete" size={24} color="white" className={"mr-1"} />
                                <Text className="text-white">
                                    Delete
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setConfirmVisible(false)
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
            <View className={"w-full absolute"}>
                <NewAlbumForm visible={newAlbumVisible} onSubmitted={onSubmitted} onClose={() => setNewAlbumVisible(!newAlbumVisible)}/>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default Albums;
