import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView
} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useAppSelector} from "@/hooks/store/hooks";
import {Link} from "expo-router";
import {Calendar} from "react-native-calendars";
import colors from "tailwindcss/colors";

// TODO: Retrieve most populated albums, most recent entry and most recent entries.

const index = () => {

    const user = useAppSelector(state => state.user.user);
    const quote = useAppSelector(state => state.quote.quote);

    return (
        <ScrollView style={{backgroundColor: colors.neutral[800]}} contentContainerStyle={{flexGrow: 1}}>
            <View className={"flex-1 items-center dark:bg-neutral-800 pb-10"}>
                <View className={"w-full bg-blue-500 p-6"}>
                    <View className={"flex-row items-center"}>
                        <Image
                            source={{uri: user?.profile_image }}
                            style={{width: 75, height: 75, borderRadius: 50}}
                            className={"mr-4"}
                        />
                        <View className={"p-2 w-3/4"}>
                            <Text className={"dark:text-white text-2xl font-bold"}>
                                Hello, {user?.first_name}!
                            </Text>
                            <Text className={"mt-2 text-neutral-100 text-base"}>
                                Get started now! Create a new entry to start reminiscing.
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="flex-row items-center mt-3 rounded-lg p-4 bg-blue-600 shadow-md shadow-blue-500/50">
                        <MaterialIcons name="add" size={24} color="white" />
                        <Text className="text-white text-lg font-bold ml-2">
                            New Reminisce Entry
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className={"px-4"}>
                    <View className={"mt-4 border bg-neutral-200 dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-sm border-neutral-300 rounded-lg p-4"}>
                        <View key={"subtasks"}>
                            <Text className={"text-lg font-bold dark:text-white"}>
                                Quote of the Day
                            </Text>
                            <Text className={"text-base dark:text-white italic"}>
                                {quote?.q}
                            </Text>
                            <Text className={"mt-1 text-neutral-400 font-bold"}>
                                - {quote?.a}
                            </Text>
                            <Text className={"text-sm dark:text-neutral-400 mt-1"}>
                                Quotes provided by <Link className={"underline underline-offset-2"} href={"https://zenquotes.io/"}>ZenQuotes</Link>
                            </Text>
                        </View>
                    </View>
                    <View className={"flex-row gap-6 justify-between w-full mt-4"} key={"subtasks"}>
                        <View className={"flex-1 border bg-neutral-200 dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-sm border-neutral-300 rounded-lg p-4"}>
                            <Text className={"dark:text-white"}>
                                Most Recent Entry
                            </Text>
                        </View>
                        <View className={"flex-1 border bg-neutral-200 dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-sm border-neutral-300 rounded-lg p-4"}>
                            <Text className={"dark:text-white"}>
                                Entries
                            </Text>
                        </View>
                    </View>
                    <View className={"flex-row gap-4 justify-between w-full mt-4"} key={"albums"}>
                        <View className={"flex-1 border bg-neutral-200 dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-sm border-neutral-300 rounded-lg p-4"}>
                            <Text className={"dark:text-white"}>
                                Albums
                            </Text>
                        </View>
                    </View>
                    <View className={"flex-row gap-4 justify-between w-full mt-4"} key={"dates"}>
                        <View className={"flex-1 border bg-neutral-200 dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-sm border-neutral-300 rounded-lg p-4"}>
                            <Text className={"dark:text-white text-lg mb-2 font-bold"}>
                                See when you've reminisced
                            </Text>
                            <View className={"flex-row items-center"}>
                                <View className={"p-1 rounded-3xl bg-blue-500"}/>
                                <Text className={"text-neutral-100 text-sm ml-2"}>
                                    Indicates a day you've reminisced
                                </Text>
                            </View>
                            <View className={"flex-row items-center mt-2"}>
                                <Text className={"text-blue-500"}>day</Text>
                                <Text className={"text-neutral-100 text-sm ml-2"}>
                                    Indicates today
                                </Text>
                            </View>
                            <Calendar markingType={"custom"}
                                      hideDayNames={true}
                                      theme={{
                                          backgroundColor: colors.neutral[900],
                                          calendarBackground: colors.neutral[900],
                                          textSectionTitleColor: colors.white,
                                          selectedDayBackgroundColor: colors.blue[500],
                                          selectedDayTextColor: colors.neutral[800],
                                          todayTextColor: colors.blue[500],
                                          dayTextColor: colors.neutral[100],
                                          dotColor: colors.blue[500],
                                          textDayStyle: {color: colors.neutral[100]},
                                          monthTextColor: colors.neutral[100],
                                          yearTextColor: colors.neutral[100],
                                          arrowColor: colors.blue[500],
                                      }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default index;