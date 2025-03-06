import {StyleSheet, Modal, View, Text, Image, TouchableOpacity} from "react-native";
import {BlurView} from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Link} from "expo-router";
import {Patient} from "@/services/api/types";
import React from "react";
import colors from "tailwindcss/colors";
import {useColorScheme} from "nativewind";
import {MaterialIcons} from "@expo/vector-icons";

interface ConfRemoveFamProps {
    visible: boolean;
    onClose: () => void;
    onSubmitted: () => void;
    familyMember: Patient;
}

/**
 * ConfRemoveFam.tsx
 * @desc Component for removing a family member from the user's account (This is a confirmation modal)
 */
const ConfRemoveFam = (props: ConfRemoveFamProps) => {

    const {colorScheme} = useColorScheme();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            className={"flex-1"}
            onRequestClose={() => {
                props.onClose();
            }}>
            <BlurView intensity={75} style={[StyleSheet.absoluteFill, {
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                    elevation: 5,
            }]}/>

            <View className={"flex mt-safe mx-safe-or-4 dark:bg-neutral-900 bg-white rounded-lg p-4"}>
                <View className={"flex-row justify-start items-center"}>
                    <FontAwesome name={"close"} size={30} color={"red"}
                                 onPress={props.onClose}
                    />
                    <Text className={"text-lg ml-4 dark:text-white font-bold w-full"}>Remove a family member</Text>
                </View>

                <View
                    className={"border-b dark:border-b-neutral-600 border-b-neutral-300 xs:mt-1 sm:mt-1 md:mt-2 lg:mt-3 xl:mt-4 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                <Text className={"dark:text-gray-400 mt-4"}>
                    Please confirm that you would like to remove this family member from your account.
                </Text>
                <Text className={"dark:text-gray-400 mt-2"}>
                    This action cannot be undone. All data associated with this family member will be deleted.
                </Text>

                <View>
                    <View
                        className={"w-full xs:p-2 sm:p-2 md:p-4 lg:p-4 xl:p-4 bg-white dark:bg-neutral-950 xs:my-1 sm:my-2 md:my-3 lg:my-5 xl:my-6 rounded-lg flex-row items-center justify-between"}
                        style={{
                            shadowColor: colors.black,
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: colorScheme === "dark" ? 0.50 : 0.20,
                            shadowRadius: 3.84,
                            elevation: 2
                        }}>

                        {props.familyMember.profile_picture ?
                            <Image
                                // @ts-ignore
                                source={{uri: props.familyMember.profile_picture}}
                                className={"rounded-full xs:w-8 sm:w-12 md:w-16 lg:w-20 xl:w-20 xs:h-8 sm:h-12 md:h-16 lg:h-20 xl:h-20"}
                            />
                            :
                            <Image
                                source={require("@/assets/images/undraw_pic-profile_nr49.png")}
                                className={"rounded-full xs:w-8 sm:w-12 md:w-16 lg:w-20 xl:w-20 xs:h-8 sm:h-12 md:h-16 lg:h-20 xl:h-20"}
                            />
                        }
                        <View className={"flex-col w-2/3"}>
                            <Text
                                className={"dark:text-white xs-text-base sm:text-base md:text-base lg:text-xl font-bold"}>
                                {props.familyMember.first_name} {props.familyMember.last_name}
                            </Text>
                            <Text
                                className={"dark:text-neutral-200 text-neutral-500 xs:text-sm sm:text-sm md:text-sm lg:text-base mt-2"}>
                                {props.familyMember.relationship} - {props.familyMember.age} years old
                            </Text>
                        </View>
                    </View>
                </View>

                <Text className={"dark:text-gray-400 mt-2"}>
                    If you are feeling overwhelmed or need help, please consider reaching out to the following
                    resources:
                </Text>
                <View className={"dark:text-gray-400 mt-2"}>
                    <Link
                        href={"https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/grief-bereavement-loss/"}
                        className={"dark:text-white my-1"}>
                        - <Text className={"text-blue-600 underline"}>NHS Grief Counseling</Text>
                    </Link>
                    <Link href={"https://www.nhs.uk/nhs-services/mental-health-services/"}
                          className={"dark:text-white my-1"}>
                        - <Text className={"text-blue-600 underline"}>NHS Mental Health Services</Text>
                    </Link>
                    <Link
                        href={"https://www.mind.org.uk/information-support/guides-to-support-and-services/seeking-help-for-a-mental-health-problem/mental-health-helplines/"}
                        className={"dark:text-white my-1"}>
                        - <Text className={"text-blue-600 underline"}>Mind Mental Health Helplines</Text>
                    </Link>
                </View>

                <Text className={"dark:text-gray-400 mt-2"}>
                    If you are in immediate danger or need urgent help, please contact your local emergency services.
                </Text>

                {/* Buttons */}
                <View className={"flex-row justify-center gap-2"}>
                    <TouchableOpacity
                        onPress={
                            // Reset errors and close the modal
                            () => {
                                props.onSubmitted();
                            }
                        }
                        className={`flex-row items-center w-1/2 mt-3 rounded-lg p-2 bg-blue-500`}>
                        <MaterialIcons name="check" size={24} color="white" className={"mr-1"}/>
                        <Text className="text-white">
                            Confirm
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={
                            // Reset errors and close the modal
                            () => {
                                props.onClose();
                            }
                        }
                        className={"flex-row items-center w-1/2 mt-3 rounded-lg p-2 bg-red-500"}>
                        <MaterialIcons name="cancel" size={24} color="white" className={"mr-1"}/>
                        <Text className="text-white">
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ConfRemoveFam;