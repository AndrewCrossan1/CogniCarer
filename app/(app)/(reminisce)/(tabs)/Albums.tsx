import {Image, ScrollView, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useAppSelector} from "@/hooks/store/hooks";
import {Alert} from "@/components/Alert";
import {useEffect, useState} from "react";
import colors from "tailwindcss/colors";

const Albums = () => {


    const theme = useThemeColor();
    const user = useAppSelector(state => state.user.user);
    const mode = useColorScheme();
    const image = require('@/assets/images/undraw_photo-album_9d6r.png');
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState([]);

    // Timer to automatically close the alert after 3 seconds
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setVisible(false);
            }, 3000);
        }
    }, [visible]);

    return (
        <ScrollView style={{backgroundColor: mode === 'dark' ? colors.neutral[800] : colors.white}} contentContainerStyle={{flexGrow: 1}}>
            <View className={"flex-1 items-center dark:bg-neutral-800 pb-10"}>
                <View className={"w-full bg-blue-500 dark:bg-neutral-800 p-6"}>
                    <Alert message={"No albums selected!"} type={"error"} onPress={() => {
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
                    <View className={"flex-row items-center justify-between w-full"}>
                        <TouchableOpacity
                            className="flex-row items-center mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50">
                            <MaterialIcons name="add" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Create Album
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-row items-center mt-3 rounded-lg p-2 bg-red-500 drop-shadow-md shadow-blue-500/50"
                            onPress={() => {
                                if (selected.length === 0) {
                                    setVisible(true);
                                }
                            }}>
                            <MaterialIcons name="delete" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Delete Album
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-row items-center mt-3 rounded-lg p-2 bg-amber-500 drop-shadow-md shadow-blue-500/50"
                            onPress={() => {
                                if (selected.length === 0) {
                                    setVisible(true);
                                }
                            }}>
                            <MaterialIcons name="edit" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Edit Album
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Albums;