import {useSupport} from "@/hooks/useSupport";
import {ScrollView, StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {Article} from "@/services/api/types";
import Markdown from "react-native-markdown-display";
import {useColorScheme} from "nativewind";
import colors from "tailwindcss/colors";
import {MaterialIcons} from "@expo/vector-icons";

const SelectedArticle = () => {
    const { colorScheme } = useColorScheme();
    const router = useRouter();

    const styles = StyleSheet.create({
        body: {
            color: colorScheme === 'dark' ? '#fff' : '#000',
        },
        heading1: {
            color: colorScheme === 'dark' ? '#fff' : '#000',
            marginVertical: 10,
            paddingVertical: 5,
            fontWeight: 'semibold'
        },
        heading2: {
            color: colorScheme === 'dark' ? '#fff' : '#000',
            marginVertical: 10,
            paddingVertical: 5,
        },
        heading3: {
            color: colorScheme === 'dark' ? '#fff' : '#000',
            marginVertical: 10,
            paddingVertical: 5,
        },
        heading4: {
            color: colorScheme === 'dark' ? '#fff' : '#000',
            marginVertical: 10,
            paddingVertical: 5,
        },
        heading5: {
            color: colorScheme === 'dark' ? '#fff' : '#000',
            marginVertical: 10,
            paddingVertical: 5,
        },
        heading6: {
            color: colorScheme === 'dark' ? '#fff' : '#000',
            marginVertical: 10,
            paddingVertical: 5,
        },
        blockquote: {
            backgroundColor: colorScheme === 'dark' ? '#333' : colors.neutral[200],
            borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
            borderLeftWidth: 4,
            marginLeft: 5,
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 10,
        }
    });

    const { id } = useLocalSearchParams();

    const { getArticle, loading } = useSupport();
    const [article, setArticle] = useState<Article | null>(null);

    const fetchArticle = async () => {
        if (!id) return;
        let tempId = id as string;
        const article = await getArticle(tempId);
        if (!article) return;
        setArticle(article);
    }

    useEffect(() => {
        fetchArticle().then(
            () => console.log('Article fetched: ', article?.uuid)
        ).catch()
    }, [id]);

    return (
        <ScrollView className={"flex-1 p-4 dark:bg-neutral-800 bg-neutral-100"}>
            <View className={"mb-10 dark:bg-neutral-800 bg-neutral-100"}>
                <TouchableOpacity className={"flex flex-row gap-4 dark:bg-neutral-700 bg-white rounded-lg p-2 items-center"}
                                    onPress={() => router.back()}
                                  style={{
                                      shadowColor: colors.black,
                                      shadowOffset: {width: 0, height: 2},
                                      shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                      shadowRadius: 3.84,
                                      elevation: 2
                                  }}>
                    <MaterialIcons name={"arrow-back"} size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    <Text className={"text-lg dark:text-white text-black"}>Back</Text>
                </TouchableOpacity>
                {!loading && article && (
                    <Markdown style={styles}>
                        {article.content}
                    </Markdown>
                )}
            </View>
        </ScrollView>
    )
}

export default SelectedArticle;