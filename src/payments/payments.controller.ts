import { Controller,Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('payments')
@UseGuards(AuthGuard) // controller level pe, sara controller protected ho gaya
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Req() req, // Request contain karega decoded user info (jwt)
    @Body() body: {
      walletAddress?: string;
      pixels: number;
      currency?: string;
    },
  ) {
    // userId ab backend JWT se milega, not from frontend
    const userId = req.user.id;
    const { walletAddress, pixels, currency = 'usd' } = body;

    if (!userId || !pixels) {
      return { error: 'userId and pixels are required' };
    }

    const paymentIntent = await this.paymentsService.createPaymentIntent(
      userId,
      walletAddress,
      pixels,
      currency,
    );

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }
  // ✅ NEW: Get all purchases for logged-in user
  @Get('my-purchases')
  async getUserPurchases(@Req() req) {
    const userId = req.user.id;
    return this.paymentsService.getUserPurchases(userId);
  }
}
