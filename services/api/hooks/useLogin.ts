import { useState } from "react";
import API from "@/services/api/api";
import { LoginRequest, LoginResponse } from "@/services/api/types";
import * as SecureStore from "expo-secure-store";

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
            // Retrieve the token and store it in the secure store
            await SecureStore.setItemAsync("token", response.token);
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