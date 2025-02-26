import {Image, Text, TouchableOpacity, View, ScrollView, RefreshControl, ActivityIndicator} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import {useAppSelector} from "@/hooks/store/hooks";
import {Link, useRouter} from "expo-router";
import {useColorScheme} from "nativewind";
import {useCallback, useEffect, useState} from "react";
import {usePatients} from "@/hooks/patients/usePatients";
import {useFocusEffect} from "@react-navigation/native";
import {Patient} from "@/services/api/types";
import * as Haptics from "expo-haptics";

/**
 * Family page
 * @desc This page displays family members for the current user.
 * @desc The user can add, remove or manage family members.
 */
const family = () => {
    const user = useAppSelector(state => state.user.user);
    const router = useRouter();
    const {colorScheme} = useColorScheme();
    const {getPatients, loading} = usePatients();
    const [patients, setPatients] = useState<Patient[]>([] as Patient[]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // If the user is not logged in, redirect to the login page
        if (!user) {
            router.push("/(auth)/login");
        }
    }, []);

    const fetchPatients = async () => {
        const patients = await getPatients();

        if (patients) {
            setPatients(patients);
        } else {
            setPatients([]);
        }
    }

    // Refresh the list of patients
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPatients().then(() => {
            setRefreshing(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }).catch(console.error);
    }, []);

    // Fetch patients on page focus
    useFocusEffect(
        useCallback(() => {
            fetchPatients().then(() => {
            }).catch(console.error);
        }, [])
    );

    return (
        <ScrollView bounces={true} refreshControl={
            <View>
                <RefreshControl title={"Refreshing..."} titleColor={colors.neutral[400]}
                                tintColor={colors.neutral[400]} refreshing={refreshing}
                                onRefresh={onRefresh}/>
            </View>
        } className={"bg-neutral-100 dark:bg-neutral-800"}>
            <View className={"flex-1 items-center bg-neutral-100 dark:bg-neutral-800 pb-5"}>
                {/* Main Body */}
                <View className={"w-full sm:px-2 md:px-4 lg:px-6 py-2"}>
                    {/* Profile Edit Quick Action */}
                    <TouchableOpacity activeOpacity={0.4}
                                      className={"flex-row items-center justify-between xs:mt-2 sm:mt-3 md:mt-3 lg:mt-3 xl:mt-3"}
                                      onPress={() => router.push("/(app)/(myaccount)/edit-account")}>
                        <View className={"flex-row items-center"}>
                            {/* @ts-ignore */}
                            <Image source={{uri: user.profile_image}}
                                   className={"mr-4 rounded-full xs:w-10 sm:w-15 md:w-20 lg:w-25 xl:w-30 xs:h-10 sm:h-15 md:h-20 lg:h-25 xl:h-30 "}/>
                            <View className={"flex-col"}>
                                <Text
                                    className={"dark:text-white xs:text-base sm:text-base md:text-lg lg:text-xl xl:text-xl font-bold"}>
                                    {user?.first_name} {user?.last_name}
                                </Text>
                                <Text
                                    className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-base md:text-base lg:text-base xl:text-xl"}>
                                    Edit Profile
                                </Text>
                            </View>
                        </View>
                        <MaterialIcons name={"chevron-right"} size={32}
                                       color={colorScheme === "dark" ? colors.white : colors.black}/>
                    </TouchableOpacity>

                    {/* Separator */}
                    <View
                        className={"flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:mt-1 sm:mt-1 md:mt-2 lg:mt-3 xl:mt-4 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                    {/* Caring for someone new */}
                    <View
                        className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-6 xl:p-6 bg-white dark:bg-neutral-900 xs:my-1 sm:my-2 md:my-3 lg:my-5 xl:my-6 rounded-lg flex-row items-center justify-between"}
                        style={{
                            shadowColor: colors.black,
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                            shadowRadius: 3.84,
                            elevation: 2
                        }}>
                        <View className={"flex-col w-2/3"}>
                            <Text
                                className={"dark:text-white xs-text-base sm:text-base md:text-base lg:text-xl font-bold"}>
                                Your family
                            </Text>
                            <Text
                                className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                Add, remove or manage those who you care for!
                            </Text>
                            <Link href={"/(app)/(myaccount)/family/NewMember"}>
                                <Text className={"text-blue-500 text-base mt-2 underline"}>
                                    Add a new family member
                                </Text>
                            </Link>
                        </View>
                        <Image source={require("@/assets/images/undraw_showing-support_ixfc.png")}
                               style={{maxWidth: 100, maxHeight: 100}}/>
                    </View>

                    {/* Family member view */}
                    <View className={"w-full"}>
                        {/* Family member list */}
                        {loading &&
                            <View className={"w-full flex-col items-center justify-center"}>
                                <ActivityIndicator size={"large"} color={colors.blue[500]}/>
                                <Text className={"dark:text-neutral-200 text-neutral-500 text-sm"}>
                                    Please wait a moment.
                                </Text>
                            </View>
                        }

                        {!loading && patients.length === 0 &&
                            <View className={"w-full flex-col items-center justify-center"}>
                                <Text className={"dark:text-white text-base font-bold"}>
                                    It's very quiet here!
                                </Text>
                                <Text className={"dark:text-neutral-200 text-neutral-500 text-sm"}>
                                    Add a new family member to get started.
                                </Text>
                            </View>
                        }

                        {!loading &&
                          <View className={"w-full"} style={{
                              shadowColor: colors.black,
                              shadowOffset: {width: 0, height: 2},
                              shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                              shadowRadius: 3.84,
                              elevation: 2
                          }}>
                            <View className={"flex-row flex-wrap justify-start"}>
                                {patients.map((patient, index) => (
                                    <TouchableOpacity
                                        key={patient.uuid}
                                        activeOpacity={0.8}
                                        className={"w-1/2"}
                                        onPress={() => router.push(`/(app)/(myaccount)/family/${patient.uuid}`)}
                                    >
                                        <View className={`w-full py-2 px-2`}>
                                            <View className={"justify-center items-center"}>
                                                {patient.profile_picture ?
                                                    <Image
                                                        className={"rounded-t-lg"}
                                                        // @ts-ignore
                                                        source={{uri: patient.profile_picture}}
                                                        style={{width: "100%", height: 150}}
                                                        resizeMode={"cover"}
                                                    /> :
                                                    <Image
                                                        className={"rounded-t-lg"}
                                                        source={require("@/assets/images/undraw_pic-profile_nr49.png")}
                                                        style={{width: "100%", height: 150}}
                                                        resizeMode={"cover"}
                                                    />
                                                }
                                            </View>
                                            <View
                                                className={"rounded-b-lg bg-white justify-center items-center dark:bg-neutral-900 p-2"}>
                                                <View className={"items-center justify-between"}>
                                                    <Text className={"dark:text-white text-base font-bold"}>
                                                        {patient.first_name} {patient.last_name}
                                                    </Text>
                                                    <Text className={"text-blue-500 text-base"}>
                                                        {patient.relationship}
                                                    </Text>
                                                </View>

                                                <Text className={"text-sm text-neutral-500"}>
                                                    Age: {patient.age} years
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                          </View>
                        }

                    </View>

                </View>
            </View>
        </ScrollView>
    );
}

export default family;
