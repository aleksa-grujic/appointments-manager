import { supabase } from '@/config/supabase.ts';
import { toast } from 'sonner';

export const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return toast.error(error?.message);
  }
  return toast.success('Logout successful');
};

export const login = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return toast.error(error.message);
  }
  return toast.success('Login successful');
};
