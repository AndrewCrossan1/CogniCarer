import {ActivityIndicator, Modal, RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {SearchInput} from "@/components/SearchInput";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useCallback, useEffect, useState} from "react";
import {Response} from "@/services/api/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {BlurView} from "expo-blur";
import {useResponses} from "@/hooks/storyboard/useResponses";
import {ResponseCard} from "@/components/Storyboard/ResponseCard";
import colors from "tailwindcss/colors";

export default function TemplateList() {
    const styles = StyleSheet.create({
        container: {

        },
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
    });

    const {getResponses, responses, loading} = useResponses();
    const theme = useThemeColor();
    const [Responses, setResponses] = useState([] as Response[]);
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
        getResponses().then((responses) => {
            setResponses(responses);
        });
    }, [mounted]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getResponses().then((responses) => {
            setResponses(responses);
            setRefreshing(false);
        });
    }, []);

    const handleSearch = (s: string) => {
        // Filter the templates based on the search string
        const filteredResponses = responses.filter((response: Response) => {
            return response.template.name.toLowerCase().includes(s.toLowerCase()) ||
                response.patient.first_name.toLowerCase().includes(s.toLowerCase()) ||
                response.patient.last_name.toLowerCase().includes(s.toLowerCase()) ||
                response.uuid.toLowerCase().includes(s.toLowerCase());
        });
        setFiltered(true);
        setResponses(filteredResponses);
    }

    return (
        <View style={{flex: 1}} className={"dark:bg-neutral-800 p-4"}>
            <SearchInput placeholder={"Search for responses..."} onSearch={handleSearch} modalVisible={modalVisible} modalVisibleFun={() => setModalVisible(!modalVisible)}/>
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
                        <FontAwesome style={{marginRight: 10}} name={"info-circle"} size={30} color={theme.primary}/>
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
            <ScrollView style={{flex: 1}}
                        refreshControl={
                            <View>
                                <RefreshControl title={"Refreshing..."} titleColor={colors.neutral[400]} tintColor={colors.neutral[400]} refreshing={refreshing} onRefresh={onRefresh}/>
                            </View>
                        }>
                <View style={styles.container} className={"p-1"}>
                    {!loading && Responses.map((response: Response) => {
                        return <ResponseCard key={response.uuid} response={response}/>
                    })}
                    {filtered && Responses.length === 0 && <Text className={"text-center text-lg text-neutral-500"}>No responses found</Text>}
                </View>
            </ScrollView>
        </View>
    )
}
