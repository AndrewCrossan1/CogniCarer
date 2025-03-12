import {View, Text, TouchableOpacity, Animated, SafeAreaView} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function Alert({ message, type, visible, onPress}: { message: string, type: "error" | "success", visible: boolean, onPress: () => void }) {

    // Define colours
    const alertColors =
        type === "success" ? "bg-green-200 border-green-500 text-green-700" : "bg-red-200 border-red-500 text-red-700";

    return (
        visible && (
        <View className="w-full absolute top-0 left-0 right-0 z-50">
            <Animated.View
                className={`transition ease-linear mt-6 rounded-lg ${alertColors} p-6`}
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 3,
                    elevation: 5,
                }}>
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
        </View>
        )
    );

}
