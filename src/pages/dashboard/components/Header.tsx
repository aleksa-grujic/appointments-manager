import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { AddNewInputDialog } from '@/components/app-specific/AddNewInputDialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useGetAppointments } from '@/api/useGetAppointments.ts';

export const Header = () => {
  const { data: appointments, refetch } = useGetAppointments({});

  const totalAppointments = appointments?.reduce((acc, appointment) => {
    return acc + (appointment.child_count ? parseInt(appointment.child_count) : 1);
  }, 0);
  const ongoingAppointments = appointments
    ?.filter((appointment) => appointment.status === 'ongoing')
    .reduce((acc, appointment) => {
      return acc + (appointment.child_count ? parseInt(appointment.child_count) : 1);
    }, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Praćenje igranja i čuvanja Bubica</CardTitle>
          <CardDescription className="text-balance max-w-lg leading-relaxed">
            Dodajte nove unose, pratite broj dece na igranju i čuvanju u igraonici Bubica.
          </CardDescription>
        </CardHeader>
        <CardFooter className={'flex-row flex-wrap gap-2'}>
          <AddNewInputDialog />
          <Button variant={'outline'} onClick={() => refetch()}>
            <ReloadIcon className={'mr-2'} /> Osvezi tabelu
          </Button>
        </CardFooter>
      </Card>
      <Card className="sm:col-span-2 p-6">
        <div className="flex justify-around h-full">
          <div className="flex flex-col">
            <p className="text-sm">Trenutno dece</p>
            <p className="text-3xl mt-2">{ongoingAppointments}</p>
          </div>
          <div className="border-r border-gray-200 h-full" />
          <div className="flex flex-col">
            <p className="text-sm">Ukupno danas</p>
            <p className="text-3xl mt-2">{totalAppointments}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
