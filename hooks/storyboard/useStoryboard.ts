import {useState} from "react";
import {Response, Template} from "@/services/api/types";
import API from "@/services/api/api";

export const useStoryboard = () => {
    const [loading, setLoading] = useState(false);
    const [responses, setResponses] = useState([] as Response[]);
    const [templates, setTemplates] = useState([] as Template[]);
    const [error, setError] = useState<string | null>(null);

    /**
     * Get all responses
     * @returns {Promise<Response[]>}
     */
    const getResponses = async (): Promise<boolean> => {
        setLoading(true);
        const response = await API.get("storyboard/responses/");

        if (!response) {
            setError("An error occurred while fetching responses");
            setLoading(false);
            return false;
        }

        setResponses(response);
        setLoading(false);
        return true;
    }

    const getResponse = async (id: string): Promise<boolean> => {
        setLoading(true);
        const response = await API.get(`storyboard/responses/${id}/`);

        if (!response) {
            setError("An error occurred while fetching response");
            setLoading(false);
            return false;
        }

        setResponses([response]);
        setLoading(false);
        return true;
    }

    const getTemplates = async (): Promise<boolean> => {
        setLoading(true);
        const response = await API.get("storyboard/templates/");

        if (!response) {
            setError("An error occurred while fetching templates");
            setLoading(false);
            return false;
        }

        setTemplates(response);
        setLoading(false);
        return true;
    }

    const getTemplate = async (id: string): Promise<boolean> => {
        setLoading(true);
        const response = await API.get(`storyboard/templates/${id}/`);

        if (!response) {
            setError("An error occurred while fetching template");
            setLoading(false);
            return false;
        }

        setTemplates([response]);
        setLoading(false);
        return true;
    }

    return {loading, responses, templates, error, getResponses, getResponse, getTemplates, getTemplate};
}