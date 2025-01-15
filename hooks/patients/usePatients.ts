import API from "@/services/api/api";
import {useState} from "react";
import {Patient} from "@/services/api/types";

export const usePatients = () => {
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([] as Patient[]);
    const [error, setError] = useState<string | null>(null);

    const getPatients = async (): Promise<boolean> => {
        setLoading(true);
        const response = await API.get("patients/");

        if (!response) {
            setError("An error occurred while fetching patients");
            setLoading(false);
            return false;
        }

        setPatients(response);
        setLoading(false);
        return true;
    }

    const getPatient = async (id: string): Promise<boolean> => {
        setLoading(true);
        const response = await API.get(`patients/${id}/`);

        if (!response) {
            setError("An error occurred while fetching patient");
            setLoading(false);
            return false;
        }

        setPatients([response]);
        setLoading(false);
        return true;
    }

    return {loading, patients, error, getPatients};
}