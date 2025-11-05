/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class PixelsService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  // ✅ Ye method missing tha
  async getPixelsByUser(userId: string) {
    const { data, error } = await this.supabase
      .from('pixels')
      .select('*')
      .eq('ownerId', userId);

    if (error) throw new Error(error.message);
    return data;
  }

  async reservePixel(block: any, userId: string) {
    const res = await this.supabase
      .from('pixels')
      .insert([{ ...block, ownerId: userId }])
      .select()
      .single();
    if (res.error) throw new Error(res.error.message);
    return res.data;
  }
}
