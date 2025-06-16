import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL and Key must be defined in environment variables'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Custom auth functions
export const signInAsDoctor = async (email: string, password: string) => {
  if (email !== import.meta.env.VITE_DOCTOR_EMAIL) {
    throw new Error('Invalid doctor credentials');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

// Secure data fetcher
export const fetchPatientData = async (userId: string) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};