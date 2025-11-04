/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Req, UseGuards, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Protected route to fetch current user
  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req: { user: { id: string } }) {
    const userId = req.user.id; // JWT token se user id
    return await this.usersService.findById(userId);
  }

  @UseGuards(AuthGuard)
@Put('update')
async updateProfile(
  @Req() req: { user: { id: string } },
  @Body() body: { full_name?: string; phone?: string },
) {
  try {
    console.log("Updating user:", req.user.id, body); // ✅ kya aa raha hai
    const updatedUser = await this.usersService.updateUser(req.user.id, body);
    console.log("Updated data:", updatedUser); // ✅ success me kya aa raha hai
    return updatedUser;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Update Error:", err.message); // ✅ exact error
    } else {
      console.error("Update Error:", err); // fallback for non-Error types
    }
    throw err; // 500 error fir bhi aayega lekin console me dekhenge reason
  }
}

}
