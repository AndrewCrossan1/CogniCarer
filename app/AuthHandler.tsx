import { useAuth } from "@/context/AuthContext"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"

export default function AuthHandler() {
    const { key } = useAuth()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, []);

    useEffect(() => {
        if (mounted && !key) {
            router.push("/(auth)/login")
        } else if (mounted && key) {
            router.push("/(app)")
        }
    }, [mounted, router, key])

    return null
}