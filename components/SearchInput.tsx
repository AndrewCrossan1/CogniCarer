import {View, TextInput, StyleSheet, TouchableOpacity, Modal, Text, SafeAreaView} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useThemeColor} from "@/hooks/useThemeColor";
import {useEffect, useState} from "react";

export function SearchInput({placeholder, onSearch}: { placeholder: string, onSearch: (s: string) => void }) {
    const theme = useThemeColor();
    const [borderColor, setBorderColor] = useState("border-neutral-900");
    const [iconColor, setIconColor] = useState("dimgrey");
    const [modalVisible, setModalVisible] = useState(false);
    const [searchValue, setSearchValue] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setModalVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [modalVisible]);

    const onChangeText = (s: string) => {
        setSearchValue(s);
        onSearch(s);
    }

    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
        },
        icon: {
            marginRight: 10,
        },
        input: {
            flex: 1,
            color: theme.text,
        },
        modalView: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },
    })

    const onInputFocus = () => {
        setBorderColor("border-blue-500");
        setIconColor(theme.text);
    }
    const onInputFocusOut = () => {
        setBorderColor("border-neutral-900");
        setIconColor("dimgrey");
    }

    return (
        <SafeAreaView>
            <View style={styles.container}
                  className={`dark:bg-neutral-900 w-full border ${borderColor} transition ease-linear`}>
                <FontAwesome style={{marginRight: 10}} name={"search"} size={16} color={iconColor}/>
                <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
                    <TextInput
                        className={"dark:text-white w-full"}
                        onFocus={onInputFocus}
                        onBlur={onInputFocusOut}
                        placeholder={placeholder}
                        autoCorrect={false}
                        autoCapitalize={"none"}
                        onChangeText={(s) => {
                            onChangeText(s)
                        }}
                        value={searchValue}
                        placeholderTextColor={"dimgrey"}
                    />
                </View>
                <TouchableOpacity onPress={() => {
                    setModalVisible(true)
                }} className={"rounded-lg"}>
                    <FontAwesome style={{marginLeft: 10}} name={"info-circle"} size={20} color={iconColor}/>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View className={"mt-safe mx-safe-or-4 dark:bg-neutral-900 rounded-lg elevation-md p-4"}>
                        <View className={"flex-row justify-start items-center"}>
                            <FontAwesome style={{marginRight: 10}} name={"info-circle"} size={30} color={"white"}/>
                            <View className={"flex-1 flex-row items-center"}>
                                <Text className={"text-lg dark:text-white font-bold w-full"}>Search Information</Text>
                            </View>
                            <FontAwesome name={"close"} size={30} color={"red"}
                                         onPress={() => setModalVisible(!modalVisible)}/>
                        </View>
                        <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: "white", marginVertical: 5}}/>
                        <Text className={"dark:text-gray-400 mt-2"}>
                            Use the search bar to search for a specific item.
                        </Text>
                        <Text className={"dark:text-gray-400 my-2"}>
                            You can search by name, ID, or any other relevant information.
                        </Text>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )

}