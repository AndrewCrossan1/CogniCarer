import { createContext, useContext, useState, ReactNode, FC } from "react";
import {useLogout} from "@/services/api/hooks/useLogout";
import {useLogin} from "@/services/api/hooks/useLogin";
import {User} from "@/services/api/types";

// Define the shape of the context
interface AuthContextType {
    key: string | null;
    user: User | null;
    loginUser: (email: string, password: string) => Promise<boolean>;
    logoutUser: () => void;
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
    };

    return (
        <AuthContext.Provider value={{ key, user, loginUser, logoutUser }}>
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