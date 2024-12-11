import { createContext, useContext, useState, ReactNode, FC } from "react";
import {LoginResponse, User} from "@/services/api/types";
import {useRouter} from "expo-router";
import * as SecureStore from "expo-secure-store";
import API from "@/services/api/api";
import {useDispatch} from "react-redux";
import {setToken} from "@/services/store/slices/tokenSlice";

// Define the shape of the context
interface AuthContextType {
    key: string | null;
    user: User | null;
    login: (email: string, password: string, remember: boolean) => Promise<boolean>;
    logout: () => Promise<boolean>;
    update: (email: string, firstName: string, lastName: string) => Promise<boolean>
    remembered: () => Promise<boolean>;
    loading: boolean;
    error: string | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider component
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [key, setKey] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const dispatch = useDispatch();

    /**
     * Log in a user using the provided email and password
     * If remember is true, store the token in the secure store
     * @param email The email of the user
     * @param password The password of the user
     * @param remember Whether to remember the user or not
     * @returns A boolean indicating the success of the operation
     */
    const login = async (email: string, password: string, remember: boolean): Promise<boolean> => {
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

            setKey(response.key);
            // Store the token in the redux store
            dispatch(setToken(response.key));

            // Store the token in the secure store
            if (remember) {
                await SecureStore.setItemAsync("remember", "true");
                await SecureStore.setItemAsync("token", response.key);
                console.debug("Token stored in secure store");
            }

            // Request the user data (The key should be set in the API client)
            const user = await API.get("/auth/user/");
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
            setKey(null);

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
     * Check if a user has a valid token stored in the secure store
     * If they do, log them in (This only happens when remember me was checked)
     * @returns A boolean indicating the success of the operation
     */
    const remembered = async () => {
        // Used to log user in using FaceID and stored information (If they chose remember me and the token is still valid)
        const token = await SecureStore.getItemAsync("token");

        // Check the validity of the token by calling the user endpoint
        if (token) {
            const user : User = await API.get("/auth/user/"); // We do this to update the user data
            if (user) {
                setUser(user);
                setKey(token);
                dispatch(setToken(token));
                return true;
            }
            return false;
        }
        return false;
    }

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
        <AuthContext.Provider value={{ key, user, login, logout, update, remembered, loading, error }}>
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
