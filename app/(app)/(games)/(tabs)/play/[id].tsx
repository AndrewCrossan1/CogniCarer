import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useGame} from "@/hooks/games/useGame";
import {Attempt, Match} from "@/services/api/types";
import {useColorScheme} from "nativewind";
import colors from "tailwindcss/colors";
import {Dropdown, DropdownRef} from "@/components/forms/Dropdown";
import {usePatients} from "@/hooks/patients/usePatients";
import {useGameStatistics} from "@/hooks/games/useGameStatistics";
import {useFocusEffect} from "@react-navigation/native";

const SelectedGameHome = () => {
    const { getGame, loading } = useGame();
    const { getAttemptsByGameAndPatient, loading: statsLoading } = useGameStatistics();
    const { id } = useLocalSearchParams();
    const [game, setGame] = useState<Match | null>(null);
    const { colorScheme } = useColorScheme();
    const { getPatients } = usePatients();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientOptions, setPatientOptions] = useState([] as { value: string, display: string }[]);
    const [previousAttempts, setPreviousAttempts] = useState([] as Attempt[]);
    const dropdownRef = useRef<DropdownRef>(null);


    const fetchGame = async () => {
        if (id) {
            let tempId = (id).toString();
            getGame(tempId).then((game) => {
                if (game) {
                    setGame(game);
                }
            }).catch((error) => {
                console.error(error);
            });
        }

        getPatients().then((patients) => {
            let tempOptions = [] as { value: string, display: string }[];
            if (patients) {
                patients.forEach((patient) => {
                    tempOptions.push({
                        value: patient.uuid,
                        display: patient.first_name + " " + patient.last_name
                    });
                });
                setPatientOptions(tempOptions);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        fetchGame();

        if (game?.person_with_dementia) {
            // Use patientOptions to match the person_with_dementia to the patient value
            let patient = patientOptions.find((patient) => patient.value === game.person_with_dementia);
            console.log(patient);
            if (patient) {
                game.person_with_dementia = patient.display;
            }
        }
    }, [id]);

    useEffect(() => {
        if (selectedPatient) {
            getAttemptsByGameAndPatient(id.toString(), selectedPatient).then((attempts) => {
                if (attempts) {
                    setPreviousAttempts(attempts);
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [selectedPatient]);

    useFocusEffect(
        useCallback(() => {
            setSelectedPatient(null);
            setPreviousAttempts([]);
            dropdownRef.current?.setSelected("");
        }, [])
    );

    return (
        <View className={"flex-1 justify-between items-center bg-neutral-100 dark:bg-neutral-800 md:px-4 lg:px-6"}>
            {loading && (
                <ActivityIndicator size={"large"} color={colors.blue[500]} />
            )}

            {!loading && game && (
                <View className={"w-full h-full justify-center lg:justify-evenly"}>
                    <View>
                        <View className={"items-center my-4"}>
                            <Text className="text-4xl font-bold text-neutral-900 dark:text-white">
                                {game.title}
                            </Text>
                            <Text className="text-lg text-neutral-500 dark:text-neutral-400">
                                By: {game.person_with_dementia || "The CogniCarer Team"}
                            </Text>
                        </View>

                        <View className={"flex flex-row gap-3 my-4"}>
                            <View
                                className="flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center" style={{
                                shadowColor: colors.black,
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                shadowRadius: 3.84,
                                elevation: 2
                            }}>
                                <Text className="text-4xl font-bold text-blue-500">
                                    {game.average_score}
                                </Text>
                                <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Average Score
                                </Text>
                            </View>

                            <View
                                className="flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center" style={{
                                shadowColor: colors.black,
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                shadowRadius: 3.84,
                                elevation: 2
                            }}>
                                <Text className="text-4xl font-bold text-blue-500">
                                    {game.maximum_score}
                                </Text>
                                <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Maximum Score
                                </Text>
                            </View>

                            <View
                                className="flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center" style={{
                                shadowColor: colors.black,
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                shadowRadius: 3.84,
                                elevation: 2
                            }}>
                                <Text className="text-4xl font-bold text-blue-500">
                                    {game.times_played}
                                </Text>
                                <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Total Play{game.times_played > 1 ? "s" : ""}
                                </Text>
                            </View>
                        </View>

                        <View className={"flex items-center my-2"}>
                            {/* Description */}
                            <Text className="text-lg dark:text-white" numberOfLines={2}>
                                {game.description || "No description available"}
                            </Text>
                        </View>

                        <View className={"flex my-2 items-center"}>
                            <View className={"flex flex-col my-2 items-start"}>
                                <Text className={"text-lg tracking-wide font-semibold dark:text-white text-start"}>
                                    Round 1: {game.round_1_time} seconds
                                </Text>

                                <Text className={"text-lg tracking-wide font-semibold dark:text-white text-start"}>
                                    Round 2: {game.round_2_time} seconds
                                </Text>

                                <Text className={"text-lg tracking-wide font-semibold dark:text-white text-start"}>
                                    Round 3: {game.round_3_time} seconds
                                </Text>
                            </View>
                        </View>

                        <View className={"flex my-2"}>
                            <Text className={"text-lg dark:text-white font-semibold my-2"}>
                                Select the player
                            </Text>
                            <Dropdown ref={dropdownRef} options={patientOptions} onSelect={(value => {
                                setSelectedPatient(value);
                            })} />
                        </View>

                        <Text className={"text-lg dark:text-white font-semibold mt-2"}>
                            Previous Attempts
                        </Text>
                        <View className={"w-full flex border-b dark:border-b-neutral-600 border-b-neutral-300"}/>

                        <View className={"flex flex-row gap-3 mt-3"}>
                            {!selectedPatient && (
                                <View className={"flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center"} style={{
                                    shadowColor: colors.black,
                                    shadowOffset: {width: 0, height: 2},
                                    shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                    shadowRadius: 3.84,
                                    elevation: 2
                                }}>
                                    <Text className="text-4xl font-bold text-blue-500">
                                        Select a player
                                    </Text>
                                    <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Select a player to view their attempts
                                    </Text>
                                </View>
                            )}

                            {selectedPatient && previousAttempts.length === 0 && (
                                <View className={"flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center"} style={{
                                    shadowColor: colors.black,
                                    shadowOffset: {width: 0, height: 2},
                                    shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                    shadowRadius: 3.84,
                                    elevation: 2
                                }}>
                                    <Text className="text-4xl font-bold text-blue-500">
                                        No attempts
                                    </Text>
                                    <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                                        No attempts have been made yet
                                    </Text>
                                </View>
                            )}
                            {previousAttempts.map((attempt, index) => (
                                <View key={index} className={"flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center"} style={{
                                    shadowColor: colors.black,
                                    shadowOffset: {width: 0, height: 2},
                                    shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                    shadowRadius: 3.84,
                                    elevation: 2
                                }}>
                                    <Text className="text-4xl font-bold text-blue-500">
                                        {statsLoading ? (
                                            <ActivityIndicator size={"large"} color={colors.blue[500]} />
                                        ) : (
                                            <Text>{attempt.score} / {game.maximum_score}</Text>
                                        )}
                                    </Text>
                                    <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                                        {attempt.created_at}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity className={"flex bg-blue-500 text-white p-4 px-4 rounded-lg my-4"}>
                        <Text className={"text-lg font-semibold text-white text-center"}>
                            Play Game
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default SelectedGameHome;
