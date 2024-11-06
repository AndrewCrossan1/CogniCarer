import { useState } from "react";
import API from "@/services/api/api";
import { LoginRequest, LoginResponse } from "@/services/api/types";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<LoginResponse | null>(null);

    const login = async (loginRequest: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.login(loginRequest);
            setData(response);
            return response;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, data, login };
}