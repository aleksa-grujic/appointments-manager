import { Separator } from '@/components/ui/separator.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form.tsx';
import { Control, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { clsx } from 'clsx';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { formatISO } from 'date-fns';
import { TimeInput } from '@/components/app-specific/TimeInput.tsx';

type AppointmentDetailsRowProps<T extends FieldValues> = {
  edit?: boolean;
  isTextArea?: boolean;
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: 'input' | 'textarea' | 'select' | 'time' | 'toggle';
  options?: Array<{ label: string; value: string }>;
};
const AppointmentDetailsRow = <T extends FieldValues>({
  label,
  name,
  edit,
  control,
  type = 'input',
  options,
}: AppointmentDetailsRowProps<T>) => {
  const renderInput = (field: ControllerRenderProps<T, Path<T>>) => {
    switch (type) {
      case 'input':
      default:
        return (
          <Input
            placeholder={label}
            {...field}
            disabled={!edit}
            className={clsx({
              'w-1/2 mr-1': true,
            })}
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={label}
            {...field}
            disabled={!edit}
            className={clsx({
              'w-full !mt-2 h-[120px]': true,
            })}
          />
        );
      case 'select':
        return (
          <Select {...field} disabled={!edit} onValueChange={(value) => field.onChange(value)}>
            <SelectTrigger
              className={clsx({
                'w-1/2 mr-1': true,
              })}
            >
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options?.map((option) => (
                  <SelectItem value={option.value} key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case 'time':
        return (
          <TimeInput
            value={new Date(field.value)}
            onChange={(date) => field.onChange(formatISO(date))}
            isDisabled={!edit}
          />
        );
      case 'toggle':
        return (
          <ToggleGroup
            type="single"
            value={field.value}
            onValueChange={(count) => field.onChange(count)}
            className="justify-start"
            disabled={!edit}
          >
            {options?.map((option) => (
              <ToggleGroupItem value={option.value} aria-label={option.label} key={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        );
    }
  };

  return (
    <>
      <FormField
        control={control}
        render={({ field }) => (
          <FormItem
            className={clsx({
              'flex justify-between items-center py-2 flex-nowrap space-y-0': true,
              'flex-wrap': type === 'textarea',
            })}
          >
            <FormLabel>{label}</FormLabel>
            <FormControl>{renderInput(field)}</FormControl>
          </FormItem>
        )}
        name={name}
      />
      <Separator />
    </>
  );
};

export default AppointmentDetailsRow;
