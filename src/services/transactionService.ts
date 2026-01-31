import { supabase } from '../supabaseClient.js';
import type { Transaction } from '../types/index.js';

export const transactionService = {
  async fetchAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return (data as Transaction[]) || [];
  },

  async fetchRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
    if (error) throw error;
    return (data as Transaction[]) || [];
  },

  async add(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select();
    if (error) throw error;
    return data[0] as Transaction;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async bulkAdd(transactions: Omit<Transaction, 'id'>[]): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactions)
      .select();
    if (error) throw error;
    return (data as Transaction[]) || [];
  }
};
