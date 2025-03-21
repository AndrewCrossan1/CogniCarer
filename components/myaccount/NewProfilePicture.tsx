import {Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BlurView} from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import {MaterialIcons} from "@expo/vector-icons";
import ImageViewer from "@/components/ImageViewer";
import {useState} from "react";
import {useAuth} from "@/context/AuthContext";

interface NewProfilePictureProps {
    visible: boolean;
    onClose: () => void;
    onSubmitted: () => void;
    form: any;
    onErrors: (error: string) => void;
}

/**
 * New Profile Picture Component for user profile
 * @param props
 * @constructor
 */
export default function NewProfilePicture(props: NewProfilePictureProps) {

    const [picture, setPicture] = useState<ImagePicker.ImagePickerResult | undefined>(undefined);
    const [pictureString, setPictureString] = useState<string | undefined>(undefined);
    const [errors, setErrors] = useState(false);
    const { update } = useAuth();

    const submit = async () => {
        if (pictureString === undefined) {
            setErrors(true);
            props.onErrors("No picture was selected");
            return;
        }

        let data = {
            first_name: props.form.first_name,
            last_name: props.form.last_name,
            date_of_birth: props.form.date_of_birth,
            email: props.form.email,
            profile_image: picture
        }

        // Send the form data to the server
        update(data.email, data.first_name, data.date_of_birth, data.last_name, data.profile_image).then(
            (success) => {
                if (success) {
                    props.onSubmitted();
                }
            }
        ).catch(
            (error) => {
                props.onErrors(error);
            }
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            className={"flex-1"}
            onRequestClose={() => {
                props.onClose();
            }}>
            <BlurView intensity={Platform.OS === "ios" ? 75 : 100} style={[StyleSheet.absoluteFill, {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 5,
            }]}/>

            <View className={"mt-safe-or-10 mx-4 dark:bg-neutral-900 border dark:border-neutral-900 border-gray-200 bg-white rounded-lg p-4 android:elevation-md"}>
                <View className={"flex-row justify-start items-center"}>
                    <FontAwesome name={"close"} size={30} color={"red"}
                                 onPress={props.onClose}
                    />
                    <Text className={"text-lg ml-4 dark:text-white font-bold w-full"}>Set a new Profile Picture</Text>
                </View>
                <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: "white", marginVertical: 5}}/>

                <Text className={"dark:text-gray-400 mt-2"}>
                    Please fill in the fields below to set a new profile picture
                </Text>

                {/* Picture */}
                <Text
                    className={"dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg my-2"}>Picture</Text>
                <TouchableOpacity
                    onPress={async () => {
                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ['images'],
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        });

                        setPicture(result);

                        if (!result.canceled) {
                            setPictureString(result.assets[0].uri);
                        }
                    }}
                    className={"flex-row items-center w-full mb-4 rounded-lg p-2 bg-blue-500"}>
                    <MaterialIcons name="add" size={24} color="white" className={"mr-1"}/>
                    <Text className="text-white">
                        Choose Picture
                    </Text>
                </TouchableOpacity>
                <View>
                    {pictureString !== undefined && (
                        <ImageViewer source={pictureString}/>
                    )}
                </View>

                {errors && (
                    <View className={"flex-row items-center justify-center"}>
                        <MaterialIcons name={"error"} size={24} color={"red"} className={"mr-4"}/>
                        <Text className={"text-red-500 text-xl my-4"}>
                            There are errors in the form
                        </Text>
                    </View>
                )}

                {/* Buttons */}
                <View className={"flex flex-row justify-center gap-2"}>
                    <TouchableOpacity
                        onPress={() => {
                            submit();
                        }}
                        className={`flex-1 flex-row items-center mt-3 rounded-lg p-2 bg-blue-500`}>
                        <MaterialIcons name="upload" size={24} color="white" className={"mr-1"}/>
                        <Text className="text-white">
                            Submit
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={
                            // Reset errors and close the modal
                            () => {
                                props.onClose();
                            }
                        }
                        className={"flex-1 flex-row items-center mt-3 rounded-lg p-2 bg-red-500"}>
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
