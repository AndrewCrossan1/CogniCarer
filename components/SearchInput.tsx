import {View, TouchableOpacity} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useState} from "react";
import Input from "@/components/Input";

export function SearchInput({placeholder, onSearch, modalVisibleFun}: { placeholder: string, onSearch: (s: string) => void, modalVisible: boolean, modalVisibleFun: () => void }) {
    const [searchValue, setSearchValue] = useState("")
    const [focused, setFocused] = useState(false);

    const onChangeText = (s: string) => {
        setSearchValue(s);
        onSearch(s);
    }

    return (
        <View className={`flex-row p-2.5 rounded-md border transition ease-linear ${focused ? "border-blue-500" : "border-gray-400"}`}>
            <FontAwesome style={{marginRight: 10}} name={"search"} size={16} color={focused ? "#3B82F6" : "#9ca3af"}/>
            <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
                <Input
                    className={"dark:text-white w-full"}
                    autoCorrect={false}
                    autoCapitalize={"none"}
                    onFocus={() => {setFocused(true)}}
                    onBlur={() => {setFocused(false)}}
                    onChangeText={onChangeText}
                    value={searchValue}
                    placeholderTextColor={"#AAAAA5"}
                    placeholder={placeholder}
                    noStyle={true}
                />
            </View>
            <TouchableOpacity className={"rounded-lg"}>
                <FontAwesome style={{marginLeft: 10}} name={"info-circle"} size={20}  color={focused ? "#3B82F6" : "#9ca3af"}
                                onPress={modalVisibleFun}
                />
            </TouchableOpacity>
        </View>
    )

}
