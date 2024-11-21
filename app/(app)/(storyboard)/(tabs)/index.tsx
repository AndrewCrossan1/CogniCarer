import {View, Text, StyleSheet} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";

export default function Storyboard() {
    // This is the home page for Storyboards, responses and templates will be briefly displayed here,
    // The user can also choose to register a new response with a patient.
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
        },
    });
    return (
        <View style={styles.container} className={"dark:bg-neutral-800 p-2"}>
            <View className={"w-full p-4"}>
            </View>
            <Text className={"dark:text-white"}>Recent Responses</Text>
            <Text className={"dark:text-white"}>Recently created Templates</Text>
        </View>
    );
}