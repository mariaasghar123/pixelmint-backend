import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private supabase: SupabaseClient;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_KEY as string,
    );
  }

  async createPaymentIntent(
    userId: string,
    walletAddress: string | undefined,
    pixels: number,
    currency: string,
  ) {
    // 💲 Calculate price in cents (you can adjust this rate)
    const amountCents = Math.round(pixels * 10);

    // ✅ Step 1: Insert pending record into DB
    const { data: purchase, error } = await this.supabase
      .from('purchases')
      .insert({
        user_id: userId,
        pixels,
        wallet_address: walletAddress || null,
        amount_cents: amountCents, // ✅ FIX ADDED
        currency,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) {
      console.error(error);
      throw new Error('Failed to save purchase to database');
    }

    // ✅ Step 2: Create Stripe PaymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountCents,
      currency,
      metadata: {
        userId,
        purchaseId: purchase.id,
      },
    });

    // ✅ Step 3: Update DB with Stripe paymentIntent ID
    await this.supabase
      .from('purchases')
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq('id', purchase.id);

    return paymentIntent;
  }
}
