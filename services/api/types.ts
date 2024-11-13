// Define a type for login request payload
export interface LoginRequest {
    email: string;
    password: string;
}

// Define a type for User
export interface User {
    pk: string;
    email: string;
    first_name: string;
    last_name: string;
    staff_role: string;
    date_joined: string;
}

// Define a type for login response payload
export interface LoginResponse {
    key: string;
    user: User;
}

// Define a type for API error
export interface ApiError {
    code: number;
    message: string;
}

// The exact same as above, will be replaced.
export interface ErrorResponse {
    errorMessage: string;
    errorCode: number;
}