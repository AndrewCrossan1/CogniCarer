import { createContext, useContext, useState, ReactNode, FC } from "react";
import {User} from "@/services/api/types";
import {useRouter} from "expo-router";
import * as SecureStore from "expo-secure-store";
import API from "@/services/api/api";
import {useDispatch} from "react-redux";
import {setToken} from "@/services/store/slices/tokenSlice";
import { useUser } from "@/hooks/store/user";

// Define the shape of the context
interface AuthContextType {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    update: (email: string, firstName: string, lastName: string) => Promise<boolean>
    loading: boolean;
    error: string | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider component
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const dispatch = useDispatch();
    const {setUser} = useUser();

    /**
     * Log in a user using the provided email and password
     * If remember is true, store the token in the secure store
     * @param email The email of the user
     * @param password The password of the user
     * @returns A boolean indicating the success of the operation
     */
    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.POST("/auth/login/", {
                email: email,
                password: password,
            });

            // Check if the response is valid
            if (!response.key) {
                setError("Invalid response from the server");
                return false;
            }

            // Store the token in the redux store
            dispatch(setToken(response.key));

            // Request the user data (The key should be set in the API client)
            const user: User = await API.get("/auth/user/");
            setUser(user);

            setLoading(false);
            return true;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.error(e);
            setLoading(false);
            return false;
        }
    };

    /**
     * Log out the user
     * @returns A boolean indicating the success of the operation
     */
    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            // Check if the user chose to remember them
            const remember = await SecureStore.getItemAsync("remember");
            if (remember !== "true") {
                // Remove the token from the secure store
                await SecureStore.deleteItemAsync("token");
                // Call the logout API
                await API.POST("/auth/logout/");
            }
            // Remove the user data
            setUser(null);

            // Remove the token from the redux store
            dispatch(setToken(null));

            // Redirect to login page
            router.push("/(auth)/login");
            return true;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.error(e);
        } finally {
            setLoading(false);
        }
        return false;
    };

    /**
     * Update the user's information
     * @param email The email of the user
     * @param firstName The first name of the user
     * @param lastName The last name of the user
     * @returns A boolean indicating the success of the operation
     */
    const update = async (email: string, firstName: string, lastName: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const user = await API.put("/auth/user/", {
                email: email,
                first_name: firstName,
                last_name: lastName,
            });

            setUser(user);
            return true;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.error(e);
            setError("An error occurred while updating the user");
        } finally {
            setLoading(false);
        }
        return false;
    }

    return (
        <AuthContext.Provider value={{ login, logout, update, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

// Define a custom hook to access the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
