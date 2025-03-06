import {useEffect, useState} from "react";
import {useAppSelector} from "@/hooks/store/hooks";
import {useRouter} from "expo-router";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'You are setting the style `{ shadowOffset: ... }` as a prop. You should nest it in a style object.'
]);

export default function index() {
    const [mounted, setMounted] = useState(false)
    const { user } = useAppSelector(state => state.user)
    const router = useRouter();

    useEffect(() => {
        setMounted(true)
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!user) {
            router.replace("/(auth)/login");
        } else {
            router.replace("/(app)");
        }
    }, [mounted]);
}