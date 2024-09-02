import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { TimePickerInput } from '@/components/ui/time-picker-input.tsx';
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useMutateAppointment } from '@/api/useMutateAppointment.tsx';
import { formatISO } from 'date-fns';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';

export const AddNewInputDialog = () => {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  const [date, setDate] = React.useState<Date>(new Date());
  const [kidName1, setKidName1] = React.useState<string>('');
  const [kidName2, setKidName2] = React.useState<string>('');
  const [kidName3, setKidName3] = React.useState<string>('');
  const [parentName, setParentName] = React.useState<string>('');
  const [isBabysitting, setIsBabysitting] = React.useState<boolean>(false);
  const [notes, setNotes] = React.useState<string>('');
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [kidCount, setKidCount] = React.useState<string>('1');
  const [tableNumber, setTableNumber] = React.useState<string>('');

  const { mutate: addAppointment } = useMutateAppointment();

  const openPopup = () => {
    setDate(new Date());
  };

  const cleanup = () => {
    setKidName1('');
    setParentName('');
    setIsBabysitting(false);
    setNotes('');
    setPhoneNumber('');
    setKidCount('1');
  };
  const createNewEntry = () => {
    addAppointment({
      start_time: formatISO(date),
      child_name: kidName1,
      type: isBabysitting ? 'babysitting' : 'play',
      status: 'ongoing',
      notes: notes,
      phone_number: phoneNumber,
      parent_name: parentName,
      child_count: kidCount,
      child_name2: kidName2,
      child_name3: kidName3,
      table_number: tableNumber,
    });
    cleanup();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" onClick={openPopup}>
          Dodaj novi unos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj novi unos</DialogTitle>
          <DialogDescription>Unesite podatke o novom unosu</DialogDescription>
        </DialogHeader>

        <Input
          placeholder={`Unesite ime ${kidCount !== '1' ? 'prvog ' : ''}deteta`}
          value={kidName1}
          onChange={(e) => setKidName1(e.target.value)}
        />
        {(kidCount === '2' || kidCount === '3') && (
          <Input
            placeholder="Unesite ime drugog deteta"
            value={kidName2}
            onChange={(e) => setKidName2(e.target.value)}
          />
        )}
        {kidCount === '3' && (
          <Input
            placeholder="Unesite ime trećeg deteta"
            value={kidName3}
            onChange={(e) => setKidName3(e.target.value)}
          />
        )}
        <Input placeholder="Unesite ime roditelja" value={parentName} onChange={(e) => setParentName(e.target.value)} />
        <div className="flex gap-6 justify-between md:justify-start">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Broj dece</div>
            <ToggleGroup
              type="single"
              value={kidCount}
              onValueChange={(count) => setKidCount(count)}
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

          <div className="flex gap-2">
            <div className="grid gap-2 text-center">
              <Label htmlFor="hours" className="text-sm">
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
            <div className="grid gap-2 text-center">
              <Label htmlFor="minutes" className="text-sm">
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
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="table_number" className="text-sm">
              Broj stola
            </Label>
            <Input
              type="number"
              className="w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
              id="table_number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="cuvanje"
            value={isBabysitting ? 'on' : 'off'}
            onClick={() => setIsBabysitting(!isBabysitting)}
          />
          <Label htmlFor="cuvanje">Da li je dete na čuvanju?</Label>
        </div>
        {isBabysitting && (
          <Input placeholder="Broj telefona" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        )}
        <Textarea placeholder="Napomene:" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive" onClick={cleanup}>
              Obriši
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={createNewEntry}>Napravi unos</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
