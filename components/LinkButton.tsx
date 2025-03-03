// Component inspired by https://reactnative.dev/docs/linking?language=typescript

import {useCallback} from "react";
import {Text, Linking} from "react-native";

interface LinkButtonProps {
    href: string;
    text: string;
}

/**
 * LinkButton component
 * @param href - The URL to open
 * @param text - The text to display on the button
 * @constructor
 * @description This component is used to create a button that opens a URL
 * @example
 * <LinkButton href={"https://example.com"} text={"Open Example"}/>
 * @return {JSX.Element}
 */
export const LinkButton = ({href, text}: LinkButtonProps) => {
    const handleLinkPress = useCallback(async () => {
        const supported = await Linking.canOpenURL(href);

        if (supported) {
            await Linking.openURL(href);
        } else {
            console.warn(`Don't know how to open this URL: ${href}`);
        }
    }, [href]);

    return (
        <Text onPress={handleLinkPress} className={"text-blue-500"}>{text}</Text>
    );
}
