import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import {SearchInput} from "@/components/SearchInput";
import {useGetTemplates} from "@/hooks/storyboard/useGetTemplates";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useEffect, useState} from "react";
import {Template} from "@/services/api/types";
import {TemplateCard} from "@/components/Storyboard/TemplateCard";

export default function TemplateList() {
    const styles = StyleSheet.create({
        container: {}
    });

    const {getTemplates, templates, loading} = useGetTemplates();
    const theme = useThemeColor();
    const [Templates, setTemplates] = useState([] as Template[]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        getTemplates().then(() => {
            setTemplates(templates);
        });
    }, [mounted]);

    const handleSearch = (s: string) => {
        // Filter the templates based on the search string
        const filteredTemplates = templates.filter((template: Template) => {
            return template.name.toLowerCase().includes(s.toLowerCase());
        });
        setTemplates(filteredTemplates);
    }

    return (
        <View style={{flex: 1}} className={"dark:bg-neutral-800 p-4"}>
            <SearchInput placeholder={"Search for templates..."} onSearch={handleSearch}/>
            <ScrollView style={{flex: 1}}>
                <View style={styles.container} className={"p-1"}>
                    {loading ? (<ActivityIndicator size={"large"} color={theme.primary}/>)
                        : Templates.map((template: Template) => {
                            return <TemplateCard key={template.uuid} template={template}/>
                        })
                    }
                </View>
            </ScrollView>
        </View>
    )
}