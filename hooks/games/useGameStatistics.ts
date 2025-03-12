import {useState} from "react";
import {Attempt} from "@/services/api/types";
import API from "@/services/api/api";

/**
 * useGameStatistics
 * @desc A hook to retrieve attempts and statistics for a user
 * @returns {Object} - An object containing the following:
 * @returns {Function} getAverageScore - A function to get the average score of a user across all games played
 * @returns {Function} getLatestScore - A function to get the score of the last game played
 * @returns {Function} getHighestScore - A function to get the highest score of a user across all games played
 * @returns {Function} getAttempts - A function to get all attempts from a user
 * @returns {Function} getAttemptsByGame - A function to get all attempts from a user for a specific game
 * @returns {Function} getAttempt - A function to get a specific attempt
 * @returns {boolean} loading - A boolean to indicate if the data is loading
 * @returns {boolean} error - A boolean to indicate if an error occurred
 */
export const useGameStatistics = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null);

    /**
     * Get the average score of a user across all games played
     * @param {string} uuid - The ID of the person with dementia
     * @returns {Promise<number>}
     */
    const getAverageScore = async (uuid: string): Promise<number> => {
        setLoading(true);
        // Call the API to get all support articles
        const response = await API.get('/games/attempts/average-score/?uuid=' + uuid);

        if (!response) {
            setError('An error occurred while fetching games');
            setLoading(false);
            return -1;
        }

        setLoading(false);
        return response;
    }

    /**
     * Get the score of the last game played
     * @returns {Promise<number>}
     */
    const getLatestScore = async (): Promise<number> => {
        return 0
    }

    /**
     * Get the number of unique plays of a user across all games played
     * @param uuid - The ID of the person with dementia
     */
    const getUniquePlays = async (uuid: string): Promise<number> => {
        setLoading(true);

        const response = await API.get('/games/attempts/unique-plays/?uuid=' + uuid);

        if (!response) {
            setError('An error occurred while fetching games');
            setLoading(false);
            return -1;
        }

        setLoading(false);
        return response;
    }

    /**
     * Get the most played game by a user
     * @param {string} uuid - The ID of the person with dementia
     * @returns {Promise<number>}
     */
    const getMostPlayedGame = async (uuid: string): Promise<any> => {
        setLoading(true);

        const response = await API.get('/games/attempts/most-played/?uuid=' + uuid);

        if (!response) {
            setError('An error occurred while fetching games');
            setLoading(false);
            return null
        }

        setLoading(false);
        return response;
    }

    /**
     * Get the highest score of a user across all games playe
     * @param {string} uuid - The ID of the person with dementia
     * @returns {Promise<number>}
     */
    const getHighestScore = async (uuid: string): Promise<number> => {
        setLoading(true);

        const response = await API.get('/games/attempts/highest-score/?uuid=' + uuid);

        if (!response) {
            setError('An error occurred while fetching games');
            setLoading(false);
            return -1;
        }

        setLoading(false);
        return response;
    }

    /**
     * Get all attempts from a user
     * @param {string} uuid - The ID of the user who made the attempts
     * @returns {Promise<Attempt[]>}
     */
    const getAttempts = async (uuid: string): Promise<Attempt[]> => {
        return [] as Attempt[]
    }

    /**
     * Get all attempts from a user for a specific game
     * @param {string} uuid - The ID of the user who made the attempts
     * @param {string} gameId - The ID of the game
     * @returns {Promise<Attempt[]>}
     */
    const getAttemptsByGame = async (uuid: string, gameId: string): Promise<Attempt[]> => {
        return [] as Attempt[]
    }

    /**
     * Get the top 3 attempts for the current user's family members
     * @returns {Promise<any>}
     */
    const getTopAttempts = async (): Promise<any> => {
        setLoading(true);

        const response = await API.get('/games/attempts/weeks-scores/');

        if (!response) {
            setError('An error occurred while fetching games');
            setLoading(false);
            return [];
        }

        setLoading(false);
        return response;
    }

    /**
     * Get a specific attempt
     * @param {string} uuid - The ID of the attempt
     * @returns {Promise<Attempt>}
     */
    const getAttempt = async (uuid: string): Promise<Attempt> => {
        return {} as Attempt
    }

    return {getAverageScore, getLatestScore, getMostPlayedGame, getTopAttempts, getHighestScore, getUniquePlays, getAttempts, getAttemptsByGame, getAttempt, loading, error}
}
