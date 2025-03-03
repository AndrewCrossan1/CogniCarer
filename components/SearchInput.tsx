import {View, TouchableOpacity} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import Input from "@/components/forms/Input";
import colors from "tailwindcss/colors";
import {useColorScheme} from "nativewind";


export type SearchInputRef = {
    clearSearch: () => void;
}

interface SearchInputProps {
    placeholder: string;
    onSearch: (s: string) => void;
    modalVisible: boolean;
    modalVisibleFun: () => void;
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>((props, ref) => {
    const [searchValue, setSearchValue] = useState("")
    const [focused, setFocused] = useState(false);
    const {colorScheme} = useColorScheme();

    const onChangeText = (s: string) => {
        setSearchValue(s);
        props.onSearch(s);
    }

    /* Make this a ref so that it can be accessed from the parent component */
    const searchInputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        clearSearch: () => {
            setSearchValue("");
        }
    }));

    const setColor = () => {
        if (colorScheme === "dark") {
            if (!focused) {
                return colors.neutral[400]
            }
            return colors.white
        } else {
            if (!focused) {
                return colors.neutral[400]
            }
            return colors.black
        }
    }

    return (
        <View className={`flex-row p-2.5 rounded-lg bg-neutral-200 dark:bg-neutral-900 transition ease-linear}`}>
            <FontAwesome style={{marginRight: 10}} name={"search"} size={16} color={setColor()}/>
            <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
                <Input
                    className={"dark:text-white w-full"}
                    autoCorrect={false}
                    autoCapitalize={"none"}
                    ref={searchInputRef}
                    onFocus={() => {setFocused(true)}}
                    onBlur={() => {setFocused(false)}}
                    onChangeText={onChangeText}
                    value={searchValue}
                    placeholderTextColor={colors.neutral[400]}
                    placeholder={props.placeholder}
                    noStyle={true}
                />
            </View>
            <TouchableOpacity className={"rounded-lg"}>
                <FontAwesome style={{marginLeft: 10}} name={"info-circle"} size={20} color={setColor()}
                                onPress={props.modalVisibleFun}
                />
            </TouchableOpacity>
        </View>
    )
});

export default SearchInput;
