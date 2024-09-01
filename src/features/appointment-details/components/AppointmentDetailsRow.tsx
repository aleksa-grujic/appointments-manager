import { Separator } from '@/components/ui/separator.tsx';

type AppointmentDetailsRowProps = {
  label: string;
  value: string | null;
};
const AppointmentDetailsRow = ({ label, value }: AppointmentDetailsRowProps) => {
  return (
    <>
      <div className="flex justify-between py-2">
        <p className="italic">{label}</p>
        <p className="font-bold">{value ? value : '/'}</p>
      </div>
      <Separator />
    </>
  );
};

export default AppointmentDetailsRow;
