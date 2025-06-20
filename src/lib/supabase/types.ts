import { supabase } from './client';
import type { Database } from './types';

type Test = Database['public']['Tables']['tests']['Row'];

export const TestService = {
  async getActiveTests(): Promise<Test[]> {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw new Error(error.message);
    return data;
  }
};
