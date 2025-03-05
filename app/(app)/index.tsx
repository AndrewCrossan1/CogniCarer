import {Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator} from "react-native";
import {useColorScheme} from "nativewind";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import {useAppSelector} from "@/hooks/store/hooks";
import {useRouter} from "expo-router";
import {useSupport} from "@/hooks/useSupport";
import {useCallback, useState} from "react";
import {Article} from "@/services/api/types";
import {useFocusEffect} from "@react-navigation/native";
import {useReminisce} from "@/hooks/useReminisce";

export default function Home() {
    const { colorScheme } = useColorScheme()
    const user = useAppSelector(state => state.user.user)
    const router = useRouter();
    const { getLatestArticle, loading, error, getArticlesViewedToday, likeArticle, unlikeArticle } = useSupport();
    const { entriesToday } = useReminisce();
    const [article, setArticle] = useState<Article | null>(null);
    const [articlesViewedToday, setArticlesViewedToday] = useState<number>(0);
    const [entries, setEntries] = useState<number>(0);

    useFocusEffect(
        useCallback(() => {
            getLatestArticle().then((latestArticle) => {
                setArticle(latestArticle);
            });
            getArticlesViewedToday().then((articlesViewed) => {
                if (articlesViewed) {
                    setArticlesViewedToday(articlesViewed);
                } else {
                    setArticlesViewedToday(0);
                }
            });
            entriesToday().then(
                (entries) => {
                    if (entries) {
                        setEntries(entries);
                    } else {
                        setEntries(0);
                }
            });
        }, [])
    );

    /**
     * Handle like button
     * @description Handle like button click for an article
     * @param uuid
     * @param liked
     */
    const handleLike = async (uuid: string, liked: boolean) => {
        if (liked) {
            await unlikeArticle(uuid);
        } else {
            await likeArticle(uuid);
        }

        getLatestArticle().then((latestArticle) => {
            setArticle(latestArticle);
        });
    }

    const time = new Date().getHours()

    const helloMessage = time < 12 ? "Good morning" : time < 18 ? "Good afternoon" : "Good evening";
    const promptMessage = time < 12 ? "Get a family member's day started by reminiscing about the past." :
        time < 18 ?
            "Take a break and enjoy a game of Match with a family member." :
            "Wind down from a busy day by reading the latest article we have for you.";

    return (
        <View className={"flex-1 justify-start bg-neutral-100 dark:bg-neutral-800 w-full md:px-4 lg:px-6"}>
            <View className={"flex flex-row gap-5 items-center xs:mt-4 sm:mt-5 md:mt-6 lg:mt-6 xl:mt-6"}>

                    <View className={"flex"}>
                        <Image source={{uri: user?.profile_image}}
                               className={"rounded-full xs:w-10 sm:w-20 md:w-25 lg:w-30 xl:w-35 xs:h-10 sm:h-20 md:h-25 lg:h-30 xl:h-35"}/>
                    </View>

                    <View className={"flex-1"}>
                        <Text
                            className={"dark:text-white xs:text-base sm:text-base md:text-2xl lg:text-2xl xl:text-2xl font-semibold"}>
                            {helloMessage}, {user?.first_name}!
                        </Text>
                        <Text
                            className={"dark:text-white xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"}>
                            {promptMessage}
                        </Text>
                    </View>
            </View>

            {/* Separator */}
            <View className={"border-b dark:border-b-neutral-600 border-b-neutral-300 xs:mt-1 sm:mt-1 md:mt-2 lg:mt-3 xl:mt-4 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

            {loading && (
                <ActivityIndicator size="large" color={colors.blue[500]} style={{marginTop: 20}} />
            )}

            {error && (
                <View className={"flex-row items-center justify-between xs:mt-2 sm:mt-3 md:mt-3 lg:mt-3 xl:mt-3"}>
                    <Text className={"text-base text-red-500 dark:text-red-400"}>{error}</Text>
                </View>
            )}

            {!loading && article && (
                <View className={"xs:mt-2 sm:mt-3 md:mt-3 lg:mt-3 xl:mt-3"}>
                    <TouchableOpacity
                        onPress={() => {
                            router.push(`/(app)/(help)/article/${article.uuid}`);
                        }}
                        className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-1 md:my-1 lg:my-2 xl:my-2 rounded-lg flex-row items-center justify-between"}
                        style={{
                            shadowColor: colors.black,
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                            shadowRadius: 3.84,
                            elevation: 2
                        }}>
                        <View className={"flex-1"}>
                            <View className="bg-indigo-200 dark:bg-blue-500 px-2 py-2 rounded-lg flex-row items-center w-auto mb-2">
                                <MaterialIcons name="new-releases" size={18} color={colors.blue[800]} />
                                <Text className="ml-1 text-sm font-semibold text-blue-800 dark:text-blue-900 uppercase tracking-wide">
                                    Latest Article
                                </Text>
                            </View>
                            <View className={"flex-row items-center justify-between"}>
                                <Text className={"text-base font-bold dark:text-white text-black tracking-wide "}>
                                    {article.title}
                                </Text>
                                <Text className="uppercase text-xs font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide">
                                    Category: {article.category ? article.category.name : "Undefined"}
                                </Text>
                            </View>
                            <Text className={"text-base text-neutral-500"}>{article.source}</Text>
                            {article.tags && (
                                <ScrollView horizontal={true} contentContainerStyle={{justifyContent: "flex-start"}} className={"flex-row mt-4"}>
                                    {article.tags.map((tag, index) => (
                                        <View key={index} className={"bg-neutral-200 dark:bg-neutral-950 px-2 py-1 rounded-lg mr-2"}>
                                            <Text className={"text-sm dark:text-white text-neutral-600"}>
                                                {tag}
                                            </Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                            <View className={"flex-row justify-between"}>
                                {/* Like Button with Count */}
                                <TouchableOpacity
                                    onPress={() => handleLike(article.uuid, article.liked)}
                                    className="flex-row items-center pt-2">
                                    <MaterialIcons name="thumb-up" size={18} color={article.liked ? colors.blue[500] : colors.neutral[500]} />
                                    <Text className="ml-1 text-base text-neutral-500 dark:text-neutral-400">
                                        {article.likes}
                                    </Text>
                                </TouchableOpacity>

                                {/* View Count */}
                                <View className="flex-row items-center pt-2">
                                    <MaterialIcons name="visibility" size={18} color={"gray"} />
                                    <Text className="ml-1 text-base text-neutral-500 dark:text-neutral-400">
                                        {article.views}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Have you helped anyone reminisce today */}
                    <View className={"flex-row gap-2 justify-between"}>
                        <TouchableOpacity
                            onPress={() => {
                                router.push(`/(app)/(reminisce)/(tabs)/NewEntry`);
                            }}
                            className={"flex-1 xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-1 md:my-1 lg:my-2 xl:my-2 rounded-lg flex-row items-center justify-between"}
                            style={{
                                shadowColor: colors.black,
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                shadowRadius: 3.84,
                                elevation: 2
                            }}>
                            <View className={"flex-1 items-center"}>
                                <Text className={"text-5xl font-bold text-blue-500 tracking-wide"}>
                                    {entries}
                                </Text>
                                <Text className={"text-sm text-neutral-400 text-center"}>
                                    reminisce entries today
                                </Text>

                                <Text className={"text-lg mt-2 font-semibold dark:text-white"}>
                                    {entries > 0 ? "Great job!" : "Start now!"}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                            }}
                            className={"flex-1 xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-1 md:my-1 lg:my-2 xl:my-2 rounded-lg flex-row items-center justify-between"}
                            style={{
                                shadowColor: colors.black,
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                shadowRadius: 3.84,
                                elevation: 2
                            }}>
                            <View className={"flex-1 items-center"}>
                                <Text className={"text-5xl font-bold text-blue-500 tracking-wide"}>
                                    0
                                </Text>
                                <Text className={"text-sm text-neutral-400 text-center"}>
                                    games played today
                                </Text>

                                <Text className={"text-lg mt-2 font-semibold dark:text-white"}>
                                    Play now!
                                </Text>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => {
                                router.push(`/(app)/(help)`);
                            }}
                            className={"flex-1 xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-1 md:my-1 lg:my-2 xl:my-2 rounded-lg flex-row items-center justify-between"}
                            style={{
                                shadowColor: colors.black,
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                shadowRadius: 3.84,
                                elevation: 2
                            }}>
                            <View className={"flex-1 items-center"}>
                                <Text className={"text-5xl font-bold text-blue-500 tracking-wide"}>
                                    {articlesViewedToday}
                                </Text>
                                <Text className={"text-sm text-neutral-400 text-center"}>
                                    articles read today
                                </Text>
                                <Text className={"text-lg mt-2 font-semibold dark:text-white"}>
                                    {articlesViewedToday > 0 ? "Great job!" : "Read now!"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}
