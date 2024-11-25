import API from '@/services/api/api'
import {useState} from "react";
import {Template} from "@/services/api/types";

export const useTemplates = () => {

    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([] as Template[]);

    const getTemplates = async () => {
        setLoading(true);
        return await API.getTemplates().then((templates) => {
            setLoading(false);
            setTemplates(templates);
            return templates;
        });
    }

    const getTemplate = async (id: string) => {
        // An array of one template is returned, so we return the first element
        setLoading(true);
        return await API.getTemplates(id).then((template) => {
            setTemplates(template);
            setLoading(false);
        });
    }

    return {loading, templates, getTemplates, getTemplate}
}
