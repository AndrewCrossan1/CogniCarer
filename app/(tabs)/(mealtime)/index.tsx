import {StyleSheet, Text, View} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import "@/global.css";

export default function MealIndex() {
    const theme = useThemeColor();

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.dark,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        text: {
            color: theme.text,
        }
    });
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Meals</Text>
        </View>
    )
}
