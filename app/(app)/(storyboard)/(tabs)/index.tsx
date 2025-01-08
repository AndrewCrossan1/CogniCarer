import {View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, Pressable} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useEffect, useState} from "react";
import {Template, Response} from "@/services/api/types";
import {useAppSelector} from "@/hooks/store/hooks";
import {useStoryboard} from "@/hooks/storyboard/useStoryboard";

type IconName = "chevron-up" | "chevron-down";


export default function Storyboard() {
    const user = useAppSelector(state => state.user.user);
    const [templateIcon, setTemplateIcon] = useState<IconName>("chevron-up");
    const [templateExpanded, setTemplateExpanded] = useState(true);
    const [responseIcon, setResponseIcon] = useState<IconName>("chevron-up");
    const [responseExpanded, setResponseExpanded] = useState(true);
    const [templateData, setTemplateData] = useState([] as Template[]);
    const [responseData, setResponseData] = useState([] as Response[]);
    const [mounted, setMounted] = useState(false);

    // Getting Template and Response Data
    const {getTemplates, getResponses, responses, templates} = useStoryboard()

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        getTemplates().then((valid) => {
            if (!valid) return;
            setTemplateData(templates.sort((a, b) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }));

            // Limit the number of templates to 5
            setTemplateData(templates.slice(0, 5));
        });
        getResponses().then((valid) => {
            if (!valid) return;
            setResponseData(responses.sort((a, b) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }));

            // Limit the number of responses to 5
            setResponseData(responses.slice(0, 5));
        });
    }, [mounted]);

    const styles = StyleSheet.create({
        container: {},
        btn: {
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        templateContainer: {
            maxHeight: templateExpanded ? "auto" : 0,
            overflow: "hidden",
        },
        responseContainer: {
            height: responseExpanded ? "auto" : 0,
            overflow: "hidden",
        }
    });

    const submitResponse = () => {
        console.debug("New response submitted");
    }

    const invokeExpansion = (container: string) => {
        if (container === "templates") {
            setTemplateExpanded((prev) => !prev);
            setTemplateIcon((prev) => prev === "chevron-up" ? "chevron-down" : "chevron-up");
        } else if (container === "responses") {
            setResponseExpanded((prev) => !prev);
            setResponseIcon((prev) => prev === "chevron-up" ? "chevron-down" : "chevron-up");
        } else {
            console.error("Invalid container specified");
        }
        return;
    }

    return (
        <SafeAreaView style={styles.container} className={"flex-1 dark:bg-neutral-800"}>
            <ScrollView>
                {/* Header Block */}
                <View className={"bg-blue-500 py-6"}>
                    <View className={"flex-row justify-between items-center p-4"}>
                        {/* Name and Profile Picture */}
                        <View>
                            <Text className={"text-white font-bold text-2xl"}>
                                Hello, {user?.first_name} {user?.last_name}
                            </Text>
                            <Text className={"text-white"}>
                                View and edit storyboard content here
                            </Text>
                        </View>
                        <Image
                            source={{uri: user?.profile_image }}
                            style={{width: 75, height: 75, borderRadius: 50}}
                        />
                    </View>
                    {/* Quick Actions */}
                    <Text className={"mb-2 mt-2 px-4 text-white font-bold"}>
                        Quick Actions
                    </Text>
                    <ScrollView horizontal={true}
                                contentContainerStyle={{paddingHorizontal: 10, flexWrap: "wrap", paddingBottom: 16}}>
                        <TouchableOpacity style={styles.btn} onPress={submitResponse}>
                            <View className={"flex-row items-center justify-center bg-white p-2 rounded-lg"}>
                                <FontAwesome name={"plus"} size={26} color={"#3B82F6"} className={"text-center mr-2"}/>
                                <Text className={"text-center mt-1"}>
                                    New Template
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn} onPress={submitResponse} className={"ml-2"}>
                            <View className={"flex-row items-center justify-center bg-white p-2 rounded-lg"}>
                                <FontAwesome name={"pencil"} size={26} color={"#3B82F6"}
                                             className={"text-center mr-2"}/>
                                <Text className={"text-center mt-1"}>
                                    Edit Template
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn} onPress={submitResponse} className={"ml-2"}>
                            <View className={"flex-row items-center justify-center bg-white p-2 rounded-lg"}>
                                <FontAwesome name={"trash"} size={26} color={"#3B82F6"} className={"text-center mr-2"}/>
                                <Text className={"text-center mt-1"}>
                                    Delete Template
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={submitResponse} className={"ml-2"}>
                            <View className={"flex-row items-center justify-center bg-white p-2 rounded-lg"}>
                                <FontAwesome name={"plus"} size={26} color={"#3B82F6"} className={"text-center mr-2"}/>
                                <Text className={"text-center mt-1"}>
                                    New Response
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn} onPress={submitResponse} className={"ml-2"}>
                            <View className={"flex-row items-center justify-center bg-white p-2 rounded-lg"}>
                                <FontAwesome name={"pencil"} size={26} color={"#3B82F6"}
                                             className={"text-center mr-2"}/>
                                <Text className={"text-center mt-1"}>
                                    Edit Response
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn} onPress={submitResponse} className={"ml-2"}>
                            <View className={"flex-row items-center justify-center bg-white p-2 rounded-lg"}>
                                <FontAwesome name={"trash"} size={26} color={"#3B82F6"} className={"text-center mr-2"}/>
                                <Text className={"text-center mt-1"}>
                                    Delete Response
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Main Content */}
                <View className={"p-4 mt-5 bg-neutral-900 mx-3 rounded-md"}>
                    <View className={"flex-row items-center justify-between mb-2"}>
                        <Text className={"text-xl dark:text-white"}>
                            Recently Created Templates
                        </Text>
                        <Pressable onPress={() => invokeExpansion("templates")} className={"flex-row items-center"}>
                            <FontAwesome name={templateIcon} size={16} color={"#3B82F6"}
                                         className={"text-center mr-2"}/>
                            <Text className={"text-blue-500"}>
                                {templateIcon === "chevron-up" ? "Show Less" : "Show More"}
                            </Text>
                        </Pressable>
                    </View>
                    <ScrollView style={styles.templateContainer}>
                        {templateData.map((template, index) => (
                            <View key={template.uuid} className={"my-1 p-2"}>
                                <Text className={"text-white"}>
                                    {template.name}
                                </Text>
                                <Text className={"text-gray-400"}>
                                    Created at: {new Date(template.created_at).toLocaleString()}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View className={"p-4 mt-5 bg-neutral-900 mx-3 rounded-md mb-4"}>
                    <View className={"flex-row items-center justify-between mb-2"}>
                        <Text className={"text-xl dark:text-white"}>
                            Recently Created Responses
                        </Text>
                        <Pressable onPress={() => invokeExpansion("responses")} className={"flex-row items-center"}>
                            <FontAwesome name={responseIcon} size={16} color={"#3B82F6"}
                                         className={"text-center mr-2"}/>
                            <Text className={"text-blue-500"}>
                                {responseIcon === "chevron-up" ? "Show Less" : "Show More"}
                            </Text>
                        </Pressable>
                    </View>
                    <ScrollView style={styles.responseContainer}>
                        {responseData.map((response, index) => (
                            <View key={response.uuid} className={"my-1 p-2"}>
                                <Text className={"text-white"}>
                                    {response.template.name} - {response.patient.first_name} {response.patient.last_name}
                                </Text>
                                <Text className={"text-gray-400"}>
                                    Created at: {new Date(response.created_at).toLocaleString()}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}