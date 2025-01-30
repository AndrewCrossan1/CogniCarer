import {useState} from "react";
import {TextInput, TouchableOpacity, useColorScheme, View, Text, ScrollView} from "react-native";
import colors from "tailwindcss/colors";
import {MaterialIcons} from "@expo/vector-icons";

interface DropdownProps {
    options: { value: any, display: string }[];
    onSelect: (value: any) => void;
}

export const Dropdown = (props: DropdownProps) => {
    // Destructure props
    const { options, onSelect } = props;

    const theme = useColorScheme();

    // State Definition
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");


    // Dropdown toggle function
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <View>
            <View className={`w-full flex flex-row justify-between items-center p-4 ${isOpen ? "border-t border-l border-r rounded-tl-md rounded-tr-md" : "border-t border-l border-r border-b rounded-md"} dark:border-gray-500 border-gray-400`}>
                <TextInput editable={false} key={"dropdown"} value={selected} className={"dark:text-white"} placeholder={"Choose an option"} placeholderTextColor={"#AAAAA5"} />
                <TouchableOpacity onPress={toggle} hitSlop={10}>
                    <MaterialIcons name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color={theme === "dark" ? colors.white : colors.black} />
                </TouchableOpacity>
                </View>

            {isOpen && (
                <ScrollView className={"w-full flex flex-col bg-white h-48 dark:bg-neutral-900 border-b border-l border-t border-r dark:border-gray-500 border-gray-400 rounded-b-md"}>
                    {options.map((option: any, index: number) => (
                        <TouchableOpacity key={index} onPress={() => {
                            setSelected(option.display);
                            onSelect(option.value);
                            setIsOpen(false);
                        }}>
                            <Text className={"p-4 dark:text-white"}>{option.display}</Text>
                            {index !== options.length - 1 && <View className={"border-b border-gray-400 dark:border-gray-500"}/>}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    )
}
