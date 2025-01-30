import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BlurView} from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Dropdown} from "@/components/forms/Dropdown";
import {useEffect, useRef, useState} from "react";
import {Patient} from "@/services/api/types";
import {usePatients} from "@/hooks/patients/usePatients";
import {useAppSelector} from "@/hooks/store/hooks";
import {MaterialIcons} from "@expo/vector-icons";
import {useReminisce} from "@/hooks/useReminisce";
import InputGroup, {InputGroupRef} from "@/components/forms/InputGroup";

/**
 * NewAlbumProps interface
 * @interface NewAlbumProps
 * @property {() => void} onSubmitted
 * @property {boolean} visible
 * @property {() => void} onClose
 */
interface NewAlbumProps {
    onSubmitted: () => void;
    visible: boolean;
    onClose: () => void;
}

/**
 * NewAlbum component
 * @desc A modal component which can be used to create a new album
 * @param {NewAlbumProps} props
 * @constructor
 */
const NewAlbum = (props: NewAlbumProps) => {
    // Hooks
    const {getPatients} = usePatients();
    const {visible, onSubmitted} = props;
    const user = useAppSelector(state => state.user.user);
    const {newAlbum} = useReminisce();

    // States for the new album
    const [albumName, setAlbumName] = useState("");
    const [description, setDescription] = useState("");
    const [patient, setPatient] = useState("");
    const [patients, setPatients] = useState([] as { value: string, display: string }[]);

    // Error states
    const [albumNameError, setAlbumNameError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

    // Refs for input fields
    const albumNameRef = useRef<InputGroupRef>(null);
    const descriptionRef = useRef<InputGroupRef>(null);

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
                console.debug("[NewAlbumForm] Patients fetched, found: ", fetchedPatients.length);
            }
        }

        fetchPatients();
    }, []);

    /**
     * Submit function
     * @desc Validates the form and creates the album
     * @function submit
     * @returns {void}
     */
    const submit = (): void => {
        setAlbumNameError(false);
        setDescriptionError(false);
        // Validations
        if (albumName === "") {
            setAlbumNameError(true);
            albumNameRef.current?.shake();
        }
        if (description === "") {
            setDescriptionError(true);
            descriptionRef.current?.shake();
        }
        // We return here, so both errors are shown```
        if (albumName === "" || description === "") return;

        if (!user) return;

        let album = {
            title: albumName,
            description: description,
            patient: patient,
            user: user.pk
        }

        // Creating the album
        console.debug("[NewAlbumForm] Submitting album: ", album);

        newAlbum(album).then(() => {
            onSubmitted();
        });
    }

    const onChangeText = (s: string, type: "name" | "desc") => {
        if (type === "name") {
            if (s === "") {
                setAlbumNameError(true);
            } else {
                setAlbumNameError(false);
            }
            setAlbumName(s);
        } else {
            if (s === "") {
                setDescriptionError(true);
            } else {
                setDescriptionError(false);
            }
            setDescription(s);
        }
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

                    {/* Album Name Input Group */}
                    <InputGroup
                        label={"Album Name"}
                        placeholder={"Holidays..."}
                        errorMessage={"This field is required"}
                        error={albumNameError}
                        value={albumName}
                        ref={albumNameRef}
                        onChangeText={(text) => onChangeText(text, "name")}
                    />

                    {/* Patient Dropdown */}
                    <Text
                        className={"dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg"}>Patient</Text>
                    <Dropdown options={patients}
                              onSelect={(value) => setPatient(value)}
                              key={"patient"}
                    />

                    {/* Description Input Group */}
                    <InputGroup
                        label={"Description"}
                        placeholder={"Description..."}
                        errorMessage={"This field is required"}
                        error={descriptionError}
                        value={description}
                        ref={descriptionRef}
                        onChangeText={(text) => onChangeText(text, "desc")}
                    />

                    {/* Buttons */}
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
                            onPress={
                                // Reset errors and close the modal
                                () => {
                                    setAlbumNameError(false);
                                    setDescriptionError(false);
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

export default NewAlbum;