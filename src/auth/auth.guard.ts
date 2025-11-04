/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid token');

    // ✅ Supabase auth verify
    const { data: userData, error } = await this.supabase.auth.getUser(token);

    if (error || !userData.user) throw new UnauthorizedException('Invalid token');

    // ✅ Attach user to request
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (request as any).user = {
      id: userData.user.id,
      email: userData.user.email,
    };

    return true;
  }
}
