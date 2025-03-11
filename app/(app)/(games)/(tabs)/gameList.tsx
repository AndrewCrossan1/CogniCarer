import {
    View,
    Text,
    Image,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    ScrollView
} from "react-native";
import {useColorScheme} from "nativewind";
import {useGame} from "@/hooks/games/useGame";
import {useCallback, useState} from "react";
import {Match} from "@/services/api/types";
import SearchInput from "@/components/SearchInput";
import colors from "tailwindcss/colors";
import {usePatients} from "@/hooks/patients/usePatients";
import {useFocusEffect} from "@react-navigation/native";

const GameList = () => {
    const { colorScheme } = useColorScheme();
    const { getGames, loading, error } = useGame();
    const [games, setGames] = useState<Match[] | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const { getPatient } = usePatients();

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize] = useState(4);  // A setter will be implemented when
    const [pageItems, setPageItems] = useState<Match[]>([] as Match[]);
    const [totalPages, setTotalPages] = useState(0);

    const handlePageChange = (page: number) => {
        setPage(page);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        setPageItems(games?.slice(start, end) || []);
    }

    const fetchGames = async () => {
        const games = await getGames();

        if (games) {
            // If person_with_dementia is not null, fetch the patient
            for (let i = 0; i < games.length; i++) {
                if (games[i].person_with_dementia) {
                    const patient = await getPatient(games[i].person_with_dementia);
                    games[i].person_with_dementia = patient?.first_name + " " + patient?.last_name;
                }
            }

            // Sort games by times_played
            games.sort((a, b) => b.times_played - a.times_played);

            // Pagination Control
            setTotalPages(Math.ceil(games.length / pageSize));

            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            setPageItems(games.slice(start, end));
            setGames(games);
        }
    }

    // Reset pagination and filters when the page is focused
    useFocusEffect(
        useCallback(() => {
            handlePageChange(1);

            fetchGames().then().catch();
        }, [])
    );

    const onRefresh = useCallback(() => {
        fetchGames().then(
            () => {
                handlePageChange(1);
            }
        ).catch(
            (e) => {
                console.error(e);
            });
        setRefreshing(false);
    }, [games?.length]);

    return (
        <ScrollView contentContainerStyle={{justifyContent: "flex-start"}} className={"flex-1 bg-neutral-100 dark:bg-neutral-800 w-full md:px-4 lg:px-6"}
                                 refreshControl={
                                     <View>
                                         <RefreshControl title={"Refreshing..."} titleColor={colors.neutral[400]}
                                                         tintColor={colors.neutral[400]} refreshing={refreshing}
                                                         onRefresh={onRefresh}/>
                                     </View>
                                 }>
            {/* Header */}
            <View className={"flex flex-row gap-5 items-center xs:mt-4 sm:mt-5 md:mt-6 lg:mt-6 xl:mt-6"}>
                <View className={"flex"}>
                    <Image source={require("@/assets/images/games/undraw_select-player_sppe.png")}
                           resizeMode={"cover"}
                           className={"md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg android:elevation-md"} />
                </View>
                <View className={"flex-1"}>
                    <Text className={"dark:text-white xs:text-base sm:text-base md:text-2xl lg:text-2xl xl:text-2xl font-semibold"}>
                        Available Games
                    </Text>
                    <Text className={"dark:text-white xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"}>
                        Browse public games and find games created by your family members.
                    </Text>
                </View>
            </View>

            {/* Search Bar */}
            <View className={"w-full flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:my-1 sm:my-1 md:my-3 lg:my-3 xl:my-4 md:px-2 lg:px-4 xl:px-4"}/>
            <SearchInput placeholder={"Search for a game..."} onSearch={(s) => {}} modalVisible={false} modalVisibleFun={() => {}} infoVisible={false}/>

            {error && (
                <View className={"flex flex-row items-center justify-center"}>
                    <Text className={"dark:text-white text-red-500"}>
                        {error}
                    </Text>
                </View>
            )}

            {loading && (
                <View className={"flex flex-row items-center justify-center"}>
                    <ActivityIndicator size={"large"} color={colorScheme === "dark" ? "white" : "black"}/>
                </View>
            )}


            {!loading && games && games.length === 0 &&
              <View className={"w-full flex-col items-center justify-center my-2"}>
                <Text className={"dark:text-white text-base font-bold"}>
                  It's very quiet here!
                </Text>
                <Text className={"dark:text-neutral-200 text-neutral-500 text-sm"}>
                  Why not create your own game?
                </Text>
              </View>
            }

            {/* Game List */}
            {!loading && games && games.length > 0 && (
                <View className={"flex gap-4 my-4"}>
                    {pageItems.map((item, index) => (
                        <View key={index} className={`flex-1 flex-col rounded-lg p-4 justify-between bg-white dark:bg-neutral-900`} style={{
                            shadowColor: colors.black,
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                            shadowRadius: 3.84,
                            elevation: 2
                        }}>
                            <View className={"flex flex-wrap flex-row items-center justify-between"}>
                                <Text className={"dark:text-white text-base font-bold"}>
                                    {item.title}
                                </Text>
                                <Text className={"uppercase text-xs font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide"}>
                                    Created: {new Date(item.created_at).toLocaleDateString()}
                                </Text>
                            </View>

                            <View className={"flex my-1"}>
                                <Text className={"dark:text-white text-sm"}>
                                    By: {item.person_with_dementia || "The CogniCarer Team"}
                                </Text>
                            </View>

                            {item.description && (
                                <View className={"flex my-1"}>
                                    <Text className={"dark:text-white text-sm"}>
                                        {item.description}
                                    </Text>
                                </View>
                            )}

                            <View className={"flex-1 flex-row justify-evenly items-center mt-2"}>
                                <View className={"flex items-center"}>
                                    <Text className={"text-blue-500 text-xl font-bold text-center"}>
                                        {item.average_score}/{item.maximum_score}
                                    </Text>
                                    <Text className={"dark:text-neutral-400 text-sm font-semibold text-center"}>
                                        Average Score
                                    </Text>
                                </View>
                                <View className={"flex p-1 items-center"}>
                                    <Text className={"text-blue-500 text-xl font-bold text-center"}>
                                        {item.maximum_score}
                                    </Text>
                                    <Text className={"dark:text-neutral-400 text-sm font-semibold text-center"}>
                                        Maximum Score
                                    </Text>
                                </View>
                                <View className={"flex p-1 items-center"}>
                                    <Text className={"text-blue-500 text-xl font-bold text-center"}>
                                        {item.times_played}
                                    </Text>
                                    <Text className={"dark:text-neutral-400 text-sm font-semibold text-center"}>
                                        Times Played
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity className={"flex flex-row items-center justify-center bg-blue-500 dark:bg-blue-600 p-2 rounded-lg mt-2"}>
                                <Text className={"text-white text-sm font-semibold"}>
                                    Play Now
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <View className={"flex-row items-center justify-center gap-2 mt-2 mb-4"}>
                    {page > 1 && (
                        <TouchableOpacity onPress={() => {
                            if (page > 1) {
                                handlePageChange(page - 1);
                            }
                        }} className={"border border-neutral-600 px-3 py-2 rounded-lg"}>
                            <Text className={"dark:text-white"}>Prev</Text>
                        </TouchableOpacity>
                    )}

                    {/* Current page and current page + 1 */}
                    <TouchableOpacity onPress={() => {
                        if (page > 1) {
                            handlePageChange(page - 1);
                        }
                    }} className={"bg-blue-500 border border-blue-500 px-3 py-2 rounded-lg"}>
                        {page === totalPages ? (
                            <Text className={"text-white dark:text-white"}>{page - 1}</Text>
                        ) : (
                            <Text className={"text-white dark:text-white"}>{page}</Text>
                        )}
                    </TouchableOpacity>

                    {/* Show next page */}
                    {page + 1 <= totalPages &&  (
                        <TouchableOpacity onPress={() => handlePageChange(page + 1)} className={"px-3 py-2 rounded-lg border border-neutral-600"}>
                            <Text className={" dark:text-white"}>{page + 1}</Text>
                        </TouchableOpacity>
                    )}

                    <Text className={"text-lg dark:text-white text-black"}>...</Text>

                    {/* Show last page */}
                    <TouchableOpacity onPress={() => handlePageChange(totalPages)} className={"px-3 py-2 rounded-lg border border-neutral-600"}>
                        <Text className={"dark:text-white"}>{totalPages}</Text>
                    </TouchableOpacity>

                    {page + 1 <= totalPages && (
                        <TouchableOpacity onPress={() => {
                            if (page + 1 <= totalPages) {
                                handlePageChange(page + 1);
                            }
                        }} className={"border border-neutral-600 px-3 py-2 rounded-lg"}>
                            <Text className={"text-neutral-600 dark:text-white"}>Next</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

        </ScrollView>
    )
}

export default GameList;
