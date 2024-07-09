import { BASE_URL } from '../../constants/ENVIRONMENT_VARIABLES';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    data: [],
    error: "",
    loading: false,
};
export const getMeetingView = createAsyncThunk(
    'getMeetingView',
    async ({ id }) => {
        try {
            const response = await axios.get(`${BASE_URL}calendar_app/api/calendar_meeting?id=${id}`);
            return response?.data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

const getMeetingViewSlice = createSlice({
    name: 'getMeetingView',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getMeetingView.pending, (state, action) => {
            state.loading = true;
            state.data = []
        })
        builder.addCase(getMeetingView.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
        })
        builder.addCase(getMeetingView.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.data = [];
        })
    }
})
export default getMeetingViewSlice.reducer