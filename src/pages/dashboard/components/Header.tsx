import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { AddNewInputDialog } from '@/components/app-specific/add-new-input-dialog/AddNewInputDialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useGetAppointments } from '@/api/useGetAppointments.tsx';

export const Header = () => {
  const { data: appointments, refetch } = useGetAppointments({});

  const totalAppointments = appointments?.length;
  const ongoingAppointments = appointments?.filter((appointment) => appointment.status === 'ongoing').length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
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
      <Card>
        <CardHeader>
          <CardDescription>Trenutno dece u igraonici</CardDescription>
          <CardTitle className="text-4xl">{ongoingAppointments}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Ukupno danas</CardDescription>
          <CardTitle className="text-4xl">{totalAppointments}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
