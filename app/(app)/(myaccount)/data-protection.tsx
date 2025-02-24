import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import {useEffect} from "react";
import {useAppSelector} from "@/hooks/store/hooks";
import {useRouter} from "expo-router";
import {useColorScheme} from "nativewind";

const dataProtection = () => {
    const user = useAppSelector(state => state.user.user);
    const router = useRouter();
    const { colorScheme } = useColorScheme();

    useEffect(() => {
        // If the user is not logged in, redirect to the login page
        if (!user) {
            router.push("/(auth)/login");
        }
    }, []);

    return (
        <ScrollView className={"flex-1 w-full dark:bg-neutral-800 bg-neutral-100"}>
            <View className={"sm:px-2 md:px-4 lg:px-6 py-2 dark:bg-neutral-800 bg-neutral-1990 mb-5"}>
                {/* Profile Edit Quick Action */}
                <TouchableOpacity activeOpacity={0.4} className={"flex-row items-center justify-between xs:mt-2 sm:mt-3 md:mt-3 lg:mt-3 xl:mt-3"} onPress={() => router.push("/(app)/(myaccount)/edit-account")}>
                    <View className={"flex-row items-center"}>
                        {/* @ts-ignore */}
                        <Image source={{uri: user.profile_image}} className={"mr-4 rounded-full xs:w-10 sm:w-15 md:w-20 lg:w-25 xl:w-30 xs:h-10 sm:h-15 md:h-20 lg:h-25 xl:h-30 "}/>
                        <View className={"flex-col"}>
                            <Text className={"dark:text-white xs:text-base sm:text-base md:text-lg lg:text-xl xl:text-xl font-bold"}>
                                {user?.first_name} {user?.last_name}
                            </Text>
                            <Text className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-base md:text-base lg:text-base xl:text-xl"}>
                                Edit Profile
                            </Text>
                        </View>
                    </View>
                    <MaterialIcons name={"chevron-right"} size={32} color={colorScheme === "dark" ? colors.white : colors.black} />
                </TouchableOpacity>

                {/* Data Protection Information */}
                {/* What is data protection? */}
                <View>
                    <View className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 gap-1 bg-white dark:bg-neutral-900 xs:my-1 sm:my-2 md:my-3 lg:my-4 xl:my-4 rounded-lg flex-row items-center justify-between"}
                          style={{
                              shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                        <View className={"flex-col w-2/3"}>
                            <Text className={"dark:text-white xs-text-base sm:text-base md:text-base lg:text-xl font-bold"}>
                                What is Data Protection?
                            </Text>
                            <Text className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                Data protection is the process of safeguarding important information from corruption, compromise or loss.
                            </Text>
                        </View>
                        <Image source={require("@/assets/images/undraw_starlink_pmv3.png")} resizeMode={"contain"} style={{maxWidth: 100, maxHeight: 100}}/>
                    </View>
                </View>

                {/* Why is data protection important? */}
                <View>
                    <View className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 gap-1 bg-white dark:bg-neutral-900 xs:my-1 sm:my-2 md:my-3 lg:my-4 xl:my-4 rounded-lg flex-row items-center justify-between"}
                          style={{
                              shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                        <Image source={require("@/assets/images/undraw_security-on_btwg.png")} resizeMode={"contain"} style={{maxWidth: 100, maxHeight: 100}}/>
                        <View className={"flex-col w-2/3"}>
                            <Text className={"dark:text-white xs-text-base sm:text-base md:text-base lg:text-xl font-bold"}>
                                Why is Data Protection Important?
                            </Text>
                            <Text className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                Data protection is important because it safeguards your data from unauthorized access, corruption, and loss.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* What data do we collect? */}
                <View>
                    <View className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 gap-1 bg-white dark:bg-neutral-900 xs:my-1 sm:my-2 md:my-3 lg:my-4 xl:my-4 rounded-lg flex-row items-center justify-between"}
                          style={{
                              shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                        <View className={"flex-col w-2/3"}>
                            <Text className={"dark:text-white xs-text-base sm:text-base md:text-base lg:text-xl font-bold"}>
                                What Data Do We Collect?
                            </Text>
                            <Text className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                We only collect what you provide us.
                            </Text>
                            <Text className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                We do need to collect some information to allow you to use our services, like your name and email address.
                            </Text>
                        </View>
                        <Image source={require("@/assets/images/undraw_personal-file_81l0.png")} resizeMode={"contain"} style={{maxWidth: 100, maxHeight: 100}}/>
                    </View>
                </View>

                {/* Do I have a choice to have my data saved? */}
                <View>
                    <View className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 gap-1 bg-white dark:bg-neutral-900 xs:my-1 sm:my-2 md:my-3 lg:my-4 xl:my-4 rounded-lg flex-row items-center justify-between"}
                          style={{
                              shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                        <Image source={require("@/assets/images/undraw_questions_g2px.png")} resizeMode={"contain"} style={{maxWidth: 100, maxHeight: 100}}/>
                        <View className={"flex-col w-2/3"}>
                            <Text className={"dark:text-white xs-text-base sm:text-base md:text-base lg:text-xl font-bold"}>
                                Does my data <Text className={"italic"}>need</Text> to be saved?
                            </Text>
                            <Text className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                No, but without providing us with some information, you won't be able to use our services sadly.
                            </Text>
                            <Text className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                You can delete your account at any time.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default dataProtection;