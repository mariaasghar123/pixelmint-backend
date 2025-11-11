import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AdsService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  async getAds() {
    const { data, error } = await this.supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async addAd(ad: any) {
    const { data, error } = await this.supabase.from('ads').insert([ad]).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateAd(id: string, ad: any) {
    const { data, error } = await this.supabase.from('ads').update(ad).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteAd(id: string) {
    const { data, error } = await this.supabase.from('ads').delete().eq('id', id).select();
    if (error) throw new Error(error.message);
    return data;
  }
}
