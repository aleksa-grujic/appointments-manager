import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import React, { useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useMutateAppointment } from '@/api/useMutateAppointment.ts';
import { formatISO } from 'date-fns';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { useForm } from 'react-hook-form';
import { TablesInsert } from '@/types/supabase.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { appointmentSchema } from '@/schemas/appointmentSchema.ts';
import { FormField } from '@/components/ui/form.tsx';
import { TimeInput } from '@/components/app-specific/TimeInput.tsx';

export const AddNewInputDialog = () => {
  const [open, setOpen] = React.useState(false);
  const { control, handleSubmit, watch, reset } = useForm<TablesInsert<'appointments'>>({
    defaultValues: {
      start_time: formatISO(new Date()),
      type: 'play',
      status: 'ongoing',
      child_count: '1',
    },
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    reset();
  }, [open, reset]);

  const kidCount = watch('child_count');
  const isBabysitting = watch('type') === 'babysitting';

  const { mutate: addAppointment } = useMutateAppointment();

  const onSubmit = (data: TablesInsert<'appointments'>) => {
    addAppointment({
      appointment: data,
    });
    setOpen(false);
  };

  const onClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Dodaj novi unos</Button>
      </DialogTrigger>
      <DialogContent renderCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between">
            <div>
              <DialogTitle>Dodaj novi unos</DialogTitle>
              <DialogDescription>Unesite podatke o novom unosu</DialogDescription>
            </div>
            <div className={'flex gap-4'}>
              <Button variant="destructive" onClick={onClose}>
                Obriši
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>Napravi unos</Button>
            </div>
          </div>
        </DialogHeader>
        <FormField
          name={'child_name'}
          control={control}
          render={({ field }) => (
            <Input
              placeholder={`Unesite ime ${kidCount !== '1' ? 'prvog ' : ''}deteta`}
              {...field}
              value={field.value || ''}
            />
          )}
        />

        {(kidCount === '2' || kidCount === '3') && (
          <FormField
            name={'child_name2'}
            control={control}
            render={({ field }) => (
              <Input placeholder={`Unesite ime drugog deteta`} {...field} value={field.value || ''} />
            )}
          />
        )}

        {kidCount === '3' && (
          <FormField
            name={'child_name3'}
            control={control}
            render={({ field }) => (
              <Input placeholder={`Unesite ime trećeg deteta`} {...field} value={field.value || ''} />
            )}
          />
        )}
        <FormField
          render={({ field }) => <Input placeholder={`Unesite ime roditelja`} {...field} value={field.value || ''} />}
          name={'parent_name'}
          control={control}
        />
        <div className="flex gap-6 justify-between md:justify-start">
          <FormField
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor={'child_count'} className="text-sm">
                  Broj dece
                </Label>
                <ToggleGroup
                  type="single"
                  id="child_count"
                  value={field.value || '1'}
                  onValueChange={(count) => field.onChange(count)}
                  className="justify-start"
                >
                  <ToggleGroupItem value="1" aria-label="Toggle 1">
                    1
                  </ToggleGroupItem>
                  <ToggleGroupItem value="2" aria-label="Toggle 2">
                    2
                  </ToggleGroupItem>
                  <ToggleGroupItem value="3" aria-label="Toggle 3">
                    3
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}
            name={'child_count'}
            control={control}
          />

          <FormField
            render={({ field }) => (
              <TimeInput
                value={field.value ? new Date(field.value) : new Date()}
                onChange={(date) => field.onChange(formatISO(date))}
                hourLabel={'Časovi'}
                minuteLabel={'Minuti'}
              />
            )}
            name={'start_time'}
            control={control}
          />
          <FormField
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="table_number" className="text-sm">
                  Broj stola
                </Label>
                <Input
                  type="number"
                  className="w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
                  id="table_number"
                  {...field}
                  value={field.value || ''}
                />
              </div>
            )}
            name={'table_number'}
            control={control}
          />
        </div>

        <FormField
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="babysitting"
                value={field?.value === 'babysitting' ? 'on' : 'off'}
                onCheckedChange={(checked) => field.onChange(checked ? 'babysitting' : 'play')}
              />
              <Label htmlFor="babysitting">Da li je dete na čuvanju?</Label>
            </div>
          )}
          name={'type'}
          control={control}
        />

        {isBabysitting && (
          <FormField
            render={({ field }) => <Input placeholder="Broj telefona" {...field} value={field.value || ''} />}
            name={'phone_number'}
            control={control}
          />
        )}
        <FormField
          render={({ field }) => <Textarea placeholder="Napomene:" {...field} value={field.value || ''} />}
          name={'notes'}
          control={control}
        />
      </DialogContent>
    </Dialog>
  );
};
