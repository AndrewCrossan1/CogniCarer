import {Image, Text, TouchableOpacity, View} from "react-native";
import {useAppSelector} from "@/hooks/store/hooks";
import colors from "tailwindcss/colors";
import {useColorScheme} from "nativewind";
import {LinkButton} from "@/components/LinkButton";
import {MaterialIcons} from "@expo/vector-icons";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const GameIndex = () => {
    const user = useAppSelector(state => state.user.user);
    const { colorScheme } = useColorScheme();

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

            <View className={"flex-row gap-2 justify-between my-2"}>
                {/* Information bubble */}
                <TouchableOpacity
                    onPress={() => {

                    }}
                    className={"flex-1 xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-1 md:my-1 lg:my-2 xl:my-2 rounded-lg flex-row justify-center items-center gap-4"}
                    style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}>
                    <View className={"flex"}>
                        <Image source={require("@/assets/images/undraw_education_3vwh.png")} className={"rounded-lg"} style={{aspectRatio: 1, height:100}}/>
                    </View>
                    <View className={"flex-1"}>
                        <Text className={"dark:text-white xs:text-base sm:text-base md:text-base lg:text-xl font-bold my-1"}>
                            Why are games beneficial?
                        </Text>
                        <Text className={"dark:text-white xs-text-xs sm:text-xs md:text-xs lg:text-sm my-1"}>
                            Spaced retrieval games like these can help improve memory and cognitive function.
                        </Text>
                        <LinkButton href={"https://www.cambridge.org/core/journals/international-psychogeriatrics/article/literature-review-of-spacedretrieval-interventions-a-direct-memory-intervention-for-people-with-dementia/084A0C287F13F06E47EBEBD8A7C3D76D"} text={"Read more on Spaced Retrieval"}/>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => {
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
                            Latest Game
                        </Text>
                    </View>
                    <View className={"flex-row items-center justify-between"}>
                        <Text className={"text-base font-bold dark:text-white text-black tracking-wide "}>
                            Latest Game
                        </Text>
                        <Text className="uppercase text-xs font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide">
                            Category
                        </Text>
                    </View>
                    <Text className={"text-base text-neutral-500"}>Creator</Text>

                    <View className={"flex-row justify-between"}>
                        {/* Like Button with Count */}
                        <TouchableOpacity
                            className="flex-row items-center pt-2">
                            <MaterialIcons name="star-outline" size={18} color={"gold"} />
                            <Text className="ml-1 text-base text-neutral-500 dark:text-neutral-400">
                                Favourites
                            </Text>
                        </TouchableOpacity>

                        {/* View Count */}
                        <View className="flex-row items-center pt-2">
                            <MaterialIcons name="visibility" size={18} color={"gray"} />
                            <Text className="ml-1 text-base text-neutral-500 dark:text-neutral-400">
                                Views
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            <View className={"flex gap-2 justify-center my-2"}>
                <Text className={"dark:text-white xs:text-base sm:text-base md:text-base lg:text-xl font-bold mt-1"}>
                    Available Game Types
                </Text>
                {/* Separator */}
                <View className={"border-b dark:border-b-neutral-600 border-b-neutral-300 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                <View className={"flex flex-row gap-4"}>
                    <TouchableOpacity className="flex-1 bg-white p-4 rounded-lg dark:bg-neutral-900" style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}>
                        <View className={"items-center"}>
                            <MaterialIcons name="sports-esports" size={26} color={colorScheme === "dark" ? colors.white : colors.blue[500]} />
                            <Text className="text-base font-semibold tracking-wide text-blue-500 dark:text-white text-center ml-2">
                                Find the Match
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white p-4 rounded-lg dark:bg-neutral-900" style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}>
                        <View className={"items-center"}>
                            <MaterialIcons name="sports-esports" size={26} color={colorScheme === "dark" ? colors.white : colors.blue[500]} />
                            <Text className="text-base font-semibold text-blue-500 dark:text-white text-center ml-2">
                                Unscramble
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white p-4 rounded-lg dark:bg-neutral-900" style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}>
                        <View className={"items-center"}>
                            <MaterialIcons name="sports-esports" size={26} color={colorScheme === "dark" ? colors.white : colors.blue[500]} />
                            <Text className="text-base font-semibold tracking-wide text-blue-500 dark:text-white text-center ml-2">
                                Face-to-Name
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View className={"flex gap-2 justify-center my-2"}>
                <Text className={"dark:text-white xs:text-base sm:text-base md:text-base lg:text-xl font-bold mt-1"}>
                    Quick Actions
                </Text>
                {/* Separator */}
                <View className={"border-b dark:border-b-neutral-600 border-b-neutral-300 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                <View className={"flex flex-row gap-4"}>
                    <TouchableOpacity className="flex-1 bg-white p-4 rounded-lg dark:bg-neutral-900" style={{
                        shadowColor: colors.black,
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                        shadowRadius: 3.84,
                        elevation: 2
                    }}>
                        <View className={"items-center"}>
                            <MaterialIcons name="draw" size={26} color={colorScheme === "dark" ? colors.white : colors.blue[500]} />
                            <Text className="text-base font-semibold tracking-wide text-blue-500 dark:text-white text-center ml-2">
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
                    }}>
                        <View className={"items-center"}>
                            <MaterialIcons name="analytics" size={26} color={colorScheme === "dark" ? colors.white : colors.blue[500]} />
                            <Text className="text-base font-semibold tracking-wide text-blue-500 dark:text-white text-center ml-2">
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
