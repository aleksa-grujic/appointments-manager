import { Tables } from '@/types/supabase.ts';
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
import { useDeleteAppointment } from '@/api/useDeleteAppointments.ts';

export const DeleteAppointment = ({ appointment }: { appointment: Tables<'appointments'> }) => {
  const { mutate: deleteAppointment } = useDeleteAppointment();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full mt-8">
          Obriši termin
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Da li ste sigurni da želite da obrišete ovaj termin?</AlertDialogTitle>
          <AlertDialogDescription>Ova akcija je nepovratna.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Odustani</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteAppointment(appointment.id)}>Obriši</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
