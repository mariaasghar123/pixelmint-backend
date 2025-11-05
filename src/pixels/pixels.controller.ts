// pixels.controller.ts
import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PixelsService } from './pixels.service';

@Controller('pixels')
export class PixelsController {
  constructor(private readonly pixelsService: PixelsService) {}

  @Get('my-pixels')
  @UseGuards(AuthGuard)
  async getUserPixels(@Req() req) {
    const userId = req.user.id;
    return this.pixelsService.getPixelsByUser(userId); // ✅ Supabase call
  }

  @Post('reserve')
  @UseGuards(AuthGuard)
  async reservePixel(
    @Req() req: { user: { id: string } },
    @Body() body,
  ) {
    const userId = req.user.id;
    return this.pixelsService.reservePixel(body, userId);
  }
}
