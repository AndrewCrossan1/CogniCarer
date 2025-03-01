import {ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useColorScheme} from "nativewind";
import {useSupport} from "@/hooks/useSupport";
import {useCallback, useEffect, useRef, useState} from "react";
import {Article} from "@/services/api/types";
import colors from "tailwindcss/colors";
import {MaterialIcons} from "@expo/vector-icons";
import SearchInput, {SearchInputRef} from "@/components/SearchInput";

export default function Index() {
    const {colorScheme} = useColorScheme();
    const {loading, error, getArticles, processMarkdown, getLatestArticle} = useSupport();
    const [articles, setArticles] = useState<Article[] | null>(null);
    const [latestArticle, setLatestArticle] = useState<Article | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [filteredArticles, setFilteredArticles] = useState<Article[] | null>(null);
    const [tags, setTags] = useState<string[]>([]);

    const searchInputRef = useRef<SearchInputRef>(null);

    const fetchArticles = async () => {
        const articles = await getArticles();
        const latestArticle = await getLatestArticle();

        if (articles) {
            setArticles(articles);
            latestArticle && setLatestArticle(latestArticle);

            // Remove latest article from articles list
            if (latestArticle) {
                const index = articles.findIndex(article => article.uuid === latestArticle.uuid);
                if (index > -1) {
                    articles.splice(index, 1);
                    setArticles(articles);
                }
            }
        }
    }

    const onRefresh = useCallback(() => {
        fetchArticles().then(
            () => {
                console.log("Articles fetched: ", articles?.length);
                console.log("Latest article fetched: ", latestArticle?.uuid);
            }
        ).catch(
            (e) => {
                console.error(e);
            });
        setRefreshing(false);
    }, [articles?.length, latestArticle?.uuid]);

    useEffect(() => {
        fetchArticles().then(
            () => {
                console.log("Articles fetched: ", articles?.length);
                console.log("Latest article fetched: ", latestArticle?.uuid);
            }
        ).catch(
            (e) => {
                console.error(e);
            });
    }, []);

    /**
     * Search for articles
     * @description Search for articles based on title, if tags are set, search for articles with title starting with search value within the tag filter
     * @description If no tags are set, search for articles with title starting with search value
     * @param s
     */
    const onSearch = async (s: string) => {
        setSearchValue(s);

        let filteredArticles = articles?.filter(article => {
            if (tags.length > 0) {
                return tags.some(tag => article.tags.includes(tag)) && article.title.toLowerCase().startsWith(s.toLowerCase());
            }
            return article.title.toLowerCase().startsWith(s.toLowerCase());
        });

        // Check if the latest article matches search criteria
        if (latestArticle) {
            const latestMatches = tags.length === 0 || tags.some(tag => latestArticle.tags.includes(tag));
            if (latestMatches && latestArticle.title.toLowerCase().startsWith(s.toLowerCase())) {
                filteredArticles = [latestArticle, ...(filteredArticles || [])];
            }
        }

        if (s.length === 0) {
            // Reapply tag filter
            setTagFilter(tags);
        } else {
            setFilteredArticles(filteredArticles || []);
        }
    };

    /**
     * Set tag filter
     * @description Set tag filter - remove and add tags to filter articles
     * @param tagsProp
     */
    const setTagFilter = (tagsProp: string[]) => {
        // Ensure only unique tags are set
        const uniqueTags = Array.from(new Set(tagsProp));

        setTags(uniqueTags);

        let filteredArticles = articles?.filter(article =>
            uniqueTags.some(tag => article.tags.includes(tag))
        );

        // Check if the latest article matches the tag filter
        if (latestArticle) {
            const latestMatches = uniqueTags.some(tag => latestArticle.tags.includes(tag));
            if (latestMatches) {
                filteredArticles = [latestArticle, ...(filteredArticles || [])];
            }
        }

        setFilteredArticles(uniqueTags.length > 0 ? filteredArticles ?? [] : null);
    };

    const clearSearch = () => {
        setSearchValue("");
        searchInputRef.current?.clearSearch();
        setFilteredArticles(null);
    }

    return (
        <ScrollView contentContainerStyle={{alignItems: "center"}} className={"dark:bg-neutral-800 bg-neutral-100 flex-1"}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} title={"Refreshing..."} onRefresh={onRefresh} />
                    }>
            <View className={"w-full md:px-2 lg:px-4 xl:px-4 py-4"}>
                <View className={"flex-row items-center gap-2 rounded-lg"}>
                    <Image source={require("@/assets/images/undraw_different-love_58hd.png")} className={"rounded-lg"} resizeMode={"contain"} style={{maxWidth: 125, maxHeight: 125}}/>
                    <View className={"flex-col w-3/5"}>
                        <Text className={"text-xl font-bold dark:text-white text-black tracking-wide"}>
                            Get Support
                        </Text>
                        <Text className={"text-base text-neutral-500 dark:text-neutral-400"}>
                            Learn more about dementia, caring for someone with dementia, and caring for yourself.
                        </Text>
                    </View>
                </View>
                <View className={"w-full flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:my-1 sm:my-1 md:my-2 lg:my-3 xl:my-4 md:px-2 lg:px-4 xl:px-4"}/>
                <SearchInput ref={searchInputRef} placeholder={"Search for an article..."} onSearch={(s) => onSearch(s)} modalVisible={false} modalVisibleFun={() => {}}/>
                <View>
                    {/* Pills showing current filters */}
                    {searchValue && (
                        <View className={"flex-row gap-2 mt-2"}>
                            <View className={"flex-row items-center gap-2 bg-neutral-200 dark:bg-neutral-950 px-2 py-2 rounded-lg"}>
                                <Text className={"text-sm dark:text-white text-neutral-600"}>
                                    Search: {searchValue}
                                </Text>
                                <TouchableOpacity onPress={() => clearSearch()}>
                                    <MaterialIcons name={"cancel"} size={16} color={colorScheme === "dark" ? colors.white : colors.black}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {tags && tags.length > 0 && (
                        <View>
                            <ScrollView horizontal={true} contentContainerStyle={{gap: 4, alignItems: "center"}} className={"gap-2 mt-2"}>
                                {tags.map((tag, index) => (
                                    <View key={tag+index} className={"flex-row items-center justify-between gap-2 bg-neutral-200 dark:bg-neutral-950 px-2 py-2 rounded-lg"}>
                                        <Text className={"text-xs dark:text-white text-neutral-600 tracking-wide font-semibold uppercase"}>
                                            {tag}
                                        </Text>
                                        <TouchableOpacity onPress={() => setTagFilter(tags.filter(t => t !== tag))}>
                                            <MaterialIcons name={"cancel"} size={16} color={colorScheme === "dark" ? colors.white : colors.black}/>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            </View>

            <View className={"md:px-2 lg:px-4 xl:px-4"}>
                {loading && (
                    <ActivityIndicator size={"large"} color={"#000"} />
                )}

                {!loading && !filteredArticles && latestArticle && (
                    <View
                        className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-1 md:my-1 lg:my-2 xl:my-2 rounded-lg flex-row items-center justify-between"}
                        style={{
                            shadowColor: colors.black,
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                            shadowRadius: 3.84,
                            elevation: 2
                        }}>
                        <View className={"flex-1"}>
                            <View className="bg-indigo-100 dark:bg-indigo-400 px-2 py-2 rounded-lg flex-row items-center w-auto mb-2">
                                <MaterialIcons name="new-releases" size={18} color={colors.blue[800]} />
                                <Text className="ml-1 text-sm font-semibold text-blue-800 dark:text-blue-900 uppercase tracking-wide">
                                    Latest Article
                                </Text>
                            </View>
                            <View className={"flex-row items-center justify-between"}>
                                <Text className={"text-base font-bold dark:text-white text-black tracking-wide "}>
                                    {latestArticle.title}
                                </Text>
                                <Text className="uppercase text-xs font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide">
                                    Category: {latestArticle.category.name}
                                </Text>
                            </View>
                            <Text className={"text-base text-neutral-500"}>{latestArticle.source}</Text>
                            {latestArticle.tags && (
                                <ScrollView horizontal={true} contentContainerStyle={{justifyContent: "flex-start"}} className={"flex-row mt-4"}>
                                    {latestArticle.tags.map((tag, index) => (
                                        <TouchableOpacity onPress={() => setTagFilter([...tags, tag])} key={index} className={"bg-neutral-200 dark:bg-neutral-950 px-2 py-1 rounded-lg mr-2"}>
                                            <Text className={"text-sm dark:text-white text-neutral-600"}>
                                                {tag}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    </View>
                )}

                {!loading && !filteredArticles && articles && articles?.length > 0 &&
                    articles.map((article, index) => (
                            <View
                                key={article.uuid}
                                className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-1 md:my-1 lg:my-2 xl:my-2 rounded-lg flex-row items-center justify-between"}
                                style={{
                                    shadowColor: colors.black,
                                    shadowOffset: {width: 0, height: 2},
                                    shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                    shadowRadius: 3.84,
                                    elevation: 2
                                }}>
                                <View className={"flex-1"}>
                                    <View className={"flex-row items-center justify-between"}>
                                        <Text className={"text-base font-bold dark:text-white text-black tracking-wide "}>
                                            {article.title}
                                        </Text>
                                        <Text className="uppercase text-xs font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide">
                                            Category: {article.category.name}
                                        </Text>
                                    </View>
                                    <Text className={"text-base text-neutral-500"}>{article.source}</Text>
                                    {article.tags && (
                                        <ScrollView horizontal={true} contentContainerStyle={{justifyContent: "flex-start"}} className={"flex-row mt-4"}>
                                            {article.tags.map((tag, index) => (
                                                <TouchableOpacity onPress={() => setTagFilter([...tags, tag])} key={index} className={"bg-neutral-200 dark:bg-neutral-950 px-2 py-1 rounded-lg mr-2"}>
                                                    <Text className={"text-sm dark:text-white text-neutral-600"}>
                                                        {tag}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    )}
                                </View>
                            </View>
                        )
                    )
                }

                {!loading && filteredArticles && filteredArticles?.length > 0 &&
                    filteredArticles.map((article, index) => (
                            <View key={article.uuid + "-filtered"}
                                className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-1 md:my-1 lg:my-2 xl:my-2 rounded-lg flex-row items-center justify-between"}
                                style={{
                                    shadowColor: colors.black,
                                    shadowOffset: {width: 0, height: 2},
                                    shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                    shadowRadius: 3.84,
                                    elevation: 2
                                }}>
                                <View className={"flex-1"}>
                                    {latestArticle?.uuid === article.uuid && (
                                        <View className="bg-indigo-100 dark:bg-indigo-400 px-2 py-2 rounded-lg flex-row items-center w-auto mb-2">
                                            <MaterialIcons name="new-releases" size={18} color={colors.blue[800]} />
                                            <Text className="ml-1 text-sm font-semibold text-blue-800 dark:text-blue-900 uppercase tracking-wide">
                                                Latest Article
                                            </Text>
                                        </View>
                                    )}
                                    <View className={"flex-row items-center justify-between"}>
                                        <Text className={"text-base font-bold dark:text-white text-black tracking-wide "}>
                                            {article.title}
                                        </Text>
                                        <Text className="uppercase text-xs font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide">
                                            Category: {article.category.name}
                                        </Text>
                                    </View>
                                    <Text className={"text-base text-neutral-500"}>{article.source}</Text>
                                    {article.tags && (
                                        <ScrollView horizontal={true} contentContainerStyle={{justifyContent: "flex-start"}} className={"flex-row mt-4"}>
                                            {article.tags.map((tag, index) => (
                                                <TouchableOpacity onPress={() => setTagFilter([...tags, tag])} key={index} className={"bg-neutral-200 dark:bg-neutral-950 px-2 py-1 rounded-lg mr-2"}>
                                                    <Text className={"text-sm dark:text-white text-neutral-600"}>
                                                        {tag}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    )}
                                </View>
                            </View>
                        )
                    )
                }

                {!loading && (articles && articles?.length === 0 || filteredArticles && filteredArticles.length === 0) && (
                    <View className={"w-full flex-col items-center justify-center mt-2"}>
                        <Text className={"dark:text-white text-base font-bold"}>
                            No articles found with the current search criteria.
                        </Text>
                        <Text className={"dark:text-neutral-200 text-neutral-500 text-sm"}>
                            Try refining your search or check back later.
                        </Text>
                    </View>
                )}

                {error && (
                    <Text className={"text-lg text-red-500"}>{error}</Text>
                )}
            </View>
        </ScrollView>
    );
}
