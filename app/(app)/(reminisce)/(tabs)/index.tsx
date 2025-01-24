import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView, useColorScheme
} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useAppSelector} from "@/hooks/store/hooks";
import {Link} from "expo-router";
import {Calendar} from "react-native-calendars";
import colors from "tailwindcss/colors";
import {useThemeColor} from "@/hooks/useThemeColor";

// TODO: Retrieve most populated albums, most recent entry and most recent entries.

const index = () => {

    const user = useAppSelector(state => state.user.user);
    const quote = useAppSelector(state => state.quote.quote);
    const theme = useThemeColor();
    const mode = useColorScheme();

    return (
        <ScrollView style={{backgroundColor: mode === 'dark' ? colors.neutral[800] : colors.white}} contentContainerStyle={{flexGrow: 1}}>
            <View className={"flex-1 items-center dark:bg-neutral-800 pb-10"}>
                <View className={"w-full bg-blue-500 dark:bg-neutral-800 p-6"}>
                    <View className={"flex-row items-center"}>
                        <Image
                            source={{uri: user?.profile_image }}
                            style={{width: 100, height: 100}}
                            className={"mr-4 rounded-lg"}
                        />
                        <View className={"p-2 w-3/4"}>
                            <Text className={"dark:text-white text-2xl font-bold text-white"}>
                                Hello, {user?.first_name}!
                            </Text>
                            <Text className={"mt-2 text-neutral-100 text-base"}>
                                Get started now! Create a new entry to help someone reminisce.
                            </Text>
                        </View>
                    </View>
                    <View className={"flex-row items-center justify-between"}>
                        <TouchableOpacity
                            className="flex-row items-center mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50">
                            <MaterialIcons name="add" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                New Entry
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-row items-center mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50">
                            <MaterialIcons name="upload" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Upload Picture
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-row items-center mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50">
                            <MaterialIcons name="list" size={24} color="white" className={"mr-1"} />
                            <Text className="text-white">
                                Create Album
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className={"px-4"}>
                    <View className={"mt-4 border bg-neutral-100 dark:bg-neutral-900 dark:shadow-sm dark:border-neutral-900 border-neutral-300 rounded-lg p-4"}>
                        <View key={"subtasks"}>
                            <Text className={"text-lg font-bold dark:text-white"}>
                                Quote of the Day
                            </Text>
                            <Text className={"text-base dark:text-white italic"}>
                                {quote?.q}
                            </Text>
                            <Text className={"mt-1 dark:text-neutral-400 text-neutral-600 font-bold"}>
                                - {quote?.a}
                            </Text>
                            <Text className={"text-sm dark:text-neutral-400 mt-1"}>
                                Quotes provided by <Link className={"underline underline-offset-2"} href={"https://zenquotes.io/"}>ZenQuotes</Link>
                            </Text>
                        </View>
                    </View>
                    <View className={"flex-row gap-6 justify-between w-full mt-4"} key={"subtasks"}>
                        <View className={"flex-1 border bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-sm border-neutral-300 rounded-lg p-4"}>
                            <Text className={"dark:text-white"}>
                                Most Recent Entry
                            </Text>
                        </View>
                        <View className={"flex-1 border bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-sm border-neutral-300 rounded-lg p-4"}>
                            <Text className={"dark:text-white"}>
                                Entries
                            </Text>
                        </View>
                    </View>
                    <View className={"flex-row gap-4 justify-between w-full mt-4"} key={"albums"}>
                        <View className={"flex-1 border bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-sm border-neutral-300 rounded-lg p-4"}>
                            <Text className={"dark:text-white"}>
                                Albums
                            </Text>
                        </View>
                    </View>
                    <View className={"flex-row gap-4 justify-between w-full mt-4"} key={"dates"}>
                        <View className={"flex-1 border bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-sm border-neutral-300 rounded-lg p-4"}>
                            <Text className={"dark:text-white text-lg mb-2 font-bold"}>
                                See when you've reminisced
                            </Text>
                            <View className={"flex-row items-center"}>
                                <View className={"p-1 rounded-3xl bg-blue-500"}/>
                                <Text className={"text-neutral-500 text-sm ml-2"}>
                                    Indicates a day you've reminisced
                                </Text>
                            </View>
                            <View className={"flex-row items-center mt-2 mb-2"}>
                                <Text className={"text-blue-500"}>day</Text>
                                <Text className={"text-neutral-500 text-sm ml-2"}>
                                    Indicates today
                                </Text>
                            </View>
                            <View key={mode}>
                                <Calendar markingType={"custom"}
                                          theme={{
                                              backgroundColor: mode === "dark" ? colors.neutral[900] : colors.neutral[100],
                                              calendarBackground: mode === "dark" ? colors.neutral[900] : colors.neutral[100],
                                              textSectionTitleColor: theme.text,
                                              selectedDayBackgroundColor: colors.blue[500],
                                              selectedDayTextColor: colors.neutral[800],
                                              todayTextColor: colors.blue[500],
                                              dayTextColor: theme.text,
                                              textInactiveColor: colors.neutral[400],
                                              dotColor: colors.blue[500],
                                              textDayStyle: {color: theme.text},
                                              monthTextColor: theme.text,
                                              yearTextColor: theme.text,
                                              arrowColor: colors.blue[500],
                                          }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default index;