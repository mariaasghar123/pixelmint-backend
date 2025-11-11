import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AdsService } from './ads.service';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  async getAds() {
    return this.adsService.getAds();
  }

  @Post()
  @UseGuards(AuthGuard)
  async addAd(@Req() req, @Body() body) {
    try {
      const ownerid = req.user.id; // 👈 small 'i'
      return await this.adsService.addAd({ ...body, ownerid }); // 👈 small 'i'
    } catch (err) {
      console.error("Add Ad Error:", err);
      throw err;
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateAd(@Param('id') id: string, @Body() body) {
    return this.adsService.updateAd(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteAd(@Param('id') id: string) {
    return this.adsService.deleteAd(id);
  }
}
