import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {ApiError, Template, Response, Patient} from "@/services/api/types";
import * as SecureStore from "expo-secure-store";
import {store} from "@/services/store/store";

// Define the API class
export class API {
    private client: AxiosInstance;
    private store = store;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.EXPO_PUBLIC_API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });

        // Authentication Interceptor
        this.client.interceptors.request.use(
            async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
                const token = await this.getToken();
                if (token) {
                    config.headers.Authorization = `Token ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response Interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => {
                const apiError: ApiError = {
                    code: error.response?.status || 500,
                    message: error.response?.data?.message || 'An issue occurred while processing the request',
                };
                return Promise.reject(apiError);
            }
        );
    }

    // Token Retrieval
    private async getToken(): Promise<string | null> {
        // Check if the token is stored in the secure store
        let token = await SecureStore.getItemAsync('token');
        if (!token) {
            // Check if the token is in the redux store
            token = store.getState().token.token;
        }
        return token;
    }

    // GET /storyboard/templates/
    public async getTemplates(uuid?: string): Promise<Template[]> {
        if (uuid) {
            return await this.client.get(`/storyboard/templates/${uuid}/`).then((response) =>
                response.data);
        }
        return await this.client.get('/storyboard/templates/').then((response) =>
                response.data);
    }

    // GET /patients/
    public async getPatients(uuid?: string): Promise<Patient[]> {
        if (uuid) {
            return await this.client.get(`/patients/${uuid}/`).then((response) =>
                response.data);
        }
        return await this.client.get('/patients/').then((response) =>
                response.data);
    }

    /**
     * Endpoint: /storyboard/responses/
     * @param uuid
     * @returns {Promise<Response[]>}
     * @description Get all responses or a single response by UUID
     * @example
     * // Get all responses
     * const responses = await api.getResponses();
     * // Get a single response by UUID
     * const response = await api.getResponses('343ad3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b');
     */
    public async getResponses(uuid?: string): Promise<Response[]> {
        return await this.client.get('/storyboard/responses/')
            .then(async (response) => {
                // Get the patient and template data for each response
                for (let i = 0; i < response.data.length; i++) {
                    const patient = await this.getPatients(response.data[i].patient);
                    const template = await this.getTemplates(response.data[i].template);
                    response.data[i].patient = patient;
                    response.data[i].template = template;
                }
                return response.data;
            });
    }

    /**
     * GET Method
     * @param endpoint
     * @returns {Promise<any>}
     * @description Generic GET method to fetch data from the API
     * @example
     * // Get all patients
     * const patients = await api.get('patients/');
     * // Get a single patient by UUID
     * const patient = await api.get('patients/343ad3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b');
     */
    public async get(endpoint: string): Promise<any> {
        return await this.client.get(endpoint).then((response) =>
            response.data);
    }

    /**
     * POST Method
     * @param endpoint {string} API endpoint
     * @param data {any} Data to be sent to the API
     * @returns {Promise<any>}
     * @description Generic POST method to send data to the API
     * @example
     * // Create a new patient
     * const patient = await api.post('patients/', {
     *    first_name: 'John',
     *    last_name: 'Doe',
     *    date_of_birth: '1990-01-01',
     *    });
     */
    public async POST(endpoint: string, data?: any): Promise<any> {
        if (!data) {
            data = {};
        }
        const response = await this.client.post(endpoint, data);
        return response.data;
    }

    /**
     * PUT Method
     * @param endpoint {string} API endpoint
     * @param data {object} Data to be sent to the API
     * @returns {Promise<any>}
     * @description Generic PUT method to update data on the API
     * @example
     * // Update the patient by UUID
     * const patient = await api.put('patients/343ad3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b', {
     *    first_name: 'Jane',
     *    last_name: 'Doe',
     *    date_of_birth: '1990-01-01',
     *    });
     **/
    public async put(endpoint: string, data: object): Promise<any> {
        return await this.client.put(endpoint, data).then((response) =>
            response.data);
    }

    /**
     * DELETE Method
     * @param endpoint {string} API endpoint
     * @returns {Promise<boolean>}
     * @description Generic DELETE method to delete data from the API
     * @example
     * // Delete the patient by UUID
     * const patient = await api.delete('patients/343ad3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b');
     **/
    public async delete(endpoint: string): Promise<boolean> {
        return await this.client.delete(endpoint).then((response) =>
            response.data);
    }
}

// Export the API instance
export default new API();
