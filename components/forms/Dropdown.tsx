import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
    Text,
    ScrollView,
    TouchableWithoutFeedback
} from "react-native";
import colors from "tailwindcss/colors";
import {MaterialIcons} from "@expo/vector-icons";

interface DropdownProps {
    options: { value: any, display: string }[];
    onSelect: (value: any) => void;
}

export type DropdownRef = {
    setSelected: (value: string) => void;
}

export const Dropdown = forwardRef<DropdownRef, DropdownProps>((props, ref) => {
    // Destructure props
    const {options, onSelect} = props;

    const theme = useColorScheme();

    // State Definition
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");

    const dropdownRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
        setSelected: (value: string) => {
            setSelected(value);
        }
    }));

    // Dropdown toggle function
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={toggle} hitSlop={10}>
                <View
                    className={`w-full flex flex-row justify-between items-center p-3 ${isOpen ? "border-t border-l border-r rounded-tl-lg rounded-tr-lg" : "border-t border-l border-r border-b rounded-lg"} dark:border-gray-500 border-gray-400`}>
                    <TextInput ref={dropdownRef} editable={false} key={"dropdown"} value={selected} className={"dark:text-white"}
                               placeholder={"Choose an option"} placeholderTextColor={"#AAAAA5"}/>
                    <MaterialIcons name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24}
                                   color={theme === "dark" ? colors.white : colors.black}/>
                </View>
            </TouchableWithoutFeedback>

            {isOpen && (
                <ScrollView
                    className={"w-full flex flex-col bg-white max-h-48 dark:bg-neutral-900 border-b border-l border-t border-r dark:border-gray-500 border-gray-400 rounded-b-lg"}>
                    {options.map((option: any, index: number) => (
                        <TouchableOpacity key={index} onPress={() => {
                            setSelected(option.display);
                            onSelect(option.value);
                            setIsOpen(false);
                        }}>
                            <Text className={"p-4 dark:text-white"}>{option.display}</Text>
                            {index !== options.length - 1 &&
                                <View className={"border-b border-gray-400 dark:border-gray-500"}/>}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    )
})
