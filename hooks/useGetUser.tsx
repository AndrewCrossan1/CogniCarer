import {useState} from "react";
import API from "@/services/api/api";
import {User} from "@/services/api/types";

export const useGetUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<User | null>(null);

    const get = async () => {
        setLoading(true);
        setError(null);
        try {
            // Call the logout API
            const user = await API.getUser();
            // If successful, return true
            setData(user);
            return user;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, data, get };
};