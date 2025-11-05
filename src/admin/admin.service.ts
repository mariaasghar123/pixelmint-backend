import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AdminService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  async validateAdmin(email: string, password: string) {
    // ✅ Use 'this.supabase' instead of 'supabase'
    const { data, error } = await this.supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('password', password); // ⚠️ Password hashing recommended

    if (error || !data || data.length === 0) return null;
    return data[0];
  }
}
