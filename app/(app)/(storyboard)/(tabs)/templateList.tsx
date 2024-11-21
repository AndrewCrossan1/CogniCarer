import {View, StyleSheet, Text} from "react-native";

export default function TemplateList() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
    });

    return (
        <View style={styles.container} className={"dark:bg-neutral-800"}>
            <Text className={"dark:text-white"}>Templates will be shown here.</Text>
        </View>
    )
}