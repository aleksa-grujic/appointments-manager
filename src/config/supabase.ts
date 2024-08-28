import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase.ts';

export const supabase = createClient<Database>(import.meta.env.VITE_API_URL, import.meta.env.VITE_SUPABASE_KEY);
