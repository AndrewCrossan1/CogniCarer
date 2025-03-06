import {
    Image,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "tailwindcss/colors";
import {useColorScheme} from "nativewind";
import {Alert} from "@/components/Alert";
import {useCallback, useEffect, useState} from "react";
import * as Haptics from "expo-haptics";
import {Picture} from "@/services/api/types";
import {useReminisce} from "@/hooks/useReminisce";
import {BlurView} from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Selector from "@/components/forms/Selector";
import NewPictureForm from "@/components/reminisce/NewPictureForm";

const Pictures = () => {

    const image = require('@/assets/images/undraw_asset-selection_jrie.png');
    const {colorScheme} = useColorScheme();

    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<Picture[]>([] as Picture[]);
    const [pictures, setPictures] = useState<Picture[]>([] as Picture[]);
    const [message, setMessage] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [canSelect, setCanSelect] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [alertType, setAlertType] = useState<"success" | "error">("error");
    const [newPictureVisible, setNewPictureVisible] = useState(false);

    const onSelectPress = () => {
        if (!canSelect) {
            setCanSelect(true);
        } else {
            setCanSelect(false);
            setSelected([]);
        }
    }

    const {getPictures, loading, deleteItem} = useReminisce()

    // Timer to automatically close the alert after 3 seconds
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setVisible(false);
            }, 3000);
        }
    }, [visible]);

    // Fetch pictures on component mount
    useEffect(() => {
        const fetchPictures = async () => {
            const fetchedPictures = await getPictures();
            if (fetchedPictures) {
                setPictures(fetchedPictures);
            } else {
                setMessage("No Pictures found");
                setVisible(true);
            }
        }

        fetchPictures();
    }, []);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        getPictures().then((valid) => {
            if (!valid) return;
            setRefreshing(false);
            setPictures(valid);
        });
    }, [getPictures]);

    const deletePicture = useCallback(() => {
        if (selected.length === 0) {
            setMessage("No Pictures selected");
            setVisible(true);
            return;
        }
        if (confirmVisible) {
            // Delete albums
            console.debug("Deleting pictures: ", selected.map(picture => picture.title));
            setConfirmVisible(false);
            // For each selected album, delete it
            selected.forEach(async (picture) => {
                await deleteItem({type: "picture", id: picture.uuid});
                console.debug("Deleted picture: ", picture.title);

                getPictures().then((valid) => {
                    if (!valid) return;
                    console.debug("Pictures updated, found: ", valid.length);
                    setPictures(valid);
                });
            })
            setSelected([]);
            setMessage("Picture(s) deleted");
            setAlertType("success");
            setVisible(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setCanSelect(false);
            return;
        } else {
            setConfirmVisible(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    }, [confirmVisible, selected, deleteItem, getPictures]);


    const onSubmitted = () => {
        // Fetch albums again
        getPictures().then((valid) => {
            if (!valid) return;
            setPictures(valid);
        });
        // Show success alert
        setMessage("Picture uploaded successfully");
        setAlertType("success");
        setVisible(true);

        // Close the modal
        setNewPictureVisible(false);
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={{alignItems: "center"}} className={"flex dark:bg-neutral-800"}
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
                    shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 5}}
                >
                    <Image source={image} className={"rounded-lg flex"} resizeMode={"cover"} style={{width: 100, height: 100}}/>
                    <View className={"p-2 flex-1"}>
                        <Text className={"dark:text-white md:text-xl lg:text-2xl font-bold text-black"}>
                            Pictures
                        </Text>
                        <Text className={"mt-2 text-neutral-600 dark:text-neutral-300 md:text-sm lg:text-base"}>
                            View, delete and add pictures to your family members' profiles.
                        </Text>
                    </View>
                </View>
                <View className={"flex flex-row items-center justify-between gap-2 w-full"}>
                    <TouchableOpacity
                        onPress={() => {
                            setNewPictureVisible(!newPictureVisible);
                        }}
                        className="flex-row items-center mt-3 flex-1 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900">
                        <MaterialIcons name="upload" size={24} color="white" className={"mr-1"} />
                        <Text className="text-white">
                            Add Pictures
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            onSelectPress();
                        }}
                        className={`flex-row items-center mt-3 flex-1 rounded-lg p-2 ${canSelect ? 'bg-amber-500' : 'bg-blue-600'} dark:bg-neutral-900`}>
                        <MaterialIcons name={canSelect ? 'cancel' : 'edit'} size={24} color="white" className={"mr-1"} />
                        <Text className="text-white">
                            {canSelect ? "Cancel" : "Select Pictures"}
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
                    <Selector canSelect={canSelect} selected={selected} onSelect={onSelectPress} setConfirmVisible={setConfirmVisible} confirmVisible={confirmVisible} label={"Pictures"}/>
                </View>
                {!loading && pictures.length === 0 &&
                  <View className={"w-full flex-col items-center justify-center"}>
                    <Text className={"dark:text-white text-base font-bold"}>
                      It's very quiet here!
                    </Text>
                    <Text className={"dark:text-neutral-200 text-neutral-500 text-sm"}>
                      No pictures found, add some to get started.
                    </Text>
                  </View>
                }

                {/* Every 2 albums (Columns) create a new row */}
                {!loading && (
                    <View className={"flex-row flex-wrap justify-start w-full"}>
                        {pictures.map((picture) => (
                            <TouchableOpacity
                                key={picture.uuid}
                                activeOpacity={0.8}
                                onPress={() => {
                                    if (!canSelect) return;
                                    if (selected.includes(picture)) {
                                        setSelected(selected.filter(selectedPicture => selectedPicture !== picture));
                                    } else {
                                        setSelected([...selected, picture]);
                                    }
                                }}
                                className={"w-1/2 p-2"}
                            >
                                <View className={"bg-neutral-100 dark:bg-neutral-800 rounded-lg"} style={{
                                    shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}
                                >
                                    <View className={"w-full relative"}>
                                        {canSelect && <View
                                          className={`absolute top-2 right-2 w-6 h-6 rounded-full border-1 border-gray-300 justify-center items-center ${
                                              selected.includes(picture) ? "bg-blue-500 border-blue-500" : ""
                                          }`}
                                        >
                                            {selected.includes(picture) ? (
                                                    <MaterialIcons name={"check"} size={20} color={"white"} />
                                                ) :
                                                <MaterialIcons name={"add"} size={20} color={"blue"} />
                                            }
                                        </View>
                                        }
                                    </View>
                                    <View className={`${canSelect && selected.includes(picture) ? "opacity-50" : null}`}>
                                        <View className={"justify-center items-center"}>
                                            {/* Image */}
                                            <Image
                                                className={"rounded-t-lg xs:h-20 sm:h-24 md:h-40 lg:h-44 xl:h-48"}
                                                source={{uri: picture.image_url}}
                                                loadingIndicatorSource={require('@/assets/images/undraw_loading_65y2.png')}
                                                style={{width: "100%"}}
                                            />
                                        </View>
                                        <View className={"rounded-b-lg bg-neutral-100 dark:bg-neutral-900 p-4"}>
                                            <View className={"flex-row items-center justify-between"}>
                                                <Text numberOfLines={1} className={"dark:text-white lg:text-lg font-bold"}>
                                                    {picture.title}
                                                </Text>
                                            </View>
                                            <Text className={"text-blue-500 text-sm"}>
                                                {picture.albumActual ? picture.albumActual.title : "No Album"}
                                            </Text>
                                            <Text className={"text-blue-500 text-sm"}>
                                                {picture.patientActual?.first_name} {picture.patientActual?.last_name}
                                            </Text>
                                            <Text className={"text-xs text-neutral-500"}>
                                                Uploaded: {new Date(picture.created_at).toDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={confirmVisible}
                onRequestClose={() => {
                    setConfirmVisible(!confirmVisible);
                }}>
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
                <View className={"mt-safe mx-safe-or-4 dark:bg-neutral-900 bg-white rounded-lg  p-4"}>
                    <View className={"flex-row justify-start items-center"}>
                        <FontAwesome name={"close"} size={30} color={"red"}
                                     onPress={() => setConfirmVisible(!confirmVisible)}/>
                        <Text className={"text-lg ml-4 dark:text-white font-bold w-full"}>Delete Pictures</Text>
                    </View>
                    <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: "white", marginVertical: 5}}/>
                    <Text className={"dark:text-gray-400 mt-2"}>
                        Are you sure you want to delete the selected pictures?
                    </Text>
                    <Text className={"dark:text-red-500 mt-2"}>
                        This action is irreversible, all selected pictures will be deleted.
                    </Text>
                    {selected.map((picture, index) => (
                        <View className={"p-2 dark:bg-black bg-neutral-100 mt-2 rounded-lg"} key={picture.uuid + "-deletion"}>
                            <Text className={"dark:text-gray-400"}>
                                {index + 1}. {picture.title}
                            </Text>
                        </View>
                    ))}
                    <View className={"flex flex-row justify-center gap-2"}>
                        <TouchableOpacity
                            onPress={deletePicture}
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
            <NewPictureForm visible={newPictureVisible} onSubmitted={onSubmitted} onClose={() => setNewPictureVisible(!newPictureVisible)}/>
        </KeyboardAwareScrollView>
    )
}

export default Pictures;
