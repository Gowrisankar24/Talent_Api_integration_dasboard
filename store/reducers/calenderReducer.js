import { BASE_URL } from '../../constants/ENVIRONMENT_VARIABLES';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    data: [],
    error: "",
    loading: false,
};
export const getCalenderview_1 = createAsyncThunk(
    'getCalenderview_1',
    async ({ from_date, to_date }) => {
        try {
            const response = await axios.get(`${BASE_URL}/calendar_app/api/calendar?from_date=${from_date}&to_date=${to_date}`);
            return response?.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

const calender_1_Slice = createSlice({
    name: 'getCalenderview_1',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getCalenderview_1.pending, (state, action) => {
            state.loading = true;
            state.data = []
        })
        builder.addCase(getCalenderview_1.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
        })
        builder.addCase(getCalenderview_1.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.data = [];
        })
    }
})
export default calender_1_Slice.reducer