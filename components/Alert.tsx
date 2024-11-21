import {View, Text, TouchableOpacity, Animated, SafeAreaView} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useEffect, useRef} from "react";

export function Alert({ message, type, visible, onPress}: { message: string, type: "error" | "success", visible: boolean, onPress: () => void }) {

    // Define colours
    const alertColors =
        type === "success" ? "bg-green-200 border-green-500 text-green-700" : "bg-red-200 border-red-500 text-red-700";

    return (
        <SafeAreaView className={"flex-1 inset-x-0 top-0"} style={{ zIndex: 1000}}>
            <Animated.View
                className={`transition ease-linear ${visible ? "visible" : "invisible" } absolute top-6 left-4 right-4 mx-auto border-1-4 rounded-lg ${alertColors} p-4`}
                style={{ zIndex: 1000 }}>
                <TouchableOpacity onPress={onPress} className={"absolute top-2 right-2"}>
                    <FontAwesome name={"close"} size={30} color={"#000"}/>
                </TouchableOpacity>

                {/* Alert Type */}
                <View className={"flex flex-row items-center"}>
                    <FontAwesome name={type === "success" ? "check-circle" : "exclamation-circle"} size={20}/>
                    <Text className={"ml-2 font-bold"}>{type === "success" ? "Success" : "Error"}</Text>
                </View>

                {/* Alert Message */}
                <Text className={"mt-2"}>{message}</Text>
            </Animated.View>
        </SafeAreaView>
    );

}
