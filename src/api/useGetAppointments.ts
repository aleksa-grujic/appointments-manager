import { supabase } from '@/config/supabase.ts';
import { useQuery } from '@tanstack/react-query';
import { sortAppointmentsByDateAndStatus } from '@/lib/utils.ts';
import { formatISO } from 'date-fns';

const getAppointments = async (startDate = new Date(), endDate = new Date()) => {
  const startDay = new Date(startDate.setHours(0, 0, 0, 0));
  const startDayTimestamp = formatISO(startDay);

  const endDay = new Date(endDate.setHours(23, 59, 59, 999));
  const endDayTimestamp = formatISO(endDay);

  const { data, error } = await supabase
    .from('appointments')
    .select()
    .filter('status', 'neq', 'deleted')
    .gte('start_time', startDayTimestamp)
    .lte('start_time', endDayTimestamp);

  if (error) {
    throw new Error(error.message);
  }

  return sortAppointmentsByDateAndStatus(data);
};

type UseGetAppointmentsProps = {
  startDate?: Date;
  endDate?: Date;
};

export const useGetAppointments = (props: UseGetAppointmentsProps) => {
  const { startDate, endDate } = props;

  const queryKey = ['appointments'];
  if (startDate) queryKey.push(startDate.toISOString());
  if (endDate) queryKey.push(endDate.toISOString());

  return useQuery({
    queryKey: queryKey,
    queryFn: () => getAppointments(startDate, endDate),
  });
};
