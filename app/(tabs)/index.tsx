import { Text, View, StyleSheet } from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import "@/global.css";

export default function Index() {
  const themeColor = useThemeColor();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: themeColor.dark,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: themeColor.text,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
