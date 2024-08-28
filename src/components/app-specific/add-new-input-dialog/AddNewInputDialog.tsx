import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Clock } from 'lucide-react';
import { Label } from '@/components/ui/label.tsx';
import { TimePickerInput } from '@/components/ui/time-picker-input.tsx';
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useMutateAppointment } from '@/api/useMutateAppointment.tsx';
import { formatISO } from 'date-fns';

export const AddNewInputDialog = () => {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  const [date, setDate] = React.useState<Date>(new Date());
  const [kidName, setKidName] = React.useState<string>('');
  const [parentName, setParentName] = React.useState<string>('');
  const [isBabysitting, setIsBabysitting] = React.useState<boolean>(false);
  const [notes, setNotes] = React.useState<string>('');
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');

  const { mutate: addAppointment } = useMutateAppointment();

  const openPopup = () => {
    setDate(new Date());
  };

  const cleanup = () => {
    setKidName('');
    setParentName('');
    setIsBabysitting(false);
    setNotes('');
    setPhoneNumber('');
  };
  const createNewEntry = () => {
    addAppointment({
      start_time: formatISO(date),
      child_name: kidName,
      type: isBabysitting ? 'babysitting' : 'play',
      status: 'ongoing',
      notes: notes,
      phone_number: phoneNumber,
      parent_name: parentName,
    });
    cleanup();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="default" onClick={openPopup}>
          Dodaj novi unos
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dodaj novi unos</AlertDialogTitle>
          <AlertDialogDescription>Unesite podatke o novom unosu</AlertDialogDescription>
        </AlertDialogHeader>

        <Input placeholder="Unesite ime deteta" value={kidName} onChange={(e) => setKidName(e.target.value)} />
        <Input placeholder="Unesite ime roditelja" value={parentName} onChange={(e) => setParentName(e.target.value)} />
        <div className="flex items-end gap-2">
          <div className="grid gap-1 text-center">
            <Label htmlFor="hours" className="text-xs">
              Časovi
            </Label>
            <TimePickerInput
              picker="hours"
              date={date}
              setDate={setDate}
              ref={hourRef}
              onRightFocus={() => minuteRef.current?.focus()}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="minutes" className="text-xs">
              Minuti
            </Label>
            <TimePickerInput
              picker="minutes"
              date={date}
              setDate={setDate}
              ref={minuteRef}
              onLeftFocus={() => hourRef.current?.focus()}
            />
          </div>
          <div className="flex h-10 items-center">
            <Clock className="ml-2 h-4 w-4" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="cuvanje"
            value={isBabysitting ? 'on' : 'off'}
            onClick={() => setIsBabysitting(!isBabysitting)}
          />
          <label
            htmlFor="cuvanje"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Da li je dete na čuvanju?
          </label>
        </div>
        {isBabysitting && (
          <Input placeholder="Broj telefona" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        )}
        <Textarea placeholder="Napomene:" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cleanup}>Obriši</AlertDialogCancel>
          <AlertDialogAction onClick={createNewEntry}>Napravi unos</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
