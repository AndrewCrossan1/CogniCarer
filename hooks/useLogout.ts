import {useState} from "react";
import API from "@/services/api/api";

export const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<boolean | null>(null);

    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            // Call the logout API
            await API.logout();
            // If successful, return true
            setData(true);
            return true;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, data, logout };
};