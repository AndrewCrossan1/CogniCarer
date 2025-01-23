import {ActivityIndicator, Text, View} from "react-native";
import Input from "@/components/Input";
import {useEffect, useState} from "react";
import {useLocalSearchParams} from "expo-router";
import {useAppSelector} from "@/hooks/store/hooks";
import {useStoryboard} from "@/hooks/storyboard/useStoryboard";
import {usePatients} from "@/hooks/patients/usePatients";
import {Patient, Template} from "@/services/api/types";

const newResponseCreate = () => {
    const user = useAppSelector(state => state.user.user);
    const { templates, getTemplates, loading, error } = useStoryboard();
    const { patients, getPatients, loading: patientLoading, error: patientError } = usePatients();
    const { template: templateParam, patient: patientParam } = useLocalSearchParams();
    const [template, setTemplate] = useState<Template | null>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [inputs, setInputs] = useState<{[key: string]: string}>({});

    useEffect(() => {
        const fetch = async () => {
            let valid = await getTemplates();
            if (!valid) {
                console.error("Error fetching templates");
            }
            valid = await getPatients();
            if (!valid) {
                console.error("Error fetching patients");
            }
            const foundTemplate = templates.find(t => t.id === templateParam);
            const foundPatient = patients.find(p => p.id === patientParam);
            if (foundTemplate) {
                setTemplate(foundTemplate);
            }
            if (foundPatient) {
                setPatient(foundPatient);
            }
            console.debug("Template found: " + templateParam);
            console.debug("Patient found: " + patientParam);
        }
        fetch();
    }, [templateParam, patientParam]);

    return (
        <View className={"flex-1 flex-row flex-wrap items-center justify-center dark:bg-neutral-800"}>
            {loading || patientLoading &&
                <ActivityIndicator size={"large"} className={"dark:text-white text-blue-500 mt-10"}/>
            }
            {!loading && template?.content.split(/{(.*?)}/).map((part, index) => {
                if (index % 2 === 0) {
                    return <Text className={"text-4xl dark:text-white"} key={index}>{part}</Text>
                } else {
                    return <Input
                        key={`index${index}`}
                        padding={"p-2.5"}
                        style={{marginHorizontal: 5, maxWidth: 100}}
                        placeholder={part}
                        placeholderTextColor={"#AAAAA5"}
                        value={inputs[part]}
                        onChangeText={(text: string) => {
                            setInputs({...inputs, [part]: text});
                        }}
                    />
                }
            })}
        </View>
    )
}

export default newResponseCreate;
