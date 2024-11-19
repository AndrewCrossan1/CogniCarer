import { createContext, useContext, useState, ReactNode, FC } from "react";
import {useLogout} from "@/hooks/useLogout";
import {useLogin} from "@/hooks/useLogin";
import {User} from "@/services/api/types";
import {useUpdateUser} from "@/hooks/useUpdateUser";
import {useRouter} from "expo-router";

// Define the shape of the context
interface AuthContextType {
    key: string | null;
    user: User | null;
    loginUser: (email: string, password: string) => Promise<boolean>;
    logoutUser: () => void;
    updateUser: (email: string, firstName: string, lastName: string) => Promise<boolean>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider component
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [key, setKey] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // Call the login hook
    const { login } = useLogin();
    const { logout } = useLogout();
    const { update } = useUpdateUser();
    const router = useRouter();

    const loginUser = async (email: string, password: string): Promise<boolean> => {
        const { user, key } = await login({ email, password });
        if (key && user) {
            // Set the token in the state
            setKey(key);
            setUser(user);
            return true;
        }
        return false;
    };

    const logoutUser = async () => {
        // Clear the token from the state
        setKey(null);
        setUser(null);

        // Call the logout hook
        await logout();

        // Redirect to the login page
        router.push("/(auth)/login");
    };

    const updateUser = async (email: string, firstName: string, lastName: string): Promise<boolean> => {
        const updatedUser = await update(email, firstName, lastName);
        if (updatedUser) {
            setUser(updatedUser);
            return true;
        }
        return false;
    }

    return (
        <AuthContext.Provider value={{ key, user, loginUser, logoutUser, updateUser }}>
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
