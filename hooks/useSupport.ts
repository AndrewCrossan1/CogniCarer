import {useState} from "react";
import {Article} from "@/services/api/types";
import API from "@/services/api/api";

/**
 * useSupport hook
 * @returns {Object} {loading: boolean, error: string, getArticles: function}
 * @constructor
 * @description This hook is used to get support articles
 * @example
 * const {loading, error, getArticles} = useSupport()
 */
export const useSupport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * getArticles function
     * @returns {Promise<Article[] | null>}
     * @description This function is used to get all support articles
     * @example
     * const articles = await getArticles()
     */
    const getArticles = async () : Promise<Article[] | null> => {
        setLoading(true);
        // Call the API to get all support articles
        const response = await API.get('/support/articles/');

        if (!response) {
            setError('An error occurred while fetching support articles');
            setLoading(false);
            return null;
        }

        setLoading(false);
        return response;
    }

    /**
     * getLatestArticle function
     * @returns {Promise<Article | null>}
     * @description This function is used to get the latest support article
     * @example
     * const article = await getLatestArticle()
     */
    const getLatestArticle = async () : Promise<Article | null> => {
        setLoading(true);
        // Call the API to get all support articles
        const response = await API.get('/support/articles/latest-article/');

        if (!response) {
            setError('An error occurred while fetching support articles');
            setLoading(false);
            return null;
        }

        setLoading(false);
        return response[0];
    }

    /**
     * getArticle function
     * @param {string} uuid
     * @returns {Promise<Article | null>}
     * @description This function is used to get a support article by its uuid
     * @example
     * const article = await getArticle('1234-5678-9101')
     */
    const getArticle = async (uuid: string) : Promise<Article | null> => {
        setLoading(true);
        const response = await API.get(`/support/articles/${uuid}/`);

        if (!response) {
            setError('An error occurred while fetching support articles');
            setLoading(false);
            return null;
        }

        setLoading(false);
        return response;
    }

    const likeArticle = async (uuid: string) : Promise<boolean> => {
        setLoading(true);
        const response = await API.POST(`/support/articles/${uuid}/like/`);

        if (!response) {
            setError('An error occurred while fetching support articles');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    const unlikeArticle = async (uuid: string) : Promise<boolean> => {
        setLoading(true);
        const response = await API.POST(`/support/articles/${uuid}/unlike/`);

        if (!response) {
            setError('An error occurred while fetching support articles');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    }

    const getArticlesViewedToday = async () : Promise<number | null> => {
        setLoading(true);
        // Call the API to get all support articles
        const response = await API.get('/support/articles/viewed-today/');

        if (!response) {
            setError('An error occurred while fetching support articles');
            setLoading(false);
            return null;
        }

        setLoading(false);
        return response.articles_viewed_today;
    }

    return {loading, error, getArticles, getLatestArticle, getArticle, likeArticle, unlikeArticle, getArticlesViewedToday}
}