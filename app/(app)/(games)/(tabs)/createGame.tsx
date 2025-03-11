import {Text, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const createGame = () => {
    return (
        <KeyboardAwareScrollView contentContainerStyle={{alignItems: "center", justifyContent: "center", flex: 1}}>
            <Text>Game List</Text>
        </KeyboardAwareScrollView>
    )
}

export default createGame;
