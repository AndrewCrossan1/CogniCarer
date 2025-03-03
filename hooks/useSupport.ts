import {ReactNode, useState} from "react";
import {Article} from "@/services/api/types";
import Markdown from "react-native-markdown-display";
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
        const response = await API.get('/support/articles/');

        if (!response) {
            setError('An error occurred while fetching support articles');
            setLoading(false);
            return null;
        }

        setLoading(false);
        return response[0];
    }

    /**
     * getArticleBySource function
     * @param {string} source
     * @returns {Promise<Article[] | null>}
     * @description This function is used to get support articles starting with the source parameter, e.g. 'nhs' will return the articles with source 'nhs scotland', 'nhs england' or 'nhs wales'.
     * @example
     * const articles = await getArticleBySource('nhs')
     */
    const getArticleBySource = async (source: string) : Promise<Article[] | null> => {
        return null;
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
        // Call the API to get all support articles
        console.log(uuid)
        const response = await API.get(`/support/articles/${uuid}/`);

        if (!response) {
            setError('An error occurred while fetching support articles');
            setLoading(false);
            return null;
        }

        setLoading(false);
        return response;
    }

    return {loading, error, getArticles, getLatestArticle, getArticleBySource, getArticle}
}