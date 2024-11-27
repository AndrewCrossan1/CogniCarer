import {ActivityIndicator, Modal, RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {SearchInput} from "@/components/SearchInput";
import {useTemplates} from "@/hooks/storyboard/useTemplates";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useEffect, useState} from "react";
import {Template} from "@/services/api/types";
import {TemplateCard} from "@/components/Storyboard/TemplateCard";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {BlurView} from "expo-blur";
import colors from "tailwindcss/colors";
import * as Haptics from "expo-haptics";

export default function TemplateList() {
    const styles = StyleSheet.create({
        modalView: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
        },
        searchContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 5,
            elevation: 5,
        }
    });

    const {getTemplates, templates, loading} = useTemplates();
    const theme = useThemeColor();
    const [Templates, setTemplates] = useState([] as Template[]);
    const [mounted, setMounted] = useState(false);
    const [filtered, setFiltered] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setModalVisible(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, [modalVisible]);

    useEffect(() => {
        if (!mounted) return;
        getTemplates().then((templates) => {
            setTemplates(templates);
            // Sort templates by name
            setTemplates(templates.sort((a: Template, b: Template) => a.name.localeCompare(b.name)));
        });
    }, [mounted]);

    const onRefresh = () => {
        setRefreshing(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        getTemplates().then((templates) => {
            setTemplates(templates);
            setRefreshing(false);
            // Sort templates by name
            setTemplates(templates.sort((a: Template, b: Template) => a.name.localeCompare(b.name)));
        });
    }

    const handleSearch = (s: string) => {
        // Filter the templates based on the search string
        const filteredTemplates = templates.filter((template: Template) => {
            return template.name.toLowerCase().includes(s.toLowerCase());
        });
        setFiltered(true);
        setTemplates(filteredTemplates);
    }

    return (
        <View style={{flex: 1}} className={"dark:bg-neutral-800"}>
            <View style={styles.searchContainer} className={"p-4"}>
                <SearchInput placeholder={"Search for templates..."} onSearch={handleSearch} modalVisible={modalVisible}
                             modalVisibleFun={() => setModalVisible(!modalVisible)}/>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <BlurView intensity={100} style={[StyleSheet.absoluteFill, styles.modalView]}/>
                <View className={"mt-safe mx-safe-or-4 dark:bg-neutral-900 rounded-lg elevation-md p-4"}>
                    <View className={"flex-row justify-start items-center"}>
                        <FontAwesome style={{marginRight: 10}} name={"info-circle"} size={30} color={"white"}/>
                        <View className={"flex-1 flex-row items-center"}>
                            <Text className={"text-lg dark:text-white font-bold w-full"}>Search Information</Text>
                        </View>
                        <FontAwesome name={"close"} size={30} color={"red"}
                                     onPress={() => setModalVisible(!modalVisible)}/>
                    </View>
                    <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: "white", marginVertical: 5}}/>
                    <Text className={"dark:text-gray-400 mt-2"}>
                        Use the search bar to search for a specific item.
                    </Text>
                    <Text className={"dark:text-gray-400 my-2"}>
                        You can search by name, ID, or any other relevant information.
                    </Text>
                </View>

            </Modal>
            <ScrollView style={{flex: 1}} className={"px-4"}
                        refreshControl={
                            <RefreshControl title={"Refreshing..."} titleColor={colors.neutral[400]}
                                            tintColor={colors.neutral[400]} refreshing={refreshing}
                                            onRefresh={onRefresh}/>
                        }>
                <View className={""}>
                    {loading && <ActivityIndicator size={"large"} className={`${refreshing ? 'invisible' : 'visible'}`}
                                                   color={theme.primary}/>}
                    {!loading && Templates.map((template: Template) => {
                        return <TemplateCard key={template.uuid} template={template}/>
                    })}
                    {filtered && Templates.length === 0 &&
                        <Text className={"text-center text-lg text-neutral-500"}>No templates found</Text>}
                </View>
            </ScrollView>
        </View>
    )
}
