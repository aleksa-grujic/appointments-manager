import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button.tsx';
import { CircleCheckBig } from 'lucide-react';
import { Label } from '@/components/ui/label.tsx';
import { TimePickerInput } from '@/components/ui/time-picker-input.tsx';
import React, { useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Appointment } from '@/types/appointment.ts';
import { Separator } from '@/components/ui/separator.tsx';
import { dateSecondsTo0, getHoursRoundedTo30 } from '@/lib/utils.ts';
import { useMutateAppointment } from '@/api/useMutateAppointment.tsx';
import { formatISO } from 'date-fns';

type Product = {
  name: string;
  displayName: string;
  price: number;
  duration: number;
  count?: number;
};

const regularPlay: Product = {
  name: 'regular-play',
  displayName: 'Igranje',
  price: 350,
  duration: 1.5,
  count: 1,
};

const specialPlay: Product = {
  name: 'special-play',
  displayName: 'Specijalno igranje',
  price: 100,
  duration: 0.5,
  count: 1,
};

const regularBabysitting: Product = {
  name: 'regular-babysitting',
  displayName: 'Čuvanje',
  price: 500,
  duration: 1,
};

export const FinishAppointment = ({ appointment }: { appointment: Appointment }) => {
  const startMinuteRef = React.useRef<HTMLInputElement>(null);
  const startHourRef = React.useRef<HTMLInputElement>(null);

  const endMinuteRef = React.useRef<HTMLInputElement>(null);
  const endHourRef = React.useRef<HTMLInputElement>(null);

  const [startDateTime, setStartDate] = React.useState(new Date(appointment.start_time));
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  const [isFree, setIsFree] = React.useState(false);

  const [totalHours, setTotalHours] = React.useState('0');
  const [totalPrice, setTotalPrice] = React.useState('0');
  const [products, setProducts] = React.useState<Product[]>([]);

  const { mutate: updateAppointment } = useMutateAppointment(true);

  const typeContentName = appointment.type === 'play' ? 'igranje' : 'čuvanje';
  const calculatePrice = useCallback(() => {
    const products: Product[] = [];
    const diff = dateSecondsTo0(endDate).getTime() - dateSecondsTo0(startDateTime).getTime();
    // round to 30 minutes interval but if it's exactly hour round to 1
    const hours = getHoursRoundedTo30(diff);

    if (isFree) {
      setTotalHours(hours.toFixed(1));
      setTotalPrice('0');
      setProducts([]);
      return;
    }

    if (appointment.type === 'babysitting') {
      products.push({
        ...regularBabysitting,
        count: hours <= 1 ? 1 : Math.ceil(hours),
      });
    } else {
      products.push(regularPlay);
      if (hours > 1.5) {
        const specialHours = hours - regularPlay.duration;
        const specialPlayCount = Math.ceil(specialHours / specialPlay.duration);

        products.push({
          ...specialPlay,
          count: specialPlayCount,
        });
      }
    }

    setTotalHours(hours.toFixed(1));
    setTotalPrice(products.reduce((acc, product) => acc + product.price * (product.count || 1), 0).toFixed(0));
    setProducts(products);
  }, [appointment.type, endDate, isFree, startDateTime]);

  React.useEffect(() => {
    calculatePrice();
  }, [endDate, calculatePrice]);

  const finishAppointment = useCallback(() => {
    const finishedAppointment: Appointment = {
      ...appointment,
      free: isFree,
      end_time: formatISO(endDate),
      updated_at: formatISO(new Date()),
      status: 'completed',
    };
    updateAppointment(finishedAppointment);
  }, [appointment, isFree, endDate, updateAppointment]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CircleCheckBig className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Završi {typeContentName}?</DialogTitle>
          <DialogDescription>Proverite sve podatke pre nego sto zatvorite unos.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Pocetno vreme</Label>
            <div className="flex items-end gap-2">
              <div className="grid gap-1 text-center">
                <TimePickerInput
                  picker="hours"
                  date={startDateTime}
                  setDate={setStartDate}
                  ref={startHourRef}
                  disabled
                  onRightFocus={() => startMinuteRef.current?.focus()}
                />
              </div>
              <div className="grid gap-1 text-center">
                <TimePickerInput
                  picker="minutes"
                  date={startDateTime}
                  setDate={setStartDate}
                  ref={startMinuteRef}
                  disabled
                  onLeftFocus={() => startHourRef.current?.focus()}
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Zavrsno vreme</Label>
            <div className="flex items-end gap-2">
              <div className="grid gap-1 text-center">
                <TimePickerInput
                  picker="hours"
                  date={endDate}
                  setDate={(date) => {
                    if (date < startDateTime) return;
                    setEndDate(date);
                  }}
                  ref={endHourRef}
                  onRightFocus={() => endMinuteRef.current?.focus()}
                />
              </div>
              <div className="grid gap-1 text-center">
                <TimePickerInput
                  picker="minutes"
                  date={endDate}
                  setDate={(date) => {
                    if (date < startDateTime) return;
                    setEndDate(date);
                  }}
                  ref={endMinuteRef}
                  onLeftFocus={() => endHourRef.current?.focus()}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isFree" value={isFree ? 'on' : 'off'} onClick={() => setIsFree(!isFree)} />
          <label
            htmlFor="isFree"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Besplatno {appointment.type === 'play' ? 'igranje' : 'čuvanje'}?
          </label>
        </div>
        <div className={'grid gap-2'}>
          <div className="grid grid-cols-2">
            <span className={'font-semibold'}>Ukupno ({totalHours}h)</span>
            <span className={'text-right font-semibold'}>{totalPrice} din</span>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-1">
            {products.map((product, index) => (
              <React.Fragment key={product.name + index}>
                <span className={'italic font-light'}>
                  {product.count}x {product.displayName} {product.duration}h
                </span>
                <span className={'text-right italic font-light'}>{product.price * (product.count || 1)} din</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="default" className={'w-full'} onClick={finishAppointment}>
              Završi {typeContentName}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
