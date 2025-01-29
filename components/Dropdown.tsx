import {useState} from "react";
import {TextInput, TouchableOpacity, useColorScheme, View, Text, ScrollView} from "react-native";
import colors from "tailwindcss/colors";
import {MaterialIcons} from "@expo/vector-icons";

interface DropdownProps<T> {
    options: T[];
    onSelect: (obj: T) => void;
}

export const Dropdown = (props: DropdownProps<any>) => {
    // Destructure props
    const { options, onSelect } = props;

    const theme = useColorScheme();

    // State Definition
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(options[0]);


    // Dropdown toggle function
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <View>
            <View className={`w-full flex flex-row justify-between items-center p-4 ${isOpen ? "border-t border-l border-r border-b rounded-tl-md rounded-tr-md" : "border-t border-l border-r border-b rounded-md"} dark:border-gray-500 border-gray-400`}>
                <TextInput editable={false} key={"dropdown"} value={selected} className={"dark:text-white"}/>
                <TouchableOpacity onPress={toggle} hitSlop={10}>
                    <MaterialIcons name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color={theme === "dark" ? colors.white : colors.black} />
                </TouchableOpacity>
                </View>

            {/* Dropdown Body (Directly below the input) (Display 3 initially, with the overflow scrollable  */}
            {isOpen && (
                <ScrollView className={"w-full flex flex-col bg-white h-90 dark:bg-neutral-900 border-b border-l border-r dark:border-gray-500 border-gray-400 rounded-b-md"}>
                    {options.map((option: any, index: number) => (
                        <TouchableOpacity className={"h-30"} key={index} onPress={() => {
                            setSelected(option);
                            onSelect(option);
                            setIsOpen(false);
                        }}>
                            <Text className={"p-4 dark:text-white"}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    )
}
