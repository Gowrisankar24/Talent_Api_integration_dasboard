"use client";
import dashboard from "./reducers/dashboard";
import rootReducer from "./reducers/theme";
import calender_1_Slice from './reducers/calenderReducer';
import getMeetingViewSlice from './reducers/meetingReducer'
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    rootReducer: rootReducer,
    dashboard: dashboard,
    calender_1_Slice:calender_1_Slice,
    getMeetingViewSlice:getMeetingViewSlice
  },
  middleware: (getDefaultMiddlleware) =>
    getDefaultMiddlleware({
      serializableCheck: false,
    }),
});

export default store;
