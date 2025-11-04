/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: () => {
        const url = process.env.SUPABASE_URL;
        const anonKey = process.env.SUPABASE_ANON_KEY; // abhi anon key use karenge
        if (!url || !anonKey) {
          throw new Error('Environment variables SUPABASE_URL and SUPABASE_ANON_KEY must be defined');
        }
        return createClient(url, anonKey);
      },
    },
    SupabaseService,
  ],
  exports: ['SUPABASE_CLIENT', SupabaseService],
})
export class SupabaseModule {}
