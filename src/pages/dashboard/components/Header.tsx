import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { AddNewInputDialog } from '@/components/app-specific/AddNewInputDialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useGetAppointments } from '@/api/useGetAppointments.ts';
import { calculatePrice, calculateProducts } from '@/lib/calculate_price.ts';
import { useMemo } from 'react';

export const Header = () => {
  const { data: appointments, refetch } = useGetAppointments({});

  const totalAppointments = useMemo(
    () =>
      appointments?.reduce((acc, appointment) => {
        return acc + (appointment.child_count ? parseInt(appointment.child_count) : 1);
      }, 0),
    [appointments],
  );

  const ongoingAppointments = useMemo(
    () =>
      appointments
        ?.filter((appointment) => appointment.status === 'ongoing')
        .reduce((acc, appointment) => {
          return acc + (appointment.child_count ? parseInt(appointment.child_count) : 1);
        }, 0),
    [appointments],
  );

  const totalMiniAppointments = useMemo(
    () => {
      const miniProducts = appointments?.reduce((acc, appointment) => {
        if (appointment.status === 'completed') {
          const products = calculateProducts(appointment);
          const miniProduct = products.find((product) => product.name === 'special-play');
          return acc + (miniProduct?.count ?? 0);
        }
        return acc
      }, 0);
      return miniProducts || 0;
    },
  [appointments]);
  const totalIncome = useMemo(
    () =>
      appointments?.reduce((acc, appointment) => {
        if (appointment.status === 'completed') {
          const price = calculatePrice(appointment);
          return acc + Number(price);
        }
        return acc;
      }, 0),
    [appointments],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Praćenje igranja i čuvanja Bubica</CardTitle>
          <CardDescription className="text-balance leading-relaxed">
            Dodajte nove unose, pratite broj dece na igranju i čuvanju u igraonici Bubica.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-row flex-wrap gap-2">
          <AddNewInputDialog />
          <Button variant="outline" onClick={() => refetch()}>
            <ReloadIcon className="mr-2" /> Osvezi tabelu
          </Button>
        </CardFooter>
      </Card>
      <Card className="sm:col-span-2 p-6">
        <div className="grid grid-rows-3 divide-y divide-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground italic">Trenutno dece</p>
            <p className="text-lg italic">{ongoingAppointments}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground italic">Ukupno danas</p>
            <p className="text-lg italic">{totalAppointments}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground italic">Ukupno naplaćeno mini igranja</p>
            <p className="text-lg italic">{totalMiniAppointments}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground italic">Ukupno naplaćeno</p>
            <p className="text-lg italic">{totalIncome} din</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
