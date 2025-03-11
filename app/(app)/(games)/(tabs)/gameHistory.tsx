import {Dimensions, Image, RefreshControl, ScrollView, Text, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "tailwindcss/colors";
import {useCallback, useState} from "react";
import {useAppSelector} from "@/hooks/store/hooks";
import {useColorScheme} from "nativewind";
import {LineChart} from "react-native-chart-kit";

const gameHistory = () => {
    const [refreshing, setRefreshing] = useState(false);
    const user = useAppSelector(state => state.user.user);
    const { colorScheme } = useColorScheme();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
        throw new Error("Not implemented");
    }, []);

    return (
        <KeyboardAwareScrollView contentContainerStyle={{justifyContent: "flex-start"}} className={"flex-1 bg-neutral-100 dark:bg-neutral-800 w-full md:px-4 lg:px-6"}
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
                    <Image source={{uri: user?.profile_image}}
                           className={"rounded-full xs:w-10 sm:w-20 md:w-25 lg:w-30 xl:w-35 xs:h-10 sm:h-20 md:h-25 lg:h-30 xl:h-35"}/>
                </View>

                <View className={"flex-1"}>
                    <Text
                        className={"dark:text-white xs:text-base sm:text-base md:text-2xl lg:text-2xl xl:text-2xl font-semibold"}>
                        Hello, {user?.first_name}!
                    </Text>
                    <Text
                        className={"dark:text-white xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"}>
                        View your family's game history here.
                        Scores, averages and more!
                    </Text>
                </View>
            </View>

            {/* Separator */}
            <View className={"w-full flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:my-1 sm:my-1 md:my-3 lg:my-3 xl:my-4 md:px-2 lg:px-4 xl:px-4"}/>

            <View className={"flex"}>

                <LineChart
                    data={{
                        labels: ["January", "February", "March", "April", "May", "June"],
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100
                                ]
                            }
                        ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>

            <View className={"flex gap-2 justify-center my-2"}>
                <Text className={"dark:text-white xs:text-base sm:text-base md:text-lg lg:text-xl font-bold mt-1"}>
                    Top Scores this Week
                </Text>
                {/* Separator */}
                <View className={"border-b dark:border-b-neutral-600 border-b-neutral-300 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                <View className={"flex flex-row gap-3"}>
                    {[
                        { name: "Mary Doe", score: 16, total: 30, game: "Match the Hamsters" },
                        { name: "John Doe", score: 18, total: 30, game: "Match the Hamsters" },
                    ].map((player, index) => (
                        <View
                            key={index}
                            className="flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center" style={{
                            shadowColor: colors.black,
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                            shadowRadius: 3.84,
                            elevation: 2
                        }}>
                            <Text className="text-lg text-blue-500 font-semibold">{player.name}</Text>
                            <Text className="text-5xl text-blue-500 font-bold my-1">{player.score}</Text>
                            <Text className="text-sm text-blue-500 font-medium">Out of {player.total}</Text>
                            <View className="flex-1 mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Text className="text-base text-blue-600 dark:text-blue-300 font-semibold text-center">
                                    {player.game}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

        </KeyboardAwareScrollView>
    )
}

export default gameHistory;
