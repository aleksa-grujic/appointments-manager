import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.tsx';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import React from 'react';
import AppointmentDetails from '@/features/appointment-details/AppointmentDetails.tsx';
import AppointmentSlip from '@/features/appointment-slip/AppointmentSlip.tsx';
import { Tables } from '@/types/supabase.ts';

type AppointmentSheetProps = {
  trigger: React.ReactNode;
  appointment: Tables<'appointments'>;
};

export const AppointmentSheet = ({ trigger, appointment }: AppointmentSheetProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string | undefined>('slip');
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setActiveTab(open ? 'slip' : undefined);
      }}
    >
      <SheetTrigger asChild onClick={() => setIsOpen(true)}>
        {trigger}
      </SheetTrigger>
      <SheetContent>
        <Tabs
          defaultValue="slip"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full mt-2 overflow-auto"
        >
          <TabsList>
            <TabsTrigger value="slip">Račun</TabsTrigger>
            <TabsTrigger value="details">Detalji termina</TabsTrigger>
          </TabsList>
          <AppointmentSlip
            appointment={appointment}
            onClose={() => setIsOpen(false)}
            isActiveTab={activeTab === 'slip'}
          />
          <AppointmentDetails
            appointment={appointment}
            onClose={() => setIsOpen(false)}
            isActiveTab={activeTab === 'details'}
          />
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
