import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {ApiError, LoginRequest, LoginResponse, User} from "@/services/api/types";
import * as SecureStore from "expo-secure-store";

// Define the API class
export class API {
    private client: AxiosInstance;

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
                    message: error.response?.data?.message || 'An error occurred',
                };
                return Promise.reject(apiError);
            }
        );
    }

    // Token Retrieval
    private async getToken(): Promise<string | null> {
        // Retrieve the token from storage
        let token = await SecureStore.getItemAsync('token');
        if (!token) {
            return null;
        }
        return token;
    }

    // Login
    public async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await this.client.post<LoginResponse>('/auth/login/', data);
        return response.data;
    }

    // Update User
    public async update(data: {email: string, first_name: string, last_name: string}): Promise<User> {
        return await this.client.put('/auth/user/', data)
            .then((response) =>
                response.data);
    }

    // Get User
    public async getUser(): Promise<User> {
        return await this.client.get('/auth/user/')
            .then((response) =>
                response.data);
    }

    // Logout
    public async logout(): Promise<void> {
        // Call the logout endpoint
        await this.client.post('/auth/logout/');

        // Remove the token from storage
        await SecureStore.deleteItemAsync('token');
    }
}

// Export the API instance
export default new API();
