import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {ApiError, Quote} from "@/services/api/types";
import {store} from "@/services/store/store";
import {ImagePickerResult} from "expo-image-picker";

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
        // Get the token from the store
        const token = this.store.getState().token.token;
        if (token) {
            return token;
        }
        return null;
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
    public async delete(endpoint: string): Promise<any> {
        return await this.client.delete(endpoint).then((response) =>
            response.data);
    }

    public async quote(): Promise<Quote> {
        return await this.client.get('https://zenquotes.io/api/today').then((response) =>
            response.data[0]);
    }

    public async image_post(endpoint: string, data: any, file: ImagePickerResult, paramName?: string): Promise<any> {
        const formData = new FormData();

        if (!file.assets) {
            return Promise.reject("No file provided");
        }

        // Get the file type
        const uri = file.assets[0].mimeType;
        if (!uri) {
            return Promise.reject("Invalid file type");
        }

        // Create a new file from the image
        const newFile = {
            uri: file.assets[0].uri,
            name: `photo.${uri.split('/')[1]}`,
            type: file.assets[0].mimeType,
        };

        if (paramName) {
            formData.append(paramName, newFile as any);
        } else {
            formData.append('image', newFile as any);
        }

        // Append the data to the form data
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        console.debug(formData);

        const response = await this.client.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    public async image_put(endpoint: string, data: any, file: ImagePickerResult): Promise<any> {
        const formData = new FormData();

        if (!file.assets) {
            return Promise.reject("No file provided");
        }

        // Get the file type
        const uri = file.assets[0].mimeType;
        if (!uri) {
            return Promise.reject("Invalid file type");
        }

        // Create a new file from the image
        const newFile = {
            uri: file.assets[0].uri,
            name: `photo.${uri.split('/')[1]}`,
            type: file.assets[0].mimeType,
        };

        // Append the file to the form data
        formData.append('profile_Mimage', newFile as any);

        // Append the data to the form data
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        const response = await this.client.put(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

// Export the API instance
export default new API();
