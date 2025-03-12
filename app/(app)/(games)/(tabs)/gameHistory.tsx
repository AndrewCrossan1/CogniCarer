import {ActivityIndicator, Image, RefreshControl, Text, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors from "tailwindcss/colors";
import {useCallback, useEffect, useState} from "react";
import {useAppSelector} from "@/hooks/store/hooks";
import {useColorScheme} from "nativewind";
import {Dropdown} from "@/components/forms/Dropdown";
import {useGameStatistics} from "@/hooks/games/useGameStatistics";
import {useFocusEffect} from "@react-navigation/native";
import {Patient} from "@/services/api/types";
import {usePatients} from "@/hooks/patients/usePatients";

const gameHistory = () => {
    const [refreshing, setRefreshing] = useState(false);
    const user = useAppSelector(state => state.user.user);
    const { colorScheme } = useColorScheme();
    const [weekScores, setWeekScores] = useState({scores: [
            {
                patient: "",
                score: 0,
                match: ""
            }
        ], week: ""});
    const { getPatients } = usePatients();

    const [patients, setPatients] = useState<Patient[]>([]);
    const [patientOptions, setPatientOptions] = useState([] as { value: string, display: string }[]);
    const [patient, setPatient] = useState<Patient | null>(null);

    const [highestScore, setHighestScore] = useState(0);
    const [averageScore, setAverageScore] = useState(0);
    const [uniquePlays, setUniquePlays] = useState(0);
    const [mostPlayedGame, setMostPlayedGame] = useState({title: "", plays: 0, player: "", game_author: ""});

    const { loading, getHighestScore, getAverageScore, getUniquePlays, getMostPlayedGame, getTopAttempts } = useGameStatistics();

    useFocusEffect(
        useCallback(() => {
            getPatients().then((patients) => {
                if (patients) {
                    setPatientOptions(patients.map(patient => ({
                        value: patient.uuid,
                        display: patient.first_name + " " + patient.last_name
                    })));

                    setPatients(patients);
                }
            });

            getTopAttempts().then((scores) => {
                let data = {
                    scores: scores.scores,
                    week: scores.week
                }

                setWeekScores(data);
            });
        }, [])
    );

    useEffect(() => {
        console.log("Patient", patient);
        if (patient) {
            getHighestScore(patient.uuid).then((score) => {
                setHighestScore(score);
            });

            getAverageScore(patient.uuid).then((score) => {
                setAverageScore(score);
            });

            getUniquePlays(patient.uuid).then((plays) => {
                setUniquePlays(plays);
            });

            getMostPlayedGame(patient.uuid).then((game) => {
                let data = {
                    title: game.match.title,
                    plays: game.count,
                    player: game.patient,
                    game_author: game.match.person_with_dementia || "The CogniCarer Team"
                }
                setMostPlayedGame(data);
            });
        }
    }, [patient?.uuid]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getPatients().then((patients) => {
            if (patients) {
                setPatientOptions(patients.map(patient => ({
                    value: patient.uuid,
                    display: patient.first_name + " " + patient.last_name
                })));
                setPatients(patients);
            }
        });
        setRefreshing(false);
    }, []);

    return (
        <KeyboardAwareScrollView contentContainerStyle={{justifyContent: "flex-start"}} className={"flex-1 bg-neutral-100 dark:bg-neutral-800 w-full md:px-4 lg:px-6"}
                                 refreshControl={
                                     <View>
                                         <RefreshControl title={"Refreshing..."} titleColor={colors.neutral[400]}
                                                         tintColor={colors.neutral[400]} refreshing={refreshing}
                                                         onRefresh={onRefresh}/>
                                     </View>
                                 }>
            {/* Header */}
            <View className={"flex flex-row gap-5 items-center xs:mt-4 sm:mt-5 md:mt-6 lg:mt-6 xl:mt-6"}>

                <View className={"flex"}>
                    <Image source={{uri: user?.profile_image}}
                           className={"rounded-full xs:w-10 sm:w-20 md:w-25 lg:w-30 xl:w-35 xs:h-10 sm:h-20 md:h-25 lg:h-30 xl:h-35"}/>
                </View>

                <View className={"flex-1"}>
                    <Text
                        className={"dark:text-white xs:text-base sm:text-base md:text-2xl lg:text-2xl xl:text-2xl font-semibold"}>
                        Hello, {user?.first_name}!
                    </Text>
                    <Text
                        className={"dark:text-white xs:text-xs sm:text-sm md:text-sm lg:text-base xl:text-base"}>
                        View your family's game history here.
                        Scores, averages and more!
                    </Text>
                </View>
            </View>

            {/* Separator */}
            <View className={"w-full flex-1 border-b dark:border-b-neutral-600 border-b-neutral-300 xs:my-1 sm:my-1 md:my-3 lg:my-3 xl:my-4 md:px-2 lg:px-4 xl:px-4"}/>

            <View className={"flex gap-2 justify-center my-2"}>
                <Text className={"dark:text-white xs:text-base sm:text-base md:text-lg lg:text-xl font-bold mt-1"}>
                    Top Scores ({weekScores.week})
                </Text>
                {/* Separator */}
                <View className={"border-b dark:border-b-neutral-600 border-b-neutral-300 xs:px-1 sm:px-2 md:px-2 lg:px-3 xl:px-4"}/>

                <View className={"flex flex-row gap-3"}>
                    {weekScores.scores.map((score, index) => (
                        <View
                            key={index + score.patient}
                            className="flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center" style={{
                            shadowColor: colors.black,
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                            shadowRadius: 3.84,
                            elevation: 2
                        }}>
                            <Text className="text-lg text-blue-500 font-semibold">
                                {score.patient}
                            </Text>
                            <Text className="text-3xl text-blue-500 font-bold my-1">
                                {score.score}%
                            </Text>
                            <View className="flex-1 mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Text className="text-base text-blue-600 dark:text-blue-300 font-semibold text-center">
                                    {score.match}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            <View className={"flex gap-2 justify-center my-2"}>
                <Text className={"dark:text-white xs:text-base sm:text-base md:text-lg lg:text-xl font-bold mt-1"}>
                    Statistics by Family Member
                </Text>

                <Dropdown options={patientOptions} onSelect={(value) => {
                    const patient = patients?.find(patient => patient.uuid === value);
                    if (!patient) {
                        return;
                    }
                    setPatient(patient);
                }}/>

                {loading && patient && (
                    <View className={"flex-1 flex-row p-4 bg-white dark:bg-neutral-900 rounded-lg items-center my-2 gap"}>
                        <ActivityIndicator size="large" color={colors.blue[500]}/>
                    </View>
                )}

                {!loading && !patient && (
                    <View className={"w-full flex-col items-center justify-center mt-2"}>
                        <Text className={"dark:text-white text-base font-bold"}>
                            It's very quiet here!
                        </Text>
                        <Text className={"dark:text-neutral-200 text-neutral-500 text-sm"}>
                            Select a family member to view their game history.
                        </Text>
                    </View>
                )}

                {!loading && patient && (
                    <>
                        <View className={"flex flex-row gap-3 mt-2"}>
                            <View
                                className="flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center" style={{
                                shadowColor: colors.black,
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                shadowRadius: 3.84,
                                elevation: 2
                            }}>
                                {loading ? (
                                    <ActivityIndicator size="large" color={colors.blue[500]}/>
                                ) : (
                                    <Text className="text-4xl text-blue-500 font-bold my-1">{uniquePlays}</Text>
                                )}
                                <Text className="text-base text-neutral-400 font-medium">Unique Play{uniquePlays > 1 && "s"}</Text>
                            </View>
                            <View
                                className="flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center" style={{
                                shadowColor: colors.black,
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                shadowRadius: 3.84,
                                elevation: 2
                            }}>
                                {loading ? (
                                    <ActivityIndicator size="large" color={colors.blue[500]}/>
                                ) : (
                                    <Text className="text-4xl text-blue-500 font-bold my-1">{highestScore}%</Text>
                                )}
                                <Text className="text-base text-neutral-400 font-medium">Highest Score</Text>
                            </View>

                            <View
                                className="flex-1 py-4 bg-white dark:bg-neutral-900 rounded-lg items-center" style={{
                                shadowColor: colors.black,
                                shadowOffset: {width: 0, height: 2},
                                shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                                shadowRadius: 3.84,
                                elevation: 2
                            }}>
                                {loading ? (
                                    <ActivityIndicator size="large" color={colors.blue[500]}/>
                                ) : (
                                    <Text className="text-4xl text-blue-500 font-bold my-1">{averageScore}%</Text>
                                )}
                                <Text className={"text-base text-neutral-400 font-medium"}>
                                    Average Score
                                </Text>
                            </View>
                        </View>

                        <View
                            className="flex-1 flex-row p-4 bg-white dark:bg-neutral-900 rounded-lg items-center my-2 gap" style={{
                            shadowColor: colors.black,
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: colorScheme === "dark" ? 0.30 : 0.10,
                            shadowRadius: 3.84,
                            elevation: 2
                        }}>
                            <View className={"flex-1"}>
                                <Text className="text-3xl text-blue-500 font-semibold my-1">{mostPlayedGame.title}</Text>
                                <Text className="text-base text-blue-500 font-medium">{mostPlayedGame.game_author || "The CogniCarer Team"}</Text>
                            </View>

                            <View className={"flex-1 items-center"}>
                                <Text className="text-lg text-blue-500 font-semibold text-center">{mostPlayedGame.player} played this game</Text>
                                <Text className="text-2xl text-blue-500 font-bold text-center">{mostPlayedGame.plays} time{mostPlayedGame.plays > 1 && "s"}!</Text>
                            </View>
                        </View>
                    </>
                )}
            </View>

        </KeyboardAwareScrollView>
    )
}

export default gameHistory;
