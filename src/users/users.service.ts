/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

export type User = {
  id: string;
  full_name: string;
  email?: string;      // ✅ lowercase field
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

  // ✅ Count total users
  async countUsers(): Promise<number> {
    const { count, error } = await this.supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    if (error) throw new Error(error.message);
    return count || 0;
  }

  // ✅ Total pixels sold
async totalPixelsSold(): Promise<number> {
  // Count all pixels in the 'pixels' table
  const { count, error } = await this.supabase
    .from('pixels')
    .select('id', { count: 'exact', head: true }); // head:true → only count, no data

  if (error) throw new Error(error.message);

  return count || 0;
}

}
