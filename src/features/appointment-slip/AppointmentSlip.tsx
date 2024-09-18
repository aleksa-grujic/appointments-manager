import { Label } from '@/components/ui/label.tsx';
import { TimePickerInput } from '@/components/ui/time-picker-input.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { useMutateAppointment } from '@/api/useMutateAppointment.ts';
import { formatISO } from 'date-fns';
import { Input } from '@/components/ui/input.tsx';
import { Plus, X } from 'lucide-react';
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx';
import { TabsContent } from '@/components/ui/tabs.tsx';
import { Tables } from '@/types/supabase.ts';
import { calculatePrice, calculateProducts, calculateTotalHours } from '@/lib/calculate_price.ts';

const AppointmentSlip = ({
  appointment,
  onClose,
  isActiveTab,
}: {
  appointment: Tables<'appointments'>;
  onClose: () => void;
  isActiveTab: boolean;
}) => {
  const isFinished = appointment.status === 'completed';

  const startMinuteRef = React.useRef<HTMLInputElement>(null);
  const startHourRef = React.useRef<HTMLInputElement>(null);

  const endMinuteRef = React.useRef<HTMLInputElement>(null);
  const endHourRef = React.useRef<HTMLInputElement>(null);

  const [startDate, setStartDate] = React.useState(new Date(appointment.start_time));
  const [endDate, setEndDate] = React.useState<Date>(() => {
    if (appointment.end_time) {
      return new Date(appointment.end_time);
    }
    return new Date();
  });

  const [isFree, setIsFree] = React.useState(false);
  const [drinkCost, setDrinkCost] = React.useState('');
  const [tableNumber, setTableNumber] = React.useState(appointment.table_number?.toString() || '');

  const [showDrinkInput, setShowDrinkInput] = React.useState(false);
  const [showInitialSlipInput, setShowInitialSlipInput] = React.useState(false);
  const [initialSlip, setInitialSlip] = React.useState('');

  const { mutate: updateAppointment } = useMutateAppointment(true);

  const typeContentName = appointment.type === 'play' ? 'igranje' : 'čuvanje';

  const totalHours = useMemo(() => {
    return calculateTotalHours(appointment, startDate, endDate);
  }, [appointment, startDate, endDate]);

  const products = useMemo(() => {
    return calculateProducts(appointment, totalHours);
  }, [appointment, totalHours]);

  const totalPrice = useMemo(() => {
    if (isFree) {
      return '0';
    }
    return calculatePrice(appointment, products);
  }, [appointment, isFree, products]);

  const finishAppointment = useCallback(() => {
    const finishedAppointment: Tables<'appointments'> = {
      ...appointment,
      free: isFree,
      end_time: formatISO(endDate),
      updated_at: formatISO(new Date()),
      status: 'completed',
    };
    updateAppointment({ appointment: finishedAppointment });
    onClose();
  }, [appointment, isFree, endDate, updateAppointment, onClose]);

  const addInitialSlip = () => {
    const productsPrice = products.reduce((acc, product) => acc + product.price * (product.count || 1), 0);
    const initialCostOfDrinks = Number(initialSlip) - productsPrice;
    updateAppointment({
      appointment: {
        ...appointment,
        drink_cost: [...(appointment.drink_cost || []), initialCostOfDrinks],
      },
      disableToast: true,
    });

    setInitialSlip('');
    setShowInitialSlipInput(false);
  };

  const openDrinkInput = () => {
    if (showDrinkInput) {
      addDrink();
    } else {
      setShowDrinkInput(true);
    }
  };

  const closeInitialSlipInput = () => {
    setShowInitialSlipInput(false);
    setInitialSlip('');
  };

  const openInitialSlipInput = () => {
    if (showInitialSlipInput) {
      addInitialSlip();
    } else {
      setShowInitialSlipInput(true);
    }
  };

  const addDrink = () => {
    if (Number(drinkCost) > 0) {
      updateAppointment({
        appointment: {
          ...appointment,
          drink_cost: [...(appointment.drink_cost || []), Number(drinkCost)],
        },
        disableToast: true,
      });
    }
    setDrinkCost('');
    setShowDrinkInput(false);
  };

  const cancelDrink = () => {
    setDrinkCost('');
    setShowDrinkInput(false);
  };

  const removeDrink = (index: number) => {
    updateAppointment({
      appointment: {
        ...appointment,
        drink_cost: appointment.drink_cost?.filter((_, i) => i !== index),
      },
      disableToast: true,
    });
  };

  const updateTableNumber = useCallback(() => {
    if ((appointment.table_number || '') !== tableNumber) {
      updateAppointment({
        appointment: {
          ...appointment,
          table_number: tableNumber,
        },
      });
    }
  }, [appointment.table_number, tableNumber]);

  useEffect(() => {
    if (!isActiveTab) {
      updateTableNumber();
    }
  }, [isActiveTab, updateTableNumber]);

  return (
    <TabsContent value="slip">
      <SheetHeader className="mb-6 flex-row justify-between">
        <div className="flex flex-col justify-between">
          <SheetTitle>Račun</SheetTitle>
          <SheetDescription>Ažurirajte ili zatvorite račun ovde.</SheetDescription>
        </div>
        <div className="flex flex-col gap-2 !mt-0 items-end mr-1">
          <Label>Broj stola</Label>
          <Input
            type="number"
            value={tableNumber}
            disabled={isFinished}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-16 h-6"
          />
        </div>
      </SheetHeader>
      <div className="space-y-4">
        <div className="flex justify-around">
          <div>
            <Label>Pocetno vreme</Label>
            <div className="flex items-end gap-2">
              <div className="grid gap-1 text-center">
                <TimePickerInput
                  picker="hours"
                  date={startDate}
                  setDate={setStartDate}
                  ref={startHourRef}
                  disabled
                  onRightFocus={() => startMinuteRef.current?.focus()}
                />
              </div>
              <div className="grid gap-1 text-center">
                <TimePickerInput
                  picker="minutes"
                  date={startDate}
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
                  disabled={isFinished}
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
                  disabled={isFinished}
                  ref={endMinuteRef}
                  onLeftFocus={() => endHourRef.current?.focus()}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFree"
            disabled={isFinished}
            value={isFree ? 'on' : 'off'}
            onClick={() => setIsFree(!isFree)}
          />
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
            {appointment.drink_cost?.map((drink, index) => (
              <React.Fragment key={drink + index}>
                <span className={'italic font-light'}>Piće</span>
                <span className="gap-2 flex justify-end items-center col-span-2">
                  <span className={'italic font-light'}>{drink} din</span>
                  {!isFinished && (
                    <Button variant="destructive" className="p-0 w-5 h-5" onClick={() => removeDrink(index)}>
                      <X className="size-4" />
                    </Button>
                  )}
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
                    min={0}
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
        {showInitialSlipInput && (
          <div className="flex gap-4 px-1">
            <Input
              type="number"
              placeholder="0"
              min={0}
              onChange={(e) => setInitialSlip(e.target.value)}
              value={initialSlip}
            />
            <Button variant="destructive" className="p-0 w-10" onClick={closeInitialSlipInput}>
              <X className="size-6" />
            </Button>
          </div>
        )}
        <Button
          type="button"
          variant={!showInitialSlipInput ? 'outline' : 'default'}
          className={'w-full'}
          disabled={isFinished}
          onClick={openInitialSlipInput}
        >
          {showInitialSlipInput ? 'Unesi cenu prvog računa' : 'Dodaj cenu prvog računa'}
        </Button>
        <Button type="button" variant="outline" className={'w-full'} disabled={isFinished} onClick={openDrinkInput}>
          Dodaj cenu pića
        </Button>
        <Button type="button" variant="default" className={'w-full'} disabled={isFinished} onClick={finishAppointment}>
          Završi {typeContentName}
        </Button>
      </div>
    </TabsContent>
  );
};

export default AppointmentSlip;
