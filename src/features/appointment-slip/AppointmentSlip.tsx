import { Label } from '@/components/ui/label.tsx';
import { TimePickerInput } from '@/components/ui/time-picker-input.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { useMutateAppointment } from '@/api/useMutateAppointment.tsx';
import { dateSecondsTo0, getHoursRoundedTo30 } from '@/lib/utils.ts';
import { formatISO } from 'date-fns';
import { Input } from '@/components/ui/input.tsx';
import { Plus, X } from 'lucide-react';
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx';
import { TabsContent } from '@/components/ui/tabs.tsx';
import { Tables } from '@/types/supabase.ts';

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

const AppointmentSlip = ({ appointment }: { appointment: Tables<'appointments'> }) => {
  const startMinuteRef = React.useRef<HTMLInputElement>(null);
  const startHourRef = React.useRef<HTMLInputElement>(null);

  const endMinuteRef = React.useRef<HTMLInputElement>(null);
  const endHourRef = React.useRef<HTMLInputElement>(null);

  const [startDateTime, setStartDate] = React.useState(new Date(appointment.start_time));
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  const [isFree, setIsFree] = React.useState(false);
  const [drinkCost, setDrinkCost] = React.useState('');

  const [showDrinkInput, setShowDrinkInput] = React.useState(false);

  const [drinks, setDrinks] = React.useState<number[]>(appointment.drink_cost || []);

  const { mutate: updateAppointment } = useMutateAppointment(true);

  const typeContentName = appointment.type === 'play' ? 'igranje' : 'čuvanje';

  const totalHours = useMemo(() => {
    const diff = dateSecondsTo0(endDate).getTime() - dateSecondsTo0(startDateTime).getTime();
    // round to 30 minutes interval but if it's exactly hour round to 1
    return getHoursRoundedTo30(diff);
  }, [endDate, startDateTime]);

  const products = useMemo(() => {
    if (appointment.type === 'babysitting') {
      return [
        {
          ...regularBabysitting,
          count: totalHours <= 1 ? 1 : Math.ceil(totalHours),
        },
      ];
    }
    const products: Product[] = [regularPlay];
    if (totalHours > 1.5) {
      const specialHours = totalHours - regularPlay.duration;
      const specialPlayCount = Math.ceil(specialHours / specialPlay.duration);

      products.push({
        ...specialPlay,
        count: specialPlayCount,
      });
    }
    return products;
  }, [totalHours, appointment.type]);

  const totalPrice = useMemo(() => {
    if (isFree) {
      return '0';
    }
    const drinksPrice = drinks.reduce((acc, drink) => acc + Number(drink), 0);
    const productsPrice = products.reduce((acc, product) => acc + product.price * (product.count || 1), 0);
    return (drinksPrice + productsPrice).toFixed(0);
  }, [isFree, drinks, products]);

  const finishAppointment = useCallback(() => {
    const finishedAppointment: Tables<'appointments'> = {
      ...appointment,
      free: isFree,
      end_time: formatISO(endDate),
      updated_at: formatISO(new Date()),
      status: 'completed',
      drink_cost: drinks.map((drink) => Number(drink)),
    };
    updateAppointment(finishedAppointment);
  }, [appointment, isFree, endDate, drinks, updateAppointment]);

  const openDrinkInput = () => {
    if (showDrinkInput) {
      addDrink();
    } else {
      setShowDrinkInput(true);
    }
  };

  const addDrink = () => {
    if (Number(drinkCost) > 0) {
      setDrinks([...drinks, Number(drinkCost)]);
    }
    setDrinkCost('');
    setShowDrinkInput(false);
  };

  const cancelDrink = () => {
    setDrinkCost('');
    setShowDrinkInput(false);
  };

  const removeDrink = (index: number) => {
    const newDrinks = drinks.filter((_, i) => i !== index);
    setDrinks(newDrinks);
  };

  useEffect(() => {
    return () => {
      if (appointment.drink_cost !== drinks) {
        console.log('this is the drink cost', drinks);
        updateAppointment({
          ...appointment,
          drink_cost: drinks,
        });
      }
    };
  }, [drinks]);

  return (
    <TabsContent value="slip">
      <SheetHeader className="mb-3">
        <SheetTitle>Račun</SheetTitle>
        <SheetDescription>Ažurirajte ili zatvorite račun ovde.</SheetDescription>
      </SheetHeader>
      <div className="space-y-4">
        <div className="flex justify-around">
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
          <Label htmlFor="isFree">Besplatno {appointment.type === 'play' ? 'igranje' : 'čuvanje'}?</Label>
        </div>
        <div className={'grid gap-2'}>
          <div className="grid grid-cols-2 gap-1">
            <span className={'font-semibold'}>Ukupno ({totalHours}h)</span>
            <span className={'text-right font-semibold'}>{totalPrice} din</span>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-2">
            {products.map((product, index) => (
              <React.Fragment key={product.name + index}>
                <span className={'italic font-light col-span-2'}>
                  {product.count}x {product.displayName} {product.duration}h
                </span>
                <span className={'text-right italic font-light'}>{product.price * (product.count || 1)} din</span>
              </React.Fragment>
            ))}
            {drinks.map((drink, index) => (
              <React.Fragment key={drink + index}>
                <span className={'italic font-light'}>Piće</span>
                <span className="gap-2 flex justify-end items-center col-span-2">
                  <span className={'italic font-light'}>{drink} din</span>
                  <Button variant="destructive" className="p-0 w-5 h-5" onClick={() => removeDrink(index)}>
                    <X className="size-4" />
                  </Button>
                </span>
              </React.Fragment>
            ))}

            {showDrinkInput && (
              <>
                <span className={'italic font-light'}>Piće</span>
                <span className="gap-2 flex justify-end col-span-2">
                  <Input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setDrinkCost(e.target.value)}
                    value={drinkCost}
                    className="w-20 h-5 px-2"
                  />
                  <Button variant="default" className="p-0 w-5 h-5" onClick={addDrink}>
                    <Plus className="size-4" />
                  </Button>
                  <Button variant="destructive" className="p-0 w-5 h-5" onClick={cancelDrink}>
                    <X className="size-4" />
                  </Button>
                </span>
              </>
            )}
          </div>
        </div>
        <Button type="button" variant="outline" className={'w-full'} onClick={openDrinkInput}>
          Dodaj cenu pića
        </Button>
        <Button type="button" variant="default" className={'w-full'} onClick={finishAppointment}>
          Završi {typeContentName}
        </Button>
      </div>
    </TabsContent>
  );
};

export default AppointmentSlip;
