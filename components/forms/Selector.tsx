import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useEffect} from "react";

interface SelectorProps {
    canSelect: boolean;
    selected: any[];
    onSelect: (value: any) => void;
    setConfirmVisible: (value: boolean) => void;
    confirmVisible: boolean;
    label: string;
}

const Selector = (props: SelectorProps) => {
    // Destructure props
    const { canSelect, selected, onSelect, setConfirmVisible, confirmVisible, label } = props;

    // Selected Animations
    const maxHeight = useSharedValue(0)

    useEffect(() => {
        if (selected.length > 0) {
            maxHeight.value = withTiming(200, {
                duration: 1500,
                easing: Easing.out(Easing.exp)
            })
        } else {
            maxHeight.value = withTiming(0, {
                duration: 1500,
                easing: Easing.out(Easing.exp)
            })
        }
    }, [selected.length]);

    const animatedStyle = useAnimatedStyle(() => ({
        maxHeight: maxHeight.value,
        opacity: maxHeight.value > 0 ? 1 : 0
    }))

    return (
        <>
            {/* Selected album dropdown choices (Delete, etc) */}
            <Animated.View style={[styles.selectedContainer, animatedStyle]}>
                {canSelect && selected.length > 0 &&
                  <View className={"w-full px-4 pt-4 flex-row items-center justify-between"}>
                    <Text className={"dark:text-white text-lg font-bold"}>
                      Selected {label}
                    </Text>
                    <Text className={"text-blue-500 text-sm"}>
                        {selected.length} Selected
                    </Text>
                  </View>
                }
                {canSelect && selected.length > 0 &&
                  <View>
                    <View className={"flex-row items-center justify-center gap-5 px-4 w-full"}>
                      <TouchableOpacity
                        onPress={() => {
                            setConfirmVisible(!confirmVisible);
                        }}
                        className="flex-row items-center mt-3 w-full rounded-lg p-2 bg-red-600 dark:bg-neutral-900 drop-shadow-md shadow-blue-500/50">
                        <MaterialIcons name="delete" size={24} color="white" className={"mr-1"} />
                        <Text className="text-white">
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                }
            </Animated.View>
        </>
    )
}


const styles = StyleSheet.create({
    selectedContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    modalView: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
})


export default Selector;