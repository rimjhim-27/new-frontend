import { supabase } from './supabase';
import {
  MedicalTest,
  TestCategory,
  CreateTestDTO,
  UpdateTestDTO,
  TestsResponse,
  SingleTestResponse
} from '../types/test-types';

export const TestTypeService = {
  async getActiveTests(): Promise<TestsResponse> {
    try {
      const { data, error } = await supabase
        .from('test_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      return { data, error: error?.message || null };
    } catch (err) {
      return { data: [], error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },

  async createTest(testData: CreateTestDTO): Promise<SingleTestResponse> {
    try {
      const { data, error } = await supabase
        .from('test_types')
        .insert({
          ...testData,
          is_active: testData.is_active ?? true  // Default to active
        })
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },

  // ... other methods with updated return types
};