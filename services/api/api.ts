import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {ApiError, LoginRequest, LoginResponse} from "@/services/api/types";

// Define the API class
export class API {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: 'https://api.example.com',
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
        return null;
    }

    // Login
    public async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await this.client.post<LoginResponse>('/auth/login', data);
        return response.data;
    }
}

// Export the API instance
export default new API();