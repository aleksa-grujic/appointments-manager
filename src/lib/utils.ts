import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Tables } from '@/types/supabase.ts';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateSecondsTo0(date: Date) {
  return new Date(date.setSeconds(0, 0));
}

export function getHoursRoundedTo30(ms: number) {
  return Math.ceil(ms / 1000 / 60 / 30) / 2;
}

export function getHoursAndMinutes(date: Date, inString = false, separator = ':') {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return inString ? `${hours}${separator}${minutes}` : { hours, minutes };
}

export function sortAppointmentsByDateAndStatus(appointments: Tables<'appointments'>[]) {
  return appointments.sort((a, b) => {
    // if (a.end_time && b.end_time) {
    //   return new Date(a.end_time).getTime() - new Date(b.end_time).getTime();
    // }
    //
    // if (a.end_time) {
    //   return 1;
    // }
    //
    // if (b.end_time) {
    //   return -1;
    // }

    return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
  });
}
