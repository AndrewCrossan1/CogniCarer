import {useState} from "react";
import {Match} from "@/services/api/types";

/**
 * Hook to manage the game data
 * @returns {Object} - The game data
 * @returns {Function} getGame - Get a game by its UUID
 * @returns {Function} getGames - Get a list of games
 * @returns {Function} getGamesByType - Get a list of games by category
 * @returns {Function} createGame - Create a new game
 * @returns {Function} updateGame - Update a game
 * @returns {Function} deleteGame - Delete a game
 * @returns {boolean} loading - The loading state
 * @returns {Error} error - The error object
 */
export const useGame = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    /**
     * Get a game by its UUID
      * @param {string} uuid - The UUID of the game
     * @returns {Promise<Match>} - The game object
     */
    const getGame = async (uuid: string): Promise<Match> => {
        return {} as Match;
    }

    /**
     * Get a list of games
     * @returns {Promise<Match[]>}
     */
    const getGames = async (): Promise<Match[]> => {
        return [] as Match[];
    }

    /**
     * Get a list of games by category
     * @param {string} category - The category of the games
     * @returns {Promise<Match[]>}
     */
    const getGamesByType = async (category: string): Promise<Match[]> => {
        return [] as Match[];
    }

    /**
     * Create a new game
     * @param {Match} game - The game object
     * @returns {Promise<Match>}
     */
    const createGame = async (game: Match): Promise<Match> => {
        return {} as Match;
    }

    /**
     * Update a game
     * @param {Match} game - The game object
     * @returns {Promise<Match>}
     */
    const updateGame = async (game: Match): Promise<Match> => {
        return {} as Match;
    }

    /**
     * Delete a game
     * @param {string} uuid - The UUID of the game
     * @returns {Promise<void>}
     */
    const deleteGame = async (uuid: string): Promise<void> => {
        return;
    }

    return {getGame, getGames, getGamesByType, createGame, updateGame, deleteGame, loading, error}
}
