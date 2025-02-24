import {Image, Switch, Text, TouchableOpacity, View, ScrollView} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useAppSelector} from "@/hooks/store/hooks";
import {useEffect} from "react";
import {useRouter} from "expo-router";
import colors from "tailwindcss/colors";
import {useColorScheme} from "nativewind";

const index = () => {
    const user = useAppSelector(state => state.user.user);
    const router = useRouter();
    const { colorScheme, setColorScheme } = useColorScheme();

    useEffect(() => {
        // If the user is not logged in, redirect to the login page
        if (!user) {
            router.push("/(auth)/login");
        }
    }, []);

    return (
        <ScrollView contentContainerStyle={{flex: 1}} bounces={false}>
            <View className={"flex-1 items-center bg-neutral-100 dark:bg-neutral-800 pb-5"}>
                {/* Main Body */}
                <View className={"w-full sm:px-2 md:px-4 lg:px-6 py-2"}>
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

                    {/* Separator */}
                    <View className={"flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:mt-1 sm:mt-1 md:mt-2 lg:mt-3 xl:mt-4 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                    {/* Caring for someone new */}
                    <View>
                        <TouchableOpacity activeOpacity={0.5} className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-2 md:my-3 lg:my-5 xl:my-6 rounded-lg flex-row items-center justify-between"}
                                          style={{
                                              shadowColor: colors.black, shadowOffset: { width: 0, height: 2}, shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10, shadowRadius: 3.84, elevation: 2}}>
                            <View className={"flex-col w-2/3"}>
                                <Text className={"dark:text-white xs-text-base sm:text-base md:text-base lg:text-xl font-bold"}>
                                    Caring for someone new?
                                </Text>
                                <Text className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                    Register a new family member to start playing games, tracking progress and reminiscing!
                                </Text>
                            </View>
                            <Image source={require("@/assets/images/undraw_showing-support_ixfc.png")} style={{maxWidth: 100, maxHeight: 100}}/>
                        </TouchableOpacity>
                    </View>

                    {/* Settings */}
                    <View className={"w-full flex-col"}>
                        <Text className={"dark:text-white xs:text-base sm:text-lg md:text-lg lg:text-xl font-bold"}>
                            Account Actions
                        </Text>

                        {/* Settings buttons */}
                        <TouchableOpacity className={"flex-row items-center justify-between mt-4"} onPress={() => { router.push("/(app)/(myaccount)/edit-account")}}>
                            <View className={"flex-row items-center"}>
                                <MaterialIcons name={"account-circle"} size={24} color={colorScheme === "dark" ? colors.white : colors.black} />
                                <Text className={"dark:text-white xs:text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl ml-4"}>
                                    Edit your profile
                                </Text>
                            </View>
                            <MaterialIcons name={"chevron-right"} size={32} color={colorScheme === "dark" ? colors.white : colors.black} />
                        </TouchableOpacity>
                        <View className={"flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:mt-1 sm:mt-1 md:mt-3 lg:mt-3 xl:mt-4 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                        <TouchableOpacity className={"flex-row items-center justify-between mt-4"} onPress={() => router.push("/(app)/(myaccount)/family")}>
                            <View className={"flex-row items-center"}>
                                <MaterialIcons name={"family-restroom"} size={24} color={colorScheme === "dark" ? colors.white : colors.black} />
                                <Text className={"dark:text-white xs:text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl ml-4"}>
                                    Add a family member
                                </Text>
                            </View>
                            <MaterialIcons name={"chevron-right"} size={32} color={colorScheme === "dark" ? colors.white : colors.black} />
                        </TouchableOpacity>
                        <View className={"flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:mt-1 sm:mt-1 md:mt-3 lg:mt-3 xl:mt-4 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                        <View className={"flex-row items-center justify-between mt-4"}>
                            <View className={"flex-row items-center"}>
                                <MaterialIcons name={"lock-reset"} size={24} color={colorScheme === "dark" ? colors.white : colors.black} />
                                <Text className={"dark:text-white xs:text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl ml-4"}>
                                    Reset your password
                                </Text>
                            </View>
                            <MaterialIcons name={"chevron-right"} size={32} color={colorScheme === "dark" ? colors.white : colors.black} />
                        </View>
                        <View className={"flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:mt-1 sm:mt-1 md:mt-3 lg:mt-3 xl:mt-4 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                        <TouchableOpacity className={"flex-row items-center justify-between mt-4"} onPress={() => router.push("/(app)/(myaccount)/data-protection")}>
                            <View className={"flex-row items-center"}>
                                <MaterialIcons name={"security"} size={24} color={colorScheme === "dark" ? colors.white : colors.black} />
                                <Text className={"xs:text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl ml-4 dark:text-white"}>
                                    Protecting your Data
                                </Text>
                            </View>
                            <MaterialIcons name={"chevron-right"} size={32} color={colorScheme === "dark" ? colors.white : colors.black} />
                        </TouchableOpacity>
                        <View className={"flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:mt-1 sm:mt-1 md:mt-3 lg:mt-3 xl:mt-4 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                        <View className={"flex-row items-center justify-between mt-4"}>
                            <View className={"flex-row items-center"}>
                                <MaterialIcons name={"contrast"} size={24} color={colorScheme === "dark" ? colors.white : colors.black} />
                                <Text className={"xs:text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl ml-4 dark:text-white"}>
                                    Dark Mode
                                </Text>
                            </View>

                            <Switch value={colorScheme === "dark"} onValueChange={() => {
                                setColorScheme(colorScheme === "dark" ? "light" : "dark");
                            }} />
                        </View>
                        <View className={"flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:mt-1 sm:mt-1 md:mt-3 lg:mt-3 xl:mt-4 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                        <View className={"flex-row items-center justify-between mt-4"}>
                            <View className={"flex-row items-center"}>
                                <MaterialIcons name={"delete"} size={24} color={colors.red[500]} />
                                <View>
                                    <Text className={"xs:text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl ml-4 dark:text-red-500"}>
                                        Delete Account
                                    </Text>
                                </View>
                            </View>
                            <MaterialIcons name={"chevron-right"} size={32} color={colors.red[500]} />
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default index;
