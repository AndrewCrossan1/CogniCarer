import { useRouter } from "expo-router"
import { useEffect, useState } from "react"

export default function AuthHandler() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(()  => {
        setMounted(true)
    }, []);

    useEffect(() => {
        if (mounted) {
            router.replace("/(auth)/login")
        }
    }, [mounted, router])
    return null
}