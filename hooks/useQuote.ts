import {useState} from "react";
import {Quote} from "@/services/api/types";
import API from "@/services/api/api";

export const useQuote = () => {
    const [loading, setLoading] = useState(false);
    const [quote, setQuote] = useState<Quote>();
    const [error, setError] = useState<string | null>(null);

    const getQuote = async (): Promise<Quote> => {
        setLoading(true);

        const response = await API.quote();

        setQuote(response);
        setLoading(false);

        // Convert the response to a Quote object
        return response;
    }

    return { quote, getQuote, loading, error };
}

