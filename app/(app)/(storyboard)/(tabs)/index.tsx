import {View, Text, StyleSheet} from "react-native";

export default function Storyboard() {
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