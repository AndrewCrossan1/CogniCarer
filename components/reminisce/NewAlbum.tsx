import {Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {BlurView} from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Dropdown} from "@/components/reminisce/Dropdown";
import {useEffect, useState} from "react";
import {Patient} from "@/services/api/types";
import {usePatients} from "@/hooks/patients/usePatients";
import {useAppSelector} from "@/hooks/store/hooks";
import {MaterialIcons} from "@expo/vector-icons";
import {useReminisce} from "@/hooks/useReminisce";

interface NewAlbumProps {
    onSubmitted: () => void;
    visible: boolean;
    onClose: () => void;
}

export const NewAlbum = (props: NewAlbumProps) => {
    // Hooks
    const {getPatients} = usePatients();
    const {visible, onSubmitted} = props;
    const user = useAppSelector(state => state.user.user);
    const { newAlbum } = useReminisce();

    // States for the new album
    const [albumName, setAlbumName] = useState("");
    const [description, setDescription] = useState("");
    const [patient, setPatient] = useState("");
    const [patients, setPatients] = useState([] as { value: string, display: string }[]);

    // Error states
    const [albumNameError, setAlbumNameError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [patientNameError, setPatientNameError] = useState("");

    // Fetch patients
    useEffect(() => {

        const fetchPatients = async () => {
            const fetchedPatients = await getPatients();
            if (fetchedPatients) {
                let patients = fetchedPatients.map((patient: Patient) => {
                    return {
                        value: patient.uuid,
                        display: patient.first_name + " " + patient.last_name
                    }
                });
                setPatients(patients);
                console.debug("Patients fetched, found: ", fetchedPatients.length);
            }
        }

        fetchPatients();
    }, []);

    // Validate the form
    const validateForm = () => {
        if (albumName === "") {
            setAlbumNameError("Album name is required");
        }
        if (description === "") {
            setDescriptionError("Description is required");
        }
        if (patient === "") {
            setPatientNameError("Patient is required");
        }

        setTimeout(() => {
            setAlbumNameError("");
            setDescriptionError("");
            setPatientNameError("");
        }, 5000);

        return !(albumName === "" || description === "" || patient === "");

    }

    // Submit the form
    const submit = () => {
        if (albumName === "" || description === "" || patient === "") {
            console.error("Form not filled");
            validateForm();
            return;
        }
        if (!user) {
            console.error("User not found");
            return;
        }
        let data = {
            title: albumName,
            description: description,
            patient: patient,
            user: user.pk
        }

        console.debug("Creating album with data: ", data);

        newAlbum(data).then(
            (response) => {
                if (response) {
                    onSubmitted();
                }
            }
        )
    }

    return (
        <>
            {/* New Album Pop-up */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}>
                <BlurView intensity={75} style={[StyleSheet.absoluteFill, styles.modalView]}/>
                <View className={"mt-safe mx-safe-or-4 dark:bg-neutral-900 bg-white rounded-lg elevation-md p-4"}>
                    <View className={"flex-row justify-start items-center"}>
                        <FontAwesome name={"close"} size={30} color={"red"}
                                     onPress={props.onClose}
                        />
                        <Text className={"text-lg ml-4 dark:text-white font-bold w-full"}>Create a new album</Text>
                    </View>
                    <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: "white", marginVertical: 5}}/>

                    <Text className={"dark:text-gray-400 mt-2"}>
                        Create a new album to sort pictures together.
                    </Text>

                    <Text className={"mb-2 mt-4 dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg"}>Album
                        Name</Text>
                    <TextInput value={albumName} onChangeText={
                        (text) => setAlbumName(text)} key={"album_name"} placeholder={"Holidays..."}
                               placeholderTextColor={"#AAAAA5"}
                               className={"rounded-md p-4 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 transition-all ease-linear input"}/>
                    <Text className={"text-red-500 mt-1"}>{albumNameError}</Text>

                    <Text
                        className={"mb-2 mt-4 dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg"}>Patient</Text>
                    <Dropdown options={patients}
                              onSelect={
                                  (value) => setPatient(value)} key={"patient"}
                    />
                    <Text className={"text-red-500 mt-1"}>{patientNameError}</Text>

                    <Text
                        className={"mb-2 mt-4 dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg"}>Description</Text>
                    <TextInput value={description} onChangeText={
                        (text) => setDescription(text)} scrollEnabled={true} key={"description"}
                               placeholder={"A collection of holiday pictures..."}
                               placeholderTextColor={"#AAAAA5"}
                               className={"rounded-md p-4 border dark:text-white dark:border-gray-500 border-gray-400 focus:border-blue-500 transition-all ease-linear input"}/>
                    <Text className={"text-red-500 mt-1"}>{descriptionError}</Text>

                    <View className={"flex-row justify-center gap-2"}>
                        <TouchableOpacity
                            onPress={() => {
                                submit();
                            }}
                            className={`flex-row items-center w-1/2 mt-3 rounded-lg p-2 bg-blue-500`}>
                            <MaterialIcons name="add" size={24} color="white" className={"mr-1"}/>
                            <Text className="text-white">
                                Create Album
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={props.onClose}
                            className={"flex-row items-center w-1/2 mt-3 rounded-lg p-2 bg-red-500"}>
                            <MaterialIcons name="cancel" size={24} color="white" className={"mr-1"}/>
                            <Text className="text-white">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    modalView: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
});