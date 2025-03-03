import {TextInput, TextInputProps} from "react-native";

/**
 * InputProps interface
 * @description The props for the Input component
 * @param noStyle boolean
 * @param padding string - The padding for the input
 * @extends TextInputProps
 * @see https://reactnative.dev/docs/textinput
 */
interface InputProps extends TextInputProps {
    noStyle?: boolean;
    padding?: string;
    ref?: any;
}

/**
 * Input component
 * @description An input component that can be rendered with default application styling, or with no styling at all
 * @param props InputProps
 * @constructor
 */
const Input = (props: InputProps) => {
    // If noStyle is null, we assume the user wants styling
    const noStyle = props.noStyle ?? false;
    const padding = props.padding ?? "p-4";

    if (noStyle) {
        return <TextInput {...props} ref={props.ref} />
    }

    return <TextInput {...props}
                      className={`rounded-md ${padding} border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 transition-all ease-linear input`}
    />
}

export default Input;
