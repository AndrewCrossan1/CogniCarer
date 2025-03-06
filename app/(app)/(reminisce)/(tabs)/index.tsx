import {
    View,
    Text,
    Image,
    TouchableOpacity,
    RefreshControl
} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useAppSelector} from "@/hooks/store/hooks";
import {Link, useRouter} from "expo-router";
import {Calendar} from "react-native-calendars";
import colors from "tailwindcss/colors";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useReminisce} from "@/hooks/useReminisce";
import {useCallback, useEffect, useState} from "react";
import {Alert} from "@/components/Alert";
import NewAlbumForm from "@/components/reminisce/NewAlbumForm";
import NewPictureForm from "@/components/reminisce/NewPictureForm";
import * as Haptics from "expo-haptics";
import {useColorScheme} from "nativewind";
import {useFocusEffect} from "@react-navigation/native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const index = () => {

    const user = useAppSelector(state => state.user.user);
    const quote = useAppSelector(state => state.quote.quote);
    const theme = useThemeColor();
    const { colorScheme: mode } = useColorScheme();
    const [alertType] = useState<"success" | "error">("error");
    const [message] = useState("");
    const [visible, setVisible] = useState(false);
    const [newAlbumVisible, setNewAlbumVisible] = useState(false);
    const [newPictureVisible, setNewPictureVisible] = useState(false);
    const [entryDates, setEntryDates] = useState<string[]>([] as string[]);
    const [markedDates, setMarkedDates] = useState({} as any);
    const [refreshing, setRefreshing] = useState(false);
    const [percentReminisced, setPercentReminisced] = useState<string>("");

    const {loading, getEntries, familyReminisced} = useReminisce()
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const getEntryDates = async () => {
                const fetchedEntries = await getEntries();
                if (fetchedEntries) {
                    setEntryDates(fetchedEntries.map((entry) => {
                        return entry.created_at;
                    }));
                }
            }

            getEntryDates().then(() => console.debug("Entry dates fetched"));
            familyReminisced().then((percent) => {
                let edited = percent.split(".")[0];
                setPercentReminisced(edited + "%");
            });
        }, [getEntries, familyReminisced])
    );

    useEffect(() => {

        const marked = async () => {
            let markedDates: any = {};
            entryDates.forEach((date) => {
                // Format the date to match the calendar format
                const formattedDate = new Date(date).toISOString().split("T")[0];
                markedDates[formattedDate] = {selected: true, selectedColor: colors.blue[500]};
            });
            setMarkedDates(markedDates);
        }

        marked().then(() => console.debug("Marked dates"));
    }, [entryDates])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        getEntries().then((valid) => {
            if (!valid) return;
            setRefreshing(false);
            console.debug("Albums refreshed, found: ", valid.length);
            setEntryDates(valid.map((entry) => {
                return entry.created_at;
            }));
            entryDates.forEach((date) => {
                // Format the date to match the calendar format
                const formattedDate = new Date(date).toISOString().split("T")[0];
                markedDates[formattedDate] = {selected: true, selectedColor: colors.blue[500]};
            });
        });
        familyReminisced().then((percent) => {
            // Remove anything after the decimal point except the percent sign
            let edited = percent.split(".")[0];
            setPercentReminisced(edited + "%");
        });
    }, [getEntries, entryDates, markedDates, familyReminisced]);

    const onSubmitted = () => {
        setNewAlbumVisible(false);
    };

    const onPictureSubmitted = () => {
        setNewPictureVisible(false);
    };

    return (
        <KeyboardAwareScrollView style={{backgroundColor: mode === 'dark' ? colors.neutral[800] : colors.neutral[100]}}
                                 contentContainerStyle={{flexGrow: 1}}
                                 refreshControl={
                                     <RefreshControl
                                         refreshing={refreshing}
                                         title={"Refreshing..."}
                                         onRefresh={onRefresh}
                                         colors={[colors.blue[500]]}
                                     />
                                 }
        >
            <View className={"w-full p-6"}>
                <Alert message={message} type={alertType} onPress={() => {
                    setVisible(false);
                }} visible={visible}/>
                <View className={"flex flex-row items-center gap-4"}>
                    <Image
                        source={{uri: user?.profile_image}}
                        style={{width: 100, height: 100}}
                        className={"flex rounded-lg"}
                    />
                    <View className={"p-2 flex-1"}>
                        <Text className={"dark:text-white md:text-xl lg:text-2xl font-bold text-black"}>
                            Hello, {user?.first_name}!
                        </Text>
                        <Text className={"mt-2 text-neutral-600 dark:text-neutral-300 md:text-sm lg:text-base"}>
                            Get started now! Create a new entry to help someone reminisce.
                        </Text>
                    </View>
                </View>
                <View className={"flex flex-row items-center justify-between gap-2"}>
                    <TouchableOpacity
                        onPress={() => router.push("/(app)/(reminisce)/(tabs)/NewEntry")}
                        className="flex-1 flex-row items-center mt-3 rounded-lg p-2 bg-blue-600 dark:bg-neutral-900">
                        <MaterialIcons name="add" size={24} color="white" className={"mr-1"}/>
                        <Text className="text-white">
                            Create a new entry
                        </Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <View
                        className={"xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 rounded-lg xs:mt-1 sm:mt-2 md:mt-3 lg:mt-5 xl:mt-6"}
                        style={{
                            shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: mode === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
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
                                Quotes provided by <Link className={"underline underline-offset-2"}
                                                         href={"https://zenquotes.io/"}>ZenQuotes</Link>
                            </Text>
                        </View>
                    </View>
                    <View className={"flex-row gap-4 justify-between w-full"}>
                        {!loading && (
                            <View
                                className={"flex w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-2 md:my-3 lg:my-5 xl:my-6 rounded-lg"}
                                style={{
                                    shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: mode === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                                <Text className={"text-5xl font-bold text-blue-500 text-center"}>
                                    {percentReminisced}
                                </Text>
                                <Text className={"dark:text-neutral-200 text-neutral-700 text-sm text-center"}>
                                    of your family members have been reminisced with today
                                </Text>

                                <Text className={"text-lg font-bold dark:text-white text-center mt-3"}>
                                    {percentReminisced === "100%" ? "Great job!" : "Keep it up!"}
                                </Text>

                                <View className={"flex-1"}>
                                    {/* Quick Action to reminisce */}
                                    <TouchableOpacity onPress={() => router.push("/(app)/(reminisce)/(tabs)/NewEntry")}
                                                      className={"flex-row items-center justify-center mt-2 p-2 bg-blue-500 dark:bg-neutral-950 rounded-lg"}>
                                        <MaterialIcons name="add" size={24} color="white" className={"mr-1"}/>
                                        <Text className={"text-white"}>
                                            Reminisce Now
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                    <View className={"flex-row gap-4 justify-between w-full"} key={"dates"}>
                        <View
                            className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 rounded-lg"}
                            style={{
                                shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: mode === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
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
                                              backgroundColor: mode === "dark" ? colors.neutral[900] : colors.white,
                                              calendarBackground: mode === "dark" ? colors.neutral[900] : colors.white,
                                              textSectionTitleColor: theme.text,
                                              selectedDayBackgroundColor: colors.blue[500],
                                              selectedDayTextColor: mode === "dark" ? colors.neutral[900] : colors.neutral[100],
                                              todayTextColor: colors.blue[500],
                                              dayTextColor: theme.text,
                                              textInactiveColor: colors.neutral[500],
                                              dotColor: colors.blue[500],
                                              textDayStyle: {color: theme.text},
                                              monthTextColor: theme.text,
                                              yearTextColor: theme.text,
                                              arrowColor: colors.blue[500],
                                          }}
                                          markedDates={markedDates}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <NewAlbumForm onSubmitted={onSubmitted} visible={newAlbumVisible} onClose={() => setNewAlbumVisible(!newAlbumVisible)}/>
            <NewPictureForm onSubmitted={onPictureSubmitted} visible={newPictureVisible} onClose={() => setNewPictureVisible(!newPictureVisible)}/>
        </KeyboardAwareScrollView>
    )
}

export default index;
