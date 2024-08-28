export type Appointment = {
  child_id: string | null;
  child_name: string | null;
  created_at: string;
  drink_cost: number | null;
  end_time: string | null;
  free: boolean | null;
  id: string;
  notes: string | null;
  parent_name: string | null;
  phone_number: string | null;
  reservation: boolean | null;
  start_time: string;
  status: string | null;
  type: string | null;
  updated_at: string | null;
  user_id: string | null;
};

export type Product = {
  name: string;
  displayName: string;
  price: number;
  duration: number;
  count?: number;
};

export type FinishedAppointment = Appointment & {
  totalHours: string;
  totalPrice: string;
  endDateTime: string;
  products: Product[];
  isFree: boolean;
};
