

import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { generateTokens } from '../utils/generateToken';
import { RegisterDTO, LoginDTO, AuthResponse } from '../types/auth.types';
import { AppError } from '../utils/errors';

export const authService = {
  async register(dto: RegisterDTO): Promise<AuthResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new AppError(409, 'AUTH_005: Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
      },
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  },

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new AppError(401, 'AUTH_003: User not found');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new AppError(401, 'AUTH_004: Invalid password');
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  },
};