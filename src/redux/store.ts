import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from '@/redux/slices/appointmentSlice.ts';

export const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
