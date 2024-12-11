import {createSlice} from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';

const initialState = {
    token: null,
};

export const tokenSlice = createSlice({
    name: 'token',
    initialState: initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        deleteToken: (state) => {
            state.token = null;
        }
    },
});

export const {setToken, deleteToken} = tokenSlice.actions;
export default tokenSlice.reducer;