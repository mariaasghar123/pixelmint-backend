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

  // payments.service.ts
async getTotalSold() {
  const { data, error } = await this.supabase
    .from('purchases')
    .select('pixels');

  if (error) throw new Error(error.message);

  const totalPixels = data.reduce((sum, item) => sum + item.pixels, 0);
  return { totalPixels };
}

}
