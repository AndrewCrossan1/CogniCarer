import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {SearchInput} from "@/components/SearchInput";
import {useGetTemplates} from "@/hooks/storyboard/useGetTemplates";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useEffect, useState} from "react";
import {Template} from "@/services/api/types";

export default function TemplateList() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        }
    });

    const {getTemplates, getTemplate, templates, loading} = useGetTemplates();
    const theme = useThemeColor();
    const [Templates, setTemplates] = useState([] as Template[]);

    useEffect(() => {
        getTemplates().then(() => {
            setTemplates(templates);
        });
    }, []);

    const handleSearch = (s: string) => {
        // Filter the templates based on the search string
        const filteredTemplates = templates.filter((template: Template) => {
            return template.name.toLowerCase().includes(s.toLowerCase());
        });
        setTemplates(filteredTemplates);
    }

    return (
        <View style={styles.container} className={"dark:bg-neutral-800 p-4"}>
            <SearchInput placeholder={"Search for templates..."} onSearch={handleSearch}/>
            {loading ? (<ActivityIndicator size={"large"} color={theme.primary}/>)
                : Templates.map((template: Template) => {
                    return <Text key={template.uuid} className={"text-white"}>{template.name}</Text>
                })
            }
        </View>
    )
}