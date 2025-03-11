import {useState} from "react";
import {Article, Match} from "@/services/api/types";
import API from "@/services/api/api";

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
    const [error, setError] = useState<string | null>(null);
    const [game, setGame] = useState<Match | null>(null)
    const [games, setGames] = useState<Match[] | null>(null)

    /**
     * Get a game by its UUID
      * @param {string} uuid - The UUID of the game
     * @returns {Promise<Match>} - The game object
     */
    const getGame = async (uuid: string): Promise<Match> => {
        return {} as Match;
    }

    /**
     * Get a list of games created by patients registered to the authenticated user
     * Note: All public games are also included
     * @returns {Promise<Match[] | null>}
     */
    const getGames = async () : Promise<Match[] | null> => {
        setLoading(true);
        // Call the API to get all support articles
        const response = await API.get('/games/matches/');

        if (!response) {
            setError('An error occurred while fetching games');
            setLoading(false);
            return null;
        }

        setLoading(false);
        return response;
    }


    /**
     * Get the latest available public game
     * @returns {Promise<Match | null>}
     */
    const getLatestGame = async (): Promise<Match | null> => {
        setLoading(true);
        // Call the API to get all support articles
        const response = await API.get('/games/matches/latest/');

        if (!response) {
            setError('An error occurred while fetching games');
            setLoading(false);
            return null;
        }

        setLoading(false);
        return response;
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

    return {getGame, getGames, getGamesByType, getLatestGame, createGame, updateGame, deleteGame, loading, error}
}
