import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx';
import AppointmentDetailsRow from '@/features/appointment-details/components/AppointmentDetailsRow.tsx';
import { TabsContent } from '@/components/ui/tabs.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Pencil } from 'lucide-react';
import { Tables, TablesInsert } from '@/types/supabase.ts';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema } from '@/schemas/appointmentSchema.ts';
import { Form } from '@/components/ui/form.tsx';
import { clsx } from 'clsx';
import { useMutateAppointment } from '@/api/useMutateAppointment.ts';
import { formatISO } from 'date-fns';
import { DeleteAppointment } from '@/components/app-specific/DeleteAppointment.tsx';

type AppointmentDetailsProps = {
  appointment: Tables<'appointments'>;
  onClose: () => void;
  isActiveTab: boolean;
};

const AppointmentDetails = ({ appointment, isActiveTab }: AppointmentDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateAppointment } = useMutateAppointment(true);

  const form = useForm<TablesInsert<'appointments'>>({
    values: appointment,
    resolver: zodResolver(appointmentSchema),
  });

  const childCount = form.watch('child_count');

  useEffect(() => {
    const onSubmit = async (data: TablesInsert<'appointments'>) => {
      updateAppointment({ appointment: { ...data, start_time: formatISO(data.start_time) } });
    };

    // on close form, if form is dirty, submit it
    if (!isEditing && form.formState.isDirty) {
      form.handleSubmit(onSubmit)();
    }
    if (!isActiveTab && form.formState.isDirty) {
      form.handleSubmit(onSubmit)();
    }
  }, [isActiveTab, form, isEditing, updateAppointment]);

  return (
    <TabsContent
      value="details"
      className={clsx({
        'mb-16': isEditing,
      })}
    >
      <SheetHeader className="mb-3">
        <SheetTitle>
          <div className="flex justify-between items-center">
            <span>Detalji termina</span>
            <Button variant="ghost" className="p-1 w-7 h-7" onClick={() => setIsEditing(!isEditing)}>
              <Pencil className="size-4" />
            </Button>
          </div>
        </SheetTitle>
        <SheetDescription>Detalji termina koji je u toku ili završen.</SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <AppointmentDetailsRow
          edit={false}
          label="Status termina"
          control={form.control}
          name="status"
          type="select"
          options={[
            { label: 'U toku', value: 'ongoing' },
            { label: 'Završen', value: 'finished' },
          ]}
        />
        <AppointmentDetailsRow
          label="Vreme dolaska"
          control={form.control}
          name="start_time"
          edit={isEditing}
          type={'time'}
        />
        {appointment.status === 'finished' && (
          <AppointmentDetailsRow
            label="Vreme odlaska"
            control={form.control}
            name="end_time"
            edit={isEditing}
            type={'time'}
          />
        )}
        <AppointmentDetailsRow
          name={'child_count'}
          control={form.control}
          label={'Broj dece'}
          edit={isEditing}
          type={'toggle'}
          options={[
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
          ]}
        />
        <AppointmentDetailsRow label="Ime deteta" control={form.control} name="child_name" edit={isEditing} />
        {(childCount === '2' || childCount === '3') && (
          <AppointmentDetailsRow label="Ime drugog deteta" control={form.control} name="child_name2" edit={isEditing} />
        )}
        {childCount === '3' && (
          <AppointmentDetailsRow label="Ime trećeg deteta" control={form.control} name="child_name3" edit={isEditing} />
        )}
        <AppointmentDetailsRow label="Broj stola" control={form.control} name="table_number" edit={isEditing} />
        <AppointmentDetailsRow label="Ime roditelja" control={form.control} name="parent_name" edit={isEditing} />
        <AppointmentDetailsRow label="Broj telefona" control={form.control} name="phone_number" edit={isEditing} />
        <AppointmentDetailsRow
          edit={isEditing}
          label="Tip termina"
          control={form.control}
          name="type"
          type="select"
          options={[
            { label: 'Igranje', value: 'play' },
            { label: 'Čuvanje', value: 'babysitting' },
          ]}
        />
        <AppointmentDetailsRow label="Beleška" control={form.control} name="notes" edit={isEditing} type={'textarea'} />
      </Form>
      <DeleteAppointment appointment={appointment} />
    </TabsContent>
  );
};

export default AppointmentDetails;
