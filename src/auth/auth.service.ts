/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseClient, AuthResponse } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  // ✅ USER SIGNUP (with fullName, username, phone)
  async signUp(fullName: string, username: string, email: string, phone: string, password: string) {
    // 1️⃣ Create user in Supabase Auth (email + password only)
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }



    // 2️⃣ Save other details in 'profiles' table
    const userId = data.user?.id;
    if (userId) {
      await this.supabase.from('profiles').insert({
        id: userId,           // ✅ Must match auth.users.id
        full_name: fullName,
        username: username,
        phone: phone,
      });
    }

    return { message: '✅ Signup successful! Check your email for verification.', data };
  }

  // ✅ USER LOGIN
  async signIn(email: string, password: string) {
    const response: AuthResponse = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    const { data, error } = response;

    if (error) {
      return { error: error.message };
    }

    return {
      message: '✅ Login successful!',
      access_token: data.session?.access_token,
      user: data.user,
    };
  }
}
