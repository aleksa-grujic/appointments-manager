import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { useCallback, useMemo } from 'react';
import { getHoursAndMinutes } from '@/lib/utils.ts';
import { useGetAppointments } from '@/api/useGetAppointments.tsx';
import { AppointmentSheet } from '@/features/appointment-sheet/AppointmentSheet.tsx';
import { Tables } from '@/types/supabase.ts';

export const TableOfContent = () => {
  const { data: appointments } = useGetAppointments({});

  const playAppointments = useMemo(
    () => appointments?.filter((appointment) => appointment.type === 'play'),
    [appointments],
  );
  const babysittingAppointments = useMemo(
    () => appointments?.filter((appointment) => appointment.type === 'babysitting'),
    [appointments],
  );

  const renderTableHeader = useCallback(() => {
    return (
      <TableHeader>
        <TableRow>
          <TableHead>Ime deteta</TableHead>
          <TableHead>Broj stola</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead>Vreme dolaska</TableHead>
          <TableHead className="hidden md:table-cell">Vreme odlaska</TableHead>
        </TableRow>
      </TableHeader>
    );
  }, []);

  const renderTableRowContent = useCallback((appointment: Tables<'appointments'>, index: number) => {
    return (
      <TableRow className={index % 2 === 0 ? 'bg-accent' : ''} key={appointment.id}>
        <TableCell>
          <div className="font-medium">{appointment.child_name || '-'}</div>
        </TableCell>
        <TableCell>{appointment.table_number || '-'}</TableCell>
        <TableCell className="hidden sm:table-cell">
          {appointment.status === 'ongoing' ? 'U toku' : 'Završeno'}
        </TableCell>
        <TableCell>{`${getHoursAndMinutes(new Date(appointment.start_time), true)}`}</TableCell>
        <TableCell className="hidden sm:table-cell">
          {appointment.end_time ? `${getHoursAndMinutes(new Date(appointment.end_time), true)}` : '-'}
        </TableCell>
      </TableRow>
    );
  }, []);

  const renderTableRow = useCallback(
    (appointment: Tables<'appointments'>, index: number) => {
      return <AppointmentSheet trigger={renderTableRowContent(appointment, index)} appointment={appointment} />;
    },
    [renderTableRowContent],
  );

  return (
    <Tabs defaultValue="play">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="play">Igranje</TabsTrigger>
          <TabsTrigger value="babysitting">Čuvanje</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="play">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Igranje</CardTitle>
            <CardDescription>Deca koja su na igranju</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              {renderTableHeader()}
              <TableBody>
                {playAppointments?.map((appointment, index) => <>{renderTableRow(appointment, index)}</>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="babysitting">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Čuvanje</CardTitle>
            <CardDescription>Deca koja su na čuvanju</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              {renderTableHeader()}
              <TableBody>
                {babysittingAppointments?.map((appointment, index) => <>{renderTableRow(appointment, index)}</>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
