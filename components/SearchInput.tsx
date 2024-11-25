import {View, TextInput, StyleSheet, TouchableOpacity, SafeAreaView} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useState} from "react";

export function SearchInput({placeholder, onSearch, modalVisibleFun}: { placeholder: string, onSearch: (s: string) => void, modalVisible: boolean, modalVisibleFun: () => void }) {
    const theme = useThemeColor();
    const [borderColor, setBorderColor] = useState("border-neutral-900");
    const [iconColor, setIconColor] = useState("dimgrey");
    const [searchValue, setSearchValue] = useState("")

    const onChangeText = (s: string) => {
        setSearchValue(s);
        onSearch(s);
    }

    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
        },
        icon: {
            marginRight: 10,
        },
        input: {
            flex: 1,
            color: theme.text,
        },
    })

    const onInputFocus = () => {
        setBorderColor("border-blue-500");
        setIconColor(theme.text);
    }
    const onInputFocusOut = () => {
        setBorderColor("border-neutral-900");
        setIconColor("dimgrey");
    }

    return (
        <SafeAreaView>
            <View style={styles.container}
                  className={`dark:bg-neutral-900 w-full border ${borderColor} transition ease-linear`}>
                <FontAwesome style={{marginRight: 10}} name={"search"} size={16} color={iconColor}/>
                <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
                    <TextInput
                        className={"dark:text-white w-full"}
                        onFocus={onInputFocus}
                        onBlur={onInputFocusOut}
                        placeholder={placeholder}
                        autoCorrect={false}
                        autoCapitalize={"none"}
                        onChangeText={(s) => {
                            onChangeText(s)
                        }}
                        value={searchValue}
                        placeholderTextColor={"dimgrey"}
                    />
                </View>
                <TouchableOpacity onPress={() => {
                    modalVisibleFun();
                }} className={"rounded-lg"}>
                    <FontAwesome style={{marginLeft: 10}} name={"info-circle"} size={20} color={iconColor}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}
