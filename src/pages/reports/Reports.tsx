import React from 'react';
import { DateRangePicker } from '@/pages/reports/components/DateRangePicker.tsx';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button.tsx';
import { AppointmentTable } from '@/components/app-specific/AppointmentTable.tsx';
import { useGetAppointments } from '@/api/useGetAppointments.ts';

const today = () => {
  // set today
  const today = new Date();
  return {
    from: today,
    to: today,
  };
};

const thisWeek = () => {
  // set this week but from beginning of the week from Monday
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day == 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  return {
    from: monday,
    to: addDays(monday, 6),
  };
};

const yesterday = () => {
  const yesterday = addDays(new Date(), -1);
  return {
    from: yesterday,
    to: yesterday,
  };
};

const thisMonth = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    from: firstDay,
    to: lastDay,
  };
};

export function Reports() {
  const [date, setDate] = React.useState<DateRange | undefined>(thisWeek());

  const { data: appointments, isFetching } = useGetAppointments({
    startDate: date?.from,
    endDate: date?.to,
  });

  return (
    <div className="flex min-h-screen w-full flex-col p-6">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-10">
        <main className="grid flex-1 items-start sm:gap-4 sm:p-4 sm:px-6 sm:py-0 sm:pb-4 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="flex gap-4">
              <DateRangePicker date={date} setDate={setDate} />
              <Button variant="outline" onClick={() => setDate(today())}>
                Danas
              </Button>
              <Button variant="outline" onClick={() => setDate(yesterday())}>
                Juce
              </Button>
              <Button variant="outline" onClick={() => setDate(thisWeek())}>
                Ova nedelja
              </Button>
              <Button variant="outline" onClick={() => setDate(thisMonth())}>
                Ovaj mesec
              </Button>
            </div>
            <AppointmentTable appointments={appointments} isLoading={isFetching} />
          </div>
        </main>
      </div>
    </div>
  );
}
