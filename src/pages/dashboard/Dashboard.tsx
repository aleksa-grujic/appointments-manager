import { Header } from '@/pages/dashboard/components/Header.tsx';
import { AppointmentTable } from '@/components/app-specific/AppointmentTable.tsx';
import { useGetAppointments } from '@/api/useGetAppointments.ts';

export function Dashboard() {
  const { data: appointments, isFetching } = useGetAppointments({});

  return (
    <div className="flex min-h-screen w-full flex-col p-6">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-10">
        <main className="grid flex-1 items-start sm:gap-4 sm:p-4 sm:px-6 sm:py-0 sm:pb-4 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Header />
            <AppointmentTable appointments={appointments} isLoading={isFetching} />
          </div>
        </main>
      </div>
    </div>
  );
}
