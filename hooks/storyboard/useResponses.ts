import API from '@/services/api/api'
import {useState} from "react";
import {Response} from "@/services/api/types";

export const useResponses = () => {

    const [loading, setLoading] = useState(false);
    const [responses, setResponses] = useState([] as Response[]);

    const getResponses = async () => {
        setLoading(true);
        return await API.getResponses().then((responses) => {
            setLoading(false);
            setResponses(responses);
            return responses;
        });
    }

    const getResponse = async (id: string) => {
        // An array of one response is returned, so we return the first element
        setLoading(true);
        return await API.getResponses(id).then((response) => {
            setResponses(response);
            setLoading(false);
        });
    }
    return {loading, responses, getResponses, getResponse}
}
