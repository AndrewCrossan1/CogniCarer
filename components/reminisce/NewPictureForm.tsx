import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BlurView} from "expo-blur";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useEffect, useRef, useState} from "react";
import {Patient, UserAlbum} from "@/services/api/types";
import {usePatients} from "@/hooks/patients/usePatients";
import {useAppSelector} from "@/hooks/store/hooks";
import InputGroup, {InputGroupRef} from "@/components/forms/InputGroup";
import {Dropdown} from "@/components/forms/Dropdown";
import {MaterialIcons} from "@expo/vector-icons";
import {useReminisce} from "@/hooks/useReminisce";
import * as ImagePicker from 'expo-image-picker';

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
const NewPictureForm = (props: NewAlbumProps) => {
    // Hooks
    const {getPatients} = usePatients();
    const {getAlbums, getAlbum} = useReminisce();
    const {visible, onSubmitted} = props;
    const user = useAppSelector(state => state.user.user);

    // States for the new album
    const [title, setTitle] = useState("");
    const [patient, setPatient] = useState("");
    const [patients, setPatients] = useState([] as { value: string, display: string }[]);
    const [album, setAlbum] = useState("");
    const [albumOptions, setAlbumsOptions] = useState([] as { value: string, display: string }[]);
    const [albums, setAlbums] = useState<UserAlbum[]>([]);

    // Error states
    const [titleError, setTitleError] = useState(false);

    // Refs for input fields
    const titleRef = useRef<InputGroupRef>(null);


    // Fetch patients and albums
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

        const fetchAlbums = async () => {
            const fetchedAlbums = await getAlbums();
            if (fetchedAlbums) {
                setAlbums(fetchedAlbums);
                console.debug("[NewAlbumForm] Albums fetched, found: ", fetchedAlbums.length);
            }
        }

        fetchPatients();
        fetchAlbums();
    }, []);

    // Fetch albums
    useEffect(() => {
        const getUsersAlbums = async () => {
            // Filter the albums set in albums to only show the albums of the selected patient
            const usersAlbums = albums.filter((album) => album.patient === patient);
            let a = usersAlbums.map((album: any) => {
                return {
                    value: album.uuid,
                    display: album.title
                }
            });
            setAlbumsOptions(a);
        }

        if (patient !== "") {
            getUsersAlbums();
        }
    }, [patient]);

    /**
     * Submit function
     * @desc Validates the form and creates the album
     * @function submit
     * @returns {void}
     */
    const submit = (): void => {
        console.debug("[NewAlbumForm] Submitting new picture");
        console.debug("Data: ", {
            title: title,
            patient: patient,
            album: album,
            user: user?.pk
        })
    }

    const onChangeText = (s: string) => {
        if (s === "") {
            setTitleError(true);
            titleRef.current?.shake();
        }
        setTitle(s);
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
                        <Text className={"text-lg ml-4 dark:text-white font-bold w-full"}>Upload a new Picture</Text>
                    </View>
                    <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: "white", marginVertical: 5}}/>


                    <Text className={"dark:text-gray-400 mt-2"}>
                        Please fill in the fields below to upload a new picture
                    </Text>

                    {/* Title */}
                    <InputGroup
                        label={"Title"}
                        placeholder={"My wedding..."}
                        errorMessage={"This field is required"}
                        error={titleError}
                        ref={titleRef}
                        value={title}
                        onChangeText={onChangeText}
                    />

                    {/* Patient Dropdown */}
                    <Text
                        className={"dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg"}>Patient</Text>
                    <Dropdown
                        options={patients}
                        onSelect={(value) => setPatient(value)}
                    />

                    {/* Album (Not rendered until a patient is chosen (To retrieve their albums) */}
                    {patient !== "" && (
                        <>
                            <Text
                                className={"dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg my-2"}>Album</Text>
                            <Dropdown
                                options={albumOptions}
                                onSelect={(value) => setAlbum(value)}
                            />
                        </>
                    )}

                    {/* Picture */}
                    <Text
                        className={"dark:text-white font-bold  sm:text-sm md:text-base lg:text-lg my-2"}>Picture</Text>
                    <TouchableOpacity
                        onPress={async () => {
                            let result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [4, 3],
                                quality: 1,
                            });

                            console.log(result);

                            if (!result.canceled) {
                                console.log(result);
                            }
                        }}
                        className={"flex-row items-center w-full mt-3 rounded-lg p-2 bg-blue-500"}>
                        <MaterialIcons name="add" size={24} color="white" className={"mr-1"}/>
                        <Text className="text-white">
                            Choose Picture
                        </Text>
                    </TouchableOpacity>

                    {/* Buttons */}
                    <View className={"flex-row justify-center gap-2"}>
                        <TouchableOpacity
                            onPress={() => {
                                submit();
                            }}
                            className={`flex-row items-center w-1/2 mt-3 rounded-lg p-2 bg-blue-500`}>
                            <MaterialIcons name="add" size={24} color="white" className={"mr-1"}/>
                            <Text className="text-white">
                                Add Picture
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={
                                // Reset errors and close the modal
                                () => {
                                    setTitleError(false);
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

export default NewPictureForm;