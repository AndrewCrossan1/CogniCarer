// Define a type for User
export interface User {
    pk: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
    date_of_birth: string;
    profile_image: string;
    prof_carer: boolean;
    family_carer: boolean;
    number_of_clients: number;
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

// Patient Types
export interface Patient {
    uuid: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    room_number: string;
    conditions: string[];
    created_at: string;
}

// Storyboard Types
export interface Template {
    uuid: string;
    name: string;
    description: string;
    content: string;
    created_at: string;
    updated_at: string;
    response_count: number;
}

export interface Response {
    uuid: string;
    template: Template
    patient: Patient
    user: User
    response: object;
    response_content: string;
    created_at: string;
    updated_at: string;
}
