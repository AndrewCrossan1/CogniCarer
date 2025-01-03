import {Text, TextInput, View} from "react-native";

interface InputFieldProps {
    value: string;
    onChangeText: (s: string) => void;
    ref?: any;
    placeholder: string;
    placeholderTextColor: string;
    width?: string;
    label: string;
    password: boolean;
}

const InputField = ({value, onChangeText, ref, placeholder, placeholderTextColor, width, label, password} : InputFieldProps) => {
    return (
        <View className={width === null ? "" : width}>
            <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>{label}</Text>
            <TextInput ref={ref} secureTextEntry={password} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={placeholderTextColor} className={"rounded-md p-4 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 transition-all ease-linear"}/>
        </View>
    )
}

export default InputField;