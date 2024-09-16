import { z } from 'zod';

export const appointmentSchema = z.object({
  child_count: z.string().optional().nullable(),
  child_id: z.string().optional().nullable(),
  child_name: z.string().optional().nullable(),
  child_name2: z.string().optional().nullable(),
  child_name3: z.string().optional().nullable(),
  created_at: z.string().optional(),
  drink_cost: z.array(z.number()).optional().nullable(),
  end_time: z.string().optional().nullable(),
  free: z.boolean().optional().nullable(),
  id: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  parent_name: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  reservation: z.boolean().optional().nullable(),
  start_time: z.string(),
  status: z.string().optional().nullable(),
  table_number: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  user_id: z.string().optional().nullable(),
});
