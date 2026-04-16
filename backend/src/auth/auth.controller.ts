import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getUserId(req: any) {
    return req.headers['x-user-id'] || 'dummy-user-id';
  }

  @Post('login')
  login(@Body() body: { clerkId: string, email: string }) {
    return this.authService.login(body.clerkId, body.email);
  }

  @Post('logout')
  logout(@Req() req: any) {
    return this.authService.logout(this.getUserId(req));
  }

  @Get('me')
  getProfile(@Req() req: any) {
    return this.authService.me(this.getUserId(req));
  }
}
