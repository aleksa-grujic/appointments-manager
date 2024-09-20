import { TimePickerInput } from '@/components/ui/time-picker-input.tsx';
import React from 'react';
import { Label } from '@/components/ui/label.tsx';

type TimeInputProps = {
  value: Date;
  onChange: (date: Date) => void;
  hourLabel?: string;
  minuteLabel?: string;
  isDisabled?: boolean;
  inputLabel?: string;
};

export const TimeInput = ({ value, onChange, hourLabel, minuteLabel, isDisabled, inputLabel }: TimeInputProps) => {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      {inputLabel && <Label>{inputLabel}</Label>}
      <div className="flex items-end gap-2">
        <div className="grid gap-2 text-center">
          {hourLabel && (
            <Label htmlFor="hours" className="text-sm">
              {hourLabel}
            </Label>
          )}
          <TimePickerInput
            picker="hours"
            date={value}
            setDate={onChange}
            ref={hourRef}
            disabled={isDisabled}
            onRightFocus={() => minuteRef.current?.focus()}
          />
        </div>
        <div className="grid gap-2 text-center">
          {minuteLabel && (
            <Label htmlFor="hours" className="text-sm">
              {minuteLabel}
            </Label>
          )}
          <TimePickerInput
            picker="minutes"
            date={value}
            setDate={onChange}
            ref={minuteRef}
            disabled={isDisabled}
            onLeftFocus={() => hourRef.current?.focus()}
          />
        </div>
      </div>
    </>
  );
};
