import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import {Template} from "@/services/api/types";
import {useState} from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

/**
 * ListCard Component
 * @description This component is used to display a card with information in it
 * @param template The template object
 */
export function TemplateCard({template}: { template: Template }) {
    const theme = useThemeColor();
    const [isExpanded, setIsExpanded] = useState(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "space-between",
        },
        content: {
            overflow: "hidden",
            maxHeight: isExpanded ? "auto" : 0,
        }
    });

    /* Extract the field names from the template content */
    const content = template.content;
    const inputs = content.match(/{([^}]*)}/g);
    const contentArray = content.split(/{([^}]*)}/g);

    /* Parse the date */
    const created_at = () => {
        /* Format: Monday Jan 1st, 2022 15:00:00 */
        const d = new Date(template.created_at);
        const day = d.toLocaleString('default', {weekday: 'long'});
        const month = d.toLocaleString('default', {month: 'short'});
        const date = d.getDate();
        const year = d.getFullYear();
        const time = d.toLocaleTimeString('default', {hour: '2-digit', minute: '2-digit'});
        return `${day} ${month} ${date}, ${year} ${time}`;
    }

    /** Render a component based on response count */
    const responseHandler = () => {
        if (template.response_count === 0) {
            return <Text className={"dark:text-gray-400"}>No responses yet</Text>
        } else if (template.response_count === 1) {
            return <Text className={"text-blue-500"}>1 Response</Text>
        } else {
            return <Text className={"text-blue-500"}>{template.response_count} Responses</Text>
        }
    }


    return (
        <View style={styles.container} className={"border-solid border bg-neutral-200 dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-sm border-neutral-300 rounded-lg my-2 p-4"}>
            {/* Title and description */}
            <View>
                <Text className={"font-bold dark:text-white text-black text-lg"}>{template.name}</Text>
                <Text className={"dark:text-gray-400 text-sm"}>{created_at()}</Text>
                <Text className={"dark:text-gray-400 mt-2"} numberOfLines={2}>{template.description}</Text>
            </View>
            <View style={styles.content}>
                {/* Display the content with the {inputs}  highlighted */}
                <Text className={"dark:text-white mt-2"}>"
                    {contentArray.map((item, index) => {
                        if (inputs && inputs.includes(`{${item}}`)) {
                            return <Text key={index} className={"text-blue-500 font-bold"}>{"{" + item + "}"}</Text>
                        } else {
                            return <Text key={index} className={"dark:text-white"}>{item}</Text>
                        }
                    })}
                    "
                </Text>
                <Text className={"text-blue-500 mt-2"}>
                    {responseHandler()}
                </Text>
            </View>
            {/* Image and response count */}
            <TouchableOpacity
                className={"dark:text-blue-500 mt-4 "}
                onPress={() => setIsExpanded(!isExpanded)}>
                {isExpanded ?
                    <View className={"flex-1 flex-row items-center"}>
                        <FontAwesome name={"chevron-up"} className={"mr-5"} color={theme.primary}/>
                        <Text className={"dark:text-white"}>Close</Text>
                    </View>
                    :

                    <View className={"flex-1 flex-row items-center"}>
                        <FontAwesome name={"chevron-down"} className={"mr-5"} color={theme.primary}/>
                        <Text className={"dark:text-white"}>Expand</Text>
                    </View>
                }
            </TouchableOpacity>
        </View>
    )
}
