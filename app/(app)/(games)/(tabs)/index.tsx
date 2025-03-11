import {ActivityIndicator, Image, Text, TouchableOpacity, View} from "react-native";
import {useAppSelector} from "@/hooks/store/hooks";
import colors from "tailwindcss/colors";
import {useColorScheme} from "nativewind";
import {MaterialIcons} from "@expo/vector-icons";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useRouter} from "expo-router";
import {useGame} from "@/hooks/games/useGame";
import {useCallback, useState} from "react";
import {Match} from "@/services/api/types";
import {useFocusEffect} from "@react-navigation/native";
import {usePatients} from "@/hooks/patients/usePatients";

const GameIndex = () => {
    const user = useAppSelector(state => state.user.user);
    const { colorScheme } = useColorScheme();
    const router = useRouter();
    const { getLatestGame, loading, error } = useGame();
    const { getPatient } = usePatients();
    const [game, setGame] = useState<Match | null>(null);

    useFocusEffect(
        useCallback(() => {
            getLatestGame().then((data) => {
                if (data) {
                    // If person_with_dementia is not null, get the patient's details
                    if (data.person_with_dementia) {
                        getPatient(data.person_with_dementia).then((patient) => {
                            if (patient) {
                                setGame({...data, person_with_dementia: patient.first_name + " " + patient.last_name});
                            }
                        })
                    } else {
                        setGame(data);
                    }
                }
            })
        }, [])
    )

    return (
        <KeyboardAwareScrollView contentContainerStyle={{justifyContent: "flex-start"}} className={"flex-1 bg-neutral-100 dark:bg-neutral-800 w-full md:px-4 lg:px-6"}>
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
                        Select a game to play with one of your family members.
                    </Text>
                </View>
            </View>
            {/* Separator */}
            <View className={"border-b dark:border-b-neutral-600 border-b-neutral-300 xs:mt-1 sm:mt-1 md:mt-2 lg:mt-3 xl:mt-4 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

            <View className={"flex-row gap-2 justify-center my-2"}>
                {loading && (
                    <ActivityIndicator size={"large"} color={colorScheme === "dark" ? colors.white : colors.blue[500]}/>
                )}
                {!loading && game && error === null && (
                <TouchableOpacity
                    onPress={() => {
                    }}
                    className={"w-full bg-white dark:bg-neutral-900 xs:my-1 sm:my-1 md:my-1 lg:my-2 xl:my-2 rounded-lg flex-row items-center justify-between"}
                    style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}>
                    <View className={"flex-1"}>
                        <View className="bg-indigo-200 dark:bg-blue-500 px-2 py-4 rounded-t-lg flex-row items-center w-auto">
                            <MaterialIcons name="new-releases" size={18} color={colors.blue[800]} />
                            <Text className="ml-1 text-sm font-semibold text-blue-800 dark:text-blue-900 uppercase tracking-wide">
                                Featured Game
                            </Text>
                        </View>
                        <View className={"xs:p-2 sm:p-2 md:p-3 lg:p-4 xl:p-4"}>
                            <View className={"flex-row items-center justify-between"}>
                                <Text className={"flex-1 text-base font-bold dark:text-white text-black tracking-wide "}>
                                    {game.title}
                                </Text>
                                <Text className="uppercase text-xs font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide">
                                    Created: {new Date(game.created_at).toLocaleDateString()}
                                </Text>
                            </View>
                            <Text className={"flex-1 text-base text-neutral-500"}>By: {game.person_with_dementia || "The CogniCarer Team"}</Text>

                            <View className={"flex-row justify-between mt-1"}>
                                <TouchableOpacity
                                    className="flex-row items-center pt-2">
                                    <Text className="text-base text-neutral-500 dark:text-neutral-400">
                                        Max: {game.maximum_score} points
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-row items-center pt-2">
                                    <Text className="text-base text-neutral-500 dark:text-neutral-400">
                                        Avg: {game.average_score}/{game.maximum_score}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                )}
            </View>

            <View className={"flex gap-2 justify-center my-2"}>
                <Text className={"dark:text-white xs:text-base sm:text-base md:text-lg lg:text-xl font-bold mt-1"}>
                    Available Game Types
                </Text>
                {/* Separator */}
                <View className={"border-b dark:border-b-neutral-600 border-b-neutral-300 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                <View className={"flex flex-row md:gap-2 lg:gap-4"}>
                    <TouchableOpacity className="flex-1 bg-white p-4 rounded-lg dark:bg-neutral-900 items-center justify-center" style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}
                                      onPress={() => {
                                          router.push("/(app)/(games)/(tabs)/gameList")
                                      }}
                    >
                        <View className={"items-center"}>
                            <MaterialIcons name="sports-esports" size={26} color={colorScheme === "dark" ? colors.white : colors.blue[500]} />
                            <Text className="text-base font-semibold tracking-wide text-blue-500 dark:text-white text-center">
                                Find the Match
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={true} className="flex-1 bg-gray-200 p-4 rounded-lg dark:bg-neutral-900 items-center justify-center" style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}>
                        <View className={"items-center"}>
                            <MaterialIcons name="construction" size={26} color={colorScheme === "dark" ? colors.white : colors.blue[400]} />
                            <Text className="text-base font-semibold text-blue-400 dark:text-white text-center">
                                Coming Soon
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={true} className="flex-1 bg-gray-200 p-4 rounded-lg dark:bg-neutral-900 items-center justify-center" style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}>
                        <View className={"items-center"}>
                            <MaterialIcons name="construction" size={26} color={colorScheme === "dark" ? colors.white : colors.blue[400]} />
                            <Text className="text-base font-semibold text-blue-400 dark:text-white text-center text-wrap">
                                Coming Soon
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View className={"flex gap-2 justify-center my-2"}>
                <Text className={"dark:text-white xs:text-base sm:text-base md:text-lg lg:text-xl font-bold mt-1"}>
                    Quick Actions
                </Text>
                {/* Separator */}
                <View className={"border-b dark:border-b-neutral-600 border-b-neutral-300 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                <View className={"flex flex-row md:gap-2 lg:gap-4"}>
                    <TouchableOpacity className="flex-1 bg-white p-4 rounded-lg dark:bg-neutral-900" style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}
                                      onPress={() => {
                                          router.push("/(app)/(games)/(tabs)/createGame")
                                      }}
                    >
                        <View className={"items-center"}>
                            <MaterialIcons name="draw" size={26} color={colorScheme === "dark" ? colors.white : colors.blue[500]} />
                            <Text className="text-base font-semibold tracking-wide text-blue-500 dark:text-white text-center">
                                Create a Personalised Game
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white p-4 rounded-lg dark:bg-neutral-900" style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}
                                      onPress={() => {
                                          router.push("/(app)/(games)/(tabs)/gameHistory")
                                      }}
                    >
                        <View className={"items-center"}>
                            <MaterialIcons name="analytics" size={26} color={colorScheme === "dark" ? colors.white : colors.blue[500]} />
                            <Text className="text-base font-semibold tracking-wide text-blue-500 dark:text-white text-center">
                                View your Game History
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default GameIndex;
