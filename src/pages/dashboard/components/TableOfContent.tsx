import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { useCallback, useMemo } from 'react';
import { FinishAppointment } from '@/pages/dashboard/components/FinishAppointment.tsx';
import { getHoursAndMinutes } from '@/lib/utils.ts';
import { Appointment, FinishedAppointment } from '@/types/appointment.ts';
import { FilterDropdown } from '@/pages/dashboard/components/FilterDropdown.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx';
import { useGetAppointments } from '@/api/useGetAppointments.tsx';

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
          <TableHead className="hidden sm:table-cell">Tip</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead>Vreme dolaska</TableHead>
          <TableHead className="hidden md:table-cell">Vreme odlaska</TableHead>
          <TableHead className="text-right">Akcije</TableHead>
        </TableRow>
      </TableHeader>
    );
  }, []);

  const renderTableRowContent = useCallback((appointment: Appointment | FinishedAppointment, index: number) => {
    return (
      <TableRow className={index % 2 === 0 ? 'bg-accent' : ''} key={appointment.id}>
        <TableCell>
          <div className="font-medium">{appointment.child_name}</div>
        </TableCell>
        <TableCell className="hidden sm:table-cell">{appointment.type === 'play' ? 'Igranje' : 'Čuvanje'}</TableCell>
        <TableCell className="hidden sm:table-cell">
          {appointment.status === 'ongoing' ? 'U toku' : 'Završeno'}
        </TableCell>
        <TableCell>{`${getHoursAndMinutes(new Date(appointment.start_time), true)}`}</TableCell>
        <TableCell className="hidden sm:table-cell">
          {appointment.end_time && `${getHoursAndMinutes(new Date(appointment.end_time), true)}`}
        </TableCell>
        <TableCell
          className="text-right"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <FinishAppointment appointment={appointment} />
        </TableCell>
      </TableRow>
    );
  }, []);

  const renderTableRow = useCallback(
    (appointment: Appointment | FinishedAppointment, index: number) => {
      return (
        <Sheet>
          <SheetTrigger asChild>{renderTableRowContent(appointment, index)}</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
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
        <div className="ml-auto flex items-center gap-2">
          <FilterDropdown />
        </div>
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
