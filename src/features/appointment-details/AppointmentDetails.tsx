import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx';
import AppointmentDetailsRow from '@/features/appointment-details/components/AppointmentDetailsRow.tsx';
import { getHoursAndMinutes } from '@/lib/utils.ts';
import { TabsContent } from '@/components/ui/tabs.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Pencil } from 'lucide-react';
import { Tables } from '@/types/supabase.ts';

type AppointmentDetailsProps = {
  appointment: Tables<'appointments'>;
};

const AppointmentDetails = ({ appointment }: AppointmentDetailsProps) => {
  return (
    <TabsContent value="details">
      <SheetHeader className="mb-3">
        <SheetTitle>
          <div className="flex justify-between items-center">
            <span>Detalji termina</span>
            <Button variant="ghost" className="p-1 w-7 h-7" onClick={() => {}}>
              <Pencil className="size-4" />
            </Button>
          </div>
        </SheetTitle>
        <SheetDescription>Detalji termina koji je u toku ili završen.</SheetDescription>
      </SheetHeader>
      <AppointmentDetailsRow label="Ime deteta" value={appointment.child_name} />
      {appointment.child_count === '2' ||
        (appointment.child_count === '3' && (
          <AppointmentDetailsRow label="Ime drugog deteta" value={appointment.child_name2} />
        ))}
      {appointment.child_count === '3' && (
        <AppointmentDetailsRow label="Ime trećeg deteta" value={appointment.child_name3} />
      )}
      <AppointmentDetailsRow label="Broj stola" value={appointment.table_number} />
      <AppointmentDetailsRow label="Ime roditelja" value={appointment.parent_name} />
      <AppointmentDetailsRow label="Broj telefona" value={appointment.phone_number} />
      <AppointmentDetailsRow label="Tip termina" value={appointment.type === 'play' ? 'Igranje' : 'Čuvanje'} />
      <AppointmentDetailsRow label="Status termina" value={appointment.status === 'ongoing' ? 'U toku' : 'Završen'} />
      <AppointmentDetailsRow
        label="Vreme dolaska"
        value={getHoursAndMinutes(new Date(appointment.start_time), true) as string}
      />
      {appointment.end_time && (
        <AppointmentDetailsRow
          label="Vreme odlaska"
          value={getHoursAndMinutes(new Date(appointment.end_time), true) as string}
        />
      )}
      {appointment.notes && <AppointmentDetailsRow label="Napomena" value={appointment.notes} />}
    </TabsContent>
  );
};

export default AppointmentDetails;
