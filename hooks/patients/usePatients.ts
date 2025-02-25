import API from "@/services/api/api";
import {useState} from "react";
import {Patient} from "@/services/api/types";

export const usePatients = () => {
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([] as Patient[]);
    const [error, setError] = useState<string | null>(null);

    const getPatients = async (): Promise<Patient[] | null> => {
        setLoading(true);
        const response = await API.get("patients/");

        if (!response) {
            setError("An error occurred while fetching patients");
            setLoading(false);
            return null;
        }

        setPatients(response);
        setLoading(false);
        return response;
    }

    const getPatient = async (id: string): Promise<Patient | null> => {
        setLoading(true);
        const response = await API.get(`patients/${id}/`);

        if (!response) {
            setError("An error occurred while fetching patient");
            setLoading(false);
            return null;
        }

        setPatients([response]);
        setLoading(false);
        return response;
    }

    interface UpdatePatientData {
        first_name: string;
        middle_name: string;
        last_name: string;
        date_of_birth: string;
        relationship: string;
        gender: string;
    }

    const updatePatient = async (id: string,  data: UpdatePatientData, image?: any): Promise<boolean> => {
        setLoading(true);
        let response;
        console.log(data);
        if (image) {
            // Update patient with image
            response = null;
        } else {
            // Update patient without
            response = await API.put(`patients/${id}/`, data);
            console.log(response);
        }

        if (!response) {
            setError("An error occurred while updating patient");
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    const createPatient = async (data: UpdatePatientData, image?: any): Promise<boolean> => {
        setLoading(true);
        let response;
        if (image) {
            // Update patient with image
            response = await API.image_post(`patients/`, data, image, "image");
        } else {
            // Update patient without
            response = await API.POST(`patients/`, data);
        }

        if (!response) {
            setError("An error occurred while updating patient");
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    return {loading, patients, error, getPatients, getPatient, updatePatient, createPatient};
}
