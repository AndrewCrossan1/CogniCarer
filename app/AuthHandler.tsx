import { useAuth } from "@/context/AuthContext"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import * as LocalAuthentication from "expo-local-authentication"
import {useDispatch} from "react-redux";
import {setToken} from "@/services/store/slices/tokenSlice";
import * as SecureStorage from "expo-secure-store";

export default function AuthHandler() {
    const { remembered } = useAuth()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const dispatch = useDispatch()

    useEffect(()  => {
        setMounted(true)
    }, []);

    const biometricAuth = async () => {
        // Check if biometric authentication is available
        const available = await LocalAuthentication.hasHardwareAsync()
        if (!available) {
            console.debug("Biometric authentication is not available")
            return null;
        }
        // Check if face id is available
        const faceId = await LocalAuthentication.supportedAuthenticationTypesAsync()
        if (faceId.includes(2)) {
            console.debug("Face ID is available")
        }
        console.debug("faceId", faceId)

        // Check if the user has remembered their credentials
        const valid = await remembered();
        if (!valid) {
            console.debug("User has not remembered their credentials")
            return null;
        }

        // Authenticate the user using biometrics
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Authenticate to continue",
            cancelLabel: "Cancel"
        })

        if (!result.success) {
            console.debug("Biometric authentication failed")
            return null;
        }
        return await SecureStorage.getItemAsync("token");
    }

    useEffect(() => {
        if (mounted) {
            biometricAuth().then((result) => {
                if (result) {
                    // Set the token in the store
                    dispatch(setToken(result));
                    router.push("/(app)")
                } else {
                    router.push("/(auth)/login")
                }
            })}
    }, [mounted, router])
    return null
}