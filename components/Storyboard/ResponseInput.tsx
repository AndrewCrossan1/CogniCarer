import {View, Text} from "react-native";
import Input from "@/components/forms/Input";

/**
 * Interface for the response input field
 * @param response - The full response string
 * @param fontSize - The font size
 * @param setResponse - Callback to set the response string in the parent component
 * @param args - Additional arguments
 */
interface ResponseInputProps {
    response: string;
    setResponse: (response: string) => void;
    fontSize?: string;
    args?: any[];
}

/**
 * Component for the response input field
 * @param response - The full response string
 * @param setResponse - Callback to set the response string in the parent component
 * @param fontSize - The font size
 * @param args - Additional arguments
 * @example <ResponseInput response={response} setResponse={(e) => {setResponse(e)}} fontSize={"text-2xl"} />
 */
export function ResponseInput({response, setResponse, fontSize, ...args}: ResponseInputProps) {

    /**
     * Renders text as normal, but anything wrapped in {} is rendered as an input field
     * @param value - The string to render
     */
    const renderInput = (value: string) => {
        return (
            <View className={"flex-1 flex-row flex-wrap items-center justify-center"}>
                {value.split(/{(.*?)}/).map((part, index) => {
                    if (index % 2 === 0) {
                        return <Text className={"text-4xl dark:text-white"} key={index}>{part}</Text>
                    } else {
                        return <Input
                            key={index}
                            padding={"p-2.5"}
                            style={{marginHorizontal: 5, maxWidth: 100}}
                            placeholder={part}
                            placeholderTextColor={"#AAAAA5"}
                        />
                    }
                })}
            </View>
        )
    }

    return (
        <>
            {renderInput(response)}
        </>
    )
}
