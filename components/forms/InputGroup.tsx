import React, {forwardRef, useImperativeHandle, useRef} from "react";
import {SafeAreaView, Text, TextInput, TextInputProps} from "react-native";
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withTiming} from "react-native-reanimated";

/**
 * InputGroupProps
 * @desc The props for the InputGroup component
 * @param label - The label of the input field
 * @param errorMessage - The error message to display
 * @param error - Whether the input field has an error
 * @param size - The size of the input field
 * @param props - The rest of the TextInputProps
 * @extends TextInputProps
 * @see https://reactnative.dev/docs/textinput#props
 * @returns InputGroupProps
 */
interface InputGroupProps extends TextInputProps {
    label: string;
    errorMessage: string;
    error: boolean
    size?: "1/2" | "1/3" | "1/4" | "1/5" | "1/6" | "1/12";
}

export type InputGroupRef = {
    shake: () => void;
}

/**
 * InputGroup component
 * @desc InputGroup is used to standardize the layout of input fields, the following components are displayed:
 * - Text: The label of the input field (props.label)
 * - TextInput: The input field
 * - Text: The error message (Triggered when the error prop is true)
 * All styling is done in this component to ensure consistency across the application, this can be overridden, but
 * it is then up to the developer to ensure that the styling is consistent with the rest of the application
 **/
const InputGroup =  forwardRef<InputGroupRef, InputGroupProps>((props, ref) => {
    const inputRef = useRef<TextInput>(null);
    const translateX = useSharedValue(0);

    useImperativeHandle(ref, () => ({
        shake: () => {
            translateX.value = withSequence(
                withTiming(-10, {duration: 50}),
                withTiming(10, {duration: 50}),
                withTiming(-10, {duration: 50}),
                withTiming(10, {duration: 50}),
                withTiming(0, {duration: 50}),
            );
        }
    }));

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: translateX.value}]
        }
    });

    /**
     * getTailwindSize
     * @desc This function returns the tailwindcss class for the size of the input field
     * @param size - The size of the input field
     * @returns string - The tailwindcss class for the size of the input field
     */
    const getTailwindSize = (size?: string): string => {
        if (!size) return "w-full";
        const sizes: Record<string, string> = {
            "1/2": "w-1/2",
            "1/3": "w-1/3",
            "1/4": "w-1/4",
            "1/5": "w-1/5",
            "1/6": "w-1/6",
            "1/12": "w-1/12",
        };
        return sizes[size];
    }

    return (
        <SafeAreaView className={`${getTailwindSize(props.size)} my-2`}>
            <Animated.View style={[animatedStyle]}>
                <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg"}>{props.label}</Text>
                <TextInput secureTextEntry={props.secureTextEntry} value={props.value} onChangeText={props.onChangeText}
                           ref={inputRef}
                           placeholder={props.placeholder} placeholderTextColor={"#AAAAA5"}
                           className={`rounded-md p-4 border dark:text-white ${props.error ? "border-red-500" : "dark:border-gray-500 border-gray-400"} focus:border-blue-500 my-1`}/>
                {props.error &&
                  <Text className={"text-red-500 mt-1"}>{props.errorMessage}</Text>
                }
            </Animated.View>
        </SafeAreaView>
    )
});

export default InputGroup;