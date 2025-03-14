import * as ImagePicker from 'expo-image-picker';

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

// Patient Types
export interface Patient {
    profile_picture?: string | null | ImagePicker.ImagePickerResult;
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

// Article Subtypes
export interface Tag {
    name: string;
}

export interface Category {
    uuid: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Article {
    uuid: string;
    title: string;
    tags: string[];
    category: Category
    source: string;
    source_url: string;
    content: string;
    liked: boolean;
    likes: number;
    views: number;
    created_at: string;
    updated_at: string;
}

// Game Subtypes
export interface Match {
    uuid: string,
    title: string,
    description: string,
    person_with_dementia: string,
    public: boolean,
    round_1_time: number,
    round_2_time: number,
    round_3_time: number,
    matching_image: string,
    non_matching_image_1: string,
    non_matching_image_2: string,
    created_at: string,
    updated_at: string,
    maximum_score: number,
    average_score: number,
    times_played: number,
}

export interface Attempt {
    uuid: string,
    match: string | Match,
    supervising_user: string | User,
    patient: string | Patient,
    score: number,
    created_at: string,
    updated_at: string,
    percentage: number,
}
