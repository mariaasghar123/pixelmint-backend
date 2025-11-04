/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

export type User = {
  id: string;
  full_name: string;
  email?: string;      // ✅ lowercase wali field
  Email?: string; 
  phone?: string;
  pixelsBought?: number;
};

@Injectable()
export class UsersService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );

  async findById(id: string): Promise<User> {
    const response = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    const data = response.data as User | null;
    const error = response.error;

    if (error || !data) throw new Error(error?.message || 'User not found');
    return data;
  }

async updateUser(
  id: string,
  body: { full_name?: string; phone?: string; username?: string; email?: string },
): Promise<User> {
  const response = await this.supabase
    .from('profiles')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  const data = response.data as User | null;
  const error = response.error;

  if (error || !data) throw new Error(error?.message || 'Failed to update user');
  return data;
}
}
