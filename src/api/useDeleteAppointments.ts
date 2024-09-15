import { supabase } from '@/config/supabase.ts';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Tables } from '@/types/supabase.ts';

const deleteAppointment = async (id: string) => {
  const { data, error } = await supabase.from('appointments').update({ status: 'deleted' }).eq('id', id!);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const mutateCacheAppointment = (queryClient: QueryClient, id: string) => {
  queryClient.setQueriesData({ queryKey: ['appointments'] }, (old: Tables<'appointments'>[] | undefined) => {
    if (!old) {
      return [];
    }

    return old.filter((appointment) => appointment.id !== id);
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onSuccess: (_, id) => {
      mutateCacheAppointment(queryClient, id);
      toast.success('Uspešno ste obrisali termin.');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
