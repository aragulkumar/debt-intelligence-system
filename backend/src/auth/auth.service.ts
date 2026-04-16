import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: { name, email, password: hashed },
    });
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    // Never return the password
    const { password, ...safe } = user;
    return safe;
  }
}
