import {useState} from "react";
import {Match} from "@/services/api/types";
import API, {ImagePair} from "@/services/api/api";
import {ImagePickerResult} from "expo-image-picker";

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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);

    /**
     * Get a game by its UUID
      * @param {string} uuid - The UUID of the game
     * @returns {Promise<Match>} - The game object
     */
    const getGame = async (uuid: string): Promise<Match> => {
        setLoading(true);

        // Call the API to get the game
        const response = await API.get(`/games/matches/${uuid}/`);

        if (!response) {
            setError('An error occurred while fetching the game');
            setLoading(false);
            return {} as Match;
        }

        setLoading(false);
        return response;
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
     * Create a new game
     * @param {any} game - The game object
     * @param {ImagePickerResult} matching_image - The matching image
     * @param {ImagePickerResult} image_1 - The first image
     * @param {ImagePickerResult} image_2 - The second image
     * @returns {Promise<boolean>}
     */
    const createGame = async (game: any, matching_image: ImagePickerResult, image_1: ImagePickerResult, image_2: ImagePickerResult): Promise<boolean> => {
        setLoading(true);

        // Create an array of ImagePair objects
        const images: ImagePair[] = [
            {
                label: 'matching_image',
                file: matching_image,
            },
            {
                label: 'non_matching_image_1',
                file: image_1,
            },
            {
                label: 'non_matching_image_2',
                file: image_2,
            },
        ];

        images.forEach((pair) => {
            if (!pair.file) {
                setError('Please provide all images');
                setLoading(false);
                return false;
            }
        });

        // Call the API to create a new game
        const response = await API.multiple_image_post('/games/matches/', game, images);

        if (!response) {
            setError('An error occurred while creating the game');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    return {getGame, getGames, getLatestGame, createGame, loading, error}
}
