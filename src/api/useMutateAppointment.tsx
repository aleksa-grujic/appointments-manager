import { supabase } from '@/config/supabase.ts';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { Database } from '@/types/supabase.ts';
import { toast } from 'sonner';
import { Appointment } from '@/types/appointment.ts';
import { sortAppointmentsByDateAndStatus } from '@/lib/utils.ts';

type InsertAppointment = Database['public']['Tables']['appointments']['Insert'];
type UpdateAppointment = Database['public']['Tables']['appointments']['Update'];

const createAppointment = async (appointment: InsertAppointment) => {
  const { data, error } = await supabase.from('appointments').insert(appointment).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const updateAppointment = async (appointment: UpdateAppointment) => {
  const { id, ...rest } = appointment;

  const { data, error } = await supabase.from('appointments').update(rest).eq('id', id!).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const mutateCacheAppointment = (queryClient: QueryClient, isUpdate: boolean, appointment: Appointment) => {
  queryClient.setQueryData(['appointments'], (old: Appointment[] | undefined) => {
    if (!old) {
      return [appointment];
    }
    const array = [...old];
    if (isUpdate) {
      array.map((oldAppointment) => (oldAppointment.id === appointment.id ? appointment : oldAppointment));
    } else {
      array.push(appointment);
    }
    return sortAppointmentsByDateAndStatus(array);
  });
};

export const useMutateAppointment = (isUpdate?: boolean) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: isUpdate ? updateAppointment : createAppointment,
    onSuccess: (data) => {
      const string = isUpdate ? 'Uspešno ste ažurirali termin.' : 'Uspešno ste dodali termin.';
      mutateCacheAppointment(queryClient, !!isUpdate, data[0]);
      toast.success(string);
    },
    onError: (error) => {
      console.log(error);
      toast.error('Došlo je do greške.');
    },
  });
};
