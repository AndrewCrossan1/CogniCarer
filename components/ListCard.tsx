import {View, Image, Text, StyleSheet} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";

/**
 * ListCard Component
 * @description This component is used to display a card with information in it
 * @param title The title of the card
 * @param description The description of the card
 * @param image The image of the card
 */
export function ListCard(title: string, description: string, image?: string) {
   const theme = useThemeColor();

   const styles = StyleSheet.create({
       container: {
           flex: 1,
           justifyContent: "center",
           alignItems: "center",
       }
   })

    return (
        <View style={styles.container}>
            <Text>{title}</Text>
            <Text>{description}</Text>
            {image && <Image source={{uri: image}}/>}
        </View>
    )
}