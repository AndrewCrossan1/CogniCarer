import {useState} from "react";
import {Attempt} from "@/services/api/types";

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
    const [error, setError] = useState(false)

    /**
     * Get the average score of a user across all games played
     * @returns {Promise<number>}
     */
    const getAverageScore = async (): Promise<number> => {
        return 0
    }

    /**
     * Get the score of the last game played
     * @returns {Promise<number>}
     */
    const getLatestScore = async (): Promise<number> => {
        return 0
    }

    /**
     * Get the highest score of a user across all games played
     * @returns {Promise<number>}
     */
    const getHighestScore = async (): Promise<number> => {
        return 0
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
     * Get a specific attempt
     * @param {string} uuid - The ID of the attempt
     * @returns {Promise<Attempt>}
     */
    const getAttempt = async (uuid: string): Promise<Attempt> => {
        return {} as Attempt
    }

    return {getAverageScore, getLatestScore, getHighestScore, getAttempts, getAttemptsByGame, getAttempt, loading, error}
}
