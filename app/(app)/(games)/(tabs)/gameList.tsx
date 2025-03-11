import {View, Text} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const GameList = () => {
    return (
        <KeyboardAwareScrollView contentContainerStyle={{alignItems: "center", justifyContent: "center", flex: 1}}>
            <Text>Game List</Text>
        </KeyboardAwareScrollView>
    )
}

export default GameList;
