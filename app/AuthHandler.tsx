import { useAuth } from "@/context/AuthContext"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"

export default function AuthHandler() {
    const { keyCheck, key } = useAuth()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(()  => {
        setMounted(true)
    }, []);

    useEffect(() => {
        if (mounted && !key) {
            keyCheck()
        }
        if (mounted && !key) {
            router.push("/(auth)/login")
        } else if (mounted && key) {
            router.push("/(app)")
        }
    }, [mounted, router, key])

    return null
}