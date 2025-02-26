import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Quote} from "@/services/api/types";

interface quoteState {
    quote: Quote | null;
}

const initialState: quoteState = {
    quote: null,
} as quoteState;


export const quoteSlice = createSlice({
    name: 'quote',
    initialState: initialState,
    reducers: {
        setQuote: (state,  action: PayloadAction<Quote | null>)  => {
            state.quote = action.payload;
        },
        deleteQuote: (state) => {
            state.quote = null;
        }
    },
});

export const {setQuote, deleteQuote} = quoteSlice.actions;
export default quoteSlice.reducer;