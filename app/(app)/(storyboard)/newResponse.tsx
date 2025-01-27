import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import { useStoryboard } from "@/hooks/storyboard/useStoryboard";
import { usePatients } from "@/hooks/patients/usePatients";
import { useEffect, useState } from "react";
import {Patient, Template} from "@/services/api/types";
import {useAppSelector} from "@/hooks/store/hooks";
import {useRouter} from "expo-router";
import {MaterialIcons} from "@expo/vector-icons";
import {SearchInput} from "@/components/SearchInput";

const NewResponse = () => {
    const {templates, getTemplates, error: storyboardError, responses, getResponses} = useStoryboard();
    const {patients, getPatients, error: patientError} = usePatients();
    const router = useRouter();
    const user = useAppSelector(state => state.user.user);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const validPatients = await getPatients();
            const validTemplates = await getTemplates();

            if (!validPatients || !validTemplates) {
                // Handle error
                console.error(patientError)
                console.error(storyboardError)
                return;
            }

            setFilteredPatients([...patients]);
            setFilteredTemplates([...templates]);
        }

        fetch();
    }, []);

    useEffect(() => {
        setFilteredPatients([...patients]);
        setFilteredTemplates([...templates]);
    }, [patients, templates]);

    const search = (s: string, type: "Template" | "Patient") => {
        if (type === "Template") {
            const filtered = templates.filter((t) => t.name.toLowerCase().includes(s.toLowerCase()));
            setFilteredTemplates(filtered);
        } else {
            const filtered = patients.filter((p) => p.first_name.toLowerCase().includes(s.toLowerCase()) || p.last_name.toLowerCase().includes(s.toLowerCase()));
            setFilteredPatients(filtered);
        }
    }

    const setSelected = (type: "Template" | "Patient", item: Template | Patient) => {
        if (type === "Template") {
            // If the item is already selected, deselect it
            if (selectedTemplate?.uuid === item.uuid) {
                setSelectedTemplate(null);
            } else {
                setSelectedTemplate(item as Template);
            }
        } else {
            if (selectedPatient?.uuid === item.uuid) {
                setSelectedPatient(null);
            } else {
                setSelectedPatient(item as Patient);
            }
        }
    }

    const validateSelection = () => {
        // TODO: Optimise how responses are fetched, currently I would have to fetch all responses and filter them by
        //       template and patient (Not efficient)
        getResponses().then(
            (success) => {
                if (!success) {
                    console.error("An error occurred while fetching responses");
                    return;
                }
            }
        )

        // Check if a response already exists for the selected template and patient
        const response = responses.find((r) => r.template.uuid === selectedTemplate?.uuid && r.patient.uuid === selectedPatient?.uuid);

        if (response) {
            // TODO: Allow the user to choose to edit an existing response or replace it
            //       For now, just show an error message
            console.error("A response already exists for this template and patient");
            return;
        }

        // Navigate to the response creation screen
        router.push({
            pathname: "/(app)/(storyboard)/(responses)/new",
            params: {
                template: selectedTemplate?.uuid,
                patient: selectedPatient?.uuid
            }
        })
    }

    return (
        <ScrollView className={"flex-1 dark:bg-neutral-800"}>
            {/* If no template and patient are selected, show the selection screen */}
            <>
                <View className={"bg-blue-500 py-6"}>
                    <View className={"flex-row justify-between items-center p-4"}>
                        {/* Name and Profile Picture */}
                        <View>
                            <Text className={"text-white font-bold text-2xl"}>
                                Hello, {user?.first_name} {user?.last_name}
                            </Text>
                            <Text className={"text-white"}>
                                Ready to create a new response?
                            </Text>
                            <Text className={"text-white"}>
                                Select a template and a client to begin.
                            </Text>
                        </View>
                        <Image
                            source={{uri: user?.profile_image }}
                            style={{width: 75, height: 75, borderRadius: 50}}
                        />
                    </View>
                    {/* Return button */}
                    <View className={"px-4"}>
                        <TouchableOpacity className={"bg-red-500 text-white rounded-md w-1/4 p-1.5"} onPress={() => router.dismiss(1)}>
                            <View className={"flex-row items-center justify-center rounded-lg"}>
                                <MaterialIcons name={"arrow-back"} className={"mr-3"} size={24} color={"white"}/>
                                <Text className={"text-center text-white text-lg"}>
                                    Cancel
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Dropdown with available templates */}
                <View className={"p-4"}>
                    <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg mb-2"}>Templates</Text>
                    <SearchInput placeholder={"Search for a template..."} onSearch={(s) => search(s, "Template")} modalVisible={modalVisible} modalVisibleFun={() => {}}/>
                    {selectedTemplate &&
                        <View className={"flex-row items-center justify-between p-4 dark:bg-neutral-900 bg-neutral-300 rounded-md my-2"}>
                            <View className={"w-3/4"}>
                                <Text className={"dark:text-white font-bold text-lg"}>{selectedTemplate?.name}</Text>
                                <Text className={"dark:text-gray-400"} numberOfLines={1}>{selectedTemplate?.description}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelected("Template", selectedTemplate)}>
                                <Text className={`${selectedTemplate?.uuid === selectedTemplate?.uuid ? "text-neutral-500" : "text-blue-500"}`}>{selectedTemplate?.uuid === selectedTemplate?.uuid ? "Unselect" : "Select"}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {!selectedTemplate &&
                        <ScrollView className={"h-48"}>
                            {filteredTemplates.map((t) => (
                                <View key={t.uuid} className={"flex-row items-center justify-between p-4 dark:bg-neutral-900 bg-neutral-300 rounded-md my-2"}>
                                    <View className={"w-3/4"}>
                                        <Text className={"dark:text-white font-bold text-lg"}>{t.name}</Text>
                                        <Text className={"dark:text-gray-400"} numberOfLines={1}>{t.description}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setSelectedTemplate(t)}>
                                        <Text className={"text-blue-500"}>Select</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    }
                </View>

                {/* Dropdown with available patients */}
                <View className={"p-4"}>
                    <Text className={"dark:text-white font-bold sm:text-sm md:text-base lg:text-lg mb-2"}>Patients</Text>
                    <SearchInput placeholder={"Search for a patient..."} onSearch={(s) => search(s, "Patient")} modalVisible={modalVisible} modalVisibleFun={() => {}}/>
                    {selectedPatient &&
                        <View className={"flex-row items-center justify-between p-4 dark:bg-neutral-900 bg-neutral-300 rounded-md my-2"}>
                            <View>
                                <Text className={"dark:text-white font-bold text-lg"}>{selectedPatient.first_name} {selectedPatient.last_name}</Text>
                                <Text className={"dark:text-gray-400"}>{selectedPatient.date_of_birth}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelected("Patient", selectedPatient)}>
                                <Text className={`${selectedPatient?.uuid === selectedPatient.uuid ? "text-neutral-500" : "text-blue-500"}`}>{selectedPatient?.uuid === selectedPatient.uuid ? "Unselect" : "Select"}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {!selectedPatient &&
                        <ScrollView className={"h-48"}>
                            {filteredPatients.map((p) => (
                                <View key={p.uuid} className={"flex-row items-center justify-between p-4 dark:bg-neutral-900 bg-neutral-300 rounded-md my-2"}>
                                    <View>
                                        <Text className={"dark:text-white font-bold text-lg"}>{p.first_name} {p.last_name}</Text>
                                        <Text className={"dark:text-gray-400"}>{p.date_of_birth}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setSelectedPatient(p)}>
                                        <Text className={"text-blue-500"}>Select</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    }

                    {/* Button to continue */}
                    <TouchableOpacity onPress={() => {validateSelection()}} className={"bg-blue-500 text-white rounded-md w-full p-2 mt-4 mb-8"}>
                        <View className={"flex-row items-center justify-center rounded-lg"}>
                            <Text className={"text-center text-white text-lg"}>
                                Continue
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </>
        </ScrollView>
    )
}

export default NewResponse;
