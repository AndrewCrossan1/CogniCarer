import {Image, ScrollView, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import { useThemeColor} from "@/hooks/useThemeColor";
import {useAppSelector} from "@/hooks/store/hooks";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import {Alert} from "@/components/Alert";
import {useEffect, useState} from "react";

const Entries = () => {

    const image = require('@/assets/images/undraw_dreamer_gb41.png');

    const theme = useThemeColor();
    const user = useAppSelector(state => state.user.user);
    const mode = useColorScheme();

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
                    <Alert message={"No entries selected!"} type={"error"} onPress={() => {
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
                            className="flex-row items-center mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50">
                            <MaterialIcons name="add" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Create Entry
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if (selected.length === 0) {
                                    setVisible(true);
                                }
                            }}
                            className="flex-row items-center mt-3 rounded-lg p-2 bg-red-500 dark:bg-red-500 drop-shadow-md shadow-blue-500/50">
                            <MaterialIcons name="delete" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Delete Entry
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-row items-center mt-3 rounded-lg p-2 bg-amber-500 dark:bg-amber-500 drop-shadow-md shadow-blue-500/50">
                            <MaterialIcons name="edit" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Edit Entry
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Entries;