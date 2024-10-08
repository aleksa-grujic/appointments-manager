import { supabase } from '@/config/supabase.ts';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase.ts';
import { toast } from 'sonner';
import { sortAppointmentsByDateAndStatus } from '@/lib/utils.ts';

const createAppointment = async (appointment: TablesInsert<'appointments'>) => {
  const { data, error } = await supabase.from('appointments').insert(appointment).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const updateAppointment = async (appointment: TablesUpdate<'appointments'>) => {
  const { id, ...rest } = appointment;

  const { data, error } = await supabase.from('appointments').update(rest).eq('id', id!).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const mutateCacheAppointment = (queryClient: QueryClient, isUpdate: boolean, appointment: Tables<'appointments'>) => {
  queryClient.setQueriesData({ queryKey: ['appointments'] }, (old: Tables<'appointments'>[] | undefined) => {
    if (!old) {
      return [appointment];
    }
    let array = [...old];
    if (isUpdate) {
      array = array.map((oldAppointment) => (oldAppointment.id === appointment.id ? appointment : oldAppointment));
    } else {
      array.push(appointment);
    }

    return sortAppointmentsByDateAndStatus(array);
  });
};

type MutateAppointment = {
  appointment: TablesInsert<'appointments'> | TablesUpdate<'appointments'>;
  disableToast?: boolean;
};

export const useMutateAppointment = (isUpdate?: boolean) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointment }: MutateAppointment) =>
      isUpdate
        ? updateAppointment(appointment as TablesUpdate<'appointments'>)
        : createAppointment(appointment as TablesInsert<'appointments'>),
    onSuccess: (data, variables) => {
      const string = isUpdate ? 'Uspešno ste ažurirali termin.' : 'Uspešno ste dodali termin.';
      mutateCacheAppointment(queryClient, !!isUpdate, data[0]);
      if (!variables.disableToast) {
        toast.success(string);
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error('Došlo je do greške.');
    },
  });
};
