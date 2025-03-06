import {Response} from "@/services/api/types";
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useState} from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function ResponseCard({response}: { response: Response }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const theme = useThemeColor();

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

    /* Parse the date */
    const created_at = () => {
        /* Format: Monday Jan 1st, 2022 15:00:00 */
        const d = new Date(response.created_at);
        const day = d.toLocaleString('default', {weekday: 'long'});
        const month = d.toLocaleString('default', {month: 'short'});
        const date = d.getDate();
        const year = d.getFullYear();
        const time = d.toLocaleTimeString('default', {hour: '2-digit', minute: '2-digit'});
        return `${day} ${month} ${date}, ${year} ${time}`;
    }
    console.log(response.template.name);

    return (
        <View style={styles.container} className={"border-solid border dark:bg-neutral-900 bg-neutral-200 dark:border-neutral-900 border-neutral-300 rounded-lg my-2 p-4"}>
            <View>
                <Text className={"font-bold dark:text-white text-black text-lg"}>{response.template.name} - {response.patient.first_name} {response.patient.last_name}</Text>
                <Text className={"dark:text-gray-400 text-sm"}>{created_at()}</Text>
                <Text className={"dark:text-gray-400 text-sm"}>Overseen by {response.user.first_name + " " + response.user.last_name}</Text>
            </View>

            <View style={styles.content}>
                {/* For each response object (Response is {"key": "value", "key": "value"}, get the values saved for each key, and highlight them*/}
                {Object.entries(response.response).map(([key, value], index) => {
                    return (
                        <View key={index} className={"flex-row flex-1 mt-1"}>
                            <Text className={"dark:text-blue-500 text-blue-500 font-bold"}>{key}: </Text>
                            <Text className={"dark:text-gray-400"}>{value}</Text>
                        </View>
                    )
                })}
                {/*Full response*/}
                <View className={"flex-1 mt-4"}>
                    <Text className={"dark:text-blue-500 text-blue-500 font-bold"}>Full Response:</Text>
                    <Text className={"dark:text-gray-400 mt-1"}>{response.response_content}</Text>
                </View>
            </View>
            <TouchableOpacity
                className={"dark:text-blue-500 mt-4"}
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
