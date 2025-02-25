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
    profile_picture?: string;
    age?: number;
    relationship: string;
    uuid: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    care_notes: string;
    created_at?: string;
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

// Define a type for random quote
export interface Quote {
    q: string;
    a: string;
    h: string;
}

// Define reminiscence types
export interface ReminisceEntry {
    uuid: string;
    patient: string;
    patientActual?: Patient;
    user: string;
    userActual?: User;
    picture: string;
    pictureActual?: Picture;
    title: string;
    notes: string;
    date_taken: string;
    created_at: string;
    updated_at: string;
}

export interface UserAlbum {
    user: string;
    patient: string;
    uuid: string;
    title: string;
    description: string;
    patientActual?: Patient;
    created_at: string;
    updated_at: string;
    album_path: string;
    picture_count: number;
}

export interface Picture {
    user: string;
    patient: string;
    patientActual?: Patient;
    album: string;
    albumActual?: UserAlbum;
    uuid: string;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
    updated_at: string;
}
