import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Appointment } from '@/types/appointment.ts';

// Define a type for the slice state
export interface AppointmentState {
  appointments: Array<Appointment>;
}

// Define the initial state using that type
const initialState: AppointmentState = {
  appointments: [],
};

export const appointmentSlice = createSlice({
  name: 'appointment',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    initializeAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter((appointment) => appointment.id !== action.payload);
    },
    editAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex((appointment) => appointment.id === action.payload.id);
      state.appointments[index] = action.payload;
    },
  },
});

export const { addAppointment, deleteAppointment, editAppointment, initializeAppointments } = appointmentSlice.actions;

export default appointmentSlice.reducer;
