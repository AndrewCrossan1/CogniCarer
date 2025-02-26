// Code obtained from https://docs.expo.dev/tutorial/image-picker/

import {StyleSheet} from "react-native";
import {Image} from "react-native";

export default function ImageViewer(props: { source?: string }) {
    const image = props.source !== undefined ? props.source : "https://via.placeholder.com/150";

    return (
        <Image source={{uri: image}} style={styles.image} />
    );
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150,
    },
});