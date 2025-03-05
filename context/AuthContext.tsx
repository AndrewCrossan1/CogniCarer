import { createContext, useContext, useState, ReactNode, FC } from "react";
import {Quote, User} from "@/services/api/types";
import {useRouter} from "expo-router";
import * as SecureStore from "expo-secure-store";
import API from "@/services/api/api";
import {useDispatch} from "react-redux";
import {setToken} from "@/services/store/slices/tokenSlice";
import { useUser } from "@/hooks/store/user";
import {setQuote} from "@/services/store/slices/quoteSlice";
import {useQuote} from "@/hooks/useQuote";
import {ImagePickerResult} from "expo-image-picker";

// Define the shape of the context
interface AuthContextType {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    update: (email: string, firstName: string, lastName: string, image?: any) => Promise<boolean>
    sendResetEmail: (email: string) => Promise<boolean>;
    validateResetCode: (email: string, code: string) => Promise<boolean>;
    resetPassword: (email: string, code: string, password: string, confirmPassword: string) => Promise<boolean>;
    registerUser: (data: any) => Promise<boolean>;
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
    const { getQuote, loading: quoteLoading } = useQuote();

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

            // Retrieve the quote of the day
            const quote: Quote = await getQuote();
            if (quote !== null) {
                dispatch(setQuote(quote));
            } else {
                console.debug("Failed to retrieve the quote of the day");
            }

            setLoading(false);
            return true;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.debug("Error logging in", e);
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
            // Clear data from SecureStore
            await SecureStore.deleteItemAsync("email");
            await SecureStore.deleteItemAsync("password");

            // Remove the user data
            setUser(null);

            // Remove the token from the redux store
            dispatch(setToken(null));
            dispatch(setQuote(null));

            // Redirect to login page
            router.push("/(auth)/login");
            return true;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.debug(e)
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
     * @param image
     * @returns A boolean indicating the success of the operation
     */
    const update = async (email: string, firstName: string, lastName: string, image?: any): Promise<boolean> => {
        setLoading(true);
        setError(null);
        if (image) {
            try {
                const response = await API.image_put("/auth/user/", {
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                }, image, "profile_image");

                if (!response) {
                    setError("Invalid response from the server");
                    return false;
                }

                setUser(response);
                setLoading(false);
                return true;
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
                console.debug(e);
                setError("An error occurred while updating the user");
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const response = await API.put("/auth/user/", {
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                });

                if (!response) {
                    setError("Invalid response from the server");
                    return false;
                }

                setUser(response);
                setLoading(false);
                return true;
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
                console.debug(e);
                setError("An error occurred while updating the user");
            } finally {
                setLoading(false);
            }
        }
        return false;
    }

    /**
     * Email the user with a link to reset their password
     * @param email The email of the user
     * @returns A boolean indicating the success of the operation
     * @see https://gitlab.cis.strath.ac.uk/fqb22133/dementia-rehabilitation-backend/-/blob/master/README.md?ref_type=heads
     */
    const sendResetEmail = async (email: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await API.POST("/auth/password-reset/", {
                email: email,
            });

            if (!response.success) {
                setError("Invalid response from the server");
                return false;
            }
            return true;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.debug(e);
            setError("An error occurred while sending the reset email");
        } finally {
            setLoading(false);
        }
        return false;
    }

    const validateResetCode = async (email: string, code: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await API.POST("/auth/password-reset/confirm-code/", {
                email: email,
                code: code,
            });

            if (!response.success) {
                setError("Invalid response from the server");
                return false;
            }
            return true;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.debug(e);
            setError("An error occurred while validating the reset code");
        } finally {
            setLoading(false);
        }
        return false;
    }

    const resetPassword = async (email: string, code: string, password: string, confirmPassword: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await API.POST("/auth/password-reset/confirm-password/", {
                email: email,
                code: code,
                password: password,
                password2: confirmPassword,
            });

            if (!response.success) {
                setError("Invalid response from the server");
                return false;
            }
            return true;
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.debug(e);
            setError("An error occurred while resetting the password");
        } finally {
            setLoading(false);
        }
        return false;
    }


    interface RegisterData {
        email: string;
        password1: string;
        password2: string;
        first_name: string;
        last_name: string;
        date_of_birth: string;
        prof_carer: boolean;
        family_carer: boolean;
        mhstruggle: boolean;
        profile_image: ImagePickerResult;
    }

    const registerUser = async ({email, password1, password2, first_name, last_name, date_of_birth, prof_carer, family_carer, mhstruggle, profile_image}: RegisterData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        let response;

        const data = {
            email: email,
            password1: password1,
            password2: password2,
            first_name: first_name,
            last_name: last_name,
            date_of_birth: date_of_birth,
            prof_carer: prof_carer,
            family_carer: family_carer,
            mhstruggle: mhstruggle,
        };

        try {
            response = await API.image_post("/auth/register/", data, profile_image, "profile_image");
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
            console.debug(e);
            setError("An error occurred while registering the user");
            response = null;
        } finally {
            setLoading(false);
        }
        return response !== null;
    }

    return (
        <AuthContext.Provider value={{ login, logout, update, sendResetEmail, validateResetCode, resetPassword, loading, error, registerUser }}>
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
