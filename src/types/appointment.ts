import { Database } from '@/types/supabase.ts';

export type Appointment = Database['public']['Tables']['appointments']['Row'];
