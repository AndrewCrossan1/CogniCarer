import {useState} from "react";
import API from "@/services/api/api";
import {User} from "@/services/api/types";

export const useUpdateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<User | null>(null);

    const update = async (email: string, first_name: string, last_name: string) => {
        setLoading(true);
        setError(null);
        try {
            // Call the logout API
            const user = await API.update({ email, first_name, last_name });
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

    return { loading, error, data, update };
};