// Define a type for login request payload
export interface LoginRequest {
    email: string;
    password: string;
}

// Define a type for login response payload
export interface LoginResponse {
    token: string;
}

// Define a type for API error
export interface ApiError {
    code: number;
    message: string;
}