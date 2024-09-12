import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Fragment, useCallback, useMemo } from 'react';
import { getHoursAndMinutes } from '@/lib/utils.ts';
import { AppointmentSheet } from '@/features/appointment-sheet/AppointmentSheet.tsx';
import { Tables } from '@/types/supabase.ts';
import { clsx } from 'clsx';

export const SkeletonRow = () => {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="h-4 bg-gray-300 rounded"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-300 rounded"></div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="h-4 bg-gray-300 rounded"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-300 rounded"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-300 rounded"></div>
      </TableCell>
    </TableRow>
  );
};

type AppointmentTableProps = {
  appointments: Tables<'appointments'>[] | undefined;
  isLoading: boolean;
};

export const AppointmentTable = ({ appointments, isLoading }: AppointmentTableProps) => {
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
          <TableHead>Vreme odlaska</TableHead>
        </TableRow>
      </TableHeader>
    );
  }, []);

  const renderTableRowContent = useCallback((appointment: Tables<'appointments'>, index: number) => {
    return (
      <TableRow
        className={clsx({
          'bg-accent': index % 2 === 0,
          'bg-green-100': appointment.status === 'completed',
        })}
      >
        <TableCell>
          <div className="font-medium">
            {appointment.child_name || '-'}

            {appointment.child_count === '2' ? (
              <>
                <br />
                {appointment.child_name2 || '-'}
              </>
            ) : (
              ''
            )}
            <br />
            {appointment.child_count === '3' ? (
              <>
                <br />
                {appointment.child_name3 || '-'}
              </>
            ) : (
              ''
            )}
          </div>
        </TableCell>
        <TableCell>{appointment.table_number || '-'}</TableCell>
        <TableCell className="hidden sm:table-cell">
          {appointment.status === 'ongoing' ? 'U toku' : 'Završeno'}
        </TableCell>
        <TableCell>{`${getHoursAndMinutes(new Date(appointment.start_time), true)}`}</TableCell>
        <TableCell>
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
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Igranje</CardTitle>
            <CardDescription>Deca koja su na igranju</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              {renderTableHeader()}
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)
                  : playAppointments?.map((appointment, index) => (
                      <Fragment key={appointment.id}>{renderTableRow(appointment, index)}</Fragment>
                    ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="babysitting">
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Čuvanje</CardTitle>
            <CardDescription>Deca koja su na čuvanju</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              {renderTableHeader()}
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)
                  : babysittingAppointments?.map((appointment, index) => (
                      <Fragment key={appointment.id}>{renderTableRow(appointment, index)}</Fragment>
                    ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
