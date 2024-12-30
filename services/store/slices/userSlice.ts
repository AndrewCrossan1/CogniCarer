import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "@/services/api/types";
import {RootState} from "@/services/store/store";

interface userState {
    user: User | null;
}

const initialState: userState = {
    user: null,
} as userState;

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        deleteUser: (state) => {
            state.user = null;
        }
    },
});

export const {setUser, deleteUser} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export default userSlice.reducer;