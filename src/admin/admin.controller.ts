import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const admin = await this.adminService.validateAdmin(body.email, body.password);
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    return {
      message: 'Login successful',
      token: 'dummy-jwt-token', // Optional - Or generate real JWT
    };
  }
}
